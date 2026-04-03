console.log("MEFIRS Filler: Script loaded in frame: " + window.location.href);

function clearAutomatedFields() {
    setInput("Number of Patients Transported", "");
    setInput("EMD Determinant Code", "");

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
        "EMD Performed",
        "Dispatch Reason"
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

function getDispatchReason(emdCode) {
    if (!emdCode) return null;
    let match = emdCode.match(/^(\d+)/);
    if (!match) return null;
    let num = parseInt(match[1], 10);
    const map = {
        1: "1. Abdominal Pain/Problems",
        2: "2. Allergic Reaction/Stings",
        3: "3. Animal Bite",
        4: "4. Assault",
        5: "5. Back Pain (Non-Traumatic)",
        6: "6. Breathing Problem",
        7: "7. Burns/Explosion",
        8: "8. Carbon Monoxide/Hazmat/Inhalation/CBRN",
        9: "9. Cardiac Arrest/Death",
        10: "10. Chest Pain (Non-Traumatic)",
        11: "11. Choking",
        12: "12. Convulsions/Seizure",
        13: "13. Diabetic Problem",
        14: "14. Drowning/Diving/SCUBA Accident",
        15: "15. Electrocution/Lightning",
        16: "16. Eye Problem/Injury",
        17: "17. Falls",
        18: "18. Headache",
        19: "19. Heart Problems/AICD",
        20: "20. Heat/Cold Exposure",
        21: "21. Hemorrhage/Laceration",
        22: "22. Industrial Accident/Inaccessible Incident/Other Entrapments (Non-Traffic)",
        23: "23. Overdose/Poisoning/Ingestion",
        24: "24. Pregnancy/Childbirth/Miscarriage",
        25: "25. Psychiatric/Abnormal Behavior/Suicide Attempt",
        26: "26. Sick Person",
        27: "27. Stab/Gunshot/Penetrating Trauma",
        28: "28. Stroke (CVA)/Transient Ischemic Attack",
        29: "29. Traffic/Transportation Incidents",
        30: "30. Traumatic Injuries",
        31: "31. Unconscious/Fainting",
        32: "32. Unknown Problem/Person Down",
        33: "33. Transfer/Interfacility/Palliative Care"
    };
    return map[num] || null;
}

function showInitialConfigPopup(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = "mefirs-popup-overlay";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000; display:flex; align-items:center; justify-content:center;";

    const popup = document.createElement('div');
    popup.style.cssText = "background:white; padding:40px; border-radius:15px; text-align:center; max-width:600px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.5); font-family:sans-serif;";

    const title = document.createElement('h2');
    title.innerText = "Call Configuration";
    title.style.marginBottom = "30px";
    title.style.fontSize = "28px";
    popup.appendChild(title);

    const emdContainer = document.createElement('div');
    emdContainer.style.marginBottom = "25px";
    emdContainer.style.textAlign = "left";
    const emdLabel = document.createElement('label');
    emdLabel.innerText = "EMD Code (Optional):";
    emdLabel.style.fontSize = "20px";
    emdLabel.style.fontWeight = "bold";
    const emdInput = document.createElement('input');
    emdInput.type = "text";
    emdInput.placeholder = "e.g., 17-D-3 or 17D3";
    emdInput.style.cssText = "width:100%; padding:15px; font-size:20px; margin-top:10px; border:2px solid #ccc; border-radius:8px; box-sizing:border-box;";
    emdContainer.appendChild(emdLabel);
    emdContainer.appendChild(emdInput);
    popup.appendChild(emdContainer);

    const addressContainer = document.createElement('div');
    addressContainer.style.marginBottom = "40px";
    addressContainer.style.textAlign = "left";
    const addressLabel = document.createElement('label');
    addressLabel.innerText = "Is Patient Address Same as Incident Address?";
    addressLabel.style.fontSize = "20px";
    addressLabel.style.fontWeight = "bold";
    const addressSelect = document.createElement('select');
    addressSelect.style.cssText = "width:100%; padding:15px; font-size:20px; margin-top:10px; border:2px solid #ccc; border-radius:8px; box-sizing:border-box; background:white;";
    const optYes = document.createElement('option');
    optYes.value = "yes";
    optYes.text = "Yes";
    const optNo = document.createElement('option');
    optNo.value = "no";
    optNo.text = "No / Unknown";
    optNo.selected = true;
    addressSelect.appendChild(optNo);
    addressSelect.appendChild(optYes);
    addressContainer.appendChild(addressLabel);
    addressContainer.appendChild(addressSelect);
    popup.appendChild(addressContainer);

    const btnContainer = document.createElement('div');
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "space-between";

    const unknownBtn = document.createElement('button');
    unknownBtn.innerText = "Unknown / Skip";
    unknownBtn.style.cssText = "padding:20px 30px; font-size:20px; cursor:pointer; background:#6c757d; color:white; border:none; border-radius:10px; font-weight:bold; width:48%;";
    unknownBtn.onclick = () => {
        document.body.removeChild(overlay);
        onComplete({ isSameAddress: false, dispatchReason: null, emdCode: "" });
    };

    const saveBtn = document.createElement('button');
    saveBtn.innerText = "Save";
    saveBtn.style.cssText = "padding:20px 30px; font-size:20px; cursor:pointer; background:#5cb85c; color:white; border:none; border-radius:10px; font-weight:bold; width:48%;";
    saveBtn.onclick = () => {
        document.body.removeChild(overlay);
        const emdVal = emdInput.value.trim();
        const reason = getDispatchReason(emdVal);
        const isSame = addressSelect.value === "yes";
        onComplete({ isSameAddress: isSame, dispatchReason: reason, emdCode: emdVal });
    };

    btnContainer.appendChild(unknownBtn);
    btnContainer.appendChild(saveBtn);
    popup.appendChild(btnContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

function setDropdownByLabel(labelName, value) {
    if (!value) return;
    const containers = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'));
    const targetContainer = containers.find(el => el.innerText.includes(labelName));
    if (targetContainer) {
        const trigger = targetContainer.querySelector('.ko-dropdown-placeholder, .ko-dropdown-value, .koSingleselect-down-button, .koSingleselect-searchbar-input');
        if (trigger) {
            trigger.click();
            setTimeout(() => {
                const items = Array.from(document.querySelectorAll('.koSingleselect-dropDownItem, .koSingleselect-dropDownItem span'));
                const targetItem = items.find(node => node.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() === value);
                if (targetItem) {
                    targetItem.click();
                }
            }, 600);
        }
    }
}

function callEmergentMaineGeneral() {
    clearAutomatedFields();
    showInitialConfigPopup((config) => {
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => {
                startTab(config);
            }, 800);
        }, 500);
    });

    function startTab(config) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        let startTabButtons = ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"];
        press("button", startTabButtons);
        
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => {
            automatePPE(() => responseTab(config));
        }, 1000);
    }

    function responseTab(config) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            let btns = ["Emergent (Immediate Response)", "Lights and Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"];
            press("button", btns);
            
            if (config.emdCode) setInput("EMD Determinant Code", config.emdCode);

            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            
            if (config.dispatchReason) {
                setDropdownByLabel("Dispatch Reason:", config.dispatchReason);
            }

            setTimeout(() => {
                press("menu", ["Transport", "Transport Info"]);
                setTimeout(() => transportInfoTab(config), 800);
            }, 800);
        }, 1000);
    }

    function transportInfoTab(config) {
        setInput("Number of Patients Transported", "1");
        press("button", ["Emergent (Immediate Response)", "Non-Emergent", "No Lights or Sirens", "Ground-Ambulance", "Wheeled Stretcher", "None/No Delay"]);
        press("dropdown secondary", ["Semi-Fowlers"]);
        press("menu", ["Disposition Destination"]);
        setTimeout(() => transportDestTab(config), 800);
    }

    function transportDestTab(config) {
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
                        setTimeout(() => patientTab(config), 800);
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function callNonEmergentMaineGeneral() {
    clearAutomatedFields();
    showInitialConfigPopup((config) => {
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => startTab(config), 800);
        }, 500);
    });

    function startTab(config) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Patient Contact Made", "Patient Evaluated and Care Provided", "Initiated and Continued Primary Care", "Transport by This EMS Unit (This Crew Only)"]);
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => automatePPE(() => responseTab(config)), 1000);
    }

    function responseTab(config) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            let btns = ["Emergent (Immediate Response)", "No Lights or Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"];
            press("button", btns);

            if (config.emdCode) setInput("EMD Determinant Code", config.emdCode);

            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            
            if (config.dispatchReason) {
                setDropdownByLabel("Dispatch Reason:", config.dispatchReason);
            }

            setTimeout(() => {
                press("menu", ["Transport", "Transport Info"]);
                setTimeout(() => transportInfoTab(config), 800);
            }, 800);
        }, 1000);
    }

    function transportInfoTab(config) {
        setInput("Number of Patients Transported", "1");
        press("button", ["Emergent (Immediate Response)", "Non-Emergent", "No Lights or Sirens", "Ground-Ambulance", "Wheeled Stretcher", "None/No Delay"]);
        press("dropdown secondary", ["Semi-Fowlers"]);
        press("menu", ["Disposition Destination"]);
        setTimeout(() => transportDestTab(config), 800);
    }

    function transportDestTab(config) {
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
                        setTimeout(() => patientTab(config), 800);
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
}

