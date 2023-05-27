import fetch from 'node-fetch';

import { parseJSObject, unique } from './helpers';
import { CloudRelease, Release, ReleaseFile } from './types';

const RELEASES_TABLE_URL = 'https://cloud-images.ubuntu.com/locator/releasesTable';

export function getOvaUrl(release: Release): string {
  const { arch, name, release: date, version } = release;
  const id = date === 'latest' ? 'release' : 'release-' + date;
  return `https://cloud-images.ubuntu.com/releases/${name}/${id}/ubuntu-${version}-server-cloudimg-${arch}.ova`;
}

export async function loadCloudReleases(): Promise<CloudRelease[]> {
  const response = await fetch(`${RELEASES_TABLE_URL}?_=${Date.now()}`);
  const result = parseJSObject(await response.text());
  const images = result.aaData as [string, string, string, string, string, string, string, string][];

  return images.map(([cloud, zone, name, version, arch, type, release, id]) => ({
    cloud, zone, name, version, arch, type, release, id,
  }));
}

export async function loadReleases(): Promise<Release[]> {
  const cloudReleases = await loadCloudReleases();
  return unique(cloudReleases.map(r => ({
    name: r.name,
    version: r.version,
    arch: r.arch,
    release: r.release,
  } as Release)));
}

export async function getOvaFile(release: Release): Promise<ReleaseFile | undefined> {
  const url = getOvaUrl(release);
  const result = await fetch(url, { method: 'HEAD' });
  if (result.status === 200) {
    const contentLength = result.headers.get('Content-Length');
    if (contentLength) {
      return {
        url,
        size: Number.parseInt(contentLength, 10),
        etag: result.headers.get('Etag'),
      };
    }
  }

  return undefined;
}
