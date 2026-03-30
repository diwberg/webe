import { MedusaContainer } from "@medusajs/framework/types"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"

export default async function myScript({
    container,
}: {
    container: MedusaContainer
}) {
    console.log("Starting script...")
    const fileId = process.argv[2]

    if (!fileId) {
        console.error("Please provide a file_id to delete as an argument.")
        return
    }

    console.log(`Running deleteFilesWorkflow for file_id: ${fileId}...`)

    try {
        const { result, transaction } = await deleteFilesWorkflow(container).run({
            input: {
                ids: [fileId]
            }
        })
        console.log("Result:", result)
        console.log("Transaction Info:", transaction.transactionId, transaction.getState())
    } catch (e: any) {
        console.error("Error running workflow:", e.message)
        console.error(e)
    }
}
