# SpectralLink Demo Bundle + GhostH Add-ons

This package merges:

1) **SpectralLink_Complete_v3_1_FINAL** demo project (Vite/React) as provided.
2) **GhostH add-ons**: current planning docs + the images you uploaded in this chat (renamed + manifest) + packaging/verification scripts.

## Where things are

- Demo project root: this folder (run as normal Vite project)
- GhostH planning + scripts: `_ghosth_addons/planning_docs/` and `_ghosth_addons/scripts/`
- Uploaded images (renamed): `_ghosth_addons/uploaded_images/`

## Notes

- The demo's built-in object slots expect images under `public/assets/objects/{cutout|found}/` per `src/assets/objects.ts`.
- Your uploaded images are included **as-is** under `_ghosth_addons/uploaded_images/` to avoid breaking the demo's current object-id mapping.
