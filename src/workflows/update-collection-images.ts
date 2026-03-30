import {
    createWorkflow,
    WorkflowResponse,
    transform,
    when,
} from "@medusajs/framework/workflows-sdk"
import { updateCollectionImagesStep } from "./steps/update-collection-images"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { convertCollectionThumbnailsStep } from "./steps/convert-collection-thumbnails"

export type UpdateCollectionImagesInput = {
    updates: {
        id: string
        type?: "thumbnail" | "image"
    }[]
}

export const updateCollectionImagesWorkflow = createWorkflow(
    "update-collection-images",
    (input: UpdateCollectionImagesInput) => {
        when(input, (data) => data.updates.some((u) => u.type === "thumbnail"))
            .then(
                () => {
                    const collectionImageIds = transform({
                        input,
                    }, (data) => data.input.updates.filter(
                        (u) => u.type === "thumbnail"
                    ).map((u) => u.id))
                    const { data: collectionImages } = useQueryGraphStep({
                        entity: "product_collection_image",
                        fields: ["collection_id"],
                        filters: {
                            id: collectionImageIds,
                        },
                        options: {
                            throwIfKeyNotFound: true,
                        },
                    })
                    const collectionIds = transform({
                        collectionImages,
                    }, (data) => data.collectionImages.map((img) => img.collection_id))

                    convertCollectionThumbnailsStep({
                        collection_ids: collectionIds,
                    })
                }
            )
        const updatedImages = updateCollectionImagesStep({
            updates: input.updates,
        })

        return new WorkflowResponse(updatedImages)
    }
)
