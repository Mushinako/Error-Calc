"use strict";

/**
 * One-variable statistics main functions
 * 
 * - Initializer
 * - Keyboard shortcuts
 */

// Global variables
let statInp: HTMLTextAreaElement;
let statInp2: HTMLTextAreaElement;
let statTDiv: HTMLDivElement;
let statQDiv: HTMLDivElement;

/**
 * One-variable statistics keyboard shortcuts
 * 
 * @param {KeyboardEvent} ev - Keyboard event
 */
function keyStat(ev: KeyboardEvent): void {
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
        // b-m: Functions
        ev.preventDefault();
        const btns: HTMLElement[] = ['prop', 'stat', 'lreg'].map((val: string): HTMLElement => <HTMLElement>document.getElementById(val));
        (<HTMLAnchorElement>btns[funcI]).click();
        return;
    }
}

/**
 * Initialize one-variable statistics calculation interfaces
 */
function statInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    // Clear input div
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('One-Variable Statistics');
    inDiv.appendChild(ttlElmt);
    // Set input
    const statInpOutDiv: HTMLDivElement = document.createElement('div');
    inDiv.appendChild(statInpOutDiv);
    const statInpForm: HTMLFormElement = document.createElement('form');
    statInpOutDiv.appendChild(statInpForm);
    const statInpsDiv: HTMLDivElement = document.createElement('div');
    statInpsDiv.classList.add('row');
    statInpForm.appendChild(statInpsDiv);
    // Input div
    const statInpDiv: HTMLDivElement = document.createElement('div');
    statInpDiv.classList.add('col', 's12', 'm6');
    statInpsDiv.appendChild(statInpDiv);
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('center', 'col', 's12');
    statInpDiv.appendChild(lblDiv);
    const lblBtn: HTMLAnchorElement = document.createElement('a');
    lblBtn.classList.add('btn-flat', 'no-click');
    lblBtn.textContent = 'x';
    lblDiv.appendChild(lblBtn);
    // Input textarea
    const inpDiv: HTMLDivElement = document.createElement('div');
    inpDiv.classList.add('col', 's12', 'input-field');
    statInpDiv.appendChild(inpDiv);
    statInp = document.createElement('textarea');
    statInp.classList.add('materialize-textarea');
    statInp.spellcheck = false;
    statInp.addEventListener('input', (): void => {
        // Autofill
        if (statInp.value.toLowerCase() === 'v') statInp.value = 'Var';
    });
    statInp.addEventListener('keydown', (ev: KeyboardEvent): void => {
        if (statInp.value === 'Var' && ev.key === 'Backspace') statInp.value = '';
    });
    inpDiv.appendChild(statInp);
    // Parsed div
    const statInpDiv2: HTMLDivElement = document.createElement('div');
    statInpDiv2.classList.add('col', 's12', 'm6');
    statInpsDiv.appendChild(statInpDiv2);
    // Label
    const lblDiv2: HTMLDivElement = document.createElement('div');
    lblDiv2.classList.add('center', 'col', 's12');
    statInpDiv2.appendChild(lblDiv2);
    const lblBtn2: HTMLAnchorElement = document.createElement('a');
    lblBtn2.classList.add('btn-flat', 'no-click');
    lblBtn2.textContent = 'Parsed';
    lblDiv2.appendChild(lblBtn2);
    // Input textarea
    const inpDiv2: HTMLDivElement = document.createElement('div');
    inpDiv2.classList.add('col', 's12', 'input-field');
    statInpDiv2.appendChild(inpDiv2);
    statInp2 = document.createElement('textarea');
    statInp2.classList.add('materialize-textarea');
    statInp2.disabled = true;
    inpDiv2.appendChild(statInp2);
    // Choices
    const choicesDiv: HTMLDivElement = document.createElement('div');
    choicesDiv.classList.add('row');
    statInpForm.appendChild(choicesDiv);
    // T-test
    const tDiv: HTMLDivElement = document.createElement('div');
    tDiv.classList.add('col', 's12', 'm6');
    choicesDiv.appendChild(tDiv);
    // T-test label
    const tLblDiv: HTMLDivElement = document.createElement('div');
    tLblDiv.classList.add('center', 'col', 's4');
    tDiv.appendChild(tLblDiv);
    const tLblBtn: HTMLAnchorElement = document.createElement('a');
    tLblBtn.classList.add('btn-flat', 'no-click');
    tLblBtn.textContent = 't 2-tail/1-tail/α';
    tLblDiv.appendChild(tLblBtn);
    // T-test choice
    statTDiv = document.createElement('div');
    statTDiv.classList.add('input-field', 'col', 's8');
    tDiv.appendChild(statTDiv);
    const tSel: HTMLSelectElement = document.createElement('select');
    statTDiv.appendChild(tSel);
    let tFirst: boolean = true;
    const tCis: string[] = [
        '50.00%/75.00%/0.2500',
        '60.00%/80.00%/0.2000',
        '70.00%/85.00%/0.1500',
        '80.00%/90.00%/0.1000',
        '90.00%/95.00%/0.0500',
        '95.00%/97.50%/0.0250',
        '98.00%/99.00%/0.0100',
        '99.00%/99.50%/0.0050',
        '99.80%/99.90%/0.0010',
        '99.90%/99.95%/0.0005'
    ];
    for (const c of tCis) {
        const opt: HTMLOptionElement = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (tFirst) {
            opt.selected = true;
            tFirst = false;
        }
        tSel.appendChild(opt);
    }
    // Q-test
    const qDiv: HTMLDivElement = document.createElement('div');
    qDiv.classList.add('col', 's12', 'm6');
    choicesDiv.appendChild(qDiv);
    // Q-test label
    const qLblDiv: HTMLDivElement = document.createElement('div');
    qLblDiv.classList.add('center', 'col', 's4');
    qDiv.appendChild(qLblDiv);
    const qLblBtn: HTMLAnchorElement = document.createElement('a');
    qLblBtn.classList.add('btn-flat', 'no-click');
    qLblBtn.textContent = 'q 1-tail/α';
    qLblDiv.appendChild(qLblBtn);
    // Q-test choice
    statQDiv = document.createElement('div');
    statQDiv.classList.add('input-field', 'col', 's8');
    qDiv.appendChild(statQDiv);
    const qSel: HTMLSelectElement = document.createElement('select');
    statQDiv.appendChild(qSel);
    let qFirst: boolean = true;
    const qCis: string[] = [
        '75.00%/0.2500',
        '80.00%/0.2000',
        '85.00%/0.1500',
        '90.00%/0.1000',
        '95.00%/0.0500',
        '97.50%/0.0250',
        '99.00%/0.0100',
        '99.50%/0.0050',
        '99.90%/0.0010',
        '99.95%/0.0005'
    ];
    for (const c of qCis) {
        const opt: HTMLOptionElement = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (qFirst) {
            opt.selected = true;
            qFirst = false;
        }
        qSel.appendChild(opt);
    }
    // Calculate button
    const btnDiv: HTMLDivElement = document.createElement('div');
    btnDiv.classList.add('container', 'center');
    statInpForm.appendChild(btnDiv);
    btnDiv.appendChild(createCalcBtn(statCalc));
    // Append horizontal line
    appendHr(inDiv);
    // Output
    const statOutOutDiv: HTMLDivElement = document.createElement('div');
    outDiv.appendChild(statOutOutDiv);
    const statOutForm: HTMLFormElement = document.createElement('form');
    statOutOutDiv.classList.add('row');
    statOutOutDiv.appendChild(statOutForm);
    const outputsHalf: Record<string, string> = {
        'n': 'n',
        'xbar': '\\bar{x}',
        's2': 's^{2}',
        's': 's',
        't': 't',
        'ts': 't\\cdot s'
    };
    for (const [name, formula] of Object.entries(outputsHalf)) statOutForm.appendChild(createStatOutputHalfDiv(name, formula));
    const outputsFull: Record<string, string> = {
        'q': 'Q\\text{-test}'
    };
    for (const [name, formula] of Object.entries(outputsFull)) statOutForm.appendChild(createStatOutputFullDiv(name, formula));
    // Help
    const notes: string[] = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the \"Parsed\" area',
        'To recall data or calculate different t\'s without saving a duplicate, type the Ans key (e.g., \"Var2\") in the input and click calculate',
        'Input one number on each line',
        'If copying a column of data from excel, directly paste into the input'
    ];
    const shortcuts: Record<string, string> = {
        'Enter': 'New line; Open dropdown; Confirm choice',
        'Shift+Enter': 'Run calculation',
        'Tab': 'Next input/element',
        'Shift+Tab': 'Previous input/element',
        '↓': 'Next dropdown choice',
        '↑': 'Previous dropdown choice',
        'h': 'Change to \"Err Prop\" calculations',
        'j': 'Change to \"1-Var Stat\" calculation (no use)',
        'k': 'Change to \"Lin Reg\" calculation'
    };
    const formats: Record<string, string[]> = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32']
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
