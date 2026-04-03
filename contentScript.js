// Functions for button clicks, updated with MEFIRS button labels and UI flow

function callEmergentMaineGeneral() {

    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {
        // Updated based on image_8c3d09.png
        let startTabDropdowns = ["Emergency Response (Primary Response Area)"];
        let startTabButtons = [
            "Patient Contact Made", 
            "Patient Evaluated and Care Provided", 
            "Initiated and Continued Primary Care", 
            "Transport by This EMS Unit (This Crew Only)"
        ];

        press("dropdown", startTabDropdowns);
        press("button", startTabButtons);

        press("menu", ["Response"]);
        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }

    function responseTab() {
        // Updated based on image_8c3d47.png and image_8c3d88.png
        let responseInfoTabButtons = ["Emergent (Immediate Response)", "Lights and Sirens", "Single"];
        
        press("button", responseInfoTabButtons);

        press("menu", ["Transport"]);
        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }

    function transportInfoTab() {
        // Updated based on image_8c8f63.png
        let transportButtons = [
            "Non-Emergent", 
            "No Lights or Sirens", 
            "Ground-Ambulance", 
            "Wheeled Stretcher", 
            "Semi-Fowlers"
        ];

        press("button", transportButtons);

        press("menu", ["Disposition Destination"]);
        setTimeout(transportDestTab, 10);
    }

    function transportDestTab() {
        // Updated based on image_8c8fa3.png
        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);
        press("dropdown", ["Hospital-Emergency Department"]);
        press("button", ["Closest Facility"]);

        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }
}

// Logic for Non-Emergent call to MaineGeneral
function callNonEmergentMaineGeneral() {
    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"]);

        press("menu", ["Response"]);
        press("menu", ["Response Info"]);
        setTimeout(responseTab, 10);
    }

    function responseTab() {
        press("button", ["Non-Emergent", "No Lights or Sirens", "Single"]);

        press("menu", ["Transport"]);
        press("menu", ["Transport Info"]);
        setTimeout(transportInfoTab, 10);
    }

    function transportInfoTab() {
        press("button", ["Non-Emergent", "No Lights or Sirens", "Ground-Ambulance", "Wheeled Stretcher", "Semi-Fowlers"]);

        press("menu", ["Disposition Destination"]);
        setTimeout(transportDestTab, 10);
    }

    function transportDestTab() {
        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);
        press("dropdown", ["Hospital-Emergency Department"]);
        press("button", ["Closest Facility"]);

        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }
}

// Function for Lift Assists based on Public Assistance service type
function liftAssist() {
    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {
        // Selecting Public Assistance
        press("dropdown", ["Public Assistance / Other Not Listed"]);
        press("button", ["Non-Patient Incident (Not Otherwise Listed)"]);

        press("menu", ["Response"]);
        press("menu", ["Response Info"]);
        setTimeout(responseTab, 10);
    }

    function responseTab() {
        // image_8c3d68.png shows a delay screen, often bypassed for lift assists
        press("button", ["Non-Emergent", "No Lights or Sirens", "None"]);

        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }
}

// Press function handles the specific ImageTrend UI element classes
function press(typeOfClick, arrayToPassIn) {
    let grabNodes;

    switch (typeOfClick) {
        case "dropdown":
            grabNodes = Array.from(document.querySelectorAll('.koSingleselect-dropDownItem'));
            break;
        case "dropdown secondary":
            grabNodes = Array.from(document.querySelectorAll('.koMultiselect-dropDownItem > *'));
            break;
        case "button":
            grabNodes = Array.from(document.querySelectorAll(".smart-list-button-label"));
            break;
        case "menu":
            grabNodes = Array.from(document.getElementById("sections").querySelectorAll('.text-padding'));
            break;
        default:
            break;
    }

    let nodesToClick = arrayToPassIn.map(x => grabNodes.find(node => node.textContent.trim() === x));
    nodesToClick.forEach(node => node && node.click());
}

// Logic to inject the custom buttons onto the MEFIRS page
function buttonWatcher() {
    const functionArray = [callEmergentMaineGeneral, callNonEmergentMaineGeneral, liftAssist];
    const buttonNames = ["Emergent to MaineGeneral", "Non-Emergent to MaineGeneral", "Lift Assist"];

    function addButtons() {
        const testGrabButton = document.querySelector(".button-control");
        const buttonParent = testGrabButton.parentElement;

        for (let i = 0; i < functionArray.length; i++) {
            const fn = functionArray[i];
            const buttonName = buttonNames[i];

            const newButton = document.createElement('button');
            newButton.className = testGrabButton.className;
            newButton.innerHTML = buttonName;
            newButton.style.marginLeft = "15px";
            newButton.style.marginTop = "5px";
            newButton.onclick = fn;
            buttonParent.appendChild(newButton);
        }
    }

    function checkInnerHTML() {
        // Triggered by the "Preset Value - No Delays" button seen in image_8c3d68.png
        const foundButton = Array.from(document.querySelectorAll("*")).find(element => element.innerHTML === "Preset Value - No Delays");

        if (foundButton) {
            addButtons();
            clearInterval(intervalID);
        }
    }

    const intervalID = setInterval(checkInnerHTML, 1000);
}

buttonWatcher();

// Logic for the Narrative Text Area (ID 73533)
fieldWatcher();

function fieldWatcher() {
    function checkForField() {
        const foundField = document.getElementById("73533");
        if (foundField) {
            shortcutKeys();
            clearInterval(intervalID);
        }
    }
    const intervalID = setInterval(checkForField, 1000);
}

function shortcutKeys() {
    let currentStringField = document.getElementById("73533");

    currentStringField.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();
            const [ddsStart, ddsEnd] = searchDDS(currentStringField);
            if (ddsStart !== -1 && ddsEnd !== -1) {
                currentStringField.setSelectionRange(ddsStart, ddsEnd);
            }
        }

        if (event.ctrlKey && event.key === "p") {
            event.preventDefault();
            let text = currentStringField.value;
            let startIndex = currentStringField.selectionStart;
            let periodPosition = text.slice(startIndex).search(/[.\n:]/);
            if (periodPosition !== -1) {
                let endPosition = startIndex + periodPosition + 1;
                currentStringField.setSelectionRange(startIndex, endPosition);
            }
        }
    });
}

function searchDDS(currentStringField) {
    let DDS = currentStringField.value.search("DDS");
    if (DDS !== -1) {
        let posData = findEndOfWord(currentStringField.value, DDS);
        return [DDS, posData];
    } else {
        return [-1, -1];
    }

    function findEndOfWord(text, startIndex) {
        let endPosition = startIndex;
        const validChars = [' ', '.', '\n'];
        while (endPosition < text.length) {
            const currentChar = text[endPosition];
            if (validChars.includes(currentChar)) break;
            endPosition++;
        }
        return endPosition;
    }
}
