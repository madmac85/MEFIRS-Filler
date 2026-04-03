console.log("MEFIRS Filler: Script loaded in frame: " + window.location.href);

function clearAutomatedFields() {
    setInput("Number of Patients Transported", "");

    const targetLabels = [
        "Type of Service Requested",
        "Vehicle Dispatch Location",
        "Barriers to Patient Care",
        "Destination/Transferred To",
        "Reason for Choosing Destination",
        "Primary Method of Payment",
        "Type of Dispatch Delay",
        "Type of Response Delay",
        "Type of Transport Delay",
        "Type of Turn-Around Delay",
        "Transport Mode from Scene",
        "EMD Performed"
    ];

    targetLabels.forEach(label => {
        const fieldContainer = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))
                                    .find(el => el.innerText.includes(label));
        if (fieldContainer) {
            const clearIcon = fieldContainer.querySelector('.fa-times, .fa-close, .koSingleselect-selectedItem-clear, .koMultiselect-selectedItem-clear, .fa-minus-circle');
            if (clearIcon) clearIcon.click();
        }
    });

    const exposuresSection = Array.from(document.querySelectorAll('.ko-grid-container, #sections'))
                                  .find(el => el.innerText.includes("Exposures & PPE"));
    if (exposuresSection) {
        const ppeClearButtons = Array.from(exposuresSection.querySelectorAll('.fa-times, .fa-close'))
                                     .filter(btn => btn.closest('.single-row-control, .ko-grid-column'));
        ppeClearButtons.forEach(btn => btn.click());
    }
}

