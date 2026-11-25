import sys
import boto3
from app.config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_DYNAMODB_TABLE_NAME,
    AWS_BEDROCK_MODEL_ID
)

def test_aws_credentials():
    print("==================================================")
    print(" TESTING LIVE AWS SERVICES CONNECTION (BOTO3) ")
    print("==================================================")
    print(f"Region: {AWS_REGION}")
    print(f"Access Key: {AWS_ACCESS_KEY_ID[:5]}...{AWS_ACCESS_KEY_ID[-4:]}")

    # 1. Test STS / Identity Probe
    try:
        sts = boto3.client(
            "sts",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        identity = sts.get_caller_identity()
        print(f"[OK] AWS STS Identity: Account {identity.get('Account')}, Arn {identity.get('Arn')}")
    except Exception as e:
        print(f"[FAIL] AWS STS Identity check failed: {e}")

    # 2. Test Amazon S3
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        buckets = s3.list_buckets()
        bucket_names = [b['Name'] for b in buckets.get('Buckets', [])]
        print(f"[OK] Amazon S3: Connected. Total Buckets: {len(bucket_names)}")
        
        if AWS_S3_BUCKET_NAME not in bucket_names:
            try:
                if AWS_REGION == "us-east-1":
                    s3.create_bucket(Bucket=AWS_S3_BUCKET_NAME)
                else:
                    s3.create_bucket(
                        Bucket=AWS_S3_BUCKET_NAME,
                        CreateBucketConfiguration={'LocationConstraint': AWS_REGION}
                    )
                print(f"[OK] Amazon S3: Created bucket '{AWS_S3_BUCKET_NAME}'")
            except Exception as b_err:
                print(f"[NOTE] S3 Bucket creation note: {b_err}")
        else:
            print(f"[OK] Amazon S3: Bucket '{AWS_S3_BUCKET_NAME}' verified.")
    except Exception as e:
        print(f"[FAIL] Amazon S3 check failed: {e}")

    # 3. Test Amazon DynamoDB
    try:
        dynamodb = boto3.client(
            "dynamodb",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        tables = dynamodb.list_tables().get("TableNames", [])
        print(f"[OK] Amazon DynamoDB: Connected. Tables: {tables}")
        
        if AWS_DYNAMODB_TABLE_NAME not in tables:
            try:
                dynamodb.create_table(
                    TableName=AWS_DYNAMODB_TABLE_NAME,
                    KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
                    AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
                    BillingMode='PAY_PER_REQUEST'
                )
                print(f"[OK] Amazon DynamoDB: Created table '{AWS_DYNAMODB_TABLE_NAME}'")
            except Exception as t_err:
                print(f"[NOTE] DynamoDB Table creation note: {t_err}")
        else:
            print(f"[OK] Amazon DynamoDB: Table '{AWS_DYNAMODB_TABLE_NAME}' verified.")
    except Exception as e:
        print(f"[FAIL] Amazon DynamoDB check failed: {e}")

    # 4. Test Amazon Comprehend
    try:
        comp = boto3.client(
            "comprehend",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        res = comp.detect_sentiment(Text="British Airways flight service was excellent and pleasant", LanguageCode="en")
        print(f"[OK] Amazon Comprehend: Sentiment '{res.get('Sentiment')}' ({res.get('SentimentScore')})")
    except Exception as e:
        print(f"[FAIL] Amazon Comprehend check failed: {e}")

    # 5. Test Amazon Bedrock Runtime
    try:
        bedrock = boto3.client(
            "bedrock-runtime",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        print(f"[OK] Amazon Bedrock Runtime: Initialized client for model '{AWS_BEDROCK_MODEL_ID}'")
    except Exception as e:
        print(f"[FAIL] Amazon Bedrock check failed: {e}")

    print("==================================================")

if __name__ == "__main__":
    test_aws_credentials()
