"use strict";
var formInp;
var retDiv;
const opers = {
    '+': '+',
    '-': '-',
    '×': '\\times',
    '÷': '\\frac{}{}',
    'ln': '\\ln',
    'log': '\\log',
    'e^': 'e^{}',
    '10^': '10^{}',
    'a^b': '^{}'
};
function createOpBtn(name, op) {
    const btn = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.addEventListener('click', () => {
        const cursorPos = formInp.selectionStart;
        formInp.value += op;
    });
    return btn;
}
function parseInp() {
    retDiv.innerText = `\\(${formInp.value}\\)`;
    MathJax.typeset();
}
document.addEventListener('DOMContentLoaded', () => {
    // Set input
    retDiv = document.getElementById('form');
    const formDiv = document.getElementById('inp');
    formInp = document.createElement('textarea');
    formInp.classList.add('materialize-textarea');
    formInp.autocapitalize = formInp.autocomplete = 'off';
    formInp.spellcheck = formInp['data-gramm'] = false;
    formInp.addEventListener('input', () => {
        retDiv.innerText = `\\(${formInp.value}\\)`;
        MathJax.typeset();
    });
    MathJax.typeset();
    formDiv.appendChild(formInp);
    // Set buttons
    const btnsDiv = document.getElementById('btns');
    btnsDiv.classList.add('col', 's12');
    btnsDiv.appendChild(document.createTextNode('|'));
    for (const [name, op] of Object.entries(opers)) {
        const btn = createOpBtn(name, op);
        btnsDiv.appendChild(btn);
        btnsDiv.appendChild(document.createTextNode('|'));
    }
});