function liftAssist() {
    clearAutomatedFields();
    showInitialConfigPopup((config) => {
        setTimeout(() => {
            press("menu", ["Start Up", "Start-Up", "Responding Unit Information"]);
            setTimeout(() => startTab(config), 800);
        }, 500);
    });

    function startTab(config) {
        press("dropdown", ["Emergency Response (Primary Response Area)"]);
        press("button", ["Non-Patient Incident (Not Otherwise Listed)"]);
        press("menu", ["Exposures & PPE"]);
        setTimeout(() => automatePPE(() => responseTab(config)), 1000);
    }

    function responseTab(config) {
        press("menu", ["Response", "Response Info"]);
        setTimeout(() => {
            press("button", ["Emergent (Immediate Response)", "No Lights or Sirens", "Single", "Not Recorded", "Distance", "None/No Delay", "Yes, Unknown if Pre-Arrival Instructions Given"]);
            
            if (config.emdCode) setInput("EMD Determinant Code", config.emdCode);

            press("dropdown", ["Augusta Fire Department", "None Noted"]);
            
            if (config.dispatchReason) {
                setDropdownByLabel("Dispatch Reason:", config.dispatchReason);
            }

            setTimeout(() => {
                press("menu", ["Billing Information"]);
                setTimeout(() => {
                    press("dropdown", ["No Insurance Identified"]);
                    setTimeout(() => patientTab(config), 800);
                }, 800);
            }, 800);
        }, 1000);
    }
}

function patientTab(config) {
    if (config.isSameAddress) {
        press("menu", ["Patient", "Patient Info", "Patient Information"]);
        setTimeout(() => {
            press("button", ["Patient Address Same as Incident Address"]);
            setTimeout(() => {
                press("button", ["Find a Repeat Patient"]);
            }, 1000);
        }, 1200);
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
