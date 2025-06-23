FROM public.ecr.aws/lambda/python:3.9
RUN mkdir /tmp/layer
WORKDIR /tmp/layer
RUN pip install amazon-transcribe awscrt -t python/
