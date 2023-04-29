import { Command, ux } from '@oclif/core';

import { UbuntuScraper } from '../../lib/ubuntu';

export default class Fetch extends Command {
  static description = 'Fetch available Ubuntu Cloud Images';

  static examples = [];

  static flags = {};

  static args = {};

  async run(): Promise<void> {
    await this.parse(Fetch);

    const scraper = new UbuntuScraper();

    ux.action.start('Fetching releases...');
    const releases = await scraper.loadReleases();
    ux.action.stop();

    this.logToStderr(`Found ${releases.length} releases`);

    ux.action.start('Filtering releases...');

    const availableReleases = [];
    for (const release of releases) {
      // eslint-disable-next-line no-await-in-loop
      if (await scraper.isAvailable(release)) {
        availableReleases.push(release);
      }
    }

    ux.action.stop();

    this.logToStderr(`Found ${availableReleases.length} available releases`);

    this.log(JSON.stringify(availableReleases, undefined, 2));
  }
}
