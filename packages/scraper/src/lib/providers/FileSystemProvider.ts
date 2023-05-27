import { Hash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { ContentLibraryProvider, Directory, File } from '@vinrobot/vmware-content-library';

import { filterAsync } from './helpers';

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
