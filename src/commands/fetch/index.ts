import { Command, Flags, ux } from '@oclif/core';

import { UbuntuScraper } from '../../lib/ubuntu';

export default class Fetch extends Command {
  static description = 'Fetch available Ubuntu Cloud Images';

  static examples = [];

  static flags = {
    name: Flags.string(),
    version: Flags.string(),
    arch: Flags.string(),
    release: Flags.string(),
  };

  static args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Fetch);

    const scraper = new UbuntuScraper();

    ux.action.start('Fetching releases...');
    let releases = await scraper.loadReleases();
    ux.action.stop();

    this.logToStderr(`Found ${releases.length} releases`);

    if (flags.name) {
      releases = releases.filter(release => release.name === flags.name);
      this.logToStderr(`Found ${releases.length} releases with name '${flags.name}'`);
    }

    if (flags.version) {
      releases = releases.filter(release => release.version === flags.version);
      this.logToStderr(`Found ${releases.length} releases with version '${flags.version}'`);
    }

    if (flags.arch) {
      releases = releases.filter(release => release.arch === flags.arch);
      this.logToStderr(`Found ${releases.length} releases with arch '${flags.arch}'`);
    }

    if (flags.release) {
      releases = releases.filter(release => release.release === flags.release);
      this.logToStderr(`Found ${releases.length} releases with release '${flags.release}'`);
    }

    ux.action.start('Checking availability...');

    const availableReleases = [];
    for (const release of releases) {
      // eslint-disable-next-line no-await-in-loop
      if (await scraper.isOvaAvailable(release)) {
        availableReleases.push(release);
      }
    }

    ux.action.stop();

    this.logToStderr(`Found ${availableReleases.length} available releases`);

    this.log(JSON.stringify(availableReleases, undefined, 2));
  }
}
