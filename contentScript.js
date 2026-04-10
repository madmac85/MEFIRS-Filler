console.log('[MEFIRS Filler] Script loaded in frame: ' + window.location.href);



// ─── Settings ─────────────────────────────────────────────────────────────────



const SETTINGS = {

    dispatchLocation: 'Augusta Fire Department',

    destinationFull: 'MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH',

    destinationShort: 'MaineGeneral'

};



// ─── Utilities ────────────────────────────────────────────────────────────────



/**

 * Wait for a DOM element. selectorOrFn can be a CSS selector string or a

 * function that returns the element (or null/undefined if not ready).

 * Resolves with the element, or null on timeout.

 */

function waitForElement(selectorOrFn, { timeout = 5000, interval = 100 } = {}) {

    return new Promise(resolve => {

        const check = typeof selectorOrFn === 'function'

            ? selectorOrFn

            : () => document.querySelector(selectorOrFn);



        const found = check();

        if (found) { resolve(found); return; }



        const deadline = Date.now() + timeout;

        const id = setInterval(() => {

            const el = check();

            if (el) { clearInterval(id); resolve(el); return; }

            if (Date.now() > deadline) { clearInterval(id); resolve(null); }

        }, interval);

    });

}



function sleep(ms) {

    return new Promise(r => setTimeout(r, ms));

}



