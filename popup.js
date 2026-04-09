//Button listen for reveal, popup and passthrough

document.getElementById("911Template").addEventListener("click", () => revealTemplates("911"));
document.getElementById("transferTemplate").addEventListener("click", () => revealTemplates("transfer"));
document.getElementById("refusalTemplate").addEventListener("click", () => revealTemplates("refusal"));
document.getElementById("liftTemplate").addEventListener("click", () => revealTemplates("lift"));
document.getElementById("prepareButton").addEventListener("click", movetoPopUP);

// ─── Settings ────────────────────────────────────────────────────────────────

const DEFAULTS = {
    dispatchLocation: 'Augusta Fire Department',
    destinationFull: 'MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH',
    destinationShort: 'MaineGeneral'
};

// Load saved settings into inputs on popup open
chrome.storage.sync.get(DEFAULTS, (saved) => {
    document.getElementById('dispatchLocation').value = saved.dispatchLocation;
    document.getElementById('destinationFull').value = saved.destinationFull;
    document.getElementById('destinationShort').value = saved.destinationShort;
});

document.getElementById('saveSettings').addEventListener('click', () => {
    const settings = {
        dispatchLocation: document.getElementById('dispatchLocation').value.trim() || DEFAULTS.dispatchLocation,
        destinationFull:  document.getElementById('destinationFull').value.trim() || DEFAULTS.destinationFull,
        destinationShort: document.getElementById('destinationShort').value.trim() || DEFAULTS.destinationShort
    };
    chrome.storage.sync.set(settings, () => {
        const status = document.getElementById('settingsStatus');
        status.textContent = 'Settings saved! Reload MEFIRS to apply.';
        setTimeout(() => { status.textContent = ''; }, 3000);
    });
});


//For moving the popup to the side of the screen. Sorta depreciated but keeping it for future use.
function movetoPopUP() {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.windows.create({
            url: "popup.html",
            type: "popup",
            height: 500,
            width: 400,
            left: currentWindow.left + currentWindow.width,
            top: currentWindow.top
        });
        window.close();
    });
}



//For revealing templates, if you add more please place functions here to reveal.

function revealTemplates(typeOfTemplate) {

    let element;

    switch (typeOfTemplate) {

        case "911":
            element = document.getElementById("911Narritive");
            break;

        case "transfer":
            element = document.getElementById("transferNarritive");
            break;

        case "refusal":
            element = document.getElementById("refusalNarrative");
            break;

        case "lift":
            element = document.getElementById("liftNarrative");
            break;

        default:
            break;

    }
    
    element.style.display = "block";
}