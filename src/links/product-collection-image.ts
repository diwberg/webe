import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductMediaModule from "../modules/product-media"

export default defineLink(
    {
        linkable: ProductModule.linkable.productCollection,
        field: "id",
        isList: true,
    },
    {
        ...ProductMediaModule.linkable.productCollectionImage.id,
        primaryKey: "collection_id",
    },
    {
        readOnly: true,
    }
)
