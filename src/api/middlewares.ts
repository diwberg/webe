import {
    defineMiddlewares,
    validateAndTransformBody,
} from "@medusajs/framework/http"
import {
    CreateCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/route"
import {
    UpdateCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/batch/route"
import {
    DeleteCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/batch/route"
import {
    CreateCollectionImagesSchema,
} from "./admin/collections/[collection_id]/images/route"
import {
    UpdateCollectionImagesSchema,
} from "./admin/collections/[collection_id]/images/batch/route"
import {
    DeleteCollectionImagesSchema,
} from "./admin/collections/[collection_id]/images/batch/route"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/categories/:category_id/images",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(CreateCategoryImagesSchema),
            ],
        },
        {
            matcher: "/admin/categories/:category_id/images/batch",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(UpdateCategoryImagesSchema),
            ],
        },
        {
            matcher: "/admin/categories/:category_id/images/batch",
            method: ["DELETE"],
            middlewares: [
                validateAndTransformBody(DeleteCategoryImagesSchema),
            ],
        },
        {
            matcher: "/admin/collections/:collection_id/images",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(CreateCollectionImagesSchema),
            ],
        },
        {
            matcher: "/admin/collections/:collection_id/images/batch",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(UpdateCollectionImagesSchema),
            ],
        },
        {
            matcher: "/admin/collections/:collection_id/images/batch",
            method: ["DELETE"],
            middlewares: [
                validateAndTransformBody(DeleteCollectionImagesSchema),
            ],
        },
    ],
})