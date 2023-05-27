import type { Hash } from 'node:crypto';

import { Release } from '@vinrobot/ubuntu-cloud-images';
import { ContentLibraryProvider, Directory, File } from '@vinrobot/vmware-content-library';

export class ReleasesProvider implements ContentLibraryProvider {
  constructor(private releases: Release[]) { }

  async getDirectories(): Promise<Directory[]> {
    return this.releases.map(r => new ReleaseDirectory(r));
  }
}

class ReleaseDirectory implements Directory {
  readonly name: string;

  constructor(private release: Release) {
    this.name = `ubuntu-${release.version}-server-cloudimg-${release.arch}-${release.release}`;
  }

  async getFiles(): Promise<File[]> {
    const file = this.release.file!;
    return [new ReleaseFile(this.name + '.ova', file.size, file.etag)];
  }
}

class ReleaseFile implements File {
  private readonly etag: string;

  constructor(
    readonly name: string,
    private readonly size: number,
    etag?: string | null,
  ) {
    this.etag = etag ?? JSON.stringify([name, size]);
  }

  async getSize(): Promise<number> {
    return this.size;
  }

  async updateHash(hasher: Hash): Promise<Hash> {
    return hasher.update(this.etag);
  }
}
