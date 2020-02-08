"use strict";
var formInp;
const opers = {
    '+': '',
    '-': '',
    '×': '',
    '÷': '',
    'ln': '',
    'log': '',
    'e^': '',
    '10^': '',
    'a^b': ''
};
function createOpBtn(name, op) {
    const btn = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.addEventListener('click', () => { });
    return btn;
}
document.addEventListener('DOMContentLoaded', () => {
    // Set input
    const formDiv = document.getElementById('formula');
    formDiv.classList.add('col', 's12');
    formInp = document.createElement('input');
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
