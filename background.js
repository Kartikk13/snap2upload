async function findChatGPTTab() {
    const tabs = await chrome.tabs.query({
        url: [
            "https://chatgpt.com/*",
            "https://chat.openai.com/*"
        ]
    });

    return tabs.find(tab => !tab.discarded);
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "CHATGPT_CONTENT_READY") {
        console.log(
            "ChatGPT content script ready. Tab:",
            sender.tab?.id
        );
    }
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "capture-screenshot") {
        return;
    }

    try {
        // 1. Find the currently active tab
        const [activeTab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!activeTab?.id || !activeTab.windowId) {
            console.error(
                "Screenshot failed: active tab not found."
            );
            return;
        }

        console.log(
            "Current tab:",
            activeTab.id,
            activeTab.url
        );

        // 2. Capture visible area
        const screenshot = await chrome.tabs.captureVisibleTab(
            activeTab.windowId,
            {
                format: "png"
            }
        );

        if (!screenshot) {
            console.error(
                "Screenshot failed: no image was returned."
            );
            return;
        }

        console.log(
            "Screenshot captured successfully."
        );

        // 3. Find an open ChatGPT tab
        const chatGPTTab = await findChatGPTTab();

        if (!chatGPTTab?.id) {
            console.error(
                "Screenshot captured, but no ChatGPT tab was found. " +
                "Open ChatGPT and try again."
            );
            return;
        }

        console.log(
            "ChatGPT tab found:",
            chatGPTTab.id
        );

        // 4. Send screenshot to ChatGPT content script
        await chrome.tabs.sendMessage(
            chatGPTTab.id,
            {
                type: "ATTACH_SCREENSHOT",
                image: screenshot
            }
        );

        console.log(
            "Screenshot sent to ChatGPT content script."
        );

    } catch (error) {
        console.error(
            "Screenshot workflow failed:",
            error
        );
    }
});
