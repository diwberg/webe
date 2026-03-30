import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type DeleteCollectionImagesStepInput = {
    ids: string[]
}

export const deleteCollectionImagesStep = createStep(
    "delete-collection-images-step",
    async (input: DeleteCollectionImagesStepInput, { container }) => {
        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        const collectionImages = await productMediaService.listProductCollectionImages({
            id: input.ids,
        })

        await productMediaService.deleteProductCollectionImages(input.ids)

        return new StepResponse(
            { success: true, deleted: input.ids },
            collectionImages
        )
    },
    async (collectionImages, { container }) => {
        if (!collectionImages || collectionImages.length === 0) {
            return
        }

        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        await productMediaService.createProductCollectionImages(
            collectionImages.map((img) => ({
                id: img.id,
                collection_id: img.collection_id,
                type: img.type,
                url: img.url,
                file_id: img.file_id,
            }))
        )
    }
)
