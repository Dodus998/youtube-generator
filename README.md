# YouTube Channel Audio Replacer

A Chrome extension that replaces audio from specific YouTube channels with a custom generator sound.

## Features

- 🎵 Replaces YouTube video audio with generator sound for specific channels
- 🎯 Target multiple channels simultaneously
- ⚙️ Easy-to-use popup interface for managing target channels
- 🔄 Automatically detects channel changes while browsing YouTube
- 🔇 Mutes original video audio when playing generator sound

## Installation

1. **Add your generator sound file:**

   - Place your generator sound file in the extension directory
   - Rename it to `generator-sound.mp3` (or update the filename in `manifest.json` and `content.js`)

2. **Create placeholder icons (optional):**

   - Create or add icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - Or remove the icon references from `manifest.json` temporarily

3. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right corner)
   - Click "Load unpacked"
   - Select the `youtube-generator` folder

## Usage

1. Click on the extension icon in Chrome toolbar
2. Enter the channel name or handle you want to target
   - Examples: "LinusTechTips", "@LinusTechTips", "MrBeast"
3. Click "Add Channel"
4. Navigate to YouTube and play a video from that channel
5. The extension will automatically:
   - Mute the video
   - Play the generator sound instead

## How It Works

- The extension monitors YouTube pages for video playback
- When a video from a target channel is detected, it:
  - Mutes the video element
  - Plays the generator sound in a loop
- When you navigate away or switch to a different channel, the generator sound stops

## Configuration

### Changing the Generator Sound

Replace `generator-sound.mp3` with your own audio file. Supported formats:

- MP3
- WAV
- OGG

### Adjusting Volume

Edit `content.js` and modify the volume value (line ~29):

```javascript
generatorAudio.volume = 0.7; // Change to value between 0.0 and 1.0
```

## File Structure

```
youtube-generator/
├── manifest.json          # Extension configuration
├── content.js            # Main logic for detecting and replacing audio
├── popup.html            # Popup interface HTML
├── popup.js              # Popup interface logic
├── generator-sound.mp3   # Your generator sound (add this file)
├── icon16.png           # Extension icon 16x16 (optional)
├── icon48.png           # Extension icon 48x48 (optional)
├── icon128.png          # Extension icon 128x128 (optional)
└── README.md            # This file
```

## Troubleshooting

### Extension not working:

- Make sure you've added at least one channel in the popup
- Check the browser console for errors (F12 → Console)
- Verify the channel name matches exactly

### Generator sound not playing:

- Ensure `generator-sound.mp3` is in the extension directory
- Check that the audio file is not corrupted
- Try a different audio format

### Icons not showing:

- Create simple PNG files for the icons
- Or remove icon references from `manifest.json`

## Notes

- The extension only works on YouTube.com
- It uses YouTube's channel name/handle for matching
- Multiple channels can be targeted simultaneously
- The generator sound loops continuously while video is playing

## License

Free to use and modify for personal use.
