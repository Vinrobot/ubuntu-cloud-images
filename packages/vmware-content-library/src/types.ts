import { Hash } from 'node:crypto';

export enum ContentLibraryCapability {
  httpGet = 'httpGet',
}

export enum ContentLibraryItemType {
  other = 'vcsp.other',
  iso = 'vcsp.iso',
  ovf = 'vcsp.ovf',
}

export interface ContentLibrary {
  vcspVersion: '2';
  version: string;
  contentVersion: string;
  name: string;
  id: string;
  created: Date;
  capabilities: {
    transferIn: ContentLibraryCapability[],
    transferOut: ContentLibraryCapability[],
  };
  itemsHref: string;
}

export interface ContentLibraryItems {
  items: ContentLibraryItem[];
}

export interface ContentLibraryItem {
  created: Date;
  description: string
  version: string;
  files: ContentLibraryFile[];
  id: string;
  name: string;
  metadata?: ContentLibraryMetadata[],
  properties: Record<string, string>
  selfHref: string;
  type: ContentLibraryItemType;
}

export interface ContentLibraryMetadata {
  key: string;
  value: string;
  type: string;
  domain: string;
  visibility: string;
}

export interface ContentLibraryFile {
  name: string;
  size: number;
  etag: string;
  hrefs: string[];
}

export interface ContentLibraryProvider {
  getDirectories(): Promise<Directory[]>;
}

export interface Directory {
  readonly name: string;
  getFiles(): Promise<File[]>;
}

export interface File {
  readonly name: string;
  getSize(): Promise<number>;
  updateHash(hasher: Hash): Promise<Hash>;
}
