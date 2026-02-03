export interface Base64File {
  name: string;
  size: number;
  format: string;
  typeId: number | undefined;
  base64: string;
}

export interface DropdownInterface {
  label?: string;
  sequenceNumber?: number;
  value?: number;
}