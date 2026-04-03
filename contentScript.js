//Functions for button clicks, stores all the menus and clicks.

function callEmergentMaineGeneralNonEmergent() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Emergency Response (Primary Response Area)", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided"];

        press("dropdown", startTabDropdowns);
        press("button", startTabButtons);

        press("menu", ["Response"]);

        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabButtons = ["Emergent", "Emergent (Immediate Response)", "Yes", "Single"];

        press("button", responseInfoTabButtons);

        press("dropdown secondary", ["Lights and Sirens"])

        press("menu", ["Transport"]);

        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }


    function transportInfoTab() {

        press("dropdown", ["Ground-Ambulance"]);

        press("button", ["Lower Acuity (Green)"])

        press("menu", ["Disposition Destination"]);

        setTimeout(transportDestTab, 10);
    }


    function transportDestTab() {

        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);

        press("dropdown secondary", ["Closest Facility"]);

        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }

}


function callNonEmergentMaineGeneralNonEmergent() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Emergency Response (Primary Response Area)", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided"];

        press("dropdown", startTabDropdowns);
        press("button", startTabButtons);


        press("menu", ["Response"]);

        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabButtons = ["Lower Acuity", "Non-Emergent", "Yes", "Single"];

        press("button", responseInfoTabButtons);


        press("menu", ["Transport"]);

        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }


    function transportInfoTab() {

        press("dropdown", ["Ground-Ambulance"]);

        press("button", ["Lower Acuity (Green)"])

        press("menu", ["Disposition Destination"]);

        setTimeout(transportDestTab, 10);
    }


    function transportDestTab() {

        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);

        press("dropdown secondary", ["Closest Facility"]);


        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }

}


function transferFromMaineGeneralNonEmergentToHospital() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Hospital-to-Hospital Transfer (Interfacility)", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided"];

        press("dropdown", startTabDropdowns);

        press("button", startTabButtons);


        press("menu", ["Response"]);
        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabDropdowns = ["Transfer/Interfacility/Palliative Care", "Hospital", "MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"];

        let responseInfoTabButtons = ["Non-Acute [e.g., Scheduled Transfer or Standby]", "Yes", "Non-Emergent", "Single"];

        press("dropdown", responseInfoTabDropdowns);

        press("button", responseInfoTabButtons);


        press("menu", ["Transport"]);
        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }


    function transportInfoTab() {

        press("dropdown", ["Ground-Ambulance"]);

        press("button", ["Lower Acuity (Green)"])


        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }

}


function transferFromMaineGeneralNonEmergentToFacility() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Hospital to Non-Hospital Facility Transfer", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided"];

        press("dropdown", startTabDropdowns);

        press("button", startTabButtons);


        press("menu", ["Response"]);
        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabDropdowns = ["Transfer/Interfacility/Palliative Care", "Hospital", "MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"];

        let responseInfoTabButtons = ["Non-Acute [e.g., Scheduled Transfer or Standby]", "Yes", "Non-Emergent", "Single"];

        press("dropdown", responseInfoTabDropdowns);

        press("button", responseInfoTabButtons);


        press("menu", ["Transport"]);
        press("menu", ["Transport Info"]);

        setTimeout(transportInfoTab, 10);
    }


    function transportInfoTab() {

        press("dropdown", ["Ground-Ambulance"]);

        press("button", ["Lower Acuity (Green)"])


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

        let startTabDropdowns = ["Public Assistance / Other Not Listed", "Incident Support Services Provided (Including Standby)", "No Transport", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Non-Patient Incident (Not Otherwise Listed)"];

        press("dropdown", startTabDropdowns);

        press("button", startTabButtons);


        press("menu", ["Response"]);
        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabDropdowns = ["Falls"];

        let responseInfoTabButtons = ["Lower Acuity", "Yes", "Non-Emergent", "None"];

        press("dropdown", responseInfoTabDropdowns);

        press("button", responseInfoTabButtons);


        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }
}


