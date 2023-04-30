import { Args, Command, Flags, ux } from '@oclif/core';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Release } from '../../lib/ubuntu';
import { buildContentLibrary, ReleasesProvider } from '../../lib/vmware';

export default class Generate extends Command {
  static description = '';

  static examples = [];

  static flags = {
    name: Flags.string({ default: 'ubuntu-cloud-images' }),
  };

  static args = {
    libPath: Args.string({ required: true }),
    releasesPath: Args.string({ required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    const libPath = resolve(args.libPath);
    const releasesPath = resolve(args.releasesPath);

    const content = await readFile(releasesPath, { encoding: 'utf-8' });
    const releases = JSON.parse(content) as Release[];
    // TODO: Validate releases with schema
    const provider = new ReleasesProvider(releases);

    ux.action.start('Generating files...');

    await buildContentLibrary(flags.name, libPath, provider);

    ux.action.stop();
  }
}
