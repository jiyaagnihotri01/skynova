import json
import urllib.parse
import boto3
import pandas as pd
import io

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
comprehend = boto3.client('comprehend')

TABLE_NAME = 'skypulse_reviews'

def lambda_handler(event, context):
    """
    AWS Lambda function triggered by S3 object creation.
    Processes British Airways reviews dataset via Amazon Comprehend and puts items into DynamoDB.
    """
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        
        response = s3.get_object(Bucket=bucket, Key=key)
        csv_content = response['Body'].read().decode('utf-8')
        
        df = pd.read_csv(io.StringIO(csv_content))
        table = dynamodb.Table(TABLE_NAME)
        
        count = 0
        for idx, row in df.iterrows():
            title = str(row.get('title', 'Passenger Review'))
            text = str(row.get('reviews', ''))
            
            if not text:
                continue
                
            comp_res = comprehend.detect_sentiment(Text=text[:4000], LanguageCode='en')
            sentiment = comp_res.get('Sentiment', 'NEUTRAL').capitalize()
            confidence = float(comp_res.get('SentimentScore', {}).get(sentiment.upper(), 0.88))
            
            csi_score = 75.0 if sentiment == 'Positive' else (35.0 if sentiment == 'Negative' else 55.0)
            
            table.put_item(
                Item={
                    'id': f'sp-lambda-{idx+1}',
                    'title': title,
                    'text': text[:2000],
                    'sentiment': sentiment,
                    'confidence': str(confidence),
                    'csi_score': str(csi_score),
                    'source': 'S3 Lambda Comprehend Pipeline'
                }
            )
            count += 1
            
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'Successfully processed {count} records into DynamoDB.'})
        }
    except Exception as e:
        print(f"Error in SkyPulse Lambda: {e}")
        raise e