function refusalEmergent() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Emergency Response (Primary Response Area)", "Back in Service, Care/Support Services Refused", "Patient Refused Transport", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Refused Care"];

        press("dropdown", startTabDropdowns);
        press("button", startTabButtons);


        press("menu", ["Response"]);

        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabButtons = ["Emergent", "Emergent (Immediate Response)", "Yes", "Single"];

        press("button", responseInfoTabButtons);

        press("dropdown secondary", ["Lights and Sirens"])


        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }

}


function refusalNonEmergent() {

    press("menu", ["Start Up"]);

    press("menu", ["Start-Up"]);

    setTimeout(startTab, 10);

    function startTab() {

        let startTabDropdowns = ["Emergency Response (Primary Response Area)", "Back in Service, Care/Support Services Refused", "Patient Refused Transport", "Ground Transport (ALS Equipped)"];

        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Refused Care"];

        press("dropdown", startTabDropdowns);
        press("button", startTabButtons);


        press("menu", ["Response"]);

        press("menu", ["Response Info"]);

        setTimeout(responseTab, 10);
    }


    function responseTab() {

        let responseInfoTabButtons = ["Lower Acuity", "Non-Emergent", "Yes", "Single"];

        press("button", responseInfoTabButtons);


        press("menu", ["Signatures"]);

        setTimeout(signatureTab, 10);
    }


    function signatureTab() {

        let signatureButton = document.querySelector('.grid-button');
        signatureButton.click();
    }

}



//Revised process for getting the nodes on the webpage and comparing text attributes, will grab all the button locations at once and then click all at once.
function press(typeOfClick, arrayToPassIn) {

    let grabNodes;

    switch (typeOfClick) {

        case "dropdown":
            grabNodes = Array.from(document.querySelectorAll('.koSingleselect-dropDownItem'));
            break;

        case "dropdown secondary":
            grabNodes = Array.from(document.querySelectorAll('.koMultiselect-dropDownItem > *'));
            break;

        case "dropdown medNumbers":
            grabNodes = Array.from(document.querySelectorAll('.koSingleselect-dropDown-wrapper > * > *'));
            break;

        case "button":
            grabNodes = Array.from(document.querySelectorAll(".smart-list-button-label"));
            break;

        case "menu":
            grabNodes = Array.from(document.getElementById("sections").querySelectorAll('.text-padding'));
            break;

        case "numericalButtons":
            grabNodes = Array.from(document.querySelectorAll('.number-pad-list-button-label'));
            break;

        default:
            break;
    }

    let nodesToClick = arrayToPassIn.map(x => grabNodes.find(node => node.textContent === x));

    nodesToClick.forEach(node => node && node.click());
}


//Similar to buttonClicker, however will type inside boxes instead of hitting a button or number.
function typeInBoxes(id, valueToWrite) {

    // Find the input element by its ID
    let inputElement = document.getElementById(id);

    if (inputElement) {
        // Set the desired value
        let newValue = valueToWrite;
        inputElement.value = newValue;

        // Trigger change events if necessary
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));

        console.log("Value set to input element:", newValue);
    } else {
        console.error("Input element not found with the specified ID.");
    }

}



