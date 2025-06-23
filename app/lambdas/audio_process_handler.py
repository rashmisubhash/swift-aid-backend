# lambda_function.py

import json
import base64
import logging
import boto3

# set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# clients
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

# replace with your Bedrock Foundation Model ID
MODEL_ID = 'anthropic.claude-v2'


def lambda_handler(event, context):
    """
    Triggered by Kinesis (Contact Lens real-time segment stream).
    For each completed transcript segment, call Bedrock and log the reply.
    """
    for record in event['Records']:
        # decode the Kinesis data payload
        payload = base64.b64decode(record['kinesis']['data'])
        try:
            segment = json.loads(payload)
        except json.JSONDecodeError:
            logger.warning("Skipping non-JSON record")
            continue

        # only act on final (non-partial) transcripts
        transcript = segment.get('transcript')
        is_partial = segment.get('isPartial', True)
        if not transcript or is_partial:
            continue

        logger.info(f"Transcript received: {transcript}")

        # invoke Bedrock
        try:
            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                contentType="application/json",
                accept="application/json",
                body=json.dumps({"inputText": transcript})
            )
            # the body is a streaming HTTP response; read & parse it
            body_bytes = response['body'].read()
            result = json.loads(body_bytes.decode('utf-8'))

            # extract the AI's reply
            ai_reply = (
                result
                .get('output', {})
                .get('message', {})
                .get('content', [{}])[0]
                .get('text', '')
            )

            logger.info(f"AI reply: {ai_reply}")

            # TODO: send ai_reply back into your Connect flow
            #   e.g. via another Kinesis stream, DynamoDB, or Connect's callback API

        except Exception as e:
            logger.error(f"Bedrock invocation failed: {e}", exc_info=True)

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Processed batch"})
    }