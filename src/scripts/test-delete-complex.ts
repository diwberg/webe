import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3"
import * as dotenv from "dotenv"

dotenv.config()

export default async function forceDelete({
    container,
}: {
    container: MedusaContainer
}) {
    console.log("Attempting to delete specific unicode keys...")

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

    const keysToDelete = [
        "Captura de Tela 2026-02-25 aÌ€s 10.37.40-01KJARQK5ND9YTGAYNEEQW108K.png",
        "Captura de Tela 2026-02-25 aÌ€s 11.05.08-01KJAS0DHXT8HD10JC5HWQE9G3.png"
    ]

    try {
        const command = new DeleteObjectsCommand({
            Bucket: bucket!,
            Delete: {
                Objects: keysToDelete.map(k => ({ Key: k })),
                Quiet: false // Let's see all responses
            }
        })

        console.log("Sending DeleteObjectsCommand...")
        const response = await s3.send(command)

        console.log("Deleted array:", response.Deleted)
        console.log("Errors array:", response.Errors)

    } catch (e: any) {
        console.error("SDK Error executing DeleteObjectsCommand:", e.message)
    }
}
