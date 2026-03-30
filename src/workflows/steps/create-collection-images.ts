import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"
import { MedusaError } from "@medusajs/framework/utils"

export type CreateCollectionImagesStepInput = {
    collection_images: {
        collection_id: string
        type: "thumbnail" | "image"
        url: string
        file_id: string
    }[]
}

export const createCollectionImagesStep = createStep(
    "create-collection-images-step",
    async (input: CreateCollectionImagesStepInput, { container }) => {
        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        const imagesByCollection = input.collection_images.reduce((acc, img) => {
            if (!acc[img.collection_id]) {
                acc[img.collection_id] = []
            }
            acc[img.collection_id].push(img)
            return acc
        }, {} as Record<string, typeof input.collection_images>)

        for (const [_, images] of Object.entries(imagesByCollection)) {
            const thumbnailImages = images.filter((img) => img.type === "thumbnail")

            if (thumbnailImages.length > 1) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    "Only one thumbnail is allowed per collection"
                )
            }
        }

        const createdImages = await productMediaService.createProductCollectionImages(
            Object.values(imagesByCollection).flat()
        )

        return new StepResponse(createdImages, createdImages)
    },
    async (compensationData, { container }) => {
        if (!compensationData?.length) {
            return
        }

        const productMediaService: ProductMediaModuleService =
            container.resolve(PRODUCT_MEDIA_MODULE)

        await productMediaService.deleteProductCollectionImages(
            compensationData
        )
    }
)