function cleanText(t) {

    return (t || '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();

}



function log(msg)  { console.log('[MEFIRS Filler] ' + msg); updateStatusStep(msg); }

function warn(msg) { console.warn('[MEFIRS Filler] WARNING: ' + msg); }



// ─── Status Banner ────────────────────────────────────────────────────────────



function injectStatusStyles() {

    if (document.getElementById('mefirs-filler-styles')) return;

    const style = document.createElement('style');

    style.id = 'mefirs-filler-styles';

    style.textContent =

        '@keyframes mefirs-pulse { 0%,100%{opacity:1} 50%{opacity:.6} }' +

        '@keyframes mefirs-spin { to{transform:rotate(360deg)} }' +

        '#mefirs-status-banner{position:fixed;top:0;left:0;right:0;z-index:99999;' +

            'font-family:sans-serif;font-size:14px;padding:10px 20px;display:flex;' +

            'align-items:center;gap:10px;transition:transform .3s ease,opacity .3s ease;' +

            'transform:translateY(-100%);opacity:0;box-shadow:0 2px 8px rgba(0,0,0,.2)}' +

        '#mefirs-status-banner.visible{transform:translateY(0);opacity:1}' +

        '#mefirs-status-banner.running{background:#1a73e8;color:white}' +

        '#mefirs-status-banner.done{background:#0d9f4f;color:white}' +

        '#mefirs-status-banner.error{background:#d93025;color:white}' +

        '#mefirs-status-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);' +

            'border-top-color:white;border-radius:50%;animation:mefirs-spin .6s linear infinite}' +

        '#mefirs-status-text{flex:1}' +

        '#mefirs-status-step{font-size:12px;opacity:.85;margin-left:8px}';

    document.head.appendChild(style);

}



function showStatusBanner(state, text) {

    injectStatusStyles();

    let banner = document.getElementById('mefirs-status-banner');

    if (!banner) {

        banner = document.createElement('div');

        banner.id = 'mefirs-status-banner';

        banner.innerHTML = '<div id="mefirs-status-spinner"></div>' +

            '<span id="mefirs-status-text"></span>' +

            '<span id="mefirs-status-step"></span>';

        document.body.appendChild(banner);

    }

    banner.className = state;

    document.getElementById('mefirs-status-text').textContent = text;

    document.getElementById('mefirs-status-step').textContent = '';

    const spinner = document.getElementById('mefirs-status-spinner');

    spinner.style.display = state === 'running' ? 'block' : 'none';

    // Trigger reflow for animation

    void banner.offsetHeight;

    banner.classList.add('visible');

}



function updateStatusStep(stepText) {

    const el = document.getElementById('mefirs-status-step');

    if (el) el.textContent = stepText;

}



function hideStatusBanner(delay) {

    setTimeout(() => {

        const banner = document.getElementById('mefirs-status-banner');

        if (banner) banner.classList.remove('visible');

    }, delay || 0);

}



// ─── Core Interaction Primitives ───────────────────────────────────────────────



/**

 * Click a menu/section navigation item. Tries each name as a fallback until

 * one is found. Searches broadly — first in #sections with known classes,

 * then falls back to finding any visible element whose text matches exactly.

 */

async function pressMenu(names) {

    await sleep(300);



    for (const name of names) {

        // Strategy 1: original selectors in #sections

        const sections = document.querySelector('#sections');

        if (sections) {

            const nodes = Array.from(sections.querySelectorAll(

                '.text-padding, .form-navigation-section-caption-text'

            ));

            const target = nodes.find(n => cleanText(n.textContent) === name);

            if (target) {

                target.click();

                log('pressMenu: "' + name + '"');

                await sleep(500);

                return;

            }

        }



        // Strategy 2: broad search — find smallest visible element with exact text

        const candidates = Array.from(

            document.querySelectorAll('a, span, div, li, button, td, label, p')

        ).filter(el =>

            el.offsetParent !== null &&

            el.textContent.length < 150 &&

            cleanText(el.textContent) === name

        );



        if (candidates.length > 0) {

            candidates.sort((a, b) => a.textContent.length - b.textContent.length);

            candidates[0].click();

            log('pressMenu: "' + name + '" (broad, tag=' + candidates[0].tagName + ')');

            await sleep(500);

            return;

        }

    }

    warn('pressMenu: none found in [' + names.join(', ') + ']');

}



/**

 * Click smart-list toggle buttons. Tries to click ALL names in the list

 * (they are independent toggle selections, not fallbacks).

 * Waits for at least one button from the list to appear before clicking.

 */

async function pressButton(names, { timeout = 5000 } = {}) {

    // Wait until at least one button from the list exists on the page

    const appeared = await waitForElement(

        () => Array.from(document.querySelectorAll('.smart-list-button-label, .smart-list-button'))

            .find(n => names.some(name => cleanText(n.textContent) === name)),

        { timeout }

    );

    if (!appeared) { warn('pressButton: none of [' + names.join(', ') + '] found'); return; }



    // Brief wait to let remaining buttons on the page finish rendering

    await sleep(400);



    const nodes = Array.from(document.querySelectorAll('.smart-list-button-label, .smart-list-button'));

    for (const name of names) {

        const target = nodes.find(n => cleanText(n.textContent) === name);

        if (target) { target.click(); log('pressButton: "' + name + '"'); }

        else { warn('pressButton: "' + name + '" not found among visible buttons'); }

    }

}



/**

 * Select a value from a KO single-select dropdown.

 * For each name in the array (treated as independent selections, not fallbacks):

 * opens visible dropdown triggers one at a time until the item appears,

 * then clicks it. Does NOT blast-click all triggers on the page.

 */

async function pressDropdown(names, { triggerTimeout = 1500, itemTimeout = 5000 } = {}) {

    for (const name of names) {

        // Check if item is already visible in an already-open dropdown

        let item = findDropdownItem('single', name);

        if (item) { item.click(); log('pressDropdown: "' + name + '" (already open)'); continue; }



        // Open visible triggers one at a time until the target item appears

        const triggers = Array.from(document.querySelectorAll(

            '.ko-dropdown-placeholder, .koSingleselect-down-button, .koSingleselect-searchbar-input'

        )).filter(el => el.offsetParent !== null);



        let found = false;

        for (const trigger of triggers) {

            trigger.click();

            item = await waitForElement(

                () => findDropdownItem('single', name),

                { timeout: triggerTimeout, interval: 80 }

            );

            if (item) {

                item.click();

                log('pressDropdown: "' + name + '"');

                found = true;

                break;

            }

            // Close this trigger before trying the next

            document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            await sleep(120);

        }

        if (!found) warn('pressDropdown: "' + name + '" not found in any dropdown');

    }

}



/**

 * Select a value from a KO multi-select dropdown.

 */

async function pressDropdownSecondary(names, { triggerTimeout = 1500 } = {}) {

    for (const name of names) {

        let item = findDropdownItem('multi', name);

        if (item) { item.click(); log('pressDropdownSecondary: "' + name + '" (already open)'); continue; }



        const triggers = Array.from(document.querySelectorAll(

            '.koMultiselect-searchbar-input, .koMultiselect-down-button, .koMultiselect-searchbar'

        )).filter(el => el.offsetParent !== null);



        let found = false;

        for (const trigger of triggers) {

            trigger.click();

            item = await waitForElement(

                () => findDropdownItem('multi', name),

                { timeout: triggerTimeout, interval: 80 }

            );

            if (item) {

                item.click();

                log('pressDropdownSecondary: "' + name + '"');

                found = true;

                break;

            }

            document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            await sleep(120);

        }

        if (!found) warn('pressDropdownSecondary: "' + name + '" not found');

    }

}



/** Find a visible KO dropdown item by exact text. */

function findDropdownItem(type, name) {

    const sel = type === 'single'

        ? '.koSingleselect-dropDownItem, .koSingleselect-dropDownItem span'

        : '.koMultiselect-dropDownItem, .koMultiselect-dropDownItem span';

    return Array.from(document.querySelectorAll(sel))

        .find(n => cleanText(n.textContent) === name) || null;

}



/**

 * Find the innermost (most specific) field container matching a label.

 * Sorts candidates by innerText length so we pick the tightest wrapper

 * around the field, not a parent section that contains many fields.

 */

function findFieldContainer(labelName) {

    const cleaned = cleanText(labelName);

    const candidates = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))

        .filter(el => cleanText(el.innerText).includes(cleaned));

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.innerText.length - b.innerText.length);

    return candidates[0];

}



