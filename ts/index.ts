"use strict";

interface MathJax {
    typeset(): void
}

declare const MathJax: MathJax;

var editDiv: HTMLDivElement;
var formDiv: HTMLDivElement;
var cbtns: HTMLAnchorElement[];
var nbtns: HTMLAnchorElement[];

const copers: Record<string, [() => void, number]> = {
    '+/-': [cOperOnClick(['+', '-']), 0],
    '×/÷': [cOperOnClick(['×', '÷']), 0],
};
const nopers: Record<string, [() => void, number]> = {
    'ln': [() => { }, 0],
    'log': [() => { }, 0],
    'e^': [() => { }, 0],
    '10^': [() => { }, 0],
    'a^b': [() => { }, 0]
}


// function createBtnFunc(): () => void {
//     return () => { };
// }


function cOperInputDiv(): void { }


function cOperOnClick(choices: string[]): () => void {
    const form: HTMLFormElement = document.createElement('form');
    return () => { };
}


function createOpBtn(name: string, op: [() => void, number]): HTMLAnchorElement {
    const [clkFunc, num] = op;
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('bttn');
    btn.addEventListener('click', clkFunc);
    return btn;
}


function setBtns(opers: Record<string, [() => void, number]>): HTMLAnchorElement[] {
    const div: HTMLDivElement = <HTMLDivElement>document.getElementById('btns');
    div.appendChild(document.createTextNode('|'));
    let btns: HTMLAnchorElement[] = [];
    for (const [name, op] of Object.entries(opers)) {
        const btn: HTMLAnchorElement = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
        btns.push(btn);
    }
    return btns;
}


function parse(): void {
    try {
        MathJax.typeset();
    } catch (e) {
        console.log(e);
    }
}


document.addEventListener('DOMContentLoaded', (): void => {
    // Set buttons
    cbtns = setBtns(copers);
    nbtns = setBtns(nopers);
    // Set output
    formDiv = <HTMLDivElement>document.getElementById('form');
});
