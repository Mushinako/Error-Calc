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

var editDiv: HTMLDivElement;
var formDiv: HTMLDivElement;
var cbtns: HTMLAnchorElement[];
var nbtns: HTMLAnchorElement[];

const copers: Record<string, () => void> = {
    '+/-': cOperOnClick(['+', '-'], addMin),
    '×/÷': cOperOnClick(['×', '÷'], mulDiv),
};
const nopers: Record<string, () => void> = {
    'ln': () => { },
    'log': () => { },
    'e^': () => { },
    '10^': () => { },
    'a^b': () => { }
}


// function createBtnFunc(): () => void {
//     return () => { };
// }


function inpDiv(ph: string): [HTMLDivElement, HTMLInputElement] {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp: HTMLInputElement = document.createElement('input');
    inp.classList.add('validate');
    inp.placeholder = ph;
    inp.type = 'text';
    inp.pattern = ph === 'Avg' ? '\\d+(\\.\\d*)?|\\.\\d*|Ans\\d+' : '\\d*(\\.\\d*)?';
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
    outDiv.classList.add('row');
    outDiv.id = 'inps';
    // Select
    const selDiv: HTMLDivElement = document.createElement('div');
    selDiv.classList.add('input-field', 'col', 's1');
    if (!firstRow) {
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
    }
    outDiv.appendChild(selDiv);
    // 2 inputs
    outDiv.appendChild(inpsDiv());
    // Remove btn
    const remDiv: HTMLDivElement = document.createElement('div');
    remDiv.classList.add('col', 's1');
    if (!firstRow) {
        const remBtn: HTMLAnchorElement = document.createElement('a');
        remBtn.classList.add('waves-effect', 'waves-red', 'btn-flat');
        remBtn.textContent = '×';
        remBtn.addEventListener('click', (): void => {
            outDiv.parentNode?.removeChild(outDiv);
        });
        remDiv.appendChild(remBtn);
    }
    outDiv.appendChild(remDiv);
    return outDiv;
}


function calcBtn(calc: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'waves-red', 'btn-flat');
    btn.textContent = 'Calculate';
    btn.addEventListener('click', (): void => { calc() });
    return btn;
}


function cOperOnClick(choices: string[], calc: () => void): () => void {
    return (): void => {
        const formDiv: HTMLFormElement = document.createElement('form');
        // Inputs
        formDiv.appendChild(cOperInputDiv(choices, true));
        // Btns
        const btnsDiv: HTMLDivElement = document.createElement('div');
        btnsDiv.classList.add('cont', 'row', 'center');
        // Add row
        const addRowBtn: HTMLAnchorElement = document.createElement('a');
        addRowBtn.classList.add('waves-effect', 'waves-red', 'btn-flat');
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (): void => {
            formDiv.insertBefore(cOperInputDiv(choices, false), formDiv.lastChild);
            M.AutoInit();
        });
        btnsDiv.appendChild(addRowBtn);
        // Calculate
        btnsDiv.appendChild(calcBtn(calc));
        formDiv.appendChild(btnsDiv);
        while (editDiv.hasChildNodes()) editDiv.removeChild(<Node>editDiv.lastChild);
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


document.addEventListener('DOMContentLoaded', (): void => {
    // Set input
    editDiv = <HTMLDivElement>document.getElementById('edit');
    // Set buttons
    cbtns = setBtns(copers);
    nbtns = setBtns(nopers);
    // Set output
    formDiv = <HTMLDivElement>document.getElementById('form');
});
