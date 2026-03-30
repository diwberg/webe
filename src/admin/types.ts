export type CategoryImage = {
    id?: string
    url: string
    type: "thumbnail" | "image"
    file_id: string
    category_id?: string
}

export type CollectionImage = {
    id?: string
    url: string
    type: "thumbnail" | "image"
    file_id: string
    collection_id?: string
}

export type UploadedFile = {
    id: string
    url: string
    type?: "thumbnail" | "image"
}