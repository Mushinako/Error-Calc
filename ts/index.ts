"use strict";

interface MathJax {
    typeset(): void
}

interface HTMLTextAreaElement {
    'data-gramm': boolean
}

declare const MathJax: MathJax;

var formInp: HTMLTextAreaElement;
var retDiv: HTMLDivElement;
const opers: Record<string, string> = {
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


function createOpBtn(name: string, op: string): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.addEventListener('click', (): void => {
        const cursorPos: number = <number>formInp.selectionStart;
        formInp.value += op;
    });
    return btn;
}


function parseInp(): void {
    retDiv.innerText = `\\(${formInp.value}\\)`;
    MathJax.typeset();
}


document.addEventListener('DOMContentLoaded', (): void => {
    // Set input
    retDiv = <HTMLDivElement>document.getElementById('form');
    const formDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('inp');
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
    const btnsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('btns');
    btnsDiv.classList.add('col', 's12');
    btnsDiv.appendChild(document.createTextNode('|'));
    for (const [name, op] of Object.entries(opers)) {
        const btn: HTMLAnchorElement = createOpBtn(name, op);
        btnsDiv.appendChild(btn);
        btnsDiv.appendChild(document.createTextNode('|'));
    }
});