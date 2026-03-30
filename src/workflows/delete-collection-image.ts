import {
    createWorkflow,
    WorkflowResponse,
    transform,
} from "@medusajs/framework/workflows-sdk"
import { deleteFilesWorkflow, useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { deleteCollectionImagesStep } from "./steps/delete-collection-image"

export type DeleteCollectionImagesInput = {
    ids: string[]
}

export const deleteCollectionImagesWorkflow = createWorkflow(
    "delete-collection-images",
    (input: DeleteCollectionImagesInput) => {
        const { data: collectionImages } = useQueryGraphStep({
            entity: "product_collection_image",
            fields: ["id", "file_id", "url", "type", "collection_id"],
            filters: {
                id: input.ids,
            },
            options: {
                throwIfKeyNotFound: true,
            },
        })

        const fileIds = transform(
            { collectionImages },
            (data) => data.collectionImages.map((img) => img.file_id)
        )

        deleteFilesWorkflow.runAsStep({
            input: {
                ids: fileIds,
            },
        })

        const result = deleteCollectionImagesStep({ ids: input.ids })

        return new WorkflowResponse(result)
    }
)
