import { MedusaContainer } from "@medusajs/framework/types"

export default async function listCollections({
    container,
}: {
    container: MedusaContainer
}) {
    const query = container.resolve("query")
    const { data } = await query.graph({
        entity: "product_category_image",
        fields: ["*", "file_id", "url"]
    })

    console.log("Category Images Found:", data.length)
    console.log(JSON.stringify(data, null, 2))
}
