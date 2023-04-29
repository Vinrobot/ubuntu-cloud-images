import fetch from 'node-fetch';
import { parseJSObject, unique } from './helpers';
import { CloudRelease, Release } from './types';

const RELEASES_TABLE_URL = 'https://cloud-images.ubuntu.com/locator/releasesTable';

function getReleaseUrl(release: Release): string {
  if (release.url) return release.url;
  const version = release.release === 'latest' ? 'release' : 'release-' + release.release;
  const releaseUrl = `https://cloud-images.ubuntu.com/releases/${release.name}/${version}/`;
  release.url = releaseUrl;
  return releaseUrl;
}

export class UbuntuScraper {
  async loadCloudReleases(): Promise<CloudRelease[]> {
    const response = await fetch(`${RELEASES_TABLE_URL}?_=${Date.now()}`);
    const result = parseJSObject(await response.text());
    const images = result.aaData as [string, string, string, string, string, string, string, string][];

    return images.map(([cloud, zone, name, version, arch, type, release, id]) => ({
      cloud, zone, name, version, arch, type, release, id,
    }));
  }

  async loadReleases(): Promise<Release[]> {
    const cloudReleases = await this.loadCloudReleases();
    return unique(cloudReleases.map(r => ({
      name: r.name,
      version: r.version,
      arch: r.arch,
      release: r.release,
    } as Release)));
  }

  async isAvailable(release: Release): Promise<boolean> {
    const url = getReleaseUrl(release);
    const result = await fetch(url, { method: 'HEAD' });
    return result.status === 200;
  }
}
