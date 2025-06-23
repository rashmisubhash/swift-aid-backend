import os
import json
import time
import boto3
from botocore.exceptions import ClientError
import uuid

# Configuration
REGION = os.environ.get("AWS_REGION", "us-east-1")
CONVERSATION_TABLE = os.environ.get("DYNAMODB_TABLE", "SwiftAI-Conversations")
AUDIO_BUCKET = os.environ.get("AUDIO_BUCKET", "swiftai-responses")
CONNECT_INSTANCE_ID = os.environ.get("CONNECT_INSTANCE_ID", "9dd5e7ec-7a58-4847-809c-8729fc6691b4")

# AWS clients
dynamodb = boto3.client("dynamodb", region_name=REGION)
bedrock = boto3.client("bedrock-runtime", region_name=REGION)
polly = boto3.client("polly", region_name=REGION)
s3 = boto3.client("s3", region_name=REGION)
connect = boto3.client("connect", region_name=REGION)

def get_conversation_history(contact_id, limit=10):
    """Get recent conversation history"""
    try:
        resp = dynamodb.query(
            TableName=CONVERSATION_TABLE,
            KeyConditionExpression="ContactId = :cid",
            ExpressionAttributeValues={":cid": {"S": contact_id}},
            ScanIndexForward=True,
            Limit=limit
        )
        
        history = []
        for item in resp.get("Items", []):
            speaker = item["Speaker"]["S"]
            text = item["Text"]["S"]
            
            # Only include actual conversation, not system messages
            if speaker in ["Human", "Assistant"] and text.strip():
                history.append({"speaker": speaker, "text": text})
        
        print(f"📚 Found {len(history)} conversation messages")
        return history
    except Exception as e:
        print(f"✗ Error getting conversation history: {e}")
        return []

def save_to_conversation(contact_id, speaker, text):
    """Save message to conversation history"""
    try:
        dynamodb.put_item(
            TableName=CONVERSATION_TABLE,
            Item={
                "ContactId": {"S": contact_id},
                "Timestamp": {"N": str(int(time.time() * 1000))},
                "Speaker": {"S": speaker},
                "Text": {"S": text}
            }
        )
        print(f"✓ Saved: {speaker}: {text}")
        return True
    except Exception as e:
        print(f"✗ Error saving to conversation: {e}")
        return False

def generate_emergency_response(history_lines, contact_id, is_first_message=False):
    """Generate AI response using Claude 3"""
    system_prompt = """You are an emergency response AI assistant. You help people in crisis situations.

Your responses should be:
- CALM and reassuring
- BRIEF (1-2 sentences maximum)
- ACTION-oriented
- Ask for LOCATION if not provided
- Provide immediate safety guidance
- Never hang up or end the conversation

If this is the first interaction, introduce yourself briefly and ask what emergency they need help with."""

    try:
        # Build conversation context
        if is_first_message or not history_lines:
            user_message = "This is the first call. Please introduce yourself and ask what emergency they need help with."
        else:
            conversation = "\n".join(history_lines)
            user_message = f"Previous conversation:\n{conversation}\n\nPlease provide your next response."

        print(f"🤖 Sending to Claude: {user_message[:100]}...")

        # Call Claude 3 Sonnet
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-sonnet-20240229-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 150,
                "temperature": 0.3,
                "system": system_prompt,
                "messages": [
                    {
                        "role": "user",
                        "content": user_message
                    }
                ]
            })
        )
        
        response_body = json.loads(response["body"].read())
        ai_text = response_body["content"][0]["text"].strip()
        
        print(f"✓ Claude response: {ai_text}")
        return ai_text
        
    except Exception as e:
        print(f"✗ Bedrock error: {e}")
        # Fallback response
        if is_first_message:
            return "Hello, I'm your emergency AI assistant. What's your emergency and where are you located?"
        else:
            return "I'm here to help. Can you tell me your location and describe what's happening?"

def create_audio_response(text, contact_id):
    """Create audio response using Polly"""
    try:
        print(f"🎤 Creating audio for: {text}")
        
        # Synthesize speech
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat="mp3",
            VoiceId="Joanna",
            Engine="neural"
        )
        
        # Read audio data
        audio_data = response["AudioStream"].read()
        
        # Create S3 key with timestamp
        timestamp = int(time.time() * 1000)
        key = f"responses/{contact_id}/{timestamp}.mp3"
        
        # Upload to S3
        s3.put_object(
            Bucket=AUDIO_BUCKET,
            Key=key,
            Body=audio_data,
            ContentType="audio/mpeg"
        )
        
        print(f"✓ Audio uploaded to: {key}")
        return key
        
    except Exception as e:
        print(f"✗ Polly/S3 error: {e}")
        return None

