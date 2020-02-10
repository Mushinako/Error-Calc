"use strict";
var formDiv;
var cbtns;
var nbtns;
const copers = {
    '+': ['+', 1],
    '-': ['-', 1],
    '×': ['\\times', 6],
    '÷': ['\\frac{}{}', 6]
};
const nopers = {
    'ln': ['\\ln{}', 4],
    'log': ['\\log{}', 5],
    'e^': ['e^{}', 3],
    '10^': ['10^{}', 4],
    'a^b': ['{}^{}', 1]
};
function createBtnFunc() {
    return () => { };
}
function createOpBtn(name, op) {
    const btn = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('button');
    btn.addEventListener('click', () => { });
    return btn;
}
function setBtns(opers) {
    const div = document.getElementById('btns');
    div.appendChild(document.createTextNode('|'));
    let btns = [];
    for (const [name, op] of Object.entries(opers)) {
        const btn = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
        btns.push(btn);
    }
    return btns;
}
function parse() {
    try {
        MathJax.typeset();
    }
    catch (e) {
        console.log(e);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Set buttons
    cbtns = setBtns(copers);
    nbtns = setBtns(nopers);
    // Set output
    formDiv = document.getElementById('form');
});
