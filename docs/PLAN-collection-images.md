# PLAN: Product Collection Images

## 1. Context and Goal
The goal of this task is to replicate the logic successfully used to associate images with `product categories` and apply it to `product collections`. This will allow administrators to upload, manage, and assign thumbnails and images directly to product collections within the Medusa Admin UI, and expose them through the Storefront API.

## 2. Affected Areas and Dependencies
- **Modules**: The existing custom `product-media` module.
- **Data Models**: A new model needs to be created to link images to collections.
- **Links**: A Medusa link must be defined to establish the relationship between `ProductModule.linkable.productCollection` and the custom module.
- **API Routes**: New endpoints under `/admin/collections/:id/images` must be created.
- **Admin UI**: New UI extensions (Widget + Modal) injected into the `product_collection.details.after` zone.

## 3. Step-by-Step Task Breakdown

### Phase 1: Data Model & Service Extension
- [ ] Create `product-collection-image.ts` in `src/modules/product-media/models`.
- [ ] Define the fields: `id`, `url`, `file_id`, `type` ("thumbnail" | "image"), `collection_id`.
- [ ] Include an index for `unique_thumbnail_per_collection`.
- [ ] Update `src/modules/product-media/service.ts` to include the new model.
- [ ] Generate standard DB migrations for the new model.

### Phase 2: Linking Entities
- [ ] Create `src/links/product-collection-image.ts`.
- [ ] Define the link between `ProductModule.linkable.productCollection` and `ProductMediaModule.linkable.productCollectionImage.id`.

### Phase 3: Backend API Routes
- [ ] Identify `src/api` middlewares to register new paths.
- [ ] Add `src/api/admin/collections/[collection_id]/images/route.ts` (GET, POST).
- [ ] Add `src/api/admin/collections/[collection_id]/images/batch/route.ts` (POST for batch inserts, deletes, updates).
- [ ] Add validation and CORS middlewares for `/admin/collections/:id/images/*`.

### Phase 4: Admin UI Components
- [ ] Create `src/admin/components/collection-media/` folder mirroring `category-media/`.
- [ ] Build `collection-media-modal.tsx` handling state for selecting and uploading images to collections.
- [ ] Create `src/admin/widgets/collection-media-widget.tsx` and configure it to inject into `product_collection.details.after`.
- [ ] Add API hooks in `src/admin/hooks/use-collection-image.tsx` using `@tanstack/react-query`.

## 4. Agent Assignments
- **Orchestration**: `project-planner` (Created this plan)
- **Phase 1-3 (Backend)**: `backend-specialist` (Data models, Services, API routes, Links)
- **Phase 4 (Frontend)**: `frontend-specialist` (Admin UI Widgets, Queries, Modal interaction)

## 5. Verification Checklist
- [ ] Restart Medusa dev server and log in as Admin.
- [ ] Navigate to **Collections** in the UI.
- [ ] Verify if the media widget displays.
- [ ] Try uploading an image and setting it as a thumbnail.
- [ ] Confirm if it correctly saves to the database via API requests `(Status 200)`.
- [ ] Verify if deleting an image removes it from the display and database.
