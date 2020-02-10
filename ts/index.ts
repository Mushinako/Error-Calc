"use strict";

interface MathJax {
    typeset(): void
}

declare const MathJax: MathJax;

var formDiv: HTMLDivElement;
var cbtns: HTMLAnchorElement[];
var nbtns: HTMLAnchorElement[];

const copers: Record<string, [string, number]> = {
    '+': ['+', 1],
    '-': ['-', 1],
    '×': ['\\times', 6],
    '÷': ['\\frac{}{}', 6]
};
const nopers: Record<string, [string, number]> = {
    'ln': ['\\ln{}', 4],
    'log': ['\\log{}', 5],
    'e^': ['e^{}', 3],
    '10^': ['10^{}', 4],
    'a^b': ['{}^{}', 1]
}


function createBtnFunc(): () => void {
    return () => { };
}


function createOpBtn(name: string, op: [string, number]): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('button');
    btn.addEventListener('click', (): void => { });
    return btn;
}


function setBtns(opers: Record<string, [string, number]>): HTMLAnchorElement[] {
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
