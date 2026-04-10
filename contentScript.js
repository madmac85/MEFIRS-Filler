console.log('[MEFIRS Filler] Script loaded: ' + window.location.href);

const SETTINGS = {
    dispatchLocation: 'Augusta Fire Department',
    destinationFull: 'MAINEGENERAL MEDICAL CENTER - ALFOND CENTER FOR HEALTH',
    destinationShort: 'MaineGeneral'
};

const MASTER_TABLE = [
    { id: 1, element: 'EMS Shift', section: 'Run Form Start', panel: 'Responding Crew', priority: 1 },
    { id: 19, element: 'Type of Service Requested', section: 'Run Form Start', panel: 'Dispositions', priority: 1 },
    { id: 21, element: 'Unit Disposition', section: 'Run Form Start', panel: 'Dispositions', priority: 2, isButton: true },
    { id: 22, element: 'Incident Disposition', section: 'Run Form Start', panel: 'Dispositions', priority: 3, isButton: true },
    { id: 23, element: 'Patient Care', section: 'Run Form Start', panel: 'Dispositions', priority: 4, isButton: true },
    { id: 24, element: 'Crew Care Disposition', section: 'Run Form Start', panel: 'Dispositions', priority: 5, isButton: true },
    { id: 25, element: 'Transport Disposition', section: 'Run Form Start', panel: 'Dispositions', priority: 6, isButton: true },
    { id: 28, element: 'Dispatch Reason', section: 'Dispatch', panel: 'Dispatch Information', priority: 1 },
    { id: 30, element: 'Dispatch Priority (Patient Acuity)', section: 'Dispatch', panel: 'Dispatch Information', priority: 2 },
    { id: 32, element: 'EMD Determinant Code', section: 'Dispatch', panel: 'Dispatch Information', priority: 3 },
    { id: 50, element: 'EMS Agency Number', section: 'Dispatch', panel: 'Agency Information', priority: 4 },
    { id: 59, element: 'Response Mode to Scene', section: 'Response', panel: 'Response To Scene', priority: 1 },
    { id: 64, element: 'Type of Dispatch Delay', section: 'Response', panel: 'All Delays', priority: 2 },
    { id: 66, element: 'Type of Response Delay', section: 'Response', panel: 'All Delays', priority: 3 },
    { id: 107, element: 'Is Patient Homeless?', section: 'Arrival', panel: 'Patient Information', priority: 1 },
    { id: 297, element: 'Number of Patients Transported in this EMS Unit', section: 'Transport', panel: 'Transport Information', priority: 1 },
    { id: 299, element: 'Transport Mode from Scene', section: 'Transport', panel: 'Transport Information', priority: 2 },
    { id: 301, element: 'Destination/Transferred To', section: 'Transport', panel: 'Destination Info', priority: 3 },
    { id: 315, element: 'EMS Professional (Crew Member) ID', section: 'Narrative', panel: 'Exposures & PPE', priority: 1 },
    { id: 316, element: 'Personal Protective Equipment Used', section: 'Narrative', panel: 'Exposures & PPE', priority: 2 },
    { id: 317, element: 'Primary Method of Payment', section: 'Billing Info', panel: 'Insurance Info', priority: 1 }
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cleanText(t) { return (t || '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim(); }

async function waitForElement(selectorOrFn, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = typeof selectorOrFn === 'function' ? selectorOrFn() : document.querySelector(selectorOrFn);
        if (el && el.offsetParent !== null) return el;
        await sleep(100);
    }
    return null;
}

function findFieldContainer(labelName, panelName) {
    const cleanedLabel = cleanText(labelName).toLowerCase();
    const candidates = Array.from(document.querySelectorAll('.single-row-control, .ko-grid-column'))
        .filter(el => cleanText(el.innerText).toLowerCase().includes(cleanedLabel));
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.innerText.length - b.innerText.length);
    return candidates[0];
}

async function navigateTo(section, panel) {
    const sectionNodes = Array.from(document.querySelectorAll('.text-padding, .form-navigation-section-caption-text'));
    const targetSection = sectionNodes.find(n => cleanText(n.textContent).toLowerCase() === section.toLowerCase());
    if (targetSection) {
        targetSection.click();
        await sleep(500);
    }
    const panelNodes = Array.from(document.querySelectorAll('a, span, div, li')).filter(el => el.offsetParent !== null);
    const targetPanel = panelNodes.find(n => cleanText(n.textContent).toLowerCase() === panel.toLowerCase() && n.textContent.length < 50);
    if (targetPanel) {
        targetPanel.click();
        await sleep(500);
    }
}

async function fillField(field, value) {
    if (!value) return;
    const container = await waitForElement(() => findFieldContainer(field.element, field.panel));
    if (!container) return;

    if (field.isButton) {
        const btn = Array.from(container.querySelectorAll('.smart-list-button-label, .smart-list-button'))
            .find(n => cleanText(n.textContent).toLowerCase() === value.toLowerCase());
        if (btn) btn.click();
    } else {
        const input = container.querySelector('input');
        if (input) {
            input.value = value;
            ['input', 'change', 'blur'].forEach(ev => input.dispatchEvent(new Event(ev, { bubbles: true })));
        } else {
            const trigger = container.querySelector('.ko-dropdown-placeholder, .ko-dropdown-value, .koSingleselect-down-button, .koMultiselect-down-button');
            if (trigger) {
                trigger.click();
                const item = await waitForElement(() => Array.from(document.querySelectorAll('.koSingleselect-dropDownItem, .koMultiselect-dropDownItem, .koSingleselect-dropDownItem span'))
                    .find(n => cleanText(n.textContent).toLowerCase() === value.toLowerCase()));
                if (item) item.click();
            }
        }
    }
    await sleep(300);
}

async function runAutomation(scenarioData) {
    showStatus('running', 'Starting Automation...');
    const sortedSteps = MASTER_TABLE.filter(f => scenarioData[f.element]).sort((a, b) => a.priority - b.priority);
    
    let currentSection = '';
    let currentPanel = '';

    for (const step of sortedSteps) {
        if (step.section !== currentSection || step.panel !== currentPanel) {
            await navigateTo(step.section, step.panel);
            currentSection = step.section;
            currentPanel = step.panel;
        }
        await fillField(step, scenarioData[step.element]);
    }
    showStatus('done', 'Complete');
    setTimeout(hideStatus, 3000);
}

function showStatus(state, text) {
    let banner = document.getElementById('mefirs-status');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'mefirs-status';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;padding:10px;text-align:center;font-family:sans-serif;font-weight:bold;';
        document.body.appendChild(banner);
    }
    banner.textContent = 'MEFIRS: ' + text;
    banner.style.background = state === 'running' ? '#1a73e8' : '#0d9f4f';
    banner.style.color = 'white';
    banner.style.display = 'block';
}

function hideStatus() {
    const banner = document.getElementById('mefirs-status');
    if (banner) banner.style.display = 'none';
}

function injectButtons() {
    const target = Array.from(document.querySelectorAll('button, .button-control'))
        .find(el => cleanText(el.textContent) === 'Save' && el.offsetParent !== null);
    if (!target || target.parentElement.querySelector('.mefirs-btn-group')) return;

    const group = document.createElement('div');
    group.className = 'mefirs-btn-group';
    group.style.display = 'inline-block';

    const btn = document.createElement('button');
    btn.textContent = 'Auto-Fill Emergent';
    btn.style.cssText = 'margin-left:10px;background:#d9534f;color:white;padding:5px 10px;border-radius:4px;border:none;cursor:pointer;';
    btn.onclick = (e) => {
        e.preventDefault();
        runAutomation({
            'Type of Service Requested': 'Emergency Response (Primary Response Area)',
            'Unit Disposition': 'Patient Contact Made',
            'Incident Disposition': 'Patient Evaluated and Care Provided',
            'Patient Care': 'Initiated and Continued Primary Care',
            'Transport Disposition': 'Transport by This EMS Unit (This Crew Only)',
            'Vehicle Dispatch Location': SETTINGS.dispatchLocation,
            'Response Mode to Scene': 'Emergent (Immediate Response)',
            'Type of Dispatch Delay': 'None/No Delay',
            'Type of Response Delay': 'None/No Delay',
            'Number of Patients Transported in this EMS Unit': '1',
            'Transport Mode from Scene': 'Non-Emergent',
            'Destination/Transferred To': SETTINGS.destinationFull,
            'Primary Method of Payment': 'No Insurance Identified'
        });
    };
    group.appendChild(btn);
    target.parentElement.appendChild(group);
}

setInterval(injectButtons, 2000);
