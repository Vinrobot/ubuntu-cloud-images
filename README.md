# Ubuntu Cloud Images

WIP script to create a VMware Content Library from the [Ubuntu Cloud Images](https://cloud-images.ubuntu.com/releases/).

# Usage
<!-- usage -->
```sh-session
$ npm install -g ubuntu-cloud-images
$ scraper COMMAND
running command...
$ scraper (--version)
ubuntu-cloud-images/1.0.0 darwin-x64 node-v19.2.0
$ scraper --help [COMMAND]
USAGE
  $ scraper COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`scraper fetch`](#scraper-fetch)
* [`scraper generate LIBPATH RELEASESPATH`](#scraper-generate-libpath-releasespath)
* [`scraper help [COMMANDS]`](#scraper-help-commands)
* [`scraper plugins`](#scraper-plugins)
* [`scraper plugins:install PLUGIN...`](#scraper-pluginsinstall-plugin)
* [`scraper plugins:inspect PLUGIN...`](#scraper-pluginsinspect-plugin)
* [`scraper plugins:install PLUGIN...`](#scraper-pluginsinstall-plugin-1)
* [`scraper plugins:link PLUGIN`](#scraper-pluginslink-plugin)
* [`scraper plugins:uninstall PLUGIN...`](#scraper-pluginsuninstall-plugin)
* [`scraper plugins:uninstall PLUGIN...`](#scraper-pluginsuninstall-plugin-1)
* [`scraper plugins:uninstall PLUGIN...`](#scraper-pluginsuninstall-plugin-2)
* [`scraper plugins update`](#scraper-plugins-update)

## `scraper fetch`

Fetch available Ubuntu Cloud Images

```
USAGE
  $ scraper fetch [--name <value>] [--version <value>] [--arch <value>] [--release <value>] [--fetch-files]

FLAGS
  --arch=<value>...
  --[no-]fetch-files
  --name=<value>...
  --release=<value>...
  --version=<value>...

DESCRIPTION
  Fetch available Ubuntu Cloud Images
```

_See code: [dist/commands/fetch/index.ts](https://github.com/Vinrobot/ubuntu-cloud-images/blob/v1.0.0/dist/commands/fetch/index.ts)_

## `scraper generate LIBPATH RELEASESPATH`

Generate VMware Content Library

```
USAGE
  $ scraper generate LIBPATH RELEASESPATH [--name <value>]

FLAGS
  --name=<value>  [default: ubuntu-cloud-images]

DESCRIPTION
  Generate VMware Content Library
```

_See code: [dist/commands/generate/index.ts](https://github.com/Vinrobot/ubuntu-cloud-images/blob/v1.0.0/dist/commands/generate/index.ts)_

## `scraper help [COMMANDS]`

Display help for scraper.

```
USAGE
  $ scraper help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for scraper.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `scraper plugins`

List installed plugins.

```
USAGE
  $ scraper plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ scraper plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `scraper plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scraper plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scraper plugins add

EXAMPLES
  $ scraper plugins:install myplugin 

  $ scraper plugins:install https://github.com/someuser/someplugin

  $ scraper plugins:install someuser/someplugin
```

## `scraper plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ scraper plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ scraper plugins:inspect myplugin
```

## `scraper plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scraper plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scraper plugins add

EXAMPLES
  $ scraper plugins:install myplugin 

  $ scraper plugins:install https://github.com/someuser/someplugin

  $ scraper plugins:install someuser/someplugin
```

## `scraper plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ scraper plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ scraper plugins:link myplugin
```

## `scraper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scraper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scraper plugins unlink
  $ scraper plugins remove
```

## `scraper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scraper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scraper plugins unlink
  $ scraper plugins remove
```

## `scraper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scraper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scraper plugins unlink
  $ scraper plugins remove
```

## `scraper plugins update`

Update installed plugins.

```
USAGE
  $ scraper plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