/**

 * Find a field container by its label text, open that field's dropdown,

 * then wait for and click the target value. Use this when you know the label.

 */

async function setDropdownByLabel(labelName, value, { timeout = 5000 } = {}) {

    if (!value) return;

    const container = await waitForElement(() => findFieldContainer(labelName), { timeout });

    if (!container) { warn('setDropdownByLabel: container for "' + labelName + '" not found'); return; }



    const trigger = container.querySelector(

        '.ko-dropdown-placeholder, .ko-dropdown-value, .koSingleselect-down-button, .koSingleselect-searchbar-input'

    );

    if (!trigger) { warn('setDropdownByLabel: trigger for "' + labelName + '" not found'); return; }



    trigger.click();

    const item = await waitForElement(

        () => Array.from(document.querySelectorAll(

            '.koSingleselect-dropDownItem, .koSingleselect-dropDownItem span'

        )).find(n => cleanText(n.textContent) === value),

        { timeout, interval: 80 }

    );

    if (item) { item.click(); log('setDropdownByLabel: "' + labelName + '" = "' + value + '"'); }

    else { warn('setDropdownByLabel: "' + value + '" not found for "' + labelName + '"'); }

}



/**

 * Like setDropdownByLabel, but for KO multi-select dropdowns.

 * Finds the container by label, opens its multi-select trigger,

 * then waits for the target item to appear before clicking.

 */

async function setMultiselectByLabel(labelName, value, { timeout = 5000 } = {}) {

    if (!value) return;

    const container = await waitForElement(() => findFieldContainer(labelName), { timeout });

    if (!container) { warn('setMultiselectByLabel: container for "' + labelName + '" not found'); return; }



    const trigger = container.querySelector(

        '.koMultiselect-searchbar-input, .koMultiselect-down-button, .koMultiselect-searchbar'

    );

    if (!trigger) { warn('setMultiselectByLabel: trigger for "' + labelName + '" not found'); return; }



    trigger.click();

    const item = await waitForElement(

        () => Array.from(document.querySelectorAll(

            '.koMultiselect-dropDownItem, .koMultiselect-dropDownItem span'

        )).find(n => cleanText(n.textContent) === value),

        { timeout, interval: 80 }

    );

    if (item) { item.click(); log('setMultiselectByLabel: "' + labelName + '" = "' + value + '"'); }

    else { warn('setMultiselectByLabel: "' + value + '" not found for "' + labelName + '"'); }

}



/**

 * Set a text input value by finding the input inside its label container.

 * Fires input/change/blur events so KnockoutJS bindings pick up the change.

 */

async function setInput(labelName, value, { timeout = 5000 } = {}) {

    const container = await waitForElement(() => findFieldContainer(labelName), { timeout });

    const target = container ? container.querySelector('input') : null;

    if (target) {

        target.value = value;

        ['input', 'change', 'blur'].forEach(ev =>

            target.dispatchEvent(new Event(ev, { bubbles: true }))

        );

        log('setInput: "' + labelName + '" = "' + value + '"');

    } else {

        warn('setInput: input for "' + labelName + '" not found');

    }

}



// ─── Clear Automated Fields ────────────────────────────────────────────────────



function clearAutomatedFields() {

    setInput('Number of Patients Transported', '');

    setInput('EMD Determinant Code', '');



    const targetLabels = [

        'Type of Service Requested',

        'Vehicle Dispatch Location',

        'Barriers to Patient Care',

        'Destination/Transferred To',

        'Reason for Choosing Destination',

        'Primary Method of Payment',

        'Type of Dispatch Delay',

        'Type of Response Delay',

        'Type of Transport Delay',

        'Type of Turn-Around Delay',

        'Transport Mode from Scene',

        'EMD Performed',

        'Dispatch Reason'

    ];



    targetLabels.forEach(label => {

        const fieldContainer = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))

            .find(el => cleanText(el.innerText).includes(label));

        if (fieldContainer) {

            const clearIcon = fieldContainer.querySelector(

                '.fa-times, .fa-close, .koSingleselect-selectedItem-clear, ' +

                '.koMultiselect-selectedItem-clear, .fa-minus-circle'

            );

            if (clearIcon) clearIcon.click();

        }

    });



    const exposuresSection = Array.from(document.querySelectorAll('.ko-grid-container, #sections'))

        .find(el => cleanText(el.innerText).includes('Exposures & PPE'));

    if (exposuresSection) {

        Array.from(exposuresSection.querySelectorAll('.fa-times, .fa-close'))

            .filter(btn => btn.closest('.single-row-control, .ko-grid-column'))

            .forEach(btn => btn.click());

    }

}



