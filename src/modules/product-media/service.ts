import { MedusaService } from "@medusajs/framework/utils"
import ProductCategoryImage from "./models/product-category-image"
import ProductCollectionImage from "./models/product-collection-image"

class ProductMediaModuleService extends MedusaService({
    ProductCategoryImage,
    ProductCollectionImage,
}) { }

export default ProductMediaModuleService