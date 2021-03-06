"use strict";
let inDiv;
let outDiv;
let helpDiv;
const sciNotation = (n) => sciNotationWithSigFig(n, 15);
function clearChildren(div) { while (div.hasChildNodes())
    div.removeChild(div.lastChild); }
function appendHr(div) {
    const hr = document.createElement('hr');
    div.appendChild(hr);
}
function createTtl(ttl) {
    const etlElmt = document.createElement('h1');
    etlElmt.classList.add('center');
    etlElmt.textContent = ttl;
    return etlElmt;
}
function createCalcBtn(calc) {
    const btn = document.createElement('a');
    btn.classList.add('waves-effect', 'btn', 'blue');
    btn.id = 'calc';
    btn.textContent = 'Calculate';
    btn.addEventListener('click', calc);
    return btn;
}
function createOutputHalfDiv(name, func, formula, hint) {
    const div = document.createElement('div');
    div.classList.add('col', 's12', 'm6', 'input-field');
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center', 'tooltipped');
    lblDiv.setAttribute('data-position', 'bottom');
    lblDiv.setAttribute('data-tooltip', hint);
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    const output = document.createElement('input');
    output.classList.add('col', 's10');
    output.type = 'text';
    output.id = `${func}${name}`;
    output.disabled = true;
    div.appendChild(output);
    return div;
}
function noteGen(notes) {
    const li = document.createElement('li');
    li.classList.add('active');
    const header = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText = document.createElement('strong');
    headerText.textContent = 'Notes';
    header.appendChild(headerText);
    const content = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    const innerUl = document.createElement('ul');
    innerUl.classList.add('browser-default');
    content.appendChild(innerUl);
    for (const note of notes) {
        const innerLi = document.createElement('li');
        innerLi.textContent = note;
        innerUl.appendChild(innerLi);
    }
    return li;
}
function shortcutGen(shortcuts) {
    const li = document.createElement('li');
    const header = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText = document.createElement('strong');
    headerText.textContent = 'Keyboard shortcuts';
    header.appendChild(headerText);
    const content = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    const tbl = document.createElement('table');
    tbl.classList.add('highlight');
    content.appendChild(tbl);
    const thead = document.createElement('thead');
    tbl.appendChild(thead);
    const headingTr = document.createElement('tr');
    thead.appendChild(headingTr);
    for (const head of ['Key Combination', 'Action']) {
        const th = document.createElement('th');
        th.textContent = head;
        headingTr.appendChild(th);
    }
    const tbody = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const [key, action] of Object.entries(shortcuts)) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        const keyTd = document.createElement('td');
        tr.appendChild(keyTd);
        const keyText = document.createElement('em');
        keyText.textContent = key;
        keyTd.appendChild(keyText);
        const actionTd = document.createElement('td');
        actionTd.textContent = action;
        tr.appendChild(actionTd);
    }
    return li;
}
function formatGen(formats, notes) {
    const li = document.createElement('li');
    const header = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText = document.createElement('strong');
    headerText.textContent = 'Input formats';
    header.appendChild(headerText);
    const content = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    const innerUl = document.createElement('ul');
    innerUl.classList.add('browser-default');
    content.appendChild(innerUl);
    for (const note of notes) {
        const innerLi = document.createElement('li');
        innerLi.textContent = note;
        innerUl.appendChild(innerLi);
    }
    const tbl = document.createElement('table');
    tbl.classList.add('highlight');
    content.appendChild(tbl);
    const thead = document.createElement('thead');
    tbl.appendChild(thead);
    const headingTr = document.createElement('tr');
    thead.appendChild(headingTr);
    for (const head of ['Type', 'Example']) {
        const th = document.createElement('th');
        th.textContent = head;
        headingTr.appendChild(th);
    }
    const tbody = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const [type, example] of Object.entries(formats)) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        const typeTd = document.createElement('td');
        tr.appendChild(typeTd);
        const keyText = document.createElement('em');
        keyText.textContent = type;
        typeTd.appendChild(keyText);
        const exampleTd = document.createElement('td');
        exampleTd.textContent = example.join('; ');
        tr.appendChild(exampleTd);
    }
    return li;
}
function helpGen(noteLi, shortcutLi, formatLi) {
    const ul = document.createElement('ul');
    ul.classList.add('collapsible');
    for (const li of [noteLi, shortcutLi, formatLi]) {
        ul.appendChild(li);
    }
    return ul;
}
function sciNotationWithSigFig(n, sfn) {
    const absN = Math.abs(n);
    if (sfn <= 0)
        return '0';
    if (absN < 1e6 && absN > 1e-1 || absN === 0)
        return n.toPrecision(sfn);
    return n.toExponential(sfn - 1);
}
function resultToStringLin(key) {
    const mKey = `${key}m`;
    const m0Key = `${key}m0`;
    const bKey = `${key}b`;
    const mData = window.localStorage.getItem(mKey);
    const m0Data = window.localStorage.getItem(m0Key);
    const bData = window.localStorage.getItem(bKey);
    const [m, sm, mSF] = JSON.parse(mData).slice(1);
    let res = [`m:${resultToString(m, sm, mSF)}`];
    const [b, sb, bSF] = JSON.parse(bData).slice(1);
    res.push(`b:${resultToString(b, sb, bSF)}`);
    return res;
}
function resultToString(avg, sd, sf) {
    let sfnAvg;
    if (sigFig) {
        if (sigFig2)
            sf -= 2;
        sfnAvg = sigFigDecimalConversion(avg, sf);
    }
    else {
        sfnAvg = 15;
        sf = sigFigDecimalConversion(avg, sfnAvg);
    }
    const avgStr = sciNotationWithSigFig(avg, sfnAvg);
    let resStr;
    if (avgStr.includes('e')) {
        const [avgCo, avgExp] = avgStr.split('e');
        const sdStr = (sd * Math.pow(10, -avgExp)).toFixed(-sf + +avgExp);
        resStr = `\\(({\\color{red} ${avgCo}}\\pm{\\color{blue} ${sdStr}})\\times 10^{${+avgExp}}\\)`;
    }
    else {
        let sdStr;
        if (sf > 0) {
            const exp = Math.pow(10, sf);
            sdStr = (Math.round(sd * exp) / exp).toString();
        }
        else
            sdStr = sd.toFixed(-sf);
        resStr = `\\({\\color{red} ${avgStr}}\\pm{\\color{blue} ${sdStr}}\\)`;
    }
    return resStr;
}
function setAnsCounter() {
    const keys = Object.keys(window.localStorage).filter((val) => ['Err', 'Var', 'Lin'].includes(val.slice(0, 3)));
    if (!keys.length) {
        ansCounter = 1;
        return;
    }
    const ids = keys.map((val) => +val.slice(3));
    ansCounter = Math.max(...ids) + 1;
}
function displayAns() {
    const keys = Object.keys(window.localStorage).filter((val) => /^(Err|Var|Lin)\d+$/.test(val));
    if (!keys.length) {
        ansCounter = 1;
        return;
    }
    if (sigFigInp === null) {
        sigFig = false;
        sigFig2 = false;
    }
    else {
        sigFig = sigFigInp.checked;
        sigFig2 = sigFig2Inp.checked;
    }
    const ids = [];
    clearChildren(outDiv);
    const tbl = document.createElement('table');
    tbl.classList.add('highlight', 'responsive-table', 'centered', 'margin-bottom');
    outDiv.appendChild(tbl);
    const thead = document.createElement('thead');
    tbl.appendChild(thead);
    const trHead = document.createElement('tr');
    thead.appendChild(trHead);
    for (const title of ['Ans', 'Formula', 'Result']) {
        const th = document.createElement('th');
        th.textContent = title;
        trHead.appendChild(th);
    }
    const clearTh = document.createElement('th');
    clearTh.classList.add('center');
    trHead.appendChild(clearTh);
    const clearBtn = document.createElement('a');
    clearBtn.classList.add('waves-effect', 'btn', 'red');
    clearBtn.textContent = 'All';
    clearBtn.addEventListener('click', () => {
        if (!confirm('Do you want to delete all saves?'))
            return;
        for (const key of Object.keys(window.localStorage))
            window.localStorage.removeItem(key);
        clearChildren(outDiv);
    });
    clearTh.appendChild(clearBtn);
    const tbody = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const key of keys.sort((a, b) => +a.slice(3) - +b.slice(3))) {
        const data = window.localStorage.getItem(key);
        ids.push(+key.slice(3));
        const [form, avg, sd, sf] = JSON.parse(data);
        let formStr;
        const method = key.slice(0, 3);
        if (method === 'Err') {
            formStr = `\\(${form}\\)`;
        }
        else {
            formStr = '';
            for (const n of form.split(';')) {
                if (formStr.length < 30) {
                    formStr += `${n};`;
                }
                else {
                    formStr += '...';
                    break;
                }
            }
            formStr = `\\(${formStr}\\)`;
        }
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (const item of [key, formStr]) {
            const td = document.createElement('td');
            td.textContent = item;
            tr.appendChild(td);
        }
        const tdRes = document.createElement('td');
        if (method === 'Lin') {
            const res = resultToStringLin(key);
            tdRes.appendChild(document.createTextNode(res.shift()));
            for (const r of res) {
                const br = document.createElement('br');
                tdRes.appendChild(br);
                tdRes.appendChild(document.createTextNode(r));
            }
        }
        else
            tdRes.textContent = resultToString(avg, sd, sf);
        tr.appendChild(tdRes);
        const td = document.createElement('td');
        tr.appendChild(td);
        const btn = document.createElement('a');
        btn.classList.add('waves-effect', 'btn', 'red');
        btn.textContent = '×';
        btn.addEventListener('click', (ev) => {
            if (ev.isTrusted && !confirm('Do you want to delete this result?'))
                return;
            window.localStorage.removeItem(key);
            if (Object.keys(window.localStorage).length)
                tbody.removeChild(tr);
            else
                clearChildren(outDiv);
        });
        td.appendChild(btn);
    }
    ansCounter = Math.max(...ids) + 1;
    parse();
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
    document.getElementById('no-script').style.display = 'none';
    inDiv = document.getElementById('indiv');
    outDiv = document.getElementById('outdiv');
    helpDiv = document.getElementById('helpdiv');
    if (!Object.entries || !window.localStorage) {
        const supportedBrowsers = [
            'Google Chrome 54+',
            'Mozilla Firefox 47+',
            'Apple Safari 11+',
            'Microsoft Edge 14+',
            'Opera 41+'
        ];
        const noSupportP = document.createElement('p');
        noSupportP.textContent = 'Your browser is not supported. Please use:';
        outDiv.appendChild(noSupportP);
        const supportedList = document.createElement('ul');
        supportedList.classList.add('browser-default');
        for (const b of supportedBrowsers) {
            const bLI = document.createElement('li');
            bLI.textContent = b;
            supportedList.appendChild(bLI);
        }
        outDiv.appendChild(supportedList);
        return;
    }
    const propBtn = document.getElementById('prop');
    const statBtn = document.getElementById('stat');
    const lregBtn = document.getElementById('lreg');
    propBtn.addEventListener('click', () => {
        propBtn.parentElement.classList.add('active');
        statBtn.parentElement.classList.remove('active');
        lregBtn.parentElement.classList.remove('active');
        propInit();
    });
    statBtn.addEventListener('click', () => {
        statBtn.parentElement.classList.add('active');
        propBtn.parentElement.classList.remove('active');
        lregBtn.parentElement.classList.remove('active');
        statInit();
    });
    lregBtn.addEventListener('click', () => {
        lregBtn.parentElement.classList.add('active');
        propBtn.parentElement.classList.remove('active');
        statBtn.parentElement.classList.remove('active');
        lregInit();
    });
    propInit();
});