//Actually adds the buttons to the start page
function buttonWatcher() {

    const functionArray = [callEmergentMaineGeneralNonEmergent, callNonEmergentMaineGeneralNonEmergent, transferFromMaineGeneralNonEmergentToHospital, transferFromMaineGeneralNonEmergentToFacility, liftAssist, refusalEmergent, refusalNonEmergent];
    const buttonNames = ["Emergent to MaineGeneral Non-Emergent", "Non-Emergent to MaineGeneral Non-Emergent", "Transfer From MaineGeneral Non-Emergent to Hospital", "Transfer From MaineGeneral Non-Emergent to Facility", "Lift Assist", "Refusal Emergent", "Refusal Non-Emergent"];

    function addButtons() {
        const testGrabButton = document.querySelector(".button-control");
        const buttonParent = testGrabButton.parentElement;

        // Ensure functionArray and buttonNames have the same length
        if (functionArray.length !== buttonNames.length) {
            console.error("functionArray and buttonNames arrays must be of the same length.");
            return;
        }

        for (let i = 0; i < functionArray.length; i++) {
            const fn = functionArray[i];
            const buttonName = buttonNames[i]; // Use the corresponding button name

            const newButton = document.createElement('button');
            newButton.className = testGrabButton.className;
            newButton.innerHTML = buttonName; // Set the button's innerHTML to the human-friendly name
            newButton.style.marginLeft = "15px";
            newButton.style.marginTop = "5px";
            newButton.onclick = fn;
            buttonParent.appendChild(newButton);
        }
    }


    //This is the checker, looks for the field and then DC's.
    function checkInnerHTML() {
        // Note: You may need to change "Preset Value - AMR Chey Emergency Response to CRMC" to the preset value string used in the Maine system to trigger the buttons.
        const foundButton = Array.from(document.querySelectorAll("*")).find(element => element.innerHTML === "Preset Value - AMR Chey Emergency Response to CRMC");

        if (foundButton) {
            addButtons();
            clearInterval(intervalID); //Stops the interval once the buttons are added
        }
    }

    //Set up the interval to check every 1 second
    const intervalID = setInterval(checkInnerHTML, 1000);

    //Initial check
    checkInnerHTML();
}

//Starts the button watcher
buttonWatcher();


// Check for narritive field
fieldWatcher();

function fieldWatcher() {
    // This is the checker, looks for the field and then starts textInput.
    function checkForField() {
        const foundField = document.getElementById("73533");

        if (foundField) {
            console.log("found field");
            shortcutKeys();
            
            clearInterval(intervalID); // Stop the interval once the field is found
        }
    }

    // Set up the interval to check every 1 second
    const intervalID = setInterval(checkForField, 1000);
}


//Stores keyboard shortcuts
function shortcutKeys() {

    let currentStringField = document.getElementById("73533");

    currentStringField.addEventListener("keydown", function (event) {

        //Updates/grabs keypress
        const keyPressed = event.key;

        //Moves text caret to the next DDS mark and hightlights it
        if (event.key === "Tab") {

            event.preventDefault();

            const [ddsStart, ddsEnd] = searchDDS(currentStringField);

            if (ddsStart !== -1 && ddsEnd !== -1) {
                currentStringField.setSelectionRange(ddsStart, ddsEnd);
            }
        }

        //Highlights everything from the current position to the next period, new line, or colon.
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
})}


//Searches strings for DDS mark and retusn the position of the DDS as well as the ending position of that word
function searchDDS(currentStringField) {

    let DDS = currentStringField.value.search("DDS");

    if (DDS !== -1) {

        let posData = findEndOfWord(currentStringField.value, DDS);

        return [DDS, posData];

    } else {

        return [-1, -1];
    }

    function findEndOfWord(text, startIndex) {

        //Initialize variables to store the end position and the characters to check for
        let endPosition = startIndex;
        const validChars = [' ', '.','\n'];

        //Iterate from the startIndex to the end of the string
        while (endPosition < text.length) {
            const currentChar = text[endPosition];

            //Check if the current character is a space or a period
            if (validChars.includes(currentChar)) {
                break; // Stop when a space or period is found
            }

            //Move to the next character
            endPosition++;
        }

        return endPosition;
    }
}


//Moves to the next needed field

function moveToNeededField() {

    //Insert the keypress event listener to the document
    document.addEventListener("keydown", function (keypress) {

        //Grabs the current key
        const keyPressed = keypress.key;

        //Key pressed
        if (keypress.key === "/" && keypress.ctrlKey) {

            //Prevents the default action of the keypress
            keypress.preventDefault();

            //Clicks the validation menu
            const validationMenu = document.getElementsByClassName("validationLT100")[0];
            validationMenu.click();


            //Clicks the first validation button
            let liButton = document.getElementById("validation-menu").getElementsByTagName("li")[0].querySelector(".go-to-button");
            liButton.click();

            console.log("Moved to next field!")

        }
    });
}

moveToNeededField();
