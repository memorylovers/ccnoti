# ccnoti

Cross-Channel Notification CLI with sound, voice, and desktop alerts.

## Features

- 🔊 **Sound Effects**: Audio playback with system sounds
- 🗣️ **Voice Announcements**: Text-to-speech notifications
- 📬 **Visual Notifications**: Native desktop notifications
- ⚙️ **Configurable**: Customizable via `.ccnotirc` configuration file

## Installation

```bash
npm install -g ccnoti
# or
npx ccnoti [options]
```

## Quick Start

### Basic Usage

```bash
npx ccnoti -d -m "Task complete"     # Desktop notification (with sound)
npx ccnoti -d -v  -m "All tests pass" # Sound + Desktop notification
npx ccnoti -v -m "Deploy complete"   # Voice only
npx ccnoti -s                        # Sound only
```

## Command Line Options

| Option | Alias | Description | Example |
|--------|-------|-------------|---------|
| `--sound` | `-s` | Play sound effect | `--sound` |
| `--voice` | `-v` | Enable text-to-speech | `--voice` |
| `--desktop` | `-d` | Show Desktop notification | `--desktop` |
| `--soundFile <path>` | - | Sound file path to play | `--soundFile=/System/Library/Sounds/Glass.aiff` |
| `--message <text>` | `-m` | Notification message text | `--message "Task done"` |
| `--config <path>` | `-c` | Path to config file | `--config my-config.json` |

## Configuration File

Create a `.ccnotirc` file in your project root (automatically loaded):

```json
{
  "sound": true,
  "voice": true,
  "desktop": false,
  "soundFile": "/System/Library/Sounds/Glass.aiff"
}
```

Or specify a custom config file with `-c`:

```bash
npx ccnoti -c my-config.json -m "Custom config"
```

**Note**: Command line options always override configuration file settings.

## Platform Support

- **macOS/Windows**: Full support (sound, voice, desktop notifications)
- **Linux**: Desktop notifications only

## Text-to-Speech

- **macOS**: System voices (e.g., Samantha, Daniel, Kyoko). List all: `say -v ?`
- **Windows**: SAPI voices (varies by system)
- **Linux**: Requires Festival (`apt-get install festival`)

## Requirements

- Node.js >= 22
- Supported platforms:
  - macOS: sound, voice, notifications
  - Windows: sound, voice, notifications
  - Linux: notifications only

## Dependencies

- [citty](https://github.com/unjs/citty): CLI framework
- [c12](https://github.com/unjs/c12): Configuration loader
- [consola](https://github.com/unjs/consola): Logging
- [defu](https://github.com/unjs/defu): Object merging
- [node-notifier](https://github.com/mikaelbr/node-notifier): Desktop notifications
- [say](https://github.com/Marak/say.js): Text-to-speech
- [sound-play](https://github.com/nomadhoc/sound-play): Sound playback
- [pathe](https://github.com/unjs/pathe): Path utilities
- [unbuild](https://github.com/unjs/unbuild): Build tool

## License

MIT

## Contributing

Issues and PRs welcome at [github.com/memorylovers/ccnoti](https://github.com/memorylovers/ccnoti)
