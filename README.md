# Snap2Upload

Snap2Upload is an independent Chrome extension that captures the visible area of the current browser tab and attaches the screenshot to an already-open ChatGPT conversation.

It is designed for a simple workflow:

**Capture → Attach → Continue working**

The extension does not automatically submit the conversation.

## Features

- Capture the visible area of the active browser tab with a keyboard shortcut.
- Attach the screenshot to an already-open ChatGPT conversation.
- Capture screenshots repeatedly; attachments accumulate in the composer.
- Works without switching the active browser tab to ChatGPT.
- Does not use a developer-controlled backend.
- Uses Chrome Manifest V3.

## Usage

1. Open ChatGPT in a browser tab.
2. Leave ChatGPT open in the background.
3. Browse to the page you want to capture.
4. Press **Alt + Shift + S**.
5. The screenshot is attached to the open ChatGPT composer.
6. Repeat the shortcut to add more screenshots.
7. Review the attachments and send the ChatGPT message yourself when ready.

The shortcut can be changed through Chrome's extension keyboard-shortcut settings.

## Installation from source

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extension directory containing `manifest.json`.

## How it works

Snap2Upload uses three main pieces:

- `background.js` — captures the active tab, finds an open ChatGPT tab, and sends the screenshot to its content script.
- `content.js` — converts the captured image into a `File` and injects it into ChatGPT's image-capable file input.
- `manifest.json` — defines the Manifest V3 extension configuration, permissions, shortcut, and ChatGPT content-script matching.

The extension does not automatically click ChatGPT's Send button.

## Permissions

### `activeTab`

Allows the extension to access the tab the user is actively interacting with after the user invokes the extension shortcut.

### `commands`

Provides the keyboard shortcut used to trigger screenshot capture.

### ChatGPT host permissions

The extension needs access to supported ChatGPT pages so its content script can receive the captured screenshot and attach it to the conversation.

No `tabs` or `scripting` permission is requested.

## Privacy

Snap2Upload does not operate a developer-controlled server or backend.

When the shortcut is activated, the extension captures the visible area of the active browser tab and transfers the image to the already-open ChatGPT webpage so it can be attached to the conversation.

Snap2Upload does not intentionally collect or store screenshots on developer-controlled infrastructure.

Screenshots can contain sensitive information. Users should review the captured image and the destination conversation before sending it.

For details, see [PRIVACY.md](PRIVACY.md).

## Limitations

- Snap2Upload depends on the current attachment interface exposed by ChatGPT. Changes to that third-party webpage may require an extension update.
- The extension requires an open supported ChatGPT tab to attach screenshots.
- Chrome limits how frequently visible-tab screenshots can be captured.
- The extension captures the visible browser area, not an entire scrolling webpage.

## Independent project

Snap2Upload is an independent third-party extension. It is not affiliated with, sponsored by, or endorsed by OpenAI.

“ChatGPT” is referenced only to describe the supported destination service.

## Development

This project intentionally has a small implementation:

```text
manifest.json
background.js
content.js
icons/
```

There is no application backend, database, or AI model service in this project.

## License

See [LICENSE](LICENSE).
