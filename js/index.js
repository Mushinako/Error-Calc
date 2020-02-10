"use strict";
var editDiv;
var formDiv;
var cbtns;
var nbtns;
const copers = {
    '+/-': [cOperOnClick(['+', '-']), 0],
    '×/÷': [cOperOnClick(['×', '÷']), 0],
};
const nopers = {
    'ln': [() => { }, 0],
    'log': [() => { }, 0],
    'e^': [() => { }, 0],
    '10^': [() => { }, 0],
    'a^b': [() => { }, 0]
};
// function createBtnFunc(): () => void {
//     return () => { };
// }
function cOperInputDiv() { }
function cOperOnClick(choices) {
    const form = document.createElement('form');
    return () => { };
}
function createOpBtn(name, op) {
    const [clkFunc, num] = op;
    const btn = document.createElement('a');
    btn.textContent = name;
    btn.classList.add('bttn');
    btn.addEventListener('click', clkFunc);
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
