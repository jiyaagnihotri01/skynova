import json
import boto3

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event, context):
    """
    Scheduled Cron Lambda function for periodic Amazon Bedrock executive synthesis.
    """
    prompt = "Summarize the latest trends in British Airways customer reviews and highlight top 3 operational action items."
    
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "temperature": 0.5,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=json.dumps(payload)
        )
        result = json.loads(response['body'].read())
        summary = result['content'][0]['text']
        
        return {
            'statusCode': 200,
            'body': json.dumps({'summary': summary})
        }
    except Exception as e:
        print(f"Error executing Bedrock cron: {e}")
        return {'statusCode': 500, 'error': str(e)}
