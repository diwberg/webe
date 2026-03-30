import {
    type SubscriberConfig,
    type SubscriberArgs,
} from "@medusajs/medusa";
import { Modules } from "@medusajs/utils"
import type { IProductModuleService, Logger } from "@medusajs/types";

// Função padronizada de sanitização de slugs
// - Normaliza ('NFD') e tira os diacríticos (acentos)
// - Força letras minúsculas
// - Substitui espaços em branco e todos os outros caracteres nocivos por '-'
// - Evita hífen repetido e retira do início e final
function sanitizeHandle(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default async function sanitizeHandleSubscriber({
    event: { data, name },
    container,
}: SubscriberArgs<{ id: string }>) {
    const logger = container.resolve<Logger>("logger");
    const productModuleService = container.resolve<IProductModuleService>(Modules.PRODUCT);

    try {
        if (name.includes("product-category")) {
            const category = await productModuleService.retrieveProductCategory(data.id, { select: ["id", "handle"] });

            if (!category.handle) return;

            const newHandle = sanitizeHandle(category.handle);

            if (newHandle !== category.handle) {
                logger.info(`Cleaning accented category handle: '${category.handle}' -> '${newHandle}'`);
                await productModuleService.updateProductCategories(category.id, { handle: newHandle });
            }
        }
        else if (name.includes("product-collection")) {
            const collection = await productModuleService.retrieveProductCollection(data.id, { select: ["id", "handle"] });
            if (!collection.handle) return;

            const newHandle = sanitizeHandle(collection.handle);
            if (newHandle !== collection.handle) {
                logger.info(`Cleaning accented collection handle: '${collection.handle}' -> '${newHandle}'`);
                await productModuleService.updateProductCollections(collection.id, { handle: newHandle });
            }
        }
        else if (name === "product.created" || name === "product.updated") {
            const product = await productModuleService.retrieveProduct(data.id, { select: ["id", "handle"] });
            if (!product.handle) return;

            const newHandle = sanitizeHandle(product.handle);
            if (newHandle !== product.handle) {
                logger.info(`Cleaning accented product handle: '${product.handle}' -> '${newHandle}'`);
                await productModuleService.updateProducts(product.id, { handle: newHandle });
            }
        }
    } catch (error) {
        logger.error(`Error sanitizing handle for event ${name} (id: ${data.id}): ${error}`);
    }
}

export const config: SubscriberConfig = {
    event: [
        "product.created",
        "product.updated",
        "product.product-category.created",
        "product.product-category.updated",
        "product.product-collection.created",
        "product.product-collection.updated",
    ],
};