// ─── Dispatch Reason Map ───────────────────────────────────────────────────────



function getDispatchReason(emdCode) {

    if (!emdCode) return null;

    const match = emdCode.match(/^(\d+)/);

    if (!match) return null;

    const map = {

        1: '1. Abdominal Pain/Problems',

        2: '2. Allergic Reaction/Stings',

        3: '3. Animal Bite',

        4: '4. Assault',

        5: '5. Back Pain (Non-Traumatic)',

        6: '6. Breathing Problem',

        7: '7. Burns/Explosion',

        8: '8. Carbon Monoxide/Hazmat/Inhalation/CBRN',

        9: '9. Cardiac Arrest/Death',

        10: '10. Chest Pain (Non-Traumatic)',

        11: '11. Choking',

        12: '12. Convulsions/Seizure',

        13: '13. Diabetic Problem',

        14: '14. Drowning/Diving/SCUBA Accident',

        15: '15. Electrocution/Lightning',

        16: '16. Eye Problem/Injury',

        17: '17. Falls',

        18: '18. Headache',

        19: '19. Heart Problems/AICD',

        20: '20. Heat/Cold Exposure',

        21: '21. Hemorrhage/Laceration',

        22: '22. Industrial Accident/Inaccessible Incident/Other Entrapments (Non-Traffic)',

        23: '23. Overdose/Poisoning/Ingestion',

        24: '24. Pregnancy/Childbirth/Miscarriage',

        25: '25. Psychiatric/Abnormal Behavior/Suicide Attempt',

        26: '26. Sick Person',

        27: '27. Stab/Gunshot Wound/Penetrating Trauma',

        28: '28. Stroke/CVA/TIA',

        29: '29. Traffic/Transportation Incident',

        30: '30. Traumatic Injury',

        31: '31. Unconscious/Fainting/Near-Fainting',

        32: '32. Unknown Problem/Person Down',

        33: '33. Transfer/Interfacility/Palliative Care',

        34: '34. Automated Crash Notification',

        37: '37. Interfacility Evaluation/Transfer'

    };

    return map[parseInt(match[1], 10)] || null;

}



/**

 * Derive the Dispatch Priority (Patient Acuity) from the EMD code letter.

 * e.g. "6D3" → letter D → "Delta", "18B39" → letter B → "Bravo"

 */

function getDispatchPriority(emdCode) {

    if (!emdCode) return null;

    const match = emdCode.match(/[A-Ea-eOo]/);

    if (!match) return null;

    const map = {

        'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie',

        'D': 'Delta', 'E': 'Echo', 'O': 'Omega'

    };

    return map[match[0].toUpperCase()] || null;

}



// ─── Config Popup ──────────────────────────────────────────────────────────────



