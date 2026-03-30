import { Text } from "@medusajs/ui"
import { CollectionImage, UploadedFile } from "../../types"
import { CollectionImageItem } from "./collection-image-item"

type CollectionImageGalleryProps = {
    existingImages: CollectionImage[]
    uploadedFiles: UploadedFile[]
    currentThumbnailId: string | null
    selectedImageIds: Set<string>
    onToggleSelect: (id: string, isUploaded?: boolean) => void
    imagesToDelete: Set<string>
}

export const CollectionImageGallery = ({
    existingImages,
    uploadedFiles,
    currentThumbnailId,
    selectedImageIds,
    onToggleSelect,
    imagesToDelete,
}: CollectionImageGalleryProps) => {

    const visibleExistingImages = existingImages.filter(
        (image) => image.id && !imagesToDelete.has(image.id)
    )

    const hasNoImages = visibleExistingImages.length === 0 && uploadedFiles.length === 0

    return (
        <div className="bg-ui-bg-subtle size-full overflow-auto">
            <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
                {/* Existing images */}
                {visibleExistingImages.map((image) => {
                    if (!image.id) { return null }

                    const imageId = image.id
                    const isThumbnail = currentThumbnailId === imageId

                    return (
                        <CollectionImageItem
                            key={imageId}
                            id={imageId}
                            url={image.url}
                            alt={`Collection ${image.type}`}
                            isThumbnail={isThumbnail}
                            isSelected={selectedImageIds.has(imageId)}
                            onToggleSelect={() => onToggleSelect(imageId)}
                        />
                    )
                })}

                {/* Newly uploaded files */}
                {uploadedFiles.map((file) => {
                    const uploadedId = `uploaded:${file.id}`
                    const isThumbnail = currentThumbnailId === uploadedId

                    return (
                        <CollectionImageItem
                            key={file.id}
                            id={file.id}
                            url={file.url}
                            alt="Uploaded"
                            isThumbnail={isThumbnail}
                            isSelected={selectedImageIds.has(uploadedId)}
                            onToggleSelect={() => onToggleSelect(file.id, true)}
                        />
                    )
                })}

                {/* Empty state */}
                {hasNoImages && (
                    <div className="col-span-4 flex items-center justify-center p-8">
                        <Text className="text-ui-fg-subtle text-center">
                            Nenhuma imagem ainda. Faça upload de imagens para começar.
                        </Text>
                    </div>
                )}
            </div>
        </div>
    )
}
