import {
    createWorkflow,
    transform,
    when,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createCollectionImagesStep } from "./steps/create-collection-images"
import { convertCollectionThumbnailsStep } from "./steps/convert-collection-thumbnails"

export type CreateCollectionImagesInput = {
    collection_images: {
        collection_id: string
        type: "thumbnail" | "image"
        url: string
        file_id: string
    }[]
}

export const createCollectionImagesWorkflow = createWorkflow(
    "create-collection-images",
    (input: CreateCollectionImagesInput) => {

        when(input, (data) => data.collection_images.some((img) => img.type === "thumbnail"))
            .then(
                () => {
                    const collectionIds = transform({
                        input,
                    }, (data) => {
                        return data.input.collection_images.filter(
                            (img) => img.type === "thumbnail"
                        ).map((img) => img.collection_id)
                    })

                    convertCollectionThumbnailsStep({
                        collection_ids: collectionIds,
                    })
                }
            )

        const collectionImages = createCollectionImagesStep({
            collection_images: input.collection_images,
        })

        return new WorkflowResponse(collectionImages)
    }
)