function showAddressPopup(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = "mefirs-popup-overlay";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000; display:flex; align-items:center; justify-content:center;";

    const popup = document.createElement('div');
    popup.style.cssText = "background:white; padding:40px; border-radius:15px; text-align:center; max-width:500px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.5);";

    const title = document.createElement('h2');
    title.innerText = "Is the Patient's address the same as the incident address?";
    title.style.marginBottom = "30px";
    title.style.fontSize = "24px";
    popup.appendChild(title);

    const btnContainer = document.createElement('div');
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "space-around";

    const yesBtn = document.createElement('button');
    yesBtn.innerText = "Yes";
    yesBtn.style.cssText = "padding:25px 50px; font-size:22px; cursor:pointer; background:#5cb85c; color:white; border:none; border-radius:10px; font-weight:bold;";
    yesBtn.onclick = () => {
        document.body.removeChild(overlay);
        onComplete(true);
    };

    const noBtn = document.createElement('button');
    noBtn.innerText = "No/Unknown";
    noBtn.style.cssText = "padding:25px 50px; font-size:22px; cursor:pointer; background:#d9534f; color:white; border:none; border-radius:10px; font-weight:bold;";
    noBtn.onclick = () => {
        document.body.removeChild(overlay);
        onComplete(false);
    };

    btnContainer.appendChild(yesBtn);
    btnContainer.appendChild(noBtn);
    popup.appendChild(btnContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

function callEmergentMaineGeneral() {
    clearAutomatedFields();
    showAddressPopup((isSameAddress) => {
        if (isSameAddress) {
            press("button", ["Patient Address Same as Incident Address"]);
        }
        
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => {
                startTab(isSameAddress);
            }, 800);
        }, 500);
    });

    function startTab(isSameAddress) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"];
        press("button", startTabButtons);
        
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => {
            automatePPE(() => responseTab(isSameAddress));
        }, 1000);
    }

    function responseTab(isSameAddress) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            // Added EMD Performed value
            let btns = ["Emergent (Immediate Response)", "Lights and Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"];
            press("button", btns);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            press("menu", ["Transport", "Transport Info"]);
            setTimeout(() => transportInfoTab(isSameAddress), 800);
        }, 1000);
    }

    function transportInfoTab(isSameAddress) {
        setInput("Number of Patients Transported", "1");
        press("button", ["Emergent (Immediate Response)", "Non-Emergent", "No Lights or Sirens", "Ground-Ambulance", "Wheeled Stretcher", "None/No Delay"]);
        press("dropdown secondary", ["Semi-Fowlers"]);
        press("menu", ["Disposition Destination"]);
        setTimeout(() => transportDestTab(isSameAddress), 800);
    }

    function transportDestTab(isSameAddress) {
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
                        if (isSameAddress) {
                            setTimeout(() => press("button", ["Find a Repeat Patient"]), 800);
                        }
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function callNonEmergentMaineGeneral() {
    clearAutomatedFields();
    showAddressPopup((isSameAddress) => {
        if (isSameAddress) press("button", ["Patient Address Same as Incident Address"]);
        
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => startTab(isSameAddress), 800);
        }, 500);
    });

    function startTab(isSameAddress) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"]);
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => automatePPE(() => responseTab(isSameAddress)), 1000);
    }

    function responseTab(isSameAddress) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            // Added EMD Performed value
            let btns = ["Emergent (Immediate Response)", "No Lights or Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"];
            press("button", btns);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            press("menu", ["Transport", "Transport Info"]);
            setTimeout(() => transportInfoTab(isSameAddress), 800);
        }, 1000);
    }

    function transportInfoTab(isSameAddress) {
        setInput("Number of Patients Transported", "1");
        press("button", ["Emergent (Immediate Response)", "Non-Emergent", "No Lights or Sirens", "Ground-Ambulance", "Wheeled Stretcher", "None/No Delay"]);
        press("dropdown secondary", ["Semi-Fowlers"]);
        press("menu", ["Disposition Destination"]);
        setTimeout(() => transportDestTab(isSameAddress), 800);
    }

    function transportDestTab(isSameAddress) {
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
                        if (isSameAddress) {
                            setTimeout(() => press("button", ["Find a Repeat Patient"]), 800);
                        }
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function liftAssist() {
    clearAutomatedFields();
    showAddressPopup((isSameAddress) => {
        if (isSameAddress) press("button", ["Patient Address Same as Incident Address"]);
        
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => startTab(isSameAddress), 800);
        }, 500);
    });

    function startTab(isSameAddress) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Non-Patient Incident (Not Otherwise Listed)"]);
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => automatePPE(() => responseTab(isSameAddress)), 1000);
    }

    function responseTab(isSameAddress) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            // Added EMD Performed value
            press("button", ["Emergent (Immediate Response)", "No Lights or Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"]);
            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            setTimeout(() => {
                press("menu", ["Billing Information"]);
                setTimeout(() => {
                    press("dropdown", ["No Insurance Identified"]);
                    if (isSameAddress) {
                        setTimeout(() => press("button", ["Find a Repeat Patient"]), 800);
                    }
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
        ['input', 'change', 'blur'].forEach(ev => targetInput.dispatchEvent(new Event(ev, { bubbles: true })));
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
            let dropdownTrigger = currentCard.querySelector('.koMultiselect-searchbar, .koMultiselect-down-button, input.koMultiselect-searchbar-input');
            if (dropdownTrigger) {
                dropdownTrigger.click();
                setTimeout(() => {
                    let ppeItems = Array.from(document.querySelectorAll('.koMultiselect-dropDownItem span, .koMultiselect-dropDownItem'));
                    let glovesOption = ppeItems.find(node => node.textContent.trim() === "Gloves");
                    if (glovesOption) {
                        glovesOption.click();
                        setTimeout(() => {
                            let okButton = Array.from(currentCard.querySelectorAll('button, .button-control')).find(btn => btn.innerText.includes("OK"));
                            if (okButton) okButton.click();
                            i++;
                            setTimeout(processNextCard, 800); 
                        }, 800);
                    } else {
                        i++;
                        setTimeout(processNextCard, 200);
                    }
                }, 800);
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
        const saveButton = Array.from(document.querySelectorAll("button, .button-control")).find(el => el.textContent.includes("Save") && el.offsetParent !== null);
        if (!saveButton) return;
        const buttonParent = saveButton.parentElement;
        if (buttonParent.querySelector(".mefirs-filler-btn-group")) return;
        const btnGroup = document.createElement('div');
        btnGroup.className = "mefirs-filler-btn-group";
        btnGroup.style.cssText = "display:inline-flex; flex-wrap:nowrap; margin-left:10px; vertical-align:middle;";
        for (let i = 0; i < functionArray.length; i++) {
            const newButton = document.createElement('button');
            newButton.className = saveButton.className + " mefirs-filler-btn";
            newButton.innerHTML = buttonNames[i];
            newButton.style.cssText = "margin-left:5px; background-color:#d9534f; color:white; white-space:nowrap;";
            newButton.onclick = functionArray[i];
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
            if (ddsStart !== -1 && ddsEnd !== -1) currentStringField.setSelectionRange(ddsStart, ddsEnd);
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
    if (DDS !== -1) return [DDS, findEndOfWord(currentStringField.value, DDS)];
    return [-1, -1];
    function findEndOfWord(text, startIndex) {
        let endPosition = startIndex;
        const validChars = [' ', '.', '\n'];
        while (endPosition < text.length && !validChars.includes(text[endPosition])) endPosition++;
        return endPosition;
    }
}
