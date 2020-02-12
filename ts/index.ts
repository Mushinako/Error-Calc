"use strict";

// Ignore. Typescript nuiances
interface MathJax {
    typeset?(): void,
    loader: Record<string, string[]>,
    tex: Record<string, Record<string, string[]>>
}

interface Materialize {
    AutoInit(): void,
    FormSelect: {
        init(elems: any[], options?: Record<string, any>): void;
    }
}

declare var MathJax: MathJax;
declare const M: Materialize;

// Global variables
let editDiv: HTMLDivElement;
let formDiv: HTMLDivElement;

// Operations
const copers: Record<string, () => void> = {
    '+/-': cOperOnClick(['+', '-'], calcAddMin),
    '×/÷': cOperOnClick(['×', '÷'], calcMulDiv),
};
const nopers: Record<string, () => void> = {
    'ln': nOperOnClick('ln', calcLn),
    'log': nOperOnClick('log', calcLog),
    'e^': nOperOnClick('e^', calcExp),
    '10^': nOperOnClick('10^', calc10xp)
};
const topers: Record<string, () => void> = {
    'a^x': tOperOnClick(['a', 'x'], calcPwr)
}

// Supported browsers
const supportedBrowsers: string[] = [
    'Google Chrome 54+',
    'Mozilla Firefox 47+',
    'Apple Safari 11+',
    'Microsoft Edge 14+',
    'Opera 41+'
];

/**
 * Create input element and its div wrapper
 * 
 * @param   {string} ph           - Name of input, either 'Avg' or 'SD'
 * @returns {HTMLDivElement}      - The outer wrapper
 * @returns {HTMLInputElement}    - The inner input
 */
function inpDiv(ph: string): [HTMLDivElement, HTMLInputElement] {
    // Create outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    // Create inner input
    const inp: HTMLInputElement = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    if (ph === 'Avg') inp.pattern += '|Ans\\d+';
    // Append and return
    div.appendChild(inp);
    return [div, inp];
}

/**
 * Create div that holds both inputs
 * 
 * @returns {HTMLDivElement} - As described
 */
function inpsDiv(): HTMLDivElement {
    // Create outer div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's10');
    // Average input div
    const [avgDiv, avgInp]: [HTMLDivElement, HTMLInputElement] = inpDiv('Avg');
    div.appendChild(avgDiv);
    // pm
    const pmDiv: HTMLDivElement = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    const pmBtn: HTMLAnchorElement = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    div.appendChild(pmDiv);
    // SD input div
    const [sdDiv, sdInp]: [HTMLDivElement, HTMLInputElement] = inpDiv('SD');
    div.appendChild(sdDiv);
    // Check inputs
    avgInp.addEventListener('input', (): void => {
        if (avgInp.value.toLowerCase() === 'a') {
            avgInp.value = 'Ans';
        }
        if (avgInp.value.charAt(0) === 'A') {
            sdInp.disabled = true;
        } else {
            sdInp.disabled = false;
        }
    });
    avgInp.addEventListener('keydown', (ev: KeyboardEvent): void => {
        if (avgInp.value === 'Ans' && ev.key === 'Backspace') {
            avgInp.value = '';
        }
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
    const outDiv: HTMLDivElement = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    // Select
    const selDiv: HTMLDivElement = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    const sel: HTMLSelectElement = document.createElement('select');
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
    selDiv.appendChild(sel);
    outDiv.appendChild(selDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    // Remove btn
    const remDiv: HTMLDivElement = document.createElement('div');
    remDiv.classList.add('col', 's1');
    if (!firstRow) {
        const remBtn: HTMLAnchorElement = document.createElement('a');
        remBtn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', (): void => {
            outDiv.parentNode!.removeChild(outDiv);
        });
        remDiv.appendChild(remBtn);
    }
    outDiv.appendChild(remDiv);
    // Return
    return outDiv;
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
    const outDiv: HTMLDivElement = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    // Func
    const funcDiv: HTMLDivElement = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn: HTMLAnchorElement = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    // Return, skipping the delete button
    return outDiv;
}

/**
 * Create a row div for t-operations (a^x), featuring 2 rows, each with a
 *   variable name, a pair of inputs, and **NO** button to delete the row

 * @param   {string[]} rows    - The variable names
 * @returns {HTMLDivElement[]} - The 2 rows
 */
function tOperInputDiv(rows: string[]): HTMLDivElement[] {
    // First row
    const baseRow: HTMLDivElement = nOperInputDiv(rows[0]);
    // Second row
    const outDiv: HTMLDivElement = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    // Func
    const funcDiv: HTMLDivElement = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn: HTMLAnchorElement = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = rows[1];
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    // Create outer input div
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's10');
    // Exponent input div
    // Create outer div
    const expDiv: HTMLDivElement = document.createElement('div');
    expDiv.classList.add('input-field', 'col', 's5');
    // Create inner input
    const expInp: HTMLInputElement = document.createElement('input');
    expInp.classList.add('validate');
    expInp.placeholder = 'Exp';
    expInp.type = 'text';
    expInp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    // Append
    expDiv.appendChild(expInp);
    div.appendChild(expDiv);
    outDiv.appendChild(div);
    // Check inputs
    expInp.addEventListener('input', (): void => {
        if (expInp.value.charAt(0).toLowerCase() === 'a') {
            alert('Exponent cannot be a previous answer!');
            expInp.value = '';
        }
    });
    return [baseRow, outDiv];
}

