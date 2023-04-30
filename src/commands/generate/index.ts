import { Args, Command, Flags, ux } from '@oclif/core';
import { resolve } from 'node:path';

import { buildContentLibrary } from '../../lib/vmware';
import { FileSystemProvider } from '../../lib/vmware/providers';

export default class Generate extends Command {
  static description = '';

  static examples = [];

  static flags = {
    name: Flags.string({ default: 'ubuntu-cloud-images' }),
  };

  static args = {
    libPath: Args.string({ required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    const libPath = resolve(args.libPath);

    const provider = new FileSystemProvider(libPath);

    ux.action.start('Generating files...');

    await buildContentLibrary(flags.name, libPath, provider);

    ux.action.stop();
  }
}
