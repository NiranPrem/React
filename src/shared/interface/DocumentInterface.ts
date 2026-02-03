export interface DocumentInterface {
  documentFileId?: number;
  name?: string;
  format: string;
  blobFile?: Blob | null;
  isReferral?: boolean;
  [key: string]: unknown;
}
