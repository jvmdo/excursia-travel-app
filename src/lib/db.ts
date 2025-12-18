import Dexie, { type EntityTable } from "dexie";

export interface LocalPhoto {
  id: string;
  blob: Blob;
  name: string;
  size: number;
  uploadedAt: Date;
  albumId?: string;
}

export interface LocalAlbum {
  id: string;
  name: string;
  createdAt: Date;
  coverPhotoId?: string;
}

const db = new Dexie("ExcursiaPhotosDB") as Dexie & {
  photos: EntityTable<LocalPhoto, "id">;
  albums: EntityTable<LocalAlbum, "id">;
};

db.version(1).stores({
  photos: "id, albumId, uploadedAt, name",
  albums: "id, createdAt, name",
});

export { db };
