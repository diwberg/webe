import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function myScript({
    container,
}: {
    container: MedusaContainer
}) {
    console.log("Starting S3 upload & delete test...")

    const fileService = container.resolve(Modules.FILE)
    if (!fileService) {
        throw new Error("File module not found!")
    }

    const testContent = Buffer.from("test file content hello world", "utf-8").toString("base64")
    const testFileName = "minio-test-file.txt"

    console.log("Uploading test file...")
    let fileId: string | undefined;

    try {
        const uploadResult = await fileService.createFiles({
            filename: testFileName,
            mimeType: "text/plain",
            content: testContent,
            access: "public"
        })

        console.log("Upload result:", uploadResult)
        fileId = uploadResult[0]?.id || (uploadResult as any).id
        console.log("Extracted file ID:", fileId)
    } catch (e: any) {
        console.error("Upload failed:", e.message)
        return
    }

    if (fileId) {
        console.log(`Waiting 2 seconds before deleting ${fileId}...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(`Attempting to delete ${fileId}...`)

        try {
            await fileService.deleteFiles([fileId])
            console.log("Delete command executed successfully.")
        } catch (e: any) {
            console.error("Delete failed:", e.message)
            console.error(e)
        }
    }
}