def update_contact_attributes(contact_id, audio_key):
    """Update Connect contact with audio URL"""
    try:
        audio_url = f"https://{AUDIO_BUCKET}.s3.amazonaws.com/{audio_key}"
        
        connect.update_contact_attributes(
            InstanceId=CONNECT_INSTANCE_ID,
            ContactId=contact_id,
            Attributes={
                "AudioUri": audio_url,
                "LastUpdate": str(int(time.time()))
            }
        )
        
        print(f"✓ Updated contact attributes: {audio_url}")
        return True
        
    except ClientError as e:
        print(f"✗ Connect update error: {e}")
        return False

def lambda_handler(event, context):
    """Main orchestrator handler with detailed debugging"""
    print(f"📥 Processing {len(event.get('Records', []))} DynamoDB records")
    
    # Print the entire event for debugging
    print(f"🔍 Full event: {json.dumps(event, indent=2)}")
    
    processed_count = 0
    
    for record in event.get("Records", []):
        try:
            print(f"🔄 Processing record: {record.get('eventName', 'UNKNOWN')}")
            
            # Only process INSERT events
            if record.get("eventName") != "INSERT":
                print(f"⏭️ Skipping {record.get('eventName')} event")
                continue
            
            # Get the new item
            new_image = record.get("dynamodb", {}).get("NewImage", {})
            print(f"📄 New image: {json.dumps(new_image, indent=2)}")
            
            # Extract fields
            contact_id = new_image.get("ContactId", {}).get("S")
            speaker = new_image.get("Speaker", {}).get("S")
            text = new_image.get("Text", {}).get("S")
            
            print(f"📋 Extracted - ContactId: {contact_id}, Speaker: {speaker}, Text: {text}")
            
            if not contact_id:
                print("No ContactId found, skipping")
                continue
                
            if not speaker:
                print("No Speaker found, skipping")
                continue
                
            if not text:
                print("No Text found, skipping")
                continue
            
            # Check if this is a system message that indicates call start
            if speaker == "System" and ("Contact started" in text or "started" in text.lower()):
                print("🚨 Detected call start - generating initial response")
                
                # Generate initial greeting
                ai_response = generate_emergency_response([], contact_id, is_first_message=True)
                
                # Save AI response to conversation
                if save_to_conversation(contact_id, "Assistant", ai_response):
                    # Create audio response
                    audio_key = create_audio_response(ai_response, contact_id)
                    
                    if audio_key:
                        # Update Connect contact attributes
                        success = update_contact_attributes(contact_id, audio_key)
                        if success:
                            processed_count += 1
                            print("Successfully processed call start")
                        else:
                            print("Failed to update contact attributes")
                    else:
                        print("Failed to create audio response")
                else:
                    print("Failed to save AI response")
                continue
            
            # Only process Human messages for conversation
            if speaker != "Human":
                print(f"⏭️ Skipping {speaker} message (not Human)")
                continue
            
            print(f"🗣️ Processing human message: {text}")
            
            # Get conversation history
            history = get_conversation_history(contact_id)
            
            # Build history lines for context
            history_lines = []
            for msg in history:
                if msg["speaker"] == "Human":
                    history_lines.append(f"Caller: {msg['text']}")
                elif msg["speaker"] == "Assistant":
                    history_lines.append(f"Assistant: {msg['text']}")
            
            # Generate AI response
            ai_response = generate_emergency_response(history_lines, contact_id)
            
            # Save AI response to conversation
            if save_to_conversation(contact_id, "Assistant", ai_response):
                
                # Create audio response
                audio_key = create_audio_response(ai_response, contact_id)
                
                if audio_key:
                    # Update Connect contact attributes
                    success = update_contact_attributes(contact_id, audio_key)
                    if success:
                        processed_count += 1
                        print("Successfully processed human message")
                    else:
                        print("Failed to update contact attributes")
                else:
                    print("Failed to create audio response")
            else:
                print("Failed to save AI response")
            
        except Exception as e:
            print(f"✗ Error processing record: {e}")
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            continue
    
    print(f"🏁 Processing completed. Processed {processed_count} records successfully.")
    
    return {
        "statusCode": 200, 
        "body": json.dumps({
            "processed": processed_count,
            "total_records": len(event.get('Records', []))
        })
    }