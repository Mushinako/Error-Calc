"use strict";

interface MathJax {
    typeset(): void
}

interface Materialize {
    AutoInit(): void,
    FormSelect: {
        init(elems: any[], options?: Record<string, any>): void;
    }
}

declare const MathJax: MathJax;
declare const M: Materialize;

let editDiv: HTMLDivElement;
let formDiv: HTMLDivElement;
let cbtns: HTMLAnchorElement[];
let nbtns: HTMLAnchorElement[];

const copers: Record<string, () => void> = {
    '+/-': cOperOnClick(['+', '-'], calcAddMin),
    '×/÷': cOperOnClick(['×', '÷'], calcMulDiv),
};
const nopers: Record<string, () => void> = {
    'ln': nOperOnClick('ln', calcLn),
    'log': nOperOnClick('log', calcLog),
    'e^': nOperOnClick('e^', calcExp),
    '10^': nOperOnClick('10^', calc10xp)
};
const supportedBrowsers: string[] = [
    'Google Chrome 54+',
    'Mozilla Firefox 47+',
    'Apple Safari 11+',
    'Microsoft Edge 14+',
    'Opera 41+'
];


function inpDiv(ph: string): [HTMLDivElement, HTMLInputElement] {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp: HTMLInputElement = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = '\\d*(\\.\\d*)?([Ee][\\+\\-]?\\d+)?';
    if (ph === 'Avg') inp.pattern += '|Ans\\d+';
    div.appendChild(inp);
    return [div, inp];
}


function inpsDiv(): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's10');
    // Average
    const [avgDiv, avgInp]: [HTMLDivElement, HTMLInputElement] = inpDiv('Avg');
    div.appendChild(avgDiv);
    // pm
    const pmDiv: HTMLDivElement = document.createElement('div');
    pmDiv.classList.add('center', 'col', 's2');
    const pmBtn: HTMLAnchorElement = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    div.appendChild(pmDiv);
    // SD
    const [sdDiv, sdInp]: [HTMLDivElement, HTMLInputElement] = inpDiv('SD');
    div.appendChild(sdDiv);
    // Check inputs
    avgInp.addEventListener('input', (): void => {
        if (avgInp.value.toLowerCase() === 'a') {
            avgInp.value = 'Ans';
        }
        if (avgInp.value.charAt(0) === 'A') {
            sdInp.disabled = true;
        } else {
            sdInp.disabled = false;
        }
    });
    avgInp.addEventListener('keydown', (ev: KeyboardEvent): void => {
        if (avgInp.value === 'Ans' && ev.key === 'Backspace') {
            avgInp.value = '';
        }
    });
    return div;
}


function cOperInputDiv(choices: string[], firstRow: boolean): HTMLDivElement {
    const outDiv: HTMLDivElement = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    // Select
    const selDiv: HTMLDivElement = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    const sel: HTMLSelectElement = document.createElement('select');
    let first: boolean = true;
    for (const c of choices) {
        const opt: HTMLOptionElement = document.createElement('option');
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
    const remDiv: HTMLDivElement = document.createElement('div');
    remDiv.classList.add('col', 's1');
    if (!firstRow) {
        const remBtn: HTMLAnchorElement = document.createElement('a');
        remBtn.classList.add('waves-effect', 'waves-red', 'btn', 'red');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', (): void => {
            outDiv.parentNode?.removeChild(outDiv);
        });
        remDiv.appendChild(remBtn);
    }
    outDiv.appendChild(remDiv);
    return outDiv;
}


function nOperInputDiv(func: string): HTMLDivElement {
    const outDiv: HTMLDivElement = document.createElement('div');
    outDiv.classList.add('row', 'inps');
    // Func
    const funcDiv: HTMLDivElement = document.createElement('div');
    funcDiv.classList.add('col', 's1');
    const funcBtn: HTMLAnchorElement = document.createElement('a');
    funcBtn.classList.add('btn-flat', 'no-click');
    funcBtn.textContent = func;
    funcDiv.appendChild(funcBtn);
    outDiv.appendChild(funcDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    return outDiv;
}


function calcBtn(calc: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-light-blue', 'btn', 'blue');
    btn.textContent = 'Calculate';
    btn.addEventListener('click', calc);
    return btn;
}


function cOperOnClick(choices: string[], calc: () => void): () => void {
    return (): void => {
        while (editDiv.hasChildNodes()) editDiv.removeChild(<Node>editDiv.lastChild);
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        formDiv.appendChild(cOperInputDiv(choices, true));
        // Btns
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Add row
        const addRowBtn: HTMLAnchorElement = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'waves-teal', 'btn', 'green');
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (): void => {
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


function nOperOnClick(func: string, calc: () => void): () => void {
    return (): void => {
        while (editDiv.hasChildNodes()) editDiv.removeChild(<Node>editDiv.lastChild);
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        formDiv.appendChild(nOperInputDiv(func));
        // Btns
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('container', 'row', 'center');
        // Calculate
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        editDiv.appendChild(formDiv);
    };
}


function createOpBtn(name: string, op: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.textContent = name;
    btn.addEventListener('click', op);
    return btn;
}


function setBtns(opers: Record<string, () => void>): HTMLAnchorElement[] {
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


function displayAns(): void {
    let ids: number[] = [];
    for (const [ans, data] of Object.entries(window.localStorage).sort()) {
        ids.push(parseInt(ans.slice(3)));
        const [form, avg, sd]: [string, string, string] = JSON.parse(data);
    }
}


document.addEventListener('DOMContentLoaded', (): void => {
    // Set output
    formDiv = <HTMLDivElement>document.getElementById('form');
    if (!Object.entries || !window.localStorage) {
        const noSupportP: HTMLParagraphElement = document.createElement('p');
        noSupportP.textContent = 'Your browser is not supported. Please use:'
        formDiv.appendChild(noSupportP);
        const supportedList: HTMLUListElement = document.createElement('ul');
        for (const b of supportedBrowsers) {
            const bLI: HTMLLIElement = document.createElement('li');
            bLI.textContent = b;
            supportedList.appendChild(bLI);
        }
        formDiv.appendChild(supportedList);
        return;
    }
    if (Object.entries(window.localStorage).length) {
        displayAns();
    } else {
        ansCounter = 1;
    }
    // Set input
    editDiv = <HTMLDivElement>document.getElementById('edit');
    // Set buttons
    cbtns = setBtns(copers);
    nbtns = setBtns(nopers);
});
