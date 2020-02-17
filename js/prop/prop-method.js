"use strict";
let mode;
const copers = {
    '+/-': cOperOnClick(['+', '-'], calcAddMin, 'as'),
    '×/÷': cOperOnClick(['×', '÷'], calcMulDiv, 'md'),
};
const nopers = {
    'ln': nOperOnClick('ln', calcLn, 'ln'),
    'log': nOperOnClick('log', calcLog, 'lg'),
    'e^': nOperOnClick('e^', calcExp, 'ex'),
    '10^': nOperOnClick('10^', calc10xp, '10')
};
const topers = {
    'a^x': tOperOnClick(['a', 'x'], calcPwr, 'pw')
};
function cOperOnClick(choices, calc, md) {
    return () => {
        mode = md;
        clearChildren(propInpsDiv);
        const form = document.createElement('form');
        form.appendChild(cOperInputDiv(choices, true));
        form.appendChild(cOperInputDiv(choices, false));
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        const addRowBtn = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'btn', 'green');
        addRowBtn.id = 'propaddrow';
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', () => {
            form.insertBefore(cOperInputDiv(choices, false), form.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        btnsDiv.appendChild(createCalcBtn(calc));
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
        M.AutoInit();
    };
}
function nOperOnClick(func, calc, md) {
    return () => {
        mode = md;
        clearChildren(propInpsDiv);
        const form = document.createElement('form');
        form.appendChild(nOperInputDiv(func));
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        btnsDiv.appendChild(createCalcBtn(calc));
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
    };
}
function tOperOnClick(rows, calc, md) {
    return () => {
        mode = md;
        clearChildren(propInpsDiv);
        const form = document.createElement('form');
        for (const div of tOperInputDiv(rows))
            form.appendChild(div);
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        btnsDiv.appendChild(createCalcBtn(calc));
        form.appendChild(btnsDiv);
        propInpsDiv.appendChild(form);
    };
}
function createOpBtn(name, op) {
    const btn = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.textContent = name;
    btn.addEventListener('click', op);
    return btn;
}
function setBtns(opers, div) {
    div.appendChild(document.createTextNode('|'));
    for (const [name, op] of Object.entries(opers)) {
        const btn = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
    }
}
