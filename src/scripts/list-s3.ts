import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"
import * as dotenv from "dotenv"

dotenv.config()

export default async function listObjects() {
    const s3 = new S3Client({
        region: process.env.S3_REGION || "us-east-1",
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
    })

    const bucket = process.env.S3_BUCKET

    if (!bucket) {
        console.log("Bucket not provided in env")
        return
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: bucket,
        })
        const response = await s3.send(command)
        console.log("Objects in bucket:")
        if (response.Contents) {
            response.Contents.forEach((obj) => {
                console.log(`- ${obj.Key} (Size: ${obj.Size}, LastModified: ${obj.LastModified})`)
            })
        } else {
            console.log("Bucket is empty.")
        }
    } catch (e: any) {
        console.error("Error listing objects:", e.message)
    }
}

listObjects()
