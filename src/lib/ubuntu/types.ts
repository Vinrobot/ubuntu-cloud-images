export interface Release {
  name: string;
  version: string;
  arch: string;
  release: string;
  file?: ReleaseFile;
}

export interface ReleaseFile {
  url: string;
  size: number;
  etag?: string | null;
}

export interface CloudRelease extends Release {
  cloud: string;
  zone: string;
  type: string;
  id: string;
}
