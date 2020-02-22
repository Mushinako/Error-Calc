"use strict";

/**
 * Error propagation input functions
 * 
 * - Create inputs
 * - Create switches
 */

/**
 * Create input element and its div wrapper
 * 
 * @param   {string} ph           - Name of input, possibly 'Avg', 'SD', or 'Exp'
 * @returns {HTMLDivElement}      - The outer wrapper
 * @returns {HTMLInputElement}    - The inner input
 */
function createInpDiv(ph: string): [HTMLDivElement, HTMLInputElement] {
    // Create outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    // Create inner input
    const inp: HTMLInputElement = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    if (ph === 'Avg') inp.pattern += '|(Err|Var)\\d+|Lin\\d+(m|b)';
    // Append and return
    div.appendChild(inp);
    return [div, inp];
}

/**
 * Create div that holds both inputs
 * 
 * @returns {HTMLDivElement} - As described
 */
function createInpsDiv(): HTMLDivElement {
    // Create outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's10');
    // Average input div
    const [avgDiv, avgInp]: [HTMLDivElement, HTMLInputElement] = createInpDiv('Avg');
    div.appendChild(avgDiv);
    // pm
    const pmDiv: HTMLDivElement = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    div.appendChild(pmDiv);
    const pmBtn: HTMLAnchorElement = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    // SD input div
    const [sdDiv, sdInp]: [HTMLDivElement, HTMLInputElement] = createInpDiv('SD');
    div.appendChild(sdDiv);
    // Check inputs
    avgInp.addEventListener('input', (): void => {
        // Autofill
        if (avgInp.value.toLowerCase() === 'e') avgInp.value = 'Err';
        else if (avgInp.value.toLowerCase() === 'v') avgInp.value = 'Var';
        else if (avgInp.value.toLowerCase() === 'l') avgInp.value = 'Lin';
        if (['E', 'V', 'L'].includes(avgInp.value.charAt(0))) sdInp.disabled = true;
        else sdInp.disabled = false;

    });
    avgInp.addEventListener('keydown', (ev: KeyboardEvent): void => {
        if (['Err', 'Var', 'Lin'].includes(avgInp.value) && ev.key === 'Backspace') avgInp.value = '';
    });
    // Return
    return div;
}

/**
 * Create a row div for c-operations (+/-/×/÷), featuring a selection box,
 *   a pair of inputs, and a button to delete the row for the 2nd row and
 *   above
 * 
 * @param   {string[]} choices  - The choices for the <select>
 * @param   {boolean}  firstRow - Whether this is the first row; if so,
 *                                no delete button
 * @returns {HTMLDivElement}    - The row div
 */
function cOperInputDiv(choices: string[], firstRow: boolean): HTMLDivElement {
    // Row div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('row', 'inps');
    // Select
    const selDiv: HTMLDivElement = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    div.appendChild(selDiv);
    const sel: HTMLSelectElement = document.createElement('select');
    selDiv.appendChild(sel);
    let first: boolean = true;
    for (const c of choices) {
        const opt: HTMLOptionElement = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (first) {
            opt.selected = true;
            first = false;
        }
        sel.appendChild(opt);
    }
    // 2 inputs
    div.appendChild(createInpsDiv());
    // Remove btn
    if (!firstRow) {
        const remDiv: HTMLDivElement = document.createElement('div');
        remDiv.classList.add('col', 's1');
        const remBtn: HTMLAnchorElement = document.createElement('a');
        remBtn.classList.add('waves-effect', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', (): void => {
            div.parentNode!.removeChild(div);
        });
        remDiv.appendChild(remBtn);
        div.appendChild(remDiv);
    }
    // Return
    return div;
}

/**
 * Create a row div for n-operations (ln/log/e^/10^), featuring a function
 *   name, a pair of inputs, and **NO** button to delete the row
 * 
 * @param   {string} func    - Function name
 * @returns {HTMLDivElement} - The row div
 */
function nOperInputDiv(func: string): HTMLDivElement {
    // Row div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('row', 'inps');
    // Func
    const funcDiv: HTMLDivElement = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    div.appendChild(funcDiv);
    const funcBtn: HTMLAnchorElement = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    // 2 inputs
    div.appendChild(createInpsDiv());
    // Return, skipping the delete button
    return div;
}

/**
 * Create a row div for t-operations (a^x), featuring 2 rows, each with a
 *   variable name, a pair of inputs, and **NO** button to delete the row
 * 
 * @param   {string[]} rows    - The variable names
 * @returns {HTMLDivElement[]} - The 2 rows
 */
function tOperInputDiv(rows: string[]): HTMLDivElement[] {
    // First row
    const baseRow: HTMLDivElement = nOperInputDiv(rows[0]);
    // Second row
    const expRow: HTMLDivElement = document.createElement('div');
    expRow.classList.add('row', 'inps');
    // Func
    const funcDiv: HTMLDivElement = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    expRow.appendChild(funcDiv);
    const funcBtn: HTMLAnchorElement = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = rows[1];
    funcDiv.appendChild(funcBtn);
    // Create outer input div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's10');
    expRow.appendChild(div);
    // Exponent input div
    // Create outer div
    const [expDiv, expInp]: [HTMLDivElement, HTMLInputElement] = createInpDiv('Exp');
    div.appendChild(expDiv);
    // Check inputs
    expInp.addEventListener('input', (): void => {
        if (['e', 'v', 'l'].includes(expInp.value.charAt(0).toLowerCase())) {
            alert('Exponent cannot be a previous answer!');
            expInp.value = '';
        }
    });
    return [baseRow, expRow];
}

/**
 * Create 1 switch
 * 
 * @param   {string} lbl     - The label for the switch
 * @param   {string} hint    - Tooltip content
 * @param   {number} width   - Width of the element
 * @returns {HTMLDivElement} - The div containing the switch
 */
function createSwitch(lbl: string, hint: string, width: number): [HTMLDivElement, HTMLInputElement] {
    // Outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('switch', 'center', 'tooltipped', 'col', `s${width}`);
    div.setAttribute('data-position', 'bottom');
    div.setAttribute('data-tooltip', hint);
    // Create label
    const label: HTMLLabelElement = document.createElement('label');
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);
    // Create input
    const inp: HTMLInputElement = document.createElement('input');
    inp.type = 'checkbox';
    label.appendChild(inp);
    // Create span
    const span: HTMLSpanElement = document.createElement('span');
    span.classList.add('lever');
    label.append(span);
    // Return
    return [div, inp];
}

/**
 * Create 2 switches for SigFigs
 * @returns {HTMLDivElement} - The div with the 2 switches
 */
function createSwitches(): HTMLDivElement {
    // Outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('row');
    // SigFig switch
    let sfDiv: HTMLDivElement;
    [sfDiv, sigFigInp] = createSwitch('Calculate SigFigs', 'Turn on to calculate SigFigs', 6);
    sigFigInp.checked = false;
    div.appendChild(sfDiv);
    // SigFig+2 switch
    let sf2Div: HTMLDivElement;
    [sf2Div, sigFig2Inp] = createSwitch('2 more SigFigs', 'Turn on to produce 2 more SigFigs', 6);
    sigFig2Inp.checked = false;
    sigFig2Inp.disabled = true;
    div.appendChild(sf2Div);
    // Event listeners
    sigFigInp.addEventListener('change', (): void => {
        sigFig2Inp.disabled = !sigFigInp.checked;
        displayAns();
    });
    sigFig2Inp.addEventListener('change', (): void => {
        if (!sigFig2Inp.disabled) displayAns();
    });
    // Return
    return div;
}