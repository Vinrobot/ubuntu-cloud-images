import { Hash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { Release } from '../ubuntu';
import { filterAsync, updateHash } from './helpers';
import { ContentLibraryProvider, Directory, File } from './types';

export class FileSystemProvider implements ContentLibraryProvider {
  constructor(readonly path: string) { }

  async getDirectories(): Promise<Directory[]> {
    const dir = this.path;
    const entries = (await readdir(dir)).map(entry => join(dir, entry));
    const directories = await filterAsync(entries, async entry => {
      const fileStat = await stat(entry);
      return fileStat.isDirectory();
    });
    return directories.map(dir => new FileSystemDirectory(dir));
  }
}

class FileSystemDirectory implements Directory {
  readonly name: string;

  constructor(readonly path: string) {
    this.name = basename(path);
  }

  async getFiles(): Promise<File[]> {
    const dir = this.path;
    const entries = (await readdir(dir)).map(entry => join(dir, entry));
    const files = await filterAsync(entries, async entry => {
      const fileStat = await stat(entry);
      return fileStat.isFile();
    });
    return files.map(file => new FileSystemFile(file));
  }

  async updateHash(hasher: Hash, files?: File[]): Promise<Hash> {
    return updateHash(hasher, files ?? await this.getFiles());
  }
}

class FileSystemFile implements File {
  readonly name: string;

  constructor(readonly path: string) {
    this.name = basename(path);
  }

  async getSize(): Promise<number> {
    const fileStat = await stat(this.path);
    return fileStat.size;
  }

  updateHash(hasher: Hash): Promise<Hash> {
    return new Promise(resolve => {
      const stream = createReadStream(this.path);
      stream.on('data', (data: any) => hasher.update(data));
      stream.on('end', () => resolve(hasher));
    });
  }
}

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

  async updateHash(hasher: Hash, files?: File[]): Promise<Hash> {
    return updateHash(hasher, files ?? await this.getFiles());
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