function showInitialConfigPopup(onComplete) {

    const overlay = document.createElement('div');

    overlay.id = 'mefirs-popup-overlay';

    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +

        'background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';



    const popup = document.createElement('div');

    popup.style.cssText = 'background:white;padding:40px;border-radius:15px;text-align:center;' +

        'max-width:600px;width:90%;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-family:sans-serif;';



    const title = document.createElement('h2');

    title.innerText = 'Call Configuration';

    title.style.cssText = 'margin-bottom:30px;font-size:28px;';

    popup.appendChild(title);



    // EMD Code input

    const emdContainer = document.createElement('div');

    emdContainer.style.cssText = 'margin-bottom:25px;text-align:left;';

    const emdLabel = document.createElement('label');

    emdLabel.innerText = 'EMD Code (Optional):';

    emdLabel.style.cssText = 'font-size:20px;font-weight:bold;';

    const emdInput = document.createElement('input');

    emdInput.type = 'text';

    emdInput.placeholder = 'e.g., 17-D-3 or 17D3';

    emdInput.style.cssText = 'width:100%;padding:15px;font-size:20px;margin-top:10px;' +

        'border:2px solid #ccc;border-radius:8px;box-sizing:border-box;';

    emdContainer.appendChild(emdLabel);

    emdContainer.appendChild(emdInput);

    popup.appendChild(emdContainer);



    // Address select

    const addressContainer = document.createElement('div');

    addressContainer.style.cssText = 'margin-bottom:40px;text-align:left;';

    const addressLabel = document.createElement('label');

    addressLabel.innerText = 'Is Patient Address Same as Incident Address?';

    addressLabel.style.cssText = 'font-size:20px;font-weight:bold;';

    const addressSelect = document.createElement('select');

    addressSelect.style.cssText = 'width:100%;padding:15px;font-size:20px;margin-top:10px;' +

        'border:2px solid #ccc;border-radius:8px;box-sizing:border-box;background:white;';

    const optNo  = document.createElement('option');

    optNo.value = 'no';  optNo.text = 'No / Unknown'; optNo.selected = true;

    const optYes = document.createElement('option');

    optYes.value = 'yes'; optYes.text = 'Yes';

    addressSelect.appendChild(optNo);

    addressSelect.appendChild(optYes);

    addressContainer.appendChild(addressLabel);

    addressContainer.appendChild(addressSelect);

    popup.appendChild(addressContainer);



    const btnContainer = document.createElement('div');

    btnContainer.style.cssText = 'display:flex;justify-content:space-between;';



    const finish = (emdVal) => {

        document.body.removeChild(overlay);

        onComplete({

            isSameAddress:    addressSelect.value === 'yes',

            dispatchReason:   getDispatchReason(emdVal),

            dispatchPriority: getDispatchPriority(emdVal),

            emdCode:          emdVal

        });

    };



    const unknownBtn = document.createElement('button');

    unknownBtn.innerText = 'Unknown / Skip';

    unknownBtn.style.cssText = 'padding:20px 30px;font-size:20px;cursor:pointer;background:#6c757d;' +

        'color:white;border:none;border-radius:10px;font-weight:bold;width:48%;';

    unknownBtn.onclick = () => finish('');



    const saveBtn = document.createElement('button');

    saveBtn.innerText = 'Save';

    saveBtn.style.cssText = 'padding:20px 30px;font-size:20px;cursor:pointer;background:#5cb85c;' +

        'color:white;border:none;border-radius:10px;font-weight:bold;width:48%;';

    saveBtn.onclick = () => finish(emdInput.value.trim());



    // Allow Enter key to submit

    emdInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });



    btnContainer.appendChild(unknownBtn);

    btnContainer.appendChild(saveBtn);

    popup.appendChild(btnContainer);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);

    emdInput.focus();

}



// ─── PPE Automation ────────────────────────────────────────────────────────────



async function automatePPE(nextStepCallback) {

    // Click "+ Add" button in the Exposures & PPE section

    const addBtn = await waitForElement(

        () => {

            // Try smart-list "Add All Crew" first

            const smart = Array.from(document.querySelectorAll('.smart-list-button-label, .smart-list-button'))

                .find(n => cleanText(n.textContent) === 'Add All Crew');

            if (smart) return smart;

            // Fall back to any visible button containing "Add" text

            return Array.from(document.querySelectorAll('button, .button-control, a'))

                .filter(el => el.offsetParent !== null)

                .find(el => /^\+?\s*Add/i.test(cleanText(el.textContent)));

        },

        { timeout: 4000 }

    );

    if (!addBtn) { warn('automatePPE: no add button found'); nextStepCallback(); return; }

    addBtn.click();

    log('automatePPE: clicked add button');



    // Wait for crew cards to load

    const firstCard = await waitForElement(

        () => Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))

            .find(el => cleanText(el.innerText).includes('EMS Professional (Crew Member) ID')),

        { timeout: 5000 }

    );

    if (!firstCard) {

        log('automatePPE: no crew cards found, skipping');

        nextStepCallback();

        return;

    }



    await sleep(600); // let all cards finish rendering



    const cards = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))

        .filter(el => cleanText(el.innerText).includes('EMS Professional (Crew Member) ID'));



    for (let i = 0; i < cards.length; i++) {

        const card = cards[i];



        // Find the PPE-specific multi-select within this card

        const ppeContainers = Array.from(card.querySelectorAll('.single-row-control, .ko-grid-column'));

        const ppeContainer = ppeContainers.find(el =>

            cleanText(el.innerText).includes('Personal Protective Equipment Used'));

        let trigger;

        if (ppeContainer) {

            trigger = ppeContainer.querySelector(

                '.koMultiselect-searchbar-input, .koMultiselect-down-button, .koMultiselect-searchbar'

            );

        }

        // Fallback: try first multi-select trigger in the card

        if (!trigger) {

            trigger = card.querySelector(

                '.koMultiselect-searchbar, .koMultiselect-down-button, input.koMultiselect-searchbar-input'

            );

        }

        if (!trigger) { log('automatePPE: no PPE trigger on card ' + i + ', skipping'); continue; }



        trigger.click();

        const glovesOption = await waitForElement(

            () => Array.from(document.querySelectorAll(

                '.koMultiselect-dropDownItem span, .koMultiselect-dropDownItem'

            )).find(n => cleanText(n.textContent) === 'Gloves'),

            { timeout: 3000 }

        );



        if (glovesOption) {

            glovesOption.click();

            await sleep(400);

            // OK button may be inside card or at its boundary — search broadly

            const okButton = Array.from(document.querySelectorAll('button, .button-control'))

                .find(btn => btn.offsetParent !== null && cleanText(btn.innerText) === 'OK');

            if (okButton) { okButton.click(); log('automatePPE: card ' + i + ' done'); }

            else { warn('automatePPE: OK button not found on card ' + i); }

            await sleep(500);

        } else {

            warn('automatePPE: "Gloves" not found for card ' + i);

        }

    }



    nextStepCallback();

}



// ─── Shared Tab Handlers ───────────────────────────────────────────────────────



async function sharedTransportDestTab(config) {

    await setDropdownByLabel('Destination/Transferred To', SETTINGS.destinationFull);

    await setMultiselectByLabel('Reason for Choosing Destination', 'Closest Facility');

    await pressButton(['Wheeled Stretcher']);  // How Patient Was Moved From Ambulance

    await setDropdownByLabel('Hospital Designation', 'Emergency Department');

    await pressMenu(['Billing Information']);

    await sleep(400);

    await setDropdownByLabel('Primary Method of Payment', 'No Insurance Identified');

    await patientTab(config);

}



async function sharedTransportInfoTab(config) {

    await setInput('Number of Patients Transported', '1');

    await pressButton(['Non-Emergent', 'No Lights or Sirens']);

    await pressButton(['Ground-Ambulance'], { timeout: 5000 });

    await pressButton(['Wheeled Stretcher'], { timeout: 5000 });

    await setMultiselectByLabel('Type of Transport Delay', 'None/No Delay');

    await setMultiselectByLabel('Type of Turn-Around Delay', 'None/No Delay');

    await setMultiselectByLabel('Position of Patient During Transport', 'Semi-Fowlers');

    await pressMenu(['Disposition Destination']);

    await sleep(400);

    await sharedTransportDestTab(config);

}



// ─── Workflow: Emergent to MaineGeneral ────────────────────────────────────────



function callEmergentMaineGeneral() {

    clearAutomatedFields();

    showStatusBanner('running', 'MEFIRS Filler: Running Emergent to ' + SETTINGS.destinationShort + '...');

    showInitialConfigPopup(async (config) => {

        try {

        await pressMenu(['Start Up', 'Start-Up', 'Responding Unit Information']);

        await sleep(600);



        // Start-Up tab — each selection triggers the next field to appear

        await setDropdownByLabel('Type of Service Requested', 'Emergency Response (Primary Response Area)');

        await pressButton(['Patient Contact Made']);

        // Patient Evaluation/Care appears after Unit Disposition

        await pressButton(['Patient Evaluated and Care Provided'], { timeout: 5000 });

        // Crew Disposition buttons appear after Patient Evaluation/Care

        await pressButton(['Initiated and Continued Primary Care'], { timeout: 5000 });

        // Transport Disposition buttons appear after Crew Disposition

        await pressButton(['Transport by This EMS Unit (This Crew Only)'], { timeout: 5000 });

        await pressMenu(['Exposures & PPE']);

        await sleep(500);

        automatePPE(async () => {

            try {

            // Response tab

            await pressMenu(['Response', 'Response Info']);

            await sleep(600);

            await pressButton(['Emergent (Immediate Response)', 'Lights and Sirens']);

            await pressButton(['Single', 'Not Recorded']);

            await setMultiselectByLabel('Type of Dispatch Delay', 'None/No Delay');

            await setMultiselectByLabel('Type of Response Delay', 'None/No Delay');

            await pressButton(['Yes, Unknown if Pre-Arrival Instructions Given']);

            if (config.emdCode) await setInput('EMD Determinant Code', config.emdCode);

            if (config.dispatchPriority) await setDropdownByLabel('Dispatch Priority (Patient Acuity)', config.dispatchPriority);

            await setDropdownByLabel('Vehicle Dispatch Location', SETTINGS.dispatchLocation);

            if (config.dispatchReason) await setDropdownByLabel('Dispatch Reason', config.dispatchReason);



            // Transport tab

            await pressMenu(['Transport', 'Transport Info']);

            await sleep(600);

            await setInput('Number of Patients Transported', '1');

            await pressButton(['Emergent (Immediate Response)', 'No Lights or Sirens']);

            await pressButton(['Ground-Ambulance'], { timeout: 5000 });

            await pressButton(['Wheeled Stretcher'], { timeout: 5000 });

            await setMultiselectByLabel('Type of Transport Delay', 'None/No Delay');

            await setMultiselectByLabel('Type of Turn-Around Delay', 'None/No Delay');

            await setMultiselectByLabel('Position of Patient During Transport', 'Semi-Fowlers');

            await pressMenu(['Disposition Destination']);

            await sleep(400);

            await sharedTransportDestTab(config);



            showStatusBanner('done', 'MEFIRS Filler: Emergent to ' + SETTINGS.destinationShort + ' complete');

            hideStatusBanner(4000);

            } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

        });

        } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

    });

}



// ─── Workflow: Non-Emergent to MaineGeneral ────────────────────────────────────



function callNonEmergentMaineGeneral() {

    clearAutomatedFields();

    showStatusBanner('running', 'MEFIRS Filler: Running Non-Emergent to ' + SETTINGS.destinationShort + '...');

    showInitialConfigPopup(async (config) => {

        try {

        await pressMenu(['Start Up', 'Start-Up', 'Responding Unit Information']);

        await sleep(600);



        // Start-Up tab — each selection triggers the next field to appear

        await setDropdownByLabel('Type of Service Requested', 'Emergency Response (Primary Response Area)');

        await pressButton(['Patient Contact Made']);

        await pressButton(['Patient Evaluated and Care Provided'], { timeout: 5000 });

        await pressButton(['Initiated and Continued Primary Care'], { timeout: 5000 });

        await pressButton(['Transport by This EMS Unit (This Crew Only)'], { timeout: 5000 });

        await pressMenu(['Exposures & PPE']);

        await sleep(500);

        automatePPE(async () => {

            try {

            // Response tab

            await pressMenu(['Response', 'Response Info']);

            await sleep(600);

            await pressButton(['Emergent (Immediate Response)', 'No Lights or Sirens']);

            await pressButton(['Single', 'Not Recorded']);

            await setMultiselectByLabel('Type of Dispatch Delay', 'None/No Delay');

            await setMultiselectByLabel('Type of Response Delay', 'None/No Delay');

            await pressButton(['Yes, Unknown if Pre-Arrival Instructions Given']);

            if (config.emdCode) await setInput('EMD Determinant Code', config.emdCode);

            if (config.dispatchPriority) await setDropdownByLabel('Dispatch Priority (Patient Acuity)', config.dispatchPriority);

            await setDropdownByLabel('Vehicle Dispatch Location', SETTINGS.dispatchLocation);

            if (config.dispatchReason) await setDropdownByLabel('Dispatch Reason', config.dispatchReason);



            // Transport tab

            await pressMenu(['Transport', 'Transport Info']);

            await sleep(600);

            await sharedTransportInfoTab(config);



            showStatusBanner('done', 'MEFIRS Filler: Non-Emergent to ' + SETTINGS.destinationShort + ' complete');

            hideStatusBanner(4000);

            } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

        });

        } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

    });

}



// ─── Workflow: Lift Assist ─────────────────────────────────────────────────────



function liftAssist() {

    clearAutomatedFields();

    showStatusBanner('running', 'MEFIRS Filler: Running Lift Assist...');

    showInitialConfigPopup(async (config) => {

        try {

        await pressMenu(['Start Up', 'Start-Up', 'Responding Unit Information']);

        await sleep(600);



        // Start-Up tab — Non-Patient Incident has no Crew/Transport Disposition

        await setDropdownByLabel('Type of Service Requested', 'Emergency Response (Primary Response Area)');

        await pressButton(['Non-Patient Incident (Not Otherwise Listed)']);

        await pressMenu(['Exposures & PPE']);

        await sleep(500);

        automatePPE(async () => {

            try {

            // Response tab

            await pressMenu(['Response', 'Response Info']);

            await sleep(600);

            await pressButton(['Emergent (Immediate Response)', 'No Lights or Sirens']);

            await pressButton(['Single', 'Not Recorded']);

            await setMultiselectByLabel('Type of Dispatch Delay', 'None/No Delay');

            await setMultiselectByLabel('Type of Response Delay', 'None/No Delay');

            await pressButton(['Yes, Unknown if Pre-Arrival Instructions Given']);

            if (config.emdCode) await setInput('EMD Determinant Code', config.emdCode);

            if (config.dispatchPriority) await setDropdownByLabel('Dispatch Priority (Patient Acuity)', config.dispatchPriority);

            await setDropdownByLabel('Vehicle Dispatch Location', SETTINGS.dispatchLocation);

            if (config.dispatchReason) await setDropdownByLabel('Dispatch Reason', config.dispatchReason);



            // Billing (no transport for lift assist)

            await pressMenu(['Billing Information']);

            await sleep(400);

            await setDropdownByLabel('Primary Method of Payment', 'No Insurance Identified');

            await patientTab(config);



            showStatusBanner('done', 'MEFIRS Filler: Lift Assist complete');

            hideStatusBanner(4000);

            } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

        });

        } catch (e) { warn('Error: ' + e.message); showStatusBanner('error', 'MEFIRS Filler: Error - ' + e.message); hideStatusBanner(8000); }

    });

}



