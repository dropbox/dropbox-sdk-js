export const BLOCK_SIZE: number;

export class DropboxContentHasher {
  update(data: Buffer | Uint8Array | ArrayBuffer): this;

  digest(encoding?: 'hex'): Buffer | string;
}

export function contentHash(
  data: Buffer | Uint8Array | ArrayBuffer,
): string;
