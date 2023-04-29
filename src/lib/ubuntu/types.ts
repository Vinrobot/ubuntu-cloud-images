export interface Release {
  name: string;
  version: string;
  arch: string;
  release: string;
  url?: string;
}

export interface CloudRelease extends Release {
  cloud: string;
  zone: string;
  type: string;
  id: string;
}