// ─── Patient Tab ───────────────────────────────────────────────────────────────



async function patientTab(config) {

    await pressMenu(['Patient', 'Patient Info', 'Patient Information']);

    await sleep(500);

    await pressButton(['Not Recorded']);  // Veteran Status

    await setDropdownByLabel('Alternate Home Residence', 'No');

    if (config.isSameAddress) {

        await pressButton(['Patient Address Same as Incident Address']);

        await sleep(700);

        await pressButton(['Find a Repeat Patient']);

    }

}



// ─── Button Injection ──────────────────────────────────────────────────────────



function buttonWatcher() {

    const fns = [callEmergentMaineGeneral, callNonEmergentMaineGeneral, liftAssist];

    const names = [

        'Emergent to ' + SETTINGS.destinationShort,

        'Non-Emergent to ' + SETTINGS.destinationShort,

        'Lift Assist'

    ];



    function tryAddButtons() {

        const saveButton = Array.from(document.querySelectorAll('button, .button-control'))

            .find(el => cleanText(el.textContent) === 'Save' && el.offsetParent !== null);

        if (!saveButton) return;



        const parent = saveButton.parentElement;

        if (parent.querySelector('.mefirs-filler-btn-group')) return;



        const btnGroup = document.createElement('div');

        btnGroup.className = 'mefirs-filler-btn-group';

        btnGroup.style.cssText = 'display:inline-flex;flex-wrap:nowrap;margin-left:10px;vertical-align:middle;';



        for (let i = 0; i < fns.length; i++) {

            const btn = document.createElement('button');

            btn.className = saveButton.className + ' mefirs-filler-btn';

            btn.textContent = names[i];

            btn.style.cssText = 'margin-left:5px;background-color:#d9534f;color:white;white-space:nowrap;';

            btn.addEventListener('click', fns[i]);

            btnGroup.appendChild(btn);

        }

        parent.appendChild(btnGroup);

        log('Buttons injected next to Save');

    }



    tryAddButtons();

    const observer = new MutationObserver(tryAddButtons);

    observer.observe(document.body, { childList: true, subtree: true });

}



// ─── Field Watcher & Keyboard Shortcuts ───────────────────────────────────────



function fieldWatcher() {

    function attachShortcuts(field) {

        field.addEventListener('keydown', function(event) {

            if (event.key === 'Tab') {

                event.preventDefault();

                const [start, end] = searchDDS(field);

                if (start !== -1) field.setSelectionRange(start, end);

            }

            if (event.ctrlKey && event.key === 'p') {

                event.preventDefault();

                const text = field.value;

                const from = field.selectionStart;

                const pos  = text.slice(from).search(/[.\n:]/);

                if (pos !== -1) field.setSelectionRange(from, from + pos + 1);

            }

        });

        log('Keyboard shortcuts attached to field #' + field.id);

    }



    const existing = document.getElementById('73533');

    if (existing) { attachShortcuts(existing); return; }



    const observer = new MutationObserver(() => {

        const field = document.getElementById('73533');

        if (field) { observer.disconnect(); attachShortcuts(field); }

    });

    observer.observe(document.body, { childList: true, subtree: true });

}



function searchDDS(field) {

    const idx = field.value.search('DDS');

    if (idx === -1) return [-1, -1];

    let end = idx;

    const stops = [' ', '.', '\n'];

    while (end < field.value.length && !stops.includes(field.value[end])) end++;

    return [idx, end];

}



// ─── Init ──────────────────────────────────────────────────────────────────────



chrome.storage.sync.get(SETTINGS, (saved) => {

    Object.assign(SETTINGS, saved);

    log('Settings loaded: dispatch=' + SETTINGS.dispatchLocation +

        ', dest=' + SETTINGS.destinationShort);

    buttonWatcher();

    fieldWatcher();

});"
