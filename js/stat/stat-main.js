"use strict";
let statInp;
let statInp2;
function keyStat(ev) {
    if (ev.altKey || ev.metaKey || ev.ctrlKey)
        return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            ev.preventDefault();
            statCalc();
        }
    }
    if (ev.shiftKey)
        return;
}
function statInit() {
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    const ttlElmt = createTtl('One-Variable Statistics');
    inDiv.appendChild(ttlElmt);
    const statInpOutDiv = document.createElement('div');
    inDiv.appendChild(statInpOutDiv);
    const statInpForm = document.createElement('form');
    statInpOutDiv.appendChild(statInpForm);
    const statInpsDiv = document.createElement('div');
    statInpsDiv.classList.add('row');
    statInpForm.appendChild(statInpsDiv);
    const statInpDiv = document.createElement('div');
    statInpDiv.classList.add('col', 's12', 'm6');
    statInpsDiv.appendChild(statInpDiv);
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('center', 'col', 's12');
    statInpDiv.appendChild(lblDiv);
    const lblBtn = document.createElement('a');
    lblBtn.classList.add('btn-flat', 'no-click');
    lblBtn.textContent = 'x';
    lblDiv.appendChild(lblBtn);
    const inpDiv = document.createElement('div');
    inpDiv.classList.add('col', 's12', 'input-field');
    statInpDiv.appendChild(inpDiv);
    statInp = document.createElement('textarea');
    statInp.classList.add('materialize-textarea');
    inpDiv.appendChild(statInp);
    const statInpDiv2 = document.createElement('div');
    statInpDiv2.classList.add('col', 's12', 'm6');
    statInpsDiv.appendChild(statInpDiv2);
    const lblDiv2 = document.createElement('div');
    lblDiv2.classList.add('center', 'col', 's12');
    statInpDiv2.appendChild(lblDiv2);
    const lblBtn2 = document.createElement('a');
    lblBtn2.classList.add('btn-flat', 'no-click');
    lblBtn2.textContent = 'Parsed';
    lblDiv2.appendChild(lblBtn2);
    const inpDiv2 = document.createElement('div');
    inpDiv2.classList.add('col', 's12', 'input-field');
    statInpDiv2.appendChild(inpDiv2);
    statInp2 = document.createElement('textarea');
    statInp2.classList.add('materialize-textarea');
    inpDiv2.appendChild(statInp2);
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('container', 'center');
    statInpForm.appendChild(btnDiv);
    btnDiv.appendChild(createCalcBtn(statCalc));
    appendHr(inDiv);
    const statOutOutDiv = document.createElement('div');
    outDiv.appendChild(statOutOutDiv);
    const statOutForm = document.createElement('form');
    statOutOutDiv.classList.add('row');
    statOutOutDiv.appendChild(statOutForm);
    const outputs = {
        'n': 'n',
        'xbar': '\\bar{x}',
        's2': 's^{2}',
        's': 's'
    };
    for (const [name, formula] of Object.entries(outputs))
        statOutForm.appendChild(createStatOutputDiv(name, formula));
    const notes = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'Input one number on each line',
        'If copying a column of data from excel, directly paste into the input'
    ];
    const shortcuts = {
        'Enter': 'New line',
        'Shift+Enter': 'Run calculation'
    };
    const formats = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32']
    };
    const formatNote = [
        'All empty lines are ignored',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the \"Parsed\" area'
    ];
    const noteLi = noteGen(notes);
    const shortcutsLi = shortcutGen(shortcuts);
    const formatLi = formatGen(formats, formatNote);
    const helpUl = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    parse();
    M.AutoInit();
}
