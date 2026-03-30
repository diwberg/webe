import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type UpdateCollectionImagesStepInput = {
    updates: {
        id: string
        type?: "thumbnail" | "image"
    }[]
}

export const updateCollectionImagesStep = createStep(
    "update-collection-images-step",
    async (input: UpdateCollectionImagesStepInput, { container }) => {
        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        const prevData = await productMediaService.listProductCollectionImages({
            id: input.updates.map((u) => u.id),
        })

        const updatedData = await productMediaService.updateProductCollectionImages(
            input.updates
        )

        return new StepResponse(updatedData, prevData)
    },
    async (compensationData, { container }) => {
        if (!compensationData?.length) {
            return
        }

        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        await productMediaService.updateProductCollectionImages(
            compensationData.map((img) => ({
                id: img.id,
                type: img.type,
            }))
        )
    }
)
