"use strict";
let statInp;
let statInp2;
let statTDiv;
let statQDiv;
function keyStat(ev) {
    if (ev.altKey || ev.metaKey || ev.ctrlKey)
        return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            ev.preventDefault();
            statCalc();
        }
        return;
    }
    if (ev.shiftKey)
        return;
    const funcKeys = ['h', 'j', 'k'];
    const funcI = funcKeys.indexOf(ev.key.toLowerCase());
    if (funcI > -1) {
        ev.preventDefault();
        const btns = ['prop', 'stat', 'lreg'].map((val) => document.getElementById(val));
        btns[funcI].click();
        return;
    }
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
    statInp.spellcheck = false;
    statInp.addEventListener('input', () => {
        if (statInp.value.toLowerCase() === 'v')
            statInp.value = 'Var';
    });
    statInp.addEventListener('keydown', (ev) => {
        if (statInp.value === 'Var' && ev.key === 'Backspace')
            statInp.value = '';
    });
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
    statInp2.disabled = true;
    inpDiv2.appendChild(statInp2);
    const choicesDiv = document.createElement('div');
    choicesDiv.classList.add('row');
    statInpForm.appendChild(choicesDiv);
    const tDiv = document.createElement('div');
    tDiv.classList.add('col', 's12', 'm6');
    choicesDiv.appendChild(tDiv);
    const tLblDiv = document.createElement('div');
    tLblDiv.classList.add('center', 'col', 's4');
    tDiv.appendChild(tLblDiv);
    const tLblBtn = document.createElement('a');
    tLblBtn.classList.add('btn-flat', 'no-click');
    tLblBtn.textContent = 't 2-tail/1-tail/α';
    tLblDiv.appendChild(tLblBtn);
    statTDiv = document.createElement('div');
    statTDiv.classList.add('input-field', 'col', 's8');
    tDiv.appendChild(statTDiv);
    const tSel = document.createElement('select');
    statTDiv.appendChild(tSel);
    let tFirst = true;
    const tCis = [
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
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (tFirst) {
            opt.selected = true;
            tFirst = false;
        }
        tSel.appendChild(opt);
    }
    const qDiv = document.createElement('div');
    qDiv.classList.add('col', 's12', 'm6');
    choicesDiv.appendChild(qDiv);
    const qLblDiv = document.createElement('div');
    qLblDiv.classList.add('center', 'col', 's4');
    qDiv.appendChild(qLblDiv);
    const qLblBtn = document.createElement('a');
    qLblBtn.classList.add('btn-flat', 'no-click');
    qLblBtn.textContent = 'q 1-tail/α';
    qLblDiv.appendChild(qLblBtn);
    statQDiv = document.createElement('div');
    statQDiv.classList.add('input-field', 'col', 's8');
    qDiv.appendChild(statQDiv);
    const qSel = document.createElement('select');
    statQDiv.appendChild(qSel);
    let qFirst = true;
    const qCis = [
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
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (qFirst) {
            opt.selected = true;
            qFirst = false;
        }
        qSel.appendChild(opt);
    }
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
    const outputsHalf = {
        'n': 'n',
        'xbar': '\\bar{x}',
        's2': 's^{2}',
        's': 's',
        't': 't',
        'ts': 't\\cdot s'
    };
    for (const [name, formula] of Object.entries(outputsHalf))
        statOutForm.appendChild(createStatOutputHalfDiv(name, formula));
    const outputsFull = {
        'q': 'Q\\text{-test}'
    };
    for (const [name, formula] of Object.entries(outputsFull))
        statOutForm.appendChild(createStatOutputFullDiv(name, formula));
    const notes = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the \"Parsed\" area',
        'To recall data or calculate different t\'s without saving a duplicate, type the Ans key (e.g., \"Var2\") in the input and click calculate',
        'Input one number on each line',
        'If copying a column of data from excel, directly paste into the input'
    ];
    const shortcuts = {
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
    const formats = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32']
    };
    const formatNote = [
        'All empty lines are ignored',
        'Inputs that do not follow the format may be ignored or incorrectly parsed'
    ];
    const noteLi = noteGen(notes);
    const shortcutsLi = shortcutGen(shortcuts);
    const formatLi = formatGen(formats, formatNote);
    const helpUl = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    parse();
    M.AutoInit();
}
