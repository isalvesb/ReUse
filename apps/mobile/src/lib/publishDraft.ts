// A single account-scoped document; never restore unowned historical draft_* keys.
export function publishDraftKey(subject: string) {
  if (!subject) throw Error("Sessão necessária.");
  return `reuse:publish:v16:${subject}`;
}
export function draftPhotoReference(photo: {
  imageId?: string;
  uploadId?: string;
}) {
  if (photo.imageId) return { imageId: photo.imageId };
  if (photo.uploadId) return { uploadId: photo.uploadId };
  throw Error("Foto local ainda não enviada.");
}
