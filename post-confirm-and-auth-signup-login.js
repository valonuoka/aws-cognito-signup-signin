import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
});

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const bucketName = process.env.USER_DATA_BUCKET;
  const userAttributes = event.request?.userAttributes || {};
  const userId = userAttributes.sub;
  const email = userAttributes.email;

  if (!bucketName) {
    console.error("Missing USER_DATA_BUCKET environment variable");
    return event;
  }

  if (!userId || !email) {
    console.error("Missing required user attributes:", userAttributes);
    return event;
  }

  const timestamp = new Date().toISOString();

  // -----------------------------
  // 1. POST CONFIRMATION (SIGN-UP)
  // -----------------------------
  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    const userData = {
      userId,
      email,
      name: userAttributes.name || null,
      signUpDate: timestamp,
      status: "CONFIRMED",
    };

    const objectKey = `users/${userId}.json`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: JSON.stringify(userData),
          ContentType: "application/json",
        })
      );
      console.log(`Saved signup data to s3://${bucketName}/${objectKey}`);
    } catch (error) {
      console.error("Error saving signup data:", error);
    }
  }

  // -----------------------------
  // 2. POST AUTHENTICATION (SIGN-IN)
  // -----------------------------
  if (event.triggerSource === "PostAuthentication_Authentication") {
    const loginData = {
      userId,
      email,
      loginTime: timestamp,
      sourceIp: event.request?.callerContext?.ip || null,
    };

    const objectKey = `logins/${userId}-${Date.now()}.json`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: JSON.stringify(loginData),
          ContentType: "application/json",
        })
      );
      console.log(`Saved login data to s3://${bucketName}/${objectKey}`);
    } catch (error) {
      console.error("Error saving login data:", error);
    }
  }

  return event;
};
