"use strict";
function createInpDiv(ph) {
    const div = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = '[\\+\\-]?\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    if (ph === 'Avg')
        inp.pattern += '|(Err|Var|Lin)\\d+';
    div.appendChild(inp);
    return [div, inp];
}
function createInpsDiv() {
    const div = document.createElement('div');
    div.classList.add('col', 's10');
    const [avgDiv, avgInp] = createInpDiv('Avg');
    div.appendChild(avgDiv);
    const pmDiv = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    div.appendChild(pmDiv);
    const pmBtn = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    const [sdDiv, sdInp] = createInpDiv('SD');
    div.appendChild(sdDiv);
    avgInp.addEventListener('input', () => {
        if (avgInp.value.toLowerCase() === 'e')
            avgInp.value = 'Err';
        else if (avgInp.value.toLowerCase() === 'v')
            avgInp.value = 'Var';
        else if (avgInp.value.toLowerCase() === 'l')
            avgInp.value = 'Lin';
        if (['E', 'V', 'L'].includes(avgInp.value.charAt(0)))
            sdInp.disabled = true;
        else
            sdInp.disabled = false;
    });
    avgInp.addEventListener('keydown', (ev) => {
        if (['Err', 'Var', 'Lin'].includes(avgInp.value) && ev.key === 'Backspace')
            avgInp.value = '';
    });
    return div;
}
function cOperInputDiv(choices, firstRow) {
    const div = document.createElement('div');
    div.classList.add('row', 'inps');
    const selDiv = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    div.appendChild(selDiv);
    const sel = document.createElement('select');
    selDiv.appendChild(sel);
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
    div.appendChild(createInpsDiv());
    if (!firstRow) {
        const remDiv = document.createElement('div');
        remDiv.classList.add('col', 's1');
        const remBtn = document.createElement('a');
        remBtn.classList.add('waves-effect', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', () => {
            div.parentNode.removeChild(div);
        });
        remDiv.appendChild(remBtn);
        div.appendChild(remDiv);
    }
    return div;
}
function nOperInputDiv(func) {
    const div = document.createElement('div');
    div.classList.add('row', 'inps');
    const funcDiv = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    div.appendChild(funcDiv);
    const funcBtn = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    div.appendChild(createInpsDiv());
    return div;
}
function tOperInputDiv(rows) {
    const baseRow = nOperInputDiv(rows[0]);
    const expRow = document.createElement('div');
    expRow.classList.add('row', 'inps');
    const funcDiv = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    expRow.appendChild(funcDiv);
    const funcBtn = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click', 'no-pad');
    funcBtn.textContent = rows[1];
    funcDiv.appendChild(funcBtn);
    const div = document.createElement('div');
    div.classList.add('col', 's10');
    expRow.appendChild(div);
    const [expDiv, expInp] = createInpDiv('Exp');
    div.appendChild(expDiv);
    expInp.addEventListener('input', () => {
        if (['e', 'v', 'l'].includes(expInp.value.charAt(0).toLowerCase())) {
            alert('Exponent cannot be a previous answer!');
            expInp.value = '';
        }
    });
    return [baseRow, expRow];
}
function createSwitch(lbl, hint, width) {
    const div = document.createElement('div');
    div.classList.add('switch', 'center', 'tooltipped', 'col', `s${width}`);
    div.setAttribute('data-position', 'bottom');
    div.setAttribute('data-tooltip', hint);
    const label = document.createElement('label');
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);
    const inp = document.createElement('input');
    inp.type = 'checkbox';
    label.appendChild(inp);
    const span = document.createElement('span');
    span.classList.add('lever');
    label.append(span);
    return [div, inp];
}
function createSwitches() {
    const div = document.createElement('div');
    div.classList.add('row');
    let sfDiv;
    [sfDiv, sigFigInp] = createSwitch('Calculate SigFigs', 'Turn on to calculate SigFigs', 6);
    sigFigInp.checked = false;
    div.appendChild(sfDiv);
    let sf2Div;
    [sf2Div, sigFig2Inp] = createSwitch('2 more SigFigs', 'Turn on to produce 2 more SigFigs', 6);
    sigFig2Inp.checked = false;
    sigFig2Inp.disabled = true;
    div.appendChild(sf2Div);
    sigFigInp.addEventListener('change', () => {
        sigFig2Inp.disabled = !sigFigInp.checked;
        displayAns();
    });
    sigFig2Inp.addEventListener('change', () => {
        if (!sigFig2Inp.disabled)
            displayAns();
    });
    return div;
}
