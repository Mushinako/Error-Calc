"use strict";
let editDiv;
let formDiv;
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
const supportedBrowsers = [
    'Google Chrome 54+',
    'Mozilla Firefox 47+',
    'Apple Safari 11+',
    'Microsoft Edge 14+',
    'Opera 41+'
];
function sciNot(n) {
    const absN = Math.abs(n);
    if (absN < 1e6 && absN > 1e-3) {
        return n.toString();
    }
    return n.toExponential();
}
function inpDiv(ph) {
    const div = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    if (ph === 'Avg')
        inp.pattern += '|Ans\\d+';
    div.appendChild(inp);
    return [div, inp];
}
function inpsDiv() {
    const div = document.createElement('div');
    div.classList.add('col', 's10');
    const [avgDiv, avgInp] = inpDiv('Avg');
    div.appendChild(avgDiv);
    const pmDiv = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    const pmBtn = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    div.appendChild(pmDiv);
    const [sdDiv, sdInp] = inpDiv('SD');
    div.appendChild(sdDiv);
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
    outDiv.classList.add('row', 'inps');
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
    outDiv.appendChild(inpsDiv());
    const remDiv = document.createElement('div');
    remDiv.classList.add('col', 's1');
    if (!firstRow) {
        const remBtn = document.createElement('a');
        remBtn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', () => {
            outDiv.parentNode.removeChild(outDiv);
        });
        remDiv.appendChild(remBtn);
    }
    outDiv.appendChild(remDiv);
    return outDiv;
}
function nOperInputDiv(func) {
    const outDiv = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    const funcDiv = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    outDiv.appendChild(inpsDiv());
    return outDiv;
}
function tOperInputDiv(rows) {
    const baseRow = nOperInputDiv(rows[0]);
    const outDiv = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    const funcDiv = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = rows[1];
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    const div = document.createElement('div');
    div.classList.add('col', 's10');
    const expDiv = document.createElement('div');
    expDiv.classList.add('input-field', 'col', 's5');
    const expInp = document.createElement('input');
    expInp.classList.add('validate');
    expInp.placeholder = 'Exp';
    expInp.type = 'text';
    expInp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    expDiv.appendChild(expInp);
    div.appendChild(expDiv);
    outDiv.appendChild(div);
    expInp.addEventListener('input', () => {
        if (expInp.value.charAt(0).toLowerCase() === 'a') {
            alert('Exponent cannot be a previous answer!');
            expInp.value = '';
        }
    });
    return [baseRow, outDiv];
}
function calcBtn(calc) {
    const btn = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-light-blue', 'btn', 'blue');
    btn.id = 'calc';
    btn.textContent = 'Calculate';
    btn.addEventListener('click', calc);
    return btn;
}
function cOperOnClick(choices, calc, md) {
    return () => {
        mode = md;
        while (editDiv.hasChildNodes())
            editDiv.removeChild(editDiv.lastChild);
        const formDiv = document.createElement('form');
        formDiv.appendChild(cOperInputDiv(choices, true));
        formDiv.appendChild(cOperInputDiv(choices, false));
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        const addRowBtn = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'waves-teal', 'btn', 'green');
        addRowBtn.id = 'add-row';
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', () => {
            formDiv.insertBefore(cOperInputDiv(choices, false), formDiv.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
        M.AutoInit();
    };
}
function nOperOnClick(func, calc, md) {
    return () => {
        mode = md;
        while (editDiv.hasChildNodes())
            editDiv.removeChild(editDiv.lastChild);
        const formDiv = document.createElement('form');
        formDiv.appendChild(nOperInputDiv(func));
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
    };
}
function tOperOnClick(rows, calc, md) {
    return () => {
        mode = md;
        while (editDiv.hasChildNodes())
            editDiv.removeChild(editDiv.lastChild);
        const formDiv = document.createElement('form');
        for (const div of tOperInputDiv(rows))
            formDiv.appendChild(div);
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
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
    for (const [name, op] of Object.entries(opers)) {
        const btn = createOpBtn(name, op);
        div.appendChild(btn);
        div.appendChild(document.createTextNode('|'));
    }
}
function parse() {
    try {
        MathJax.typeset();
    }
    catch (e) {
        console.log(e);
    }
}
function displayAns() {
    if (!Object.keys(window.localStorage).length) {
        ansCounter = 1;
        return;
    }
    let ids = [];
    while (formDiv.hasChildNodes())
        formDiv.removeChild(formDiv.lastChild);
    const tbl = document.createElement('table');
    tbl.classList.add('highlight', 'responsive-table', 'centered');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    for (const title of ['Ans', 'Formula', 'Result', '']) {
        const th = document.createElement('th');
        th.textContent = title;
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    tbl.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const [ans, data] of Object.entries(window.localStorage).sort((a, b) => +a[0].slice(3) - +b[0].slice(3))) {
        ids.push(parseInt(ans.slice(3)));
        const [form, avg, sd] = JSON.parse(data);
        const formStr = `\\(${form}\\)`;
        const resStr = `\\({\\color{red} ${sciNot(avg)}}\\pm{\\color{blue} ${sciNot(sd)}}\\)`;
        const tr = document.createElement('tr');
        for (const item of [ans, formStr, resStr]) {
            const td = document.createElement('td');
            td.textContent = item;
            tr.appendChild(td);
        }
        const td = document.createElement('td');
        const btn = document.createElement('a');
        btn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        btn.textContent = '×';
        btn.addEventListener('click', () => {
            window.localStorage.removeItem(ans);
            if (Object.keys(window.localStorage).length)
                tbody.removeChild(tr);
            else
                formDiv.removeChild(tbl);
        });
        td.appendChild(btn);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    ansCounter = Math.max(...ids) + 1;
    tbl.appendChild(tbody);
    formDiv.appendChild(tbl);
    parse();
}
document.addEventListener('DOMContentLoaded', () => {
    formDiv = document.getElementById('form');
    if (!Object.entries || !window.localStorage) {
        const noSupportP = document.createElement('p');
        noSupportP.textContent = 'Your browser is not supported. Please use:';
        formDiv.appendChild(noSupportP);
        const supportedList = document.createElement('ul');
        for (const b of supportedBrowsers) {
            const bLI = document.createElement('li');
            bLI.textContent = b;
            supportedList.appendChild(bLI);
        }
        formDiv.appendChild(supportedList);
        return;
    }
    displayAns();
    editDiv = document.getElementById('edit');
    setBtns(copers);
    setBtns(nopers);
    setBtns(topers);
    document.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter' || ev.key === '\n') {
            if (ev.shiftKey) {
                const addRowBtn = document.getElementById('add-row');
                if (addRowBtn !== null)
                    addRowBtn.click();
            }
            else
                document.getElementById('calc').click();
        }
    });
    document.getElementById('btns').childNodes[1].click();
});
