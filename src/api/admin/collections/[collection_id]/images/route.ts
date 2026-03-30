import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createCollectionImagesWorkflow } from "../../../../../workflows/create-collection-images"
import { z } from "@medusajs/framework/zod"

export const CreateCollectionImagesSchema = z.object({
    images: z.array(
        z.object({
            type: z.enum(["thumbnail", "image"]),
            url: z.string(),
            file_id: z.string(),
        })
    ).min(1, "At least one image is required"),
})

type CreateCollectionImagesInput = z.infer<typeof CreateCollectionImagesSchema>

export async function POST(
    req: MedusaRequest<CreateCollectionImagesInput>,
    res: MedusaResponse
): Promise<void> {
    const { collection_id } = req.params
    const { images } = req.validatedBody

    // Add collection_id to each image
    const collection_images = images.map((image) => ({
        ...image,
        collection_id,
    }))

    const { result } = await createCollectionImagesWorkflow(req.scope).run({
        input: {
            collection_images,
        },
    })

    res.status(200).json({ collection_images: result })
}

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const { collection_id } = req.params
    const query = req.scope.resolve("query")

    const { data: collectionImages } = await query.graph({
        entity: "product_collection_image",
        fields: ["*"],
        filters: {
            collection_id,
        },
    })

    res.status(200).json({ collection_images: collectionImages })
}
