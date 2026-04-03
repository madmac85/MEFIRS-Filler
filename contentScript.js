console.log("MEFIRS Filler: Script loaded in frame: " + window.location.href);

function clearAutomatedFields() {
    // Clears numeric/text inputs we automate
    setInput("Number of Patients Transported", "");

    // Finds and clicks 'X' or 'Minus' icons to clear dropdowns and multi-selects
    // ImageTrend uses .fa-times and .fa-minus-circle for clearing values
    const clearIcons = Array.from(document.querySelectorAll('.fa-times, .fa-minus-circle, .fa-close, .koSingleselect-selectedItem-clear, .koMultiselect-selectedItem-clear'));
    clearIcons.forEach(icon => {
        // Attempt to click the icon or its parent button
        const clickable = icon.closest('button, .mod-value-action, div[click]') || icon;
        clickable.click();
    });

    // Specifically targets and removes added crew cards in the Exposures & PPE section
    const crewClearButtons = Array.from(document.querySelectorAll('.fa-times, .fa-close'))
                                  .filter(el => el.closest('.single-row-control, .ko-grid-column'));
    crewClearButtons.forEach(btn => btn.click());
}

function callEmergentMaineGeneral() {
    clearAutomatedFields();
    
    // Buffer delay to let the form clear before starting new automation
    setTimeout(() => {
        press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
        setTimeout(startTab, 800);
    }, 500);

    function startTab() {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        let startTabButtons = [
            "Patient Contact Made", 
            "Patient Evaluated and Care Provided", 
            "Initiated and Continued Primary Care", 
            "Transport by This EMS Unit (This Crew Only)"
        ];
        press("button", startTabButtons);
        
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => {
            automatePPE(responseTab);
        }, 1000);
    }

    function responseTab() {
        press("menu", ["Response", "Response Info"]);
        
        setTimeout(() => {
            let responseInfoTabButtons = [
                "Emergent (Immediate Response)", 
                "Lights and Sirens", 
                "Single", 
                "Not Recorded",
                "Distance",
                "None/No Delay"
            ];
            press("button", responseInfoTabButtons);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);

            press("menu", ["Transport", "Transport Info"]);
            setTimeout(transportInfoTab, 800);
        }, 1000);
    }

    function transportInfoTab() {
        setInput("Number of Patients Transported", "1");

        let transportButtons = [
            "Non-Emergent", 
            "No Lights or Sirens", 
            "Ground-Ambulance", 
            "Wheeled Stretcher", 
            "None/No Delay"
        ];
        press("button", transportButtons);
        press("dropdown secondary", ["Semi-Fowlers"]);

        press("menu", ["Disposition Destination"]);
        setTimeout(transportDestTab, 800);
    }

    function transportDestTab() {
        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);
        
        setTimeout(() => {
            press("dropdown", ["Hospital-Emergency Department"]);
            press("button", ["Closest Facility", "Wheeled Stretcher"]);

            press("button", ["Add"]); 
            setTimeout(() => {
                press("dropdown", ["Emergency Department"]);
                
                setTimeout(() => {
                    press("menu", ["Billing Information"]);
                    setTimeout(() => {
                        press("dropdown", ["No Insurance Identified"]);
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function callNonEmergentMaineGeneral() {
    clearAutomatedFields();

    setTimeout(() => {
        press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
        setTimeout(startTab, 800);
    }, 500);

    function startTab() {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"]);
        
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => {
            automatePPE(responseTab);
        }, 1000);
    }

    function responseTab() {
        press("menu", ["Response", "Response Info"]);

        setTimeout(() => {
            let responseInfoTabButtons = [
                "Emergent (Immediate Response)", 
                "No Lights or Sirens", 
                "Single", 
                "Not Recorded",
                "Distance",
                "None/No Delay"
            ];
            press("button", responseInfoTabButtons);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);

            press("menu", ["Transport", "Transport Info"]);
            setTimeout(transportInfoTab, 800);
        }, 1000);
    }

    function transportInfoTab() {
        setInput("Number of Patients Transported", "1");

        let transportButtons = [
            "Non-Emergent", 
            "No Lights or Sirens", 
            "Ground-Ambulance", 
            "Wheeled Stretcher", 
            "None/No Delay"
        ];
        press("button", transportButtons);
        press("dropdown secondary", ["Semi-Fowlers"]);

        press("menu", ["Disposition Destination"]);
        setTimeout(transportDestTab, 800);
    }

    function transportDestTab() {
        press("dropdown", ["MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH"]);
        
        setTimeout(() => {
            press("dropdown", ["Hospital-Emergency Department"]);
            press("button", ["Closest Facility", "Wheeled Stretcher"]);

            press("button", ["Add"]);
            setTimeout(() => {
                press("dropdown", ["Emergency Department"]);

                setTimeout(() => {
                    press("menu", ["Billing Information"]);
                    setTimeout(() => {
                        press("dropdown", ["No Insurance Identified"]);
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function liftAssist() {
    clearAutomatedFields();

    setTimeout(() => {
        press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
        setTimeout(startTab, 800);
    }, 500);

    function startTab() {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Non-Patient Incident (Not Otherwise Listed)"]);
        
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => {
            automatePPE(responseTab);
        }, 1000);
    }

    function responseTab() {
        press("menu", ["Response", "Response Info"]);

        setTimeout(() => {
            press("button", ["Emergent (Immediate Response)", "No Lights or Sirens", "Single", "Not Recorded", "Distance", "None/No Delay"]);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);

            setTimeout(() => {
                press("menu", ["Billing Information"]);
                setTimeout(() => {
                    press("dropdown", ["No Insurance Identified"]);
                }, 800);
            }, 800);
        }, 1000);
    }
}

function setInput(labelName, value) {
    const inputs = Array.from(document.querySelectorAll('input'));
    const targetInput = inputs.find(input => {
        const parent = input.closest('.ko-grid-column, .single-row-control');
        return parent && parent.innerText.includes(labelName);
    });

    if (targetInput) {
        targetInput.value = value;
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        targetInput.dispatchEvent(new Event('change', { bubbles: true }));
        targetInput.dispatchEvent(new Event('blur', { bubbles: true }));
    }
}

function automatePPE(nextStepCallback) {
    press("button", ["Add All Crew"]);
    
    setTimeout(() => {
        let cards = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))
                         .filter(el => el.innerText.includes("EMS Professional (Crew Member) ID:"));

        if (cards.length === 0) {
            nextStepCallback();
            return;
        }

        let i = 0;
        const processNextCard = () => {
            if (i >= cards.length) {
                nextStepCallback();
                return;
            }

            let currentCard = cards[i];
            let dropdownTrigger = currentCard.querySelector('.ko-dropdown-placeholder, .ko-dropdown-value, .koMultiselect-down-button, .koMultiselect-searchbar');

            if (dropdownTrigger) {
                dropdownTrigger.click();
                
                setTimeout(() => {
                    press("dropdown", ["Gloves"]);
                    
                    setTimeout(() => {
                        let okButton = Array.from(currentCard.querySelectorAll('button'))
                                            .find(btn => btn.innerText.includes("OK"));
                        if (okButton) okButton.click();
                        
                        i++;
                        setTimeout(processNextCard, 600); 
                    }, 600);
                }, 600);
            } else {
                i++;
                processNextCard();
            }
        };

        processNextCard();
    }, 1500);
}

function press(typeOfClick, arrayToPassIn) {
    let grabNodes;
    
    if (typeOfClick === "dropdown" || typeOfClick === "dropdown secondary") {
        let triggers = document.querySelectorAll('.ko-dropdown-placeholder, .ko-dropdown-value, .koMultiselect-searchbar-input, .koMultiselect-searchbar');
        triggers.forEach(t => t.click());
    }

    switch (typeOfClick) {
        case "dropdown":
            grabNodes = Array.from(document.querySelectorAll('.koSingleselect-dropDownItem, .ko-dropdown-value, .koSingleselect-dropDownItem span'));
            break;
        case "dropdown secondary":
            grabNodes = Array.from(document.querySelectorAll('.koMultiselect-dropDownItem, .koMultiselect-dropDownItem span'));
            break;
        case "button":
            grabNodes = Array.from(document.querySelectorAll(".smart-list-button-label, .smart-list-button, button"));
            break;
        case "menu":
            let sections = document.getElementById("sections");
            if (sections) {
                grabNodes = Array.from(sections.querySelectorAll('.text-padding, .form-navigation-section-caption-text'));
            }
            break;
        default:
            break;
    }
    
    if (!grabNodes) return;
    
    arrayToPassIn.forEach(val => {
        let matchingNodes = grabNodes.filter(node => node.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() === val);
        matchingNodes.forEach(node => node.click());
    });
}

function buttonWatcher() {
    const functionArray = [callEmergentMaineGeneral, callNonEmergentMaineGeneral, liftAssist];
    const buttonNames = ["Emergent to MaineGeneral", "Non-Emergent to MaineGeneral", "Lift Assist"];

    function addButtons() {
        const saveButton = Array.from(document.querySelectorAll("button, .button-control"))
                                .find(el => el.textContent.includes("Save") && el.offsetParent !== null);
        if (!saveButton) return;

        const buttonParent = saveButton.parentElement;
        if (buttonParent.querySelector(".mefirs-filler-btn-group")) return;

        const btnGroup = document.createElement('div');
        btnGroup.className = "mefirs-filler-btn-group";
        btnGroup.style.display = "inline-flex";
        btnGroup.style.flexWrap = "nowrap";
        btnGroup.style.marginLeft = "10px";
        btnGroup.style.verticalAlign = "middle";

        for (let i = 0; i < functionArray.length; i++) {
            const fn = functionArray[i];
            const buttonName = buttonNames[i];

            const newButton = document.createElement('button');
            newButton.className = saveButton.className + " mefirs-filler-btn";
            newButton.innerHTML = buttonName;
            newButton.style.marginLeft = "5px";
            newButton.style.backgroundColor = "#d9534f"; 
            newButton.style.color = "white";
            newButton.style.whiteSpace = "nowrap";
            newButton.onclick = fn;
            btnGroup.appendChild(newButton);
        }
        
        buttonParent.appendChild(btnGroup);
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
