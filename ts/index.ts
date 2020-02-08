"use strict";

var formInp: HTMLInputElement;
const opers: Record<string, string> = {
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


function createOpBtn(name: string, op: string): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.addEventListener('click', (): void => { });
    return btn;
}


document.addEventListener('DOMContentLoaded', (): void => {
    // Set input
    const formDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('formula');
    formDiv.classList.add('col', 's12');
    formInp = document.createElement('input');
    formDiv.appendChild(formInp);
    // Set buttons
    const btnsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('btns');
    btnsDiv.classList.add('col', 's12');
    btnsDiv.appendChild(document.createTextNode('|'));
    for (const [name, op] of Object.entries(opers)) {
        const btn: HTMLAnchorElement = createOpBtn(name, op);
        btnsDiv.appendChild(btn);
        btnsDiv.appendChild(document.createTextNode('|'));
    }
});