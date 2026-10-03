console.log("Snap2Upload content script loaded.");

chrome.runtime.sendMessage({
    type: "CHATGPT_CONTENT_READY"
});

function findImageFileInput() {
    // Known ChatGPT selectors
    const knownSelectors = [
        "#upload-files",
        "#upload-photos",
        "#upload-media",
        "#upload-camera"
    ];

    for (const selector of knownSelectors) {
        const input = document.querySelector(selector);

        if (
            input &&
            input instanceof HTMLInputElement &&
            input.type === "file"
        ) {
            return input;
        }
    }

    // Fallback: find an image-capable file input
    const fileInputs = document.querySelectorAll(
        'input[type="file"]'
    );

    for (const input of fileInputs) {
        const accept = input.getAttribute("accept") || "";

        if (
            accept.includes("image") ||
            accept.includes("image/*")
        ) {
            return input;
        }
    }

    // Last fallback: any file input
    return fileInputs[0] || null;
}

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type !== "ATTACH_SCREENSHOT") {
        return;
    }

    console.log("Received screenshot from extension.");

    try {
        const response = await fetch(message.image);
        const blob = await response.blob();

        const file = new File(
            [blob],
            `screenshot-${Date.now()}.png`,
            {
                type: "image/png"
            }
        );

        console.log(
            "Created file:",
            file.name,
            file.size,
            file.type
        );

        const fileInput = findImageFileInput();

        if (!fileInput) {
            console.error(
                "ChatGPT image file input not found."
            );
            return;
        }

        console.log(
            "Using file input:",
            fileInput.id || "(no id)"
        );

        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(file);

        fileInput.files = dataTransfer.files;

        fileInput.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        fileInput.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );

        console.log(
            "Screenshot injected into ChatGPT file input."
        );

    } catch (error) {
        console.error(
            "Failed to inject screenshot:",
            error
        );
    }
});
