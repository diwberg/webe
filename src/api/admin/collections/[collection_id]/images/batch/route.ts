import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
    updateCollectionImagesWorkflow,
} from "../../../../../../workflows/update-collection-images"
import {
    deleteCollectionImagesWorkflow,
} from "../../../../../../workflows/delete-collection-image"

import { z } from "@medusajs/framework/zod"

export const UpdateCollectionImagesSchema = z.object({
    updates: z.array(z.object({
        id: z.string(),
        type: z.enum(["thumbnail", "image"]),
    })).min(1, "At least one update is required"),
})

type UpdateCollectionImagesInput = z.infer<typeof UpdateCollectionImagesSchema>

export async function POST(
    req: MedusaRequest<UpdateCollectionImagesInput>,
    res: MedusaResponse
): Promise<void> {
    const { updates } = req.validatedBody

    const { result } = await updateCollectionImagesWorkflow(req.scope).run({
        input: { updates },
    })

    res.status(200).json({ collection_images: result })
}

export const DeleteCollectionImagesSchema = z.object({
    ids: z.array(z.string()).min(1, "At least one ID is required"),
})

type DeleteCollectionImagesInput = z.infer<typeof DeleteCollectionImagesSchema>

export async function DELETE(
    req: MedusaRequest<DeleteCollectionImagesInput>,
    res: MedusaResponse
): Promise<void> {
    const { ids } = req.validatedBody

    await deleteCollectionImagesWorkflow(req.scope).run({
        input: { ids },
    })

    res.status(200).json({
        deleted: ids,
    })
}
