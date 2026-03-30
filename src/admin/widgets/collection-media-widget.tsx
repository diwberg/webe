import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminCollection } from "@medusajs/framework/types"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { CollectionImage } from "../types"
import { ThumbnailBadge } from "@medusajs/icons"
import { CollectionMediaModal } from "../components/collection-media/collection-media-modal"

type CollectionImagesResponse = {
    collection_images: CollectionImage[]
}

const CollectionMediaWidget = ({ data }: DetailWidgetProps<AdminCollection>) => {
    const { data: response, isLoading } = useQuery({
        queryKey: ["collection-images", data.id],
        queryFn: async () => {
            const result = await sdk.client.fetch<CollectionImagesResponse>(
                `/admin/collections/${data.id}/images`
            )
            return result
        },
    })

    const images = response?.collection_images || []

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Mídia</Heading>
                <CollectionMediaModal collectionId={data.id} existingImages={images} />
            </div>
            <div className="px-6 py-4">
                <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-4">
                    {isLoading && (
                        <div className="col-span-full">
                            <p className="text-ui-fg-subtle text-sm">Carregando...</p>
                        </div>
                    )}
                    {!isLoading && images.length === 0 && (
                        <div className="col-span-full">
                            <p className="text-ui-fg-subtle text-sm">Nenhuma imagem adicionada ainda</p>
                        </div>
                    )}
                    {images.map((image: CollectionImage) => (
                        <div
                            key={image.id}
                            className="relative aspect-square overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle"
                        >
                            <img
                                src={image.url}
                                alt={`Collection ${image.type}`}
                                className="h-full w-full object-cover"
                            />
                            {image.type === "thumbnail" && (
                                <div className="absolute top-2 left-2">
                                    <ThumbnailBadge />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product_collection.details.after",
})

export default CollectionMediaWidget
