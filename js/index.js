"use strict";
var editDiv;
var formDiv;
var cbtns;
var nbtns;
const copers = {
    '+/-': cOperOnClick(['+', '-'], calcAddMin),
    '×/÷': cOperOnClick(['×', '÷'], calcMulDiv),
};
const nopers = {
    'ln': nOperOnClick('ln', calcLn),
    'log': nOperOnClick('log', calcLog),
    'e^': nOperOnClick('e^', calcExp),
    '10^': nOperOnClick('10^', calc10xp)
};
// function createBtnFunc(): () => void {
//     return () => { };
// }
function inpDiv(ph) {
    const div = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = ph === 'Avg' ? '\\d+(\\.\\d*)?|\\.\\d*|Ans\\d+' : '\\d*(\\.\\d*)?';
    div.appendChild(inp);
    return [div, inp];
}
function inpsDiv() {
    const div = document.createElement('div');
    div.classList.add('col', 's10');
    // Average
    const [avgDiv, avgInp] = inpDiv('Avg');
    div.appendChild(avgDiv);
    // pm
    const pmDiv = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    const pmBtn = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    div.appendChild(pmDiv);
    // SD
    const [sdDiv, sdInp] = inpDiv('SD');
    div.appendChild(sdDiv);
    // Check inputs
    avgInp.addEventListener('input', () => {
        if (avgInp.value.toLowerCase() === 'a') {
            avgInp.value = 'Ans';
        }
        if (avgInp.value.charAt(0) === 'A') {
            sdInp.disabled = true;
        }
        else {
            sdInp.disabled = false;
        }
    });
    avgInp.addEventListener('keydown', (ev) => {
        if (avgInp.value === 'Ans' && ev.key === 'Backspace') {
            avgInp.value = '';
        }
    });
    return div;
}
function cOperInputDiv(choices, firstRow) {
    const outDiv = document.createElement('div');
    outDiv.classList.add('row');
    outDiv.id = 'inps';
    // Select
    const selDiv = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    const sel = document.createElement('select');
    let first = true;
    for (const c of choices) {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (first) {
            opt.selected = true;
            first = false;
        }
        sel.appendChild(opt);
    }
    selDiv.appendChild(sel);
    outDiv.appendChild(selDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    // Remove btn
    const remDiv = document.createElement('div');
    remDiv.classList.add('col', 's1');
    if (!firstRow) {
        const remBtn = document.createElement('a');
        remBtn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', () => {
            var _a;
            (_a = outDiv.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(outDiv);
        });
        remDiv.appendChild(remBtn);
    }
    outDiv.appendChild(remDiv);
    return outDiv;
}
function nOperInputDiv(func) {
    const outDiv = document.createElement('div');
    outDiv.classList.add('row');
    outDiv.id = 'inps';
    // Func
    const funcDiv = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    return outDiv;
}
function calcBtn(calc) {
    const btn = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-light-blue', 'btn', 'blue');
    btn.textContent = 'Calculate';
    btn.addEventListener('click', () => { calc(); });
    return btn;
}
function cOperOnClick(choices, calc) {
    return () => {
        while (editDiv.hasChildNodes())
            editDiv.removeChild(editDiv.lastChild);
        const formDiv = document.createElement('form');
        // Inputs
        formDiv.appendChild(cOperInputDiv(choices, true));
        // Btns
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Add row
        const addRowBtn = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'waves-teal', 'btn', 'green');
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', () => {
            formDiv.insertBefore(cOperInputDiv(choices, false), formDiv.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        // Calculate
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
        M.AutoInit();
    };
}
function nOperOnClick(func, calc) {
    return () => {
        while (editDiv.hasChildNodes())
            editDiv.removeChild(editDiv.lastChild);
        const formDiv = document.createElement('form');
        // Inputs
        formDiv.appendChild(nOperInputDiv(func));
        // Btns
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
    };
}
function createOpBtn(name, op) {
    const btn = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.textContent = name;
    btn.addEventListener('click', op);
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
    // Set input
    editDiv = document.getElementById('edit');
    // Set buttons
    cbtns = setBtns(copers);
    nbtns = setBtns(nopers);
    // Set output
    formDiv = document.getElementById('form');
});
