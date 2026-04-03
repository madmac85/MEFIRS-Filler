console.log("MEFIRS Filler: Script loaded in frame: " + window.location.href);

function callEmergentMaineGeneral() {
    press("menu", ["Start Up"]);
    press("menu", ["Start-Up"]);
    setTimeout(startTab, 10);

    function startTab() {
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
        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);
        press("dropdown", ["Hospital-Emergency Department"]);
        press("button", ["Closest Facility"]);
        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        if (signatureButton) signatureButton.click();
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
        if (signatureButton) signatureButton.click();
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
        press("button", ["Non-Emergent", "No Lights or Sirens", "None", "Distance"]);
        press("menu", ["Signatures"]);
        setTimeout(signatureTab, 10);
    }

    function signatureTab() {
        let signatureButton = document.querySelector('.grid-button');
        if (signatureButton) signatureButton.click();
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
            let sections = document.getElementById("sections");
            if (sections) {
                grabNodes = Array.from(sections.querySelectorAll('.text-padding'));
            }
            break;
        default:
            break;
    }
    if (!grabNodes) return;
    let nodesToClick = arrayToPassIn.map(x => grabNodes.find(node => node.textContent.trim() === x));
    nodesToClick.forEach(node => node && node.click());
}

function buttonWatcher() {
    const functionArray = [callEmergentMaineGeneral, callNonEmergentMaineGeneral, liftAssist];
    const buttonNames = ["Emergent to MaineGeneral", "Non-Emergent to MaineGeneral", "Lift Assist"];

    function addButtons() {
        const saveButton = Array.from(document.querySelectorAll("button, .button-control"))
                                .find(el => el.textContent.includes("Save") && el.offsetParent !== null);
        if (!saveButton) return;

        const buttonParent = saveButton.parentElement;
        if (buttonParent.querySelector(".mefirs-filler-btn")) return;

        console.log("MEFIRS Filler: Found Save button. Injecting custom buttons...");

        for (let i = 0; i < functionArray.length; i++) {
            const fn = functionArray[i];
            const buttonName = buttonNames[i];

            const newButton = document.createElement('button');
            newButton.className = saveButton.className + " mefirs-filler-btn";
            newButton.innerHTML = buttonName;
            newButton.style.marginLeft = "10px";
            newButton.style.backgroundColor = "#d9534f"; 
            newButton.style.color = "white";
            newButton.onclick = fn;
            buttonParent.appendChild(newButton);
        }
    }
    setInterval(addButtons, 2000);
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
