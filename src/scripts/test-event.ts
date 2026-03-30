import type { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/utils";
import type { IEventBusModuleService } from "@medusajs/types";

export default async function myScript({ container }: ExecArgs) {
    const eventBus = container.resolve<IEventBusModuleService>(Modules.EVENT_BUS);
    console.log("Emitting product.updated event...");
    await eventBus.emit({
        name: "product.updated",
        data: { id: "test-product-id" },
    });
    console.log("Event emitted.");
    // Wait a bit to allow subscribers to finish async execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Done waiting.");
}
