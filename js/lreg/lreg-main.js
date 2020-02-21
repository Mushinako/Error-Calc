"use strict";
let lregInp;
let lregInp2;
let lregInpIntercept;
function keyLreg(ev) {
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
function lregInit() {
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    const ttlElmt = createTtl('Linear Regression (1 Regressor)');
    inDiv.appendChild(ttlElmt);
    const inpOutDiv = document.createElement('div');
    inDiv.appendChild(inpOutDiv);
    const inpForm = document.createElement('form');
    inpOutDiv.appendChild(inpForm);
    const inpsDiv = document.createElement('div');
    inpsDiv.classList.add('row');
    inpForm.appendChild(inpsDiv);
    const inpDiv = document.createElement('div');
    inpDiv.classList.add('col', 's12', 'm6');
    inpsDiv.appendChild(inpDiv);
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('center', 'col', 's12');
    inpDiv.appendChild(lblDiv);
    const lblBtn = document.createElement('a');
    lblBtn.classList.add('btn-flat', 'no-click');
    lblBtn.textContent = 'x y';
    lblDiv.appendChild(lblBtn);
    const inpTextDiv = document.createElement('div');
    inpTextDiv.classList.add('col', 's12', 'input-field');
    inpDiv.appendChild(inpTextDiv);
    lregInp = document.createElement('textarea');
    lregInp.classList.add('materialize-textarea');
    lregInp.spellcheck = false;
    lregInp.addEventListener('input', () => {
        if (lregInp.value.toLowerCase() === 'l')
            lregInp.value = 'Lin';
    });
    lregInp.addEventListener('keydown', (ev) => {
        if (lregInp.value === 'Lin' && ev.key === 'Backspace')
            lregInp.value = '';
    });
    inpTextDiv.appendChild(lregInp);
    const inpDiv2 = document.createElement('div');
    inpDiv2.classList.add('col', 's12', 'm6');
    inpsDiv.appendChild(inpDiv2);
    const inpTextDiv2 = document.createElement('div');
    inpTextDiv2.classList.add('col', 's12');
    inpDiv2.appendChild(inpTextDiv2);
    const tbl = document.createElement('table');
    tbl.classList.add('highlight');
    inpTextDiv2.appendChild(tbl);
    const thead = document.createElement('thead');
    tbl.appendChild(thead);
    const tr = document.createElement('tr');
    thead.appendChild(tr);
    for (const head of ['x (Parsed)', 'y (Parsed)']) {
        const th = document.createElement('th');
        th.textContent = head;
        tr.appendChild(th);
    }
    lregInp2 = document.createElement('tbody');
    tbl.appendChild(lregInp2);
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('container', 'center');
    inpForm.appendChild(btnDiv);
    btnDiv.appendChild(createCalcBtn(lregCalc));
    appendHr(inDiv);
    let intDiv;
    [intDiv, lregInpIntercept] = createSwitch('0 intercept', 'Turn on to fix y-intercept to 0', 12);
    lregInpIntercept.checked = false;
    lregInpIntercept.addEventListener('change', lregCalc);
    inDiv.appendChild(intDiv);
    const outOutDiv = document.createElement('div');
    outDiv.appendChild(outOutDiv);
    const outForm = document.createElement('form');
    outOutDiv.classList.add('row');
    outOutDiv.appendChild(outForm);
    const outputsHalf = {
        'm': ['m', 'Slope'],
        'sm': ['s_{m}', 'Slope standard error'],
        'b': ['b', 'Y-intercept'],
        'sb': ['s_{b}', 'Y-intercept standard error'],
        'r2': ['r^{2}', 'Coefficient of determination'],
        'sy': ['s_{y}', 'Y-value standard error'],
        'f': ['f', 'F-statistic'],
        'df': ['df', 'Degrees of freedom']
    };
    for (const [name, data] of Object.entries(outputsHalf))
        outForm.appendChild(createOutputHalfDiv(name, ...data));
    const notes = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'This program will try to parse any unrecognizable data. The parsed output will be shown in the table on the right',
        'To recall data without saving a duplicate, type the Ans key (e.g., \"Lin2\") in the input and click \"Calculate\"',
        'Input two numbers (x and y) on each line, space-separated',
        'If copying two columns of data from excel, directly paste into the input'
    ];
    const shortcuts = {
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
    const formats = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32'],
        'Previous Answers': ['Lin1', 'Lin3', 'Lin15']
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
