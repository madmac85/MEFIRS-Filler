// Functions for button clicks, updated for MEFIRS with "Distance" response delay

function callEmergentMaineGeneral() {

    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {
        // Based on image_8c3d09.png
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
        // Updated to include "Distance" based on image_8c93db.png
        let responseInfoTabButtons = [
            "Emergent (Immediate Response)", 
            "Lights and Sirens", 
            "Single", 
            "Distance"
        ];
        
        press("button", responseInfoTabButtons);

        press("menu", ["Transport"]);
        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }

    function transportInfoTab() {
        // Based on image_8c8f63.png
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
        // Based on image_8c8fa3.png
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
        // Updated to include "Distance" based on image_8c93db.png
        let responseInfoTabButtons = [
            "Non-Emergent", 
            "No Lights or Sirens", 
            "Single", 
            "Distance"
        ];

        press("button", responseInfoTabButtons);

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

function liftAssist() {
    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {
        press("dropdown", ["Public Assistance / Other Not Listed"]);
        press("button", ["Non-Patient Incident (Not Otherwise Listed)"]);

        press("menu", ["Response"]);
        press("menu", ["Response Info"]);
        setTimeout(responseTab, 10);
    }

    function responseTab() {
        // Included "Distance" here as well if applicable for public assistance records
        press("button", ["Non-Emergent", "No Lights or Sirens", "None", "Distance"]);

        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }
}

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
        const foundButton = Array.from(document.querySelectorAll("*")).find(element => element.innerHTML === "Preset Value - No Delays");

        if (foundButton) {
            addButtons();
            clearInterval(intervalID);
        }
    }

    const intervalID = setInterval(checkInnerHTML, 1000);
}

buttonWatcher();

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
