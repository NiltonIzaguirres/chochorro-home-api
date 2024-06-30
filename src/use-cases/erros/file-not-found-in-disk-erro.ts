export class FileNotFoundInDiskError extends Error {
  constructor() {
    super('File not found in disk.')
  }
}
