import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

export default async function testDeleteBucket({
    container,
}: {
    container: MedusaContainer
}) {
    console.log("Starting S3 upload & delete test...")

    const fileService = container.resolve(Modules.FILE)

    console.log("1. Uploading test file...")
    const uploadResult = await fileService.createFiles({
        filename: "Imagem de Teste àé 123.txt",
        mimeType: "text/plain",
        content: Buffer.from("hello world", "utf-8").toString("base64"),
        access: "public"
    })

    const fileId = uploadResult[0]?.id || (uploadResult as any).id
    console.log(" -> File uploaded with key/id:", fileId)

    console.log("2. Verifying object exists in Bucket...")
    const s3 = new S3Client({
        region: process.env.S3_REGION || "us-east-1",
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
    })

    const bucket = process.env.S3_BUCKET!

    let listCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: fileId })
    let response = await s3.send(listCommand)
    console.log(" -> Object found in bucket?", (response.Contents && response.Contents.length > 0))

    console.log("3. Deleting using Medusa FileService...")
    await fileService.deleteFiles([fileId])

    console.log("4. Verifying object is gone from Bucket...")
    listCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: fileId })
    response = await s3.send(listCommand)
    console.log(" -> Object found in bucket AFTER delete?", (response.Contents && response.Contents.length > 0))
}