/**
 * The big blue 'Calculate' button
 * 
 * @param   {(): void} calc     - Function to be run when clicked. Dependent
 *                                on the action selected
 * @returns {HTMLAnchorElement} - The said button
 */
function calcBtn(calc: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-light-blue', 'btn', 'blue');
    btn.id = 'calc';
    btn.textContent = 'Calculate';
    btn.addEventListener('click', calc);
    return btn;
}

/**
 * Create the function for the c-operations (+/-/×/÷) to be run when its
 *   corresponding method button is hit
 * 
 * @param   {string[]} choices - The choices in the <select> 
 * @param   {(): void} calc    - The function to be run when 'Calculate'
 *                               is clicked
 * @returns {(): void}         - The function to be run when the method
 *                               button is clicked
 */
function cOperOnClick(choices: string[], calc: () => void): () => void {
    return (): void => {
        // Clear and re-init form
        while (editDiv.hasChildNodes()) editDiv.removeChild(editDiv.lastChild!);
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        formDiv.appendChild(cOperInputDiv(choices, true));
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Add row button
        const addRowBtn: HTMLAnchorElement = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'waves-teal', 'btn', 'green');
        addRowBtn.id = 'add-row';
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (): void => {
            formDiv.insertBefore(cOperInputDiv(choices, false), formDiv.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        // Calculate button
        btnsDiv.appendChild(calcBtn(calc));
        // Append and init
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
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
 * @returns {(): void}      - The function to be run when the method button
 *                            is clicked
 */
function nOperOnClick(func: string, calc: () => void): () => void {
    return (): void => {
        // Clear and re-init form
        while (editDiv.hasChildNodes()) editDiv.removeChild(editDiv.lastChild!);
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        formDiv.appendChild(nOperInputDiv(func));
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate button
        btnsDiv.appendChild(calcBtn(calc));
        // Append
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
    };
}

/**
 * Create the function for the t-operations (a^x) to be run when the its
 *   corresponding method button is hit
 *
 * @param   {string[]} rows - The variable names
 * @param   {(): void} calc - The function to be run when 'Calculate' is
 *                              clicked
 * @returns {(): void}      - The function to be run when the method button
 *                            is clicked
 */
function tOperOnClick(rows: string[], calc: () => void): () => void {
    return (): void => {
        // Clear and re-init form
        while (editDiv.hasChildNodes()) editDiv.removeChild(editDiv.lastChild!);
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        for (const div of tOperInputDiv(rows)) formDiv.appendChild(div);
        // Button row wrapper
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate button
        btnsDiv.appendChild(calcBtn(calc));
        // Append
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
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
 * @param   {Record<string, (): void>} opers - Operations and their function
 *                                             to be run when their method
 *                                             button is clicked
 */
function setBtns(opers: Record<string, () => void>): void {
    // Add a "|"
    const div: HTMLDivElement = <HTMLDivElement>document.getElementById('btns');
    div.appendChild(document.createTextNode('|'));
    // For each operation, add a button and a "|"
    for (const [name, op] of Object.entries(opers)) {
        const btn: HTMLAnchorElement = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
    }
}

/**
 * Parse MathJax, ignoring errors
 */
function parse(): void {
    try {
        MathJax.typeset!();
    } catch (e) {
        console.log(e);
    }
}

/**
 * Display Ans from localStorage, also set counter
 */
function displayAns(): void {
    // Check if localStorage is empty
    if (!Object.keys(window.localStorage).length) {
        ansCounter = 1;
        return;
    }
    // List of Ans IDs present
    let ids: number[] = [];
    // Clear and reassemble table
    while (formDiv.hasChildNodes()) formDiv.removeChild(formDiv.lastChild!);
    // const tbl: HTMLDivElement = document.createElement('div');
    // // Table header
    // const thead: HTMLDivElement = document.createElement('div');
    // const titles: string[] = ['Ans', 'Formula', 'Result'];
    const tbl: HTMLTableElement = document.createElement('table');
    tbl.classList.add('highlight', 'responsive-table', 'centered');
    // Table header
    const thead: HTMLTableSectionElement = document.createElement('thead');
    const trHead: HTMLTableRowElement = document.createElement('tr');
    for (const title of ['Ans', 'Formula', 'Result', '']) {
        const th: HTMLTableHeaderCellElement = document.createElement('th');
        th.textContent = title;
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    tbl.appendChild(thead);
    // Table body
    const tbody: HTMLTableSectionElement = document.createElement('tbody');
    for (const [ans, data] of Object.entries(window.localStorage).sort((a: [string, any], b: [string, any]): number => +a[0].slice(3) - +b[0].slice(3))) {
        // Register ID
        ids.push(parseInt(ans.slice(3)));
        // Parse from localStorage
        const [form, avg, sd]: [string, string, string] = JSON.parse(data);
        const formStr: string = `\\(${form}\\)`;
        const resStr: string = `\\({\\color{red} ${avg}}\\pm{\\color{blue} ${sd}}\\)`;
        const tr: HTMLTableRowElement = document.createElement('tr');
        for (const item of [ans, formStr, resStr]) {
            const td: HTMLTableCellElement = document.createElement('td');
            td.textContent = item;
            tr.appendChild(td);
        }
        // Remove button
        const td: HTMLTableCellElement = document.createElement('td');
        const btn: HTMLAnchorElement = document.createElement('a');
        btn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        btn.textContent = '×';
        btn.addEventListener('click', (): void => {
            window.localStorage.removeItem(ans);
            if (Object.keys(window.localStorage).length) tbody.removeChild(tr);
            else formDiv.removeChild(tbl);
        });
        td.appendChild(btn);
        tr.appendChild(td);
        // Append row to body
        tbody.appendChild(tr);
    }
    // Ensure no overlapping ID
    ansCounter = Math.max(...ids) + 1;
    // Append and parse MathJax
    tbl.appendChild(tbody);
    formDiv.appendChild(tbl);
    parse();
}


document.addEventListener('DOMContentLoaded', (): void => {
    // Set output
    formDiv = <HTMLDivElement>document.getElementById('form');
    if (!Object.entries || !window.localStorage) {
        const noSupportP: HTMLParagraphElement = document.createElement('p');
        noSupportP.textContent = 'Your browser is not supported. Please use:'
        formDiv.appendChild(noSupportP);
        const supportedList: HTMLUListElement = document.createElement('ul');
        for (const b of supportedBrowsers) {
            const bLI: HTMLLIElement = document.createElement('li');
            bLI.textContent = b;
            supportedList.appendChild(bLI);
        }
        formDiv.appendChild(supportedList);
        return;
    }
    displayAns();
    // Set input
    editDiv = <HTMLDivElement>document.getElementById('edit');
    // Set buttons
    setBtns(copers);
    setBtns(nopers);
    setBtns(topers);
    // Keyboard events
    document.addEventListener('keypress', (ev: KeyboardEvent): void => {
        if (ev.key === 'Enter' || ev.key === '\n') {
            if (ev.shiftKey) {
                const addRowBtn: HTMLElement | null = document.getElementById('add-row');
                if (addRowBtn !== null) (<HTMLAnchorElement>addRowBtn).click();
            } else (<HTMLAnchorElement>document.getElementById('calc')).click();
        }
    });
    // Init +/-
    (<HTMLAnchorElement>document.getElementById('btns')!.childNodes[1]).click();
});
