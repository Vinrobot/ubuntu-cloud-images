import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { v4 as uuid4 } from 'uuid';

import { areMapEqual } from './helpers';
import { ContentLibrary, ContentLibraryCapability, ContentLibraryItem, ContentLibraryItems, ContentLibraryItemType, ContentLibraryProvider, Directory } from './types';

const LIB_FILE = 'lib.json';
const ITEMS_FILE = 'items.json';
const ITEM_FILE = 'item.json';
const IGNORE_FILES = new Set([LIB_FILE, ITEMS_FILE, ITEM_FILE, '.ds_store']);

async function createItem(directory: Directory, libId: string) {
  if (directory.name.length > 80) throw new Error('Directory name must not exceed 80 characters');

  const entries = (await directory.getFiles())
    .filter(fileName => !IGNORE_FILES.has(fileName.name.toLowerCase()))
    .sort();

  const hasher = createHash('md5');
  await directory.updateHash(hasher, entries);
  const md5 = hasher.digest('hex');

  let type = ContentLibraryItemType.other;
  if (entries.some(({ name }) => name.endsWith('.ovf') || name.endsWith('.ova'))) {
    type = ContentLibraryItemType.ovf;
  } else if (entries.some(({ name }) => name.endsWith('.iso'))) {
    type = ContentLibraryItemType.iso;
  }

  const files = await Promise.all(entries.map(async fileName => ({
    name: fileName.name,
    size: await fileName.getSize(),
    etag: md5,
    hrefs: [join(directory.name, fileName.name)],
  })));

  const itemId = `urn:uuid:${uuid4()}`;
  return {
    created: new Date(),
    description: '',
    version: '1',
    files: files,
    id: itemId,
    name: directory.name,
    metadata: type === ContentLibraryItemType.ovf ? [{
      key: 'type-metadata',
      value: JSON.stringify({
        id: itemId,
        version: '1',
        libraryIdParent: libId,
        isVappTemplate: 'false',
        vmTemplate: null,
        networks: [],
        storagePolicyGroups: null,
      }),
      type: 'String',
      domain: 'SYSTEM',
      visibility: 'READONLY',
    }] : undefined,
    properties: {},
    selfHref: join(directory.name, ITEM_FILE),
    type: type,
  } as ContentLibraryItem;
}

function createLibrary(name: string) {
  const newLib: ContentLibrary = {
    vcspVersion: '2',
    version: '1',
    contentVersion: '1',
    name: name,
    id: `urn:uuid:${uuid4()}`,
    created: new Date(),
    capabilities: {
      transferIn: [ContentLibraryCapability.httpGet],
      transferOut: [ContentLibraryCapability.httpGet],
    },
    itemsHref: ITEMS_FILE,
  };

  return newLib;
}

async function writeFiles(libDir: string, library: ContentLibrary, items: ContentLibraryItems) {
  for (const item of items.items) {
    const itemJsonPath = join(libDir, item.selfHref);
    // eslint-disable-next-line no-await-in-loop
    await mkdir(dirname(itemJsonPath), { recursive: true });
    // eslint-disable-next-line no-await-in-loop
    await writeFile(itemJsonPath, JSON.stringify(item, undefined, 2));
  }

  const itemsJsonPath = join(libDir, library.itemsHref);
  await writeFile(itemsJsonPath, JSON.stringify(items, undefined, 2));

  const libJsonPath = join(libDir, LIB_FILE);
  await writeFile(libJsonPath, JSON.stringify(library, undefined, 2));
}

export async function buildContentLibrary(libName: string, libPath: string, provider: ContentLibraryProvider): Promise<void> {
  const libJsonLoc = join(libPath, LIB_FILE);
  const libItemsJsonLoc = join(libPath, ITEMS_FILE);

  try {
    const oldLib = JSON.parse(await readFile(libJsonLoc, { encoding: 'utf-8' }));
    const oldItems = JSON.parse(await readFile(libItemsJsonLoc, { encoding: 'utf-8' }));

    const [newLib, newItems, mustSave] = await updateContentLibrary(oldLib, oldItems, provider);

    if (mustSave) {
      await writeFiles(libPath, newLib, newItems);
    }
  } catch {
    const [newLib, newItems] = await createContentLibrary(libName, provider);
    await writeFiles(libPath, newLib, newItems);
  }
}

export async function createContentLibrary(name: string, provider: ContentLibraryProvider): Promise<[ContentLibrary, ContentLibraryItems]> {
  const library = await createLibrary(name);
  const directories = await provider.getDirectories();
  const items = await Promise.all(directories.map(dir => createItem(dir, library.id)));
  return [library, { items }];
}

export async function updateContentLibrary(library: ContentLibrary, items: ContentLibraryItems, provider: ContentLibraryProvider): Promise<[ContentLibrary, ContentLibraryItems, boolean]> {
  const oldItems = new Map<string, ContentLibraryItem>(items.items.map(i => [i.name, i]));
  const directories = await provider.getDirectories();
  const newItems = await Promise.all(directories.map(dir => createItem(dir, library.id)));

  let changed = false;
  for (const newItem of newItems) {
    if (oldItems.has(newItem.name)) {
      const oldItem = oldItems.get(newItem.name)!;
      oldItems.delete(newItem.name);

      newItem.id = oldItem.id;
      newItem.created = oldItem.created;
      newItem.version = oldItem.version;

      const fileChanged = newItem.files.length !== oldItem.files.length || !areMapEqual(
        new Map(newItem.files.map(f => [f.name, f.etag])),
        new Map(oldItem.files.map(f => [f.name, f.etag])),
      );

      if (fileChanged) {
        changed = true; // Updated

        const version = Number.parseInt(newItem.version, 10);
        newItem.version = (version + 1).toString();
      }
    } else {
      changed = true; // Created
    }
  }

  if (oldItems.size > 0) {
    changed = true; // Deleted
  }

  if (changed) {
    const libVersion = Number.parseInt(library.version, 10);
    library.version = (libVersion + 1).toString();
  }

  return [library, { items: newItems }, changed];
}
