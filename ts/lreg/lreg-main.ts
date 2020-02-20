"use strict";

/**
 * Linear regression main functions
 * 
 * - Initializer
 * - Keyboard shortcuts
 */

// Global variables
let lregInp: HTMLTextAreaElement;
let lregInp2: HTMLTableSectionElement;
let lregInpIntercept: HTMLInputElement;

/**
 * Linear regression keyboard shortcuts
 * 
 * @param {KeyboardEvent} ev - Keyboard event
 */
function keyLreg(ev: KeyboardEvent): void {
    // No Alt, Win/Cmd, or Ctrl allowed
    if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            // Shift+Enter: Run calculation
            ev.preventDefault();
            statCalc();
        }
        return;
    }
    // No shift allowed
    if (ev.shiftKey) return;
    const funcKeys: string[] = ['h', 'j', 'k'];
    const funcI: number = funcKeys.indexOf(ev.key.toLowerCase());
    if (funcI > -1) {
        // h-k: Functions
        ev.preventDefault();
        const btns: HTMLElement[] = ['prop', 'stat', 'lreg'].map((val: string): HTMLElement => <HTMLElement>document.getElementById(val));
        (<HTMLAnchorElement>btns[funcI]).click();
        return;
    }
}

/**
 * Initalization linear regression calculation interface
 */
function lregInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    // Clear input div
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('Linear Regression (1 Regressor)');
    inDiv.appendChild(ttlElmt);
    // Set input
    const inpOutDiv: HTMLDivElement = document.createElement('div');
    inDiv.appendChild(inpOutDiv);
    const inpForm: HTMLFormElement = document.createElement('form');
    inpOutDiv.appendChild(inpForm);
    const inpsDiv: HTMLDivElement = document.createElement('div');
    inpsDiv.classList.add('row');
    inpForm.appendChild(inpsDiv);
    // Input div
    const inpDiv: HTMLDivElement = document.createElement('div');
    inpDiv.classList.add('col', 's12', 'm6');
    inpsDiv.appendChild(inpDiv);
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('center', 'col', 's12');
    inpDiv.appendChild(lblDiv);
    const lblBtn: HTMLAnchorElement = document.createElement('a');
    lblBtn.classList.add('btn-flat', 'no-click');
    lblBtn.textContent = 'x y';
    lblDiv.appendChild(lblBtn);
    // Input textarea
    const inpTextDiv: HTMLDivElement = document.createElement('div');
    inpTextDiv.classList.add('col', 's12', 'input-field');
    inpDiv.appendChild(inpTextDiv);
    lregInp = document.createElement('textarea');
    lregInp.classList.add('materialize-textarea');
    lregInp.spellcheck = false;
    lregInp.addEventListener('input', (): void => {
        // Autofill
        if (lregInp.value.toLowerCase() === 'l') lregInp.value = 'Lin';
    });
    lregInp.addEventListener('keydown', (ev: KeyboardEvent): void => {
        if (lregInp.value === 'Lin' && ev.key === 'Backspace') lregInp.value = '';
    });
    inpTextDiv.appendChild(lregInp);
    // Parsed div
    const inpDiv2: HTMLDivElement = document.createElement('div');
    inpDiv2.classList.add('col', 's12', 'm6');
    inpsDiv.appendChild(inpDiv2);
    // Input table
    const inpTextDiv2: HTMLDivElement = document.createElement('div');
    inpTextDiv2.classList.add('col', 's12');
    inpDiv2.appendChild(inpTextDiv2);
    const tbl = document.createElement('table');
    tbl.classList.add('highlight');
    inpTextDiv2.appendChild(tbl);
    // Header
    const thead: HTMLTableSectionElement = document.createElement('thead');
    tbl.appendChild(thead);
    const tr: HTMLTableRowElement = document.createElement('tr');
    thead.appendChild(tr);
    for (const head of ['x (Parsed)', 'y (Parsed)']) {
        const th: HTMLTableHeaderCellElement = document.createElement('th');
        th.textContent = head;
        tr.appendChild(th);
    }
    // Body
    lregInp2 = document.createElement('tbody');
    tbl.appendChild(lregInp2);
    // Calculate button
    const btnDiv: HTMLDivElement = document.createElement('div');
    btnDiv.classList.add('container', 'center');
    inpForm.appendChild(btnDiv);
    btnDiv.appendChild(createCalcBtn(lregCalc));
    // Append horizontal line
    appendHr(inDiv);
    // Intercept switch
    let intDiv: HTMLDivElement;
    [intDiv, lregInpIntercept] = createSwitch('0 intercept', 'Turn on to fix y-intercept to 0', 12);
    lregInpIntercept.checked = false;
    lregInpIntercept.addEventListener('change', lregCalc);
    inDiv.appendChild(intDiv);
    // Output
    const outOutDiv: HTMLDivElement = document.createElement('div');
    outDiv.appendChild(outOutDiv);
    const outForm: HTMLFormElement = document.createElement('form');
    outOutDiv.classList.add('row');
    outOutDiv.appendChild(outForm);
    const outputsPm: Record<string, string> = {
        'm': 'm',
        'b': 'b'
    };
    for (const [name, formula] of Object.entries(outputsPm)) outForm.appendChild(createLregOutputPmDiv(name, formula));
    // Help
    const notes: string[] = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the table on the right',
        'To recall data or calculate different t\'s without saving a duplicate, type the Ans key (e.g., \"Lin2\") in the input and click calculate',
        'Input two numbers (x and y) on each line, space-separated',
        'If copying two columns of data from excel, directly paste into the input'
    ];
    const shortcuts: Record<string, string> = {
        'Enter': 'New line; Open dropdown; Confirm choice',
        'Shift+Enter': 'Run calculation',
        'Tab': 'Next input/element',
        'Shift+Tab': 'Previous input/element',
        '↓': 'Next dropdown choice',
        '↑': 'Previous dropdown choice',
        'h': 'Change to \"Err Prop\" calculations',
        'j': 'Change to \"1-Var Stat\" calculation',
        'k': 'Change to \"Lin Reg\" calculation (no use)'
    };
    const formats: Record<string, string[]> = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32'],
        'Previous Answers': ['Lin1', 'Lin3', 'Lin15']
    };
    const formatNote: string[] = [
        'All empty lines are ignored',
        'Inputs that do not follow the format may be ignored or incorrectly parsed'
    ];
    const noteLi: HTMLLIElement = noteGen(notes);
    const shortcutsLi: HTMLLIElement = shortcutGen(shortcuts);
    const formatLi: HTMLLIElement = formatGen(formats, formatNote);
    const helpUl: HTMLUListElement = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    // Init
    parse();
    M.AutoInit();
}
