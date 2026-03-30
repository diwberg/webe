import {
    type SubscriberConfig,
    type SubscriberArgs,
} from "@medusajs/medusa";
import type { Logger } from "@medusajs/types";

export default async function revalidateWebhook({
    event: { data, name },
    container,
}: SubscriberArgs<{ id: string }>) {
    const url = process.env.NEXTJS_REVALIDATE_URL + "/api/revalidate";
    const logger = container.resolve<Logger>("logger");

    if (!url) {
        logger.warn("NEXTJS_REVALIDATE_URL env variable is not set. Skipping webhook.");
        return;
    }

    const secret = process.env.REVALIDATE_SECRET;

    if (!secret) {
        logger.warn("No publishable API key found in the database. Webhook won't be authorized.");
    }

    let success = false;
    let attempt = 0;
    const MAX_RETRIES = 3;

    while (attempt < MAX_RETRIES && !success) {
        attempt++;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(secret && { "Authorization": `Bearer ${secret}` })
                },
                body: JSON.stringify({
                    event: name,
                    data,
                }),
            });

            if (!response.ok) {
                logger.error(`Webhook attempt ${attempt} failed with status ${response.status}: ${await response.text()}`);
            } else {
                logger.info(`Webhook attempt ${attempt} succeeded for event ${name}`);
                console.log(`Webhook attempt ${attempt} succeeded for event ${name}`);
                success = true;
            }
        } catch (err) {
            const error = err as Error;
            logger.error(`Failed to send webhook on attempt ${attempt} for event ${name}: ${error.message}`);
        }

        if (!success && attempt < MAX_RETRIES) {
            // 500ms jitter/delay antes de nova tentativa
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    if (!success) {
        logger.error(`Webhook definitively failed after ${MAX_RETRIES} attempts for event ${name}. Skipping further retries.`);
    }
}

export const config: SubscriberConfig = {
    event: [
        "product.updated",
        "product.created",
        "product.deleted",
        "product.product-collection.updated",
        "product.product-collection.created",
        "product.product-collection.deleted",
        "product.product-category.updated",
        "product.product-category.created",
        "product.product-category.deleted",
    ],
};
