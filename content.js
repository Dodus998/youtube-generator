// YouTube Channel Audio Replacer Content Script

let targetChannels = []; // Will be loaded from storage
let generatorAudio = null;
let isPlaying = false;
let observer = null;

// Load target channels from storage
chrome.storage.sync.get(["targetChannels"], (result) => {
  targetChannels = result.targetChannels || [];
  console.log("Loaded target channels:", targetChannels);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.targetChannels) {
    targetChannels = changes.targetChannels.newValue || [];
    console.log("Updated target channels:", targetChannels);
    checkAndReplaceAudio();
  }
});

// Initialize generator audio
function initGeneratorAudio() {
  if (!generatorAudio) {
    generatorAudio = new Audio(chrome.runtime.getURL("generator-sound.mp3"));
    generatorAudio.loop = true;
    generatorAudio.volume = 0.7;
  }
}

// Get current channel name from YouTube page
function getCurrentChannelName() {
  // Try multiple selectors for different YouTube layouts
  const channelSelectors = [
    "ytd-channel-name a",
    "yt-formatted-string.ytd-channel-name a",
    "#channel-name a",
    "#owner-name a",
    "ytd-video-owner-renderer a",
  ];

  for (const selector of channelSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const channelName = element.textContent.trim();
      if (channelName) {
        return channelName;
      }
    }
  }
  return null;
}

// Get current channel ID from URL
function getCurrentChannelId() {
  const channelLinkElement = document.querySelector("ytd-channel-name a");
  if (channelLinkElement) {
    const href = channelLinkElement.getAttribute("href");
    if (href) {
      // Extract channel ID from URL like /@channelname or /channel/UCxxxxxx
      const match = href.match(/\/([@\w-]+)$/);
      if (match) {
        return match[1];
      }
    }
  }
  return null;
}

// Check if current video is from target channel
function isTargetChannel() {
  if (targetChannels.length === 0) {
    return false;
  }

  const channelName = getCurrentChannelName();
  const channelId = getCurrentChannelId();

  console.log("Current channel:", channelName, channelId);

  return targetChannels.some((target) => {
    const targetLower = target.toLowerCase();
    return (
      (channelName && channelName.toLowerCase().includes(targetLower)) ||
      (channelId && channelId.toLowerCase().includes(targetLower))
    );
  });
}

// Mute/unmute YouTube video
function muteYouTubeVideo(mute) {
  const video = document.querySelector("video");
  if (video) {
    video.muted = mute;
    console.log("YouTube video", mute ? "muted" : "unmuted");
  }
}

// Play or stop generator sound
function toggleGeneratorSound(play) {
  initGeneratorAudio();

  if (play && !isPlaying) {
    generatorAudio
      .play()
      .then(() => {
        isPlaying = true;
        console.log("Generator sound started");
      })
      .catch((err) => {
        console.error("Failed to play generator sound:", err);
      });
  } else if (!play && isPlaying) {
    generatorAudio.pause();
    generatorAudio.currentTime = 0;
    isPlaying = false;
    console.log("Generator sound stopped");
  }
}

// Main function to check and replace audio
function checkAndReplaceAudio() {
  const video = document.querySelector("video");

  if (!video) {
    return;
  }

  const shouldReplace = isTargetChannel();
  console.log("Should replace audio:", shouldReplace);

  if (shouldReplace) {
    muteYouTubeVideo(true);
    toggleGeneratorSound(true);
  } else {
    muteYouTubeVideo(false);
    toggleGeneratorSound(false);
  }
}

// Monitor video playback state
function monitorVideoPlayback() {
  const video = document.querySelector("video");

  if (video) {
    video.addEventListener("play", () => {
      console.log("Video play event");
      checkAndReplaceAudio();
    });

    video.addEventListener("pause", () => {
      console.log("Video pause event");
      if (isPlaying) {
        toggleGeneratorSound(false);
      }
    });

    video.addEventListener("ended", () => {
      console.log("Video ended event");
      if (isPlaying) {
        toggleGeneratorSound(false);
      }
    });
  }
}

// Set up observer for page changes (YouTube is a SPA)
function observePageChanges() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    // Check if we're on a video page
    if (window.location.pathname === "/watch") {
      setTimeout(() => {
        checkAndReplaceAudio();
        monitorVideoPlayback();
      }, 1000);
    } else {
      // Stop generator sound if we leave video page
      if (isPlaying) {
        toggleGeneratorSound(false);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when page loads
function init() {
  console.log("YouTube Channel Audio Replacer initialized");

  // Initial check
  if (window.location.pathname === "/watch") {
    setTimeout(() => {
      checkAndReplaceAudio();
      monitorVideoPlayback();
    }, 2000);
  }

  // Set up observer for navigation changes
  observePageChanges();

  // Listen for YouTube's navigation events
  window.addEventListener("yt-navigate-finish", () => {
    console.log("YouTube navigation detected");
    setTimeout(() => {
      checkAndReplaceAudio();
      monitorVideoPlayback();
    }, 1000);
  });
}

// Start the extension
init();
