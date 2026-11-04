declare module 'lz4js' {
  export function compress(src: Uint8Array, maxSize?: number): Uint8Array;
  export function decompress(src: Uint8Array, maxSize?: number): Uint8Array;
  export function decompressBound(src: Uint8Array): number;
  export function decompressFrame(src: Uint8Array, dst: Uint8Array): number;
}
