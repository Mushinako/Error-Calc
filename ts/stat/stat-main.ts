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
    }
    // No shift allowed
    if (ev.shiftKey) return;
}


function statInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    // Clear input div
    clearChildren(inDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('One-Variable Statistics');
    inDiv.appendChild(ttlElmt);
    // Set input
    const statInpOutDiv: HTMLDivElement = document.createElement('div');
    inDiv.appendChild(statInpOutDiv);
    const statInpForm: HTMLFormElement = document.createElement('form');
    statInpForm.classList.add('row');
    statInpOutDiv.appendChild(statInpForm);
    // Input div
    const statInpDiv: HTMLDivElement = document.createElement('div');
    statInpDiv.classList.add('col', 's12', 'm6');
    statInpForm.appendChild(statInpDiv);
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
    inpDiv.appendChild(statInp);
    // Parsed div
    const statInpDiv2: HTMLDivElement = document.createElement('div');
    statInpDiv2.classList.add('col', 's12', 'm6');
    statInpForm.appendChild(statInpDiv2);
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
    inpDiv2.appendChild(statInp2);
    // Calculate button
    const btnDiv: HTMLDivElement = document.createElement('div');
    btnDiv.classList.add('container', 'row', 'center');
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
    const outputs: Record<string, string> = {
        'n': 'n',
        'xbar': '\\bar{x}',
        's2': 's^{2}',
        's': 's'
    };
    for (const [name, formula] of Object.entries(outputs)) statOutForm.appendChild(createStatOutputDiv(name, formula));
    // Help
    const notes: string[] = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'Input one number on each line',
        'If copying a column of data from excel, directly paste into the input'
    ];
    const shortcuts: Record<string, string> = {
        'Enter': 'New line',
        'Shift+Enter': 'Run calculation'
    };
    const formats: Record<string, string[]> = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32']
    };
    const formatNote: string[] = [
        'All empty lines are ignored',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the \"Parsed\" area'
    ];
    const noteLi: HTMLLIElement = noteGen(notes);
    const shortcutsLi: HTMLLIElement = shortcutGen(shortcuts);
    const formatLi: HTMLLIElement = formatGen(formats, formatNote);
    const helpUl: HTMLUListElement = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    // Init
    parse();
}
