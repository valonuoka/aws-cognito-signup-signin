# AWS Cognito Sign-Up / Sign-In with Lambda & S3

## Overview
This project implements a user authentication flow using:
- AWS Cognito (User Pool)
- AWS Lambda (Post Confirmation & Post Authentication triggers)
- AWS S3 (user metadata storage)

## Features
- User sign-up with Cognito
- User sign-in tracking
- Lambda triggers for:
  - Post-confirmation (signup)
  - Post-authentication (login)
- User data stored in S3 (email, userId, timestamps)

## AWS Services Used
- Amazon Cognito
- AWS Lambda (Python)
- Amazon S3
- AWS IAM
- Amazon CloudWatch

## Lambda Triggers
- Post Confirmation Trigger  
  Stores new user data in S3 after successful signup.

- Post Authentication Trigger  
  Logs user login event (email + timestamp) to S3.

## Non-Functional Considerations
- Least-privilege IAM policies
- No credentials stored in code
- CloudWatch logging enabled
- Scalable serverless architecture

## How to Deploy
1. Create Cognito User Pool
2. Create S3 bucket
3. Create Lambda functions
4. Attach IAM policies
5. Add Lambda triggers in Cognito
