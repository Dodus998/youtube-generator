// Popup script for managing target channels

const channelInput = document.getElementById("channelInput");
const addChannelBtn = document.getElementById("addChannel");
const channelList = document.getElementById("channelList");
const statusDiv = document.getElementById("status");

// Load and display channels
function loadChannels() {
  chrome.storage.sync.get(["targetChannels"], (result) => {
    const channels = result.targetChannels || [];
    displayChannels(channels);
  });
}

// Display channels in the list
function displayChannels(channels) {
  if (channels.length === 0) {
    channelList.innerHTML =
      '<div class="empty-state">No channels added yet</div>';
    return;
  }

  channelList.innerHTML = "";
  channels.forEach((channel, index) => {
    const item = document.createElement("div");
    item.className = "channel-item";

    const name = document.createElement("div");
    name.className = "channel-name";
    name.textContent = channel;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeChannel(index);

    item.appendChild(name);
    item.appendChild(removeBtn);
    channelList.appendChild(item);
  });
}

// Add a new channel
function addChannel() {
  const channelName = channelInput.value.trim();

  if (!channelName) {
    showStatus("Please enter a channel name", "error");
    return;
  }

  chrome.storage.sync.get(["targetChannels"], (result) => {
    const channels = result.targetChannels || [];

    if (channels.includes(channelName)) {
      showStatus("Channel already added", "error");
      return;
    }

    channels.push(channelName);
    chrome.storage.sync.set({ targetChannels: channels }, () => {
      channelInput.value = "";
      loadChannels();
      showStatus("Channel added successfully!", "success");
    });
  });
}

// Remove a channel
function removeChannel(index) {
  chrome.storage.sync.get(["targetChannels"], (result) => {
    const channels = result.targetChannels || [];
    channels.splice(index, 1);

    chrome.storage.sync.set({ targetChannels: channels }, () => {
      loadChannels();
      showStatus("Channel removed", "success");
    });
  });
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = "status show";

  if (type === "error") {
    statusDiv.style.backgroundColor = "#ffebee";
    statusDiv.style.color = "#c62828";
  } else {
    statusDiv.style.backgroundColor = "#e8f5e9";
    statusDiv.style.color = "#2e7d32";
  }

  setTimeout(() => {
    statusDiv.classList.remove("show");
  }, 3000);
}

// Event listeners
addChannelBtn.addEventListener("click", addChannel);

channelInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addChannel();
  }
});

// Load channels on popup open
loadChannels();
