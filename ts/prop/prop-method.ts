"use strict";

/**
 * Error propagation method button functions
 * 
 * - Button onClick
 * - Create buttons
 */

// Mode indicator
let mode: string;

// Operations
const copers: Record<string, () => void> = {
    '+/-': cOperOnClick(['+', '-'], calcAddMin, 'as'),
    '×/÷': cOperOnClick(['×', '÷'], calcMulDiv, 'md'),
};
const nopers: Record<string, () => void> = {
    'ln': nOperOnClick('ln', calcLn, 'ln'),
    'log': nOperOnClick('log', calcLog, 'lg'),
    'e^': nOperOnClick('e^', calcExp, 'ex'),
    '10^': nOperOnClick('10^', calc10xp, '10')
};
const topers: Record<string, () => void> = {
    'a^x': tOperOnClick(['a', 'x'], calcPwr, 'pw')
}

/**
 * Create the function for the c-operations (+/-/×/÷) to be run when its
 *   corresponding method button is hit
 * 
 * @param   {string[]} choices - The choices in the <select> 
 * @param   {(): void} calc    - The function to be run when 'Calculate'
 *                               is clicked
 * @param   {string}   md      - The mode to be set
 * @returns {(): void}         - The function to be run when the method
 *                               button is clicked
 */
function cOperOnClick(choices: string[], calc: () => void, md: string): () => void {
    return (): void => {
        // Set mode
        mode = md;
        // Clear and re-init form
        clearChildren(propInpsDiv);
        const form: HTMLFormElement = document.createElement('form');
        // Inputs
        form.appendChild(cOperInputDiv(choices, true));
        form.appendChild(cOperInputDiv(choices, false));
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Add row button
        const addRowBtn: HTMLAnchorElement = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'btn', 'green');
        addRowBtn.id = 'propaddrow';
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (): void => {
            form.insertBefore(cOperInputDiv(choices, false), form.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        // Calculate button
        btnsDiv.appendChild(createCalcBtn(calc));
        // Append and init
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
        M.AutoInit();
    };
}

/**
 * Create the function for the n-operations (ln/log/e^/10^) to be run when
 *   its corresponding method button is hit
 *
 * @param   {string}   func - Function name 
 * @param   {(): void} calc - The function to be run when 'Calculate' is
 *                            clicked
 * @param   {string}   md   - The mode to be set
 * @returns {(): void}      - The function to be run when the method button
 *                            is clicked
 */
function nOperOnClick(func: string, calc: () => void, md: string): () => void {
    return (): void => {
        // Set mode
        mode = md;
        // Clear and re-init form
        clearChildren(propInpsDiv);
        const form: HTMLFormElement = document.createElement('form');
        // Inputs
        form.appendChild(nOperInputDiv(func));
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate button
        btnsDiv.appendChild(createCalcBtn(calc));
        // Append
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
    };
}

/**
 * Create the function for the t-operations (a^x) to be run when the its
 *   corresponding method button is hit
 *
 * @param   {string[]} rows - The variable names
 * @param   {(): void} calc - The function to be run when 'Calculate' is
 *                              clicked
 * @param   {string}   md   - The mode to be set
 * @returns {(): void}      - The function to be run when the method button
 *                            is clicked
 */
function tOperOnClick(rows: string[], calc: () => void, md: string): () => void {
    return (): void => {
        // Set mode
        mode = md;
        // Clear and re-init form
        clearChildren(propInpsDiv);
        const form: HTMLFormElement = document.createElement('form');
        // Inputs
        for (const div of tOperInputDiv(rows)) form.appendChild(div);
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate button
        btnsDiv.appendChild(createCalcBtn(calc));
        // Append
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
    };
}

/**
 * Create a method button
 * 
 * @param   {string}   name     - Name of operation
 * @param   {(): void} op       - Function of operation
 * @returns {HTMLAnchorElement} - The button as described
 */
function createOpBtn(name: string, op: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.textContent = name;
    btn.addEventListener('click', op);
    return btn;
}

/**
 * Create a block of method buttons
 * 
 * @param {Record<string, (): void>} opers - Operations and their function
 *                                           to be run when their method
 *                                           button is clicked
 * @param {HTMLDivElement}           div   - The div to append buttons into
 */
function setBtns(opers: Record<string, () => void>, div: HTMLDivElement): void {
    // Add a "|"
    div.appendChild(document.createTextNode('|'));
    // For each operation, add a button and a "|"
    for (const [name, op] of Object.entries(opers)) {
        const btn: HTMLAnchorElement = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
    }
}

