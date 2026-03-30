import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type ConvertCollectionThumbnailsStepInput = {
    collection_ids: string[]
}

export const convertCollectionThumbnailsStep = createStep(
    "convert-collection-thumbnails-step",
    async (input: ConvertCollectionThumbnailsStepInput, { container }) => {
        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        const existingThumbnails = await productMediaService.listProductCollectionImages({
            type: "thumbnail",
            collection_id: input.collection_ids,
        })

        if (existingThumbnails.length === 0) {
            return new StepResponse([], [])
        }

        const compensationData: string[] = existingThumbnails.map((t) => t.id)

        await productMediaService.updateProductCollectionImages(
            existingThumbnails.map((t) => ({
                id: t.id,
                type: "image" as const,
            }))
        )

        return new StepResponse(existingThumbnails, compensationData)
    },
    async (compensationData, { container }) => {
        if (!compensationData?.length) {
            return
        }

        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        await productMediaService.updateProductCollectionImages(
            compensationData.map((id) => ({
                id,
                type: "thumbnail" as const,
            }))
        )
    }
)
