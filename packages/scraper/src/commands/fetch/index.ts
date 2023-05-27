import { Command, Flags, ux } from '@oclif/core';

import { loadReleases, getOvaFile } from '@vinrobot/ubuntu-cloud-images';

export default class Fetch extends Command {
  static description = 'Fetch available Ubuntu Cloud Images';

  static examples = [];

  static flags = {
    name: Flags.string({ multiple: true, delimiter: ',' }),
    version: Flags.string({ multiple: true, delimiter: ',' }),
    arch: Flags.string({ multiple: true, delimiter: ',' }),
    release: Flags.string({ multiple: true, delimiter: ',' }),
    'fetch-files': Flags.boolean({ default: true, allowNo: true }),
  };

  static args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Fetch);

    ux.action.start('Fetching releases...');
    let releases = await loadReleases();
    ux.action.stop();

    this.logToStderr(`Found ${releases.length} releases`);

    const filterName = flags.name;
    if (filterName) {
      releases = releases.filter(release => filterName.includes(release.name));
      this.logToStderr(`Found ${releases.length} releases with name '${filterName.join(', ')}'`);
    }

    const filterVersion = flags.version;
    if (filterVersion) {
      releases = releases.filter(release => filterVersion.includes(release.version));
      this.logToStderr(`Found ${releases.length} releases with version '${filterVersion.join(', ')}'`);
    }

    const filterArch = flags.arch;
    if (filterArch) {
      releases = releases.filter(release => filterArch.includes(release.arch));
      this.logToStderr(`Found ${releases.length} releases with arch '${filterArch.join(', ')}'`);
    }

    const filterReleases = flags.release;
    if (filterReleases) {
      releases = releases.filter(release => filterReleases.includes(release.release));
      this.logToStderr(`Found ${releases.length} releases with release '${filterReleases.join(', ')}'`);
    }

    if (flags['fetch-files']) {
      ux.action.start('Checking availability...');

      const availableReleases = [];
      for (const release of releases) {
        // eslint-disable-next-line no-await-in-loop
        const file = await getOvaFile(release);
        if (file) {
          release.file = file;
          availableReleases.push(release);
        }
      }

      ux.action.stop();

      this.logToStderr(`Found ${availableReleases.length} available releases`);

      this.log(JSON.stringify(availableReleases, undefined, 2));
    } else {
      this.log(JSON.stringify(releases, undefined, 2));
    }
  }
}
