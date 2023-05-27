import { Args, Command, Flags, ux } from '@oclif/core';
import { readFile as fsReadFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

import { Release } from '@vinrobot/ubuntu-cloud-images';
import { buildContentLibrary, ReleasesProvider } from '../../lib/vmware';

function readFromStdin(): Promise<string> {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    const lines: string[] = [];
    rl.on('line', line => lines.push(line));
    rl.once('close', () => resolve(lines.join('')));
  });
}

function readFile(file: string) {
  if (file === '-') {
    return readFromStdin();
  }

  return fsReadFile(resolve(file), { encoding: 'utf-8' });
}

export default class Generate extends Command {
  static description = 'Generate VMware Content Library';

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

    const content = await readFile(args.releasesPath);
    const releases = JSON.parse(content) as Release[];
    // TODO: Validate releases with schema
    const provider = new ReleasesProvider(releases);

    ux.action.start('Generating files...');

    await buildContentLibrary(flags.name, libPath, provider);

    ux.action.stop();
  }
}
