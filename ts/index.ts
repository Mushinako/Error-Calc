"use strict";

/** 
 * Common functions
 * 
 * - Main initializer
 * - Output display
 * - Remove & create elements
 * - Generate help
 */

// Ignore. Typescript nuiances
declare var MathJax: MathJax;
declare const M: Materialize;
declare const jStat: jStat;

interface MathJax {
    typeset?(): void,
    loader: Record<string, string[]>,
    tex: Record<string, Record<string, string[]>>
}

interface Materialize {
    AutoInit(): void,
    textareaAutoResize(textarea: HTMLTextAreaElement): void,
    FormSelect: {
        init(elems: any[], options?: Record<string, any>): void;
    }
}

interface jStat {
    studentt: {
        inv(p: number, dof: number): number
    }
}

let inDiv: HTMLDivElement;
let outDiv: HTMLDivElement;
let helpDiv: HTMLDivElement;

/**
 * Remove all children from element
 * 
 * @param {HTMLElement} div - The element to be cleared
 */
function clearChildren(div: HTMLElement): void { while (div.hasChildNodes()) div.removeChild(div.lastChild!); }


function appendHr(div: HTMLElement): void {
    const hr: HTMLHRElement = document.createElement('hr');
    div.appendChild(hr);
}

/**
 * Create title h1
 * 
 * @param   {string} ttl         - Title string
 * @returns {HTMLHeadingElement} - Title h1 element
 */
function createTtl(ttl: string): HTMLHeadingElement {
    const etlElmt: HTMLHeadingElement = document.createElement('h1');
    etlElmt.classList.add('center');
    etlElmt.textContent = ttl;
    return etlElmt;
}

/**
 * The big blue 'Calculate' button
 * 
 * @param   {(): void} calc     - Function to be run when clicked. Dependent
 *                                on the action selected
 * @returns {HTMLAnchorElement} - The said button
 */
function createCalcBtn(calc: () => void): HTMLAnchorElement {
    const btn: HTMLAnchorElement = document.createElement('a');
    btn.classList.add('waves-effect', 'btn', 'blue');
    btn.id = 'calc';
    btn.textContent = 'Calculate';
    btn.addEventListener('click', calc);
    return btn;
}

/**
 * Create single output div, half-width
 * 
 * @param   {string} name    - Name of output
 * @param   {string} func    - 'stat' or 'lreg'
 * @param   {string} formula - Formula of output
 * @param   {string} hint    - Hint of output
 * @returns {HTMLDivElement} - The div element
 */
function createOutputHalfDiv(name: string, func: string, formula: string, hint: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's12', 'm6', 'input-field');
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center', 'tooltipped');
    lblDiv.setAttribute('data-position', 'bottom');
    lblDiv.setAttribute('data-tooltip', hint);
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    // Output
    const output: HTMLInputElement = document.createElement('input');
    output.classList.add('col', 's10');
    output.type = 'text';
    output.id = `${func}${name}`;
    output.disabled = true;
    div.appendChild(output);
    // Return
    return div;
}

/**
 * Generate note help
 * 
 * @param   {string[]} notes - List of help texts
 * @returns {HTMLLIElement}  - The list item element containing help texts
 */
function noteGen(notes: string[]): HTMLLIElement {
    // Outer li
    const li: HTMLLIElement = document.createElement('li');
    li.classList.add('active');
    // Header
    const header: HTMLDivElement = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText: HTMLSpanElement = document.createElement('strong');
    headerText.textContent = 'Notes';
    header.appendChild(headerText);
    // Content
    const content: HTMLDivElement = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    const innerUl: HTMLUListElement = document.createElement('ul');
    innerUl.classList.add('browser-default');
    content.appendChild(innerUl);
    for (const note of notes) {
        const innerLi: HTMLLIElement = document.createElement('li');
        innerLi.textContent = note;
        innerUl.appendChild(innerLi);
    }
    // Return
    return li;
}

/**
 * Generate keyboard shortcut help
 * 
 * @param   {Record<string, string>} shortcuts - Shortcut info
 * @returns {HTMLLIElement}                    - The list item element
 *                                               containing help texts
 */
function shortcutGen(shortcuts: Record<string, string>): HTMLLIElement {
    // Outer li
    const li: HTMLLIElement = document.createElement('li');
    // Header
    const header: HTMLDivElement = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText: HTMLSpanElement = document.createElement('strong');
    headerText.textContent = 'Keyboard shortcuts';
    header.appendChild(headerText);
    // Content
    const content: HTMLDivElement = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    // Table
    const tbl: HTMLTableElement = document.createElement('table');
    tbl.classList.add('highlight');
    content.appendChild(tbl);
    // Table head
    const thead: HTMLTableSectionElement = document.createElement('thead');
    tbl.appendChild(thead);
    const headingTr: HTMLTableRowElement = document.createElement('tr');
    thead.appendChild(headingTr);
    for (const head of ['Key Combination', 'Action']) {
        const th: HTMLTableHeaderCellElement = document.createElement('th');
        th.textContent = head;
        headingTr.appendChild(th);
    }
    // Table body
    const tbody: HTMLTableSectionElement = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const [key, action] of Object.entries(shortcuts)) {
        const tr: HTMLTableRowElement = document.createElement('tr');
        tbody.appendChild(tr);
        const keyTd: HTMLTableCellElement = document.createElement('td');
        tr.appendChild(keyTd);
        const keyText: HTMLSpanElement = document.createElement('em');
        keyText.textContent = key;
        keyTd.appendChild(keyText);
        const actionTd: HTMLTableCellElement = document.createElement('td');
        actionTd.textContent = action;
        tr.appendChild(actionTd);
    }
    // Return
    return li;
}

/**
 * Generate input format help
 * 
 * @param   {Record<string, string[]>} formats - Format info
 * @param   {string[]}                 notes   - Extra notes
 * @returns {HTMLLIElement}                    - The list item element
 *                                               containing help texts
 */
function formatGen(formats: Record<string, string[]>, notes: string[]): HTMLLIElement {
    // Outer li
    const li: HTMLLIElement = document.createElement('li');
    // Header
    const header: HTMLDivElement = document.createElement('div');
    header.classList.add('collapsible-header');
    li.appendChild(header);
    const headerText: HTMLSpanElement = document.createElement('strong');
    headerText.textContent = 'Input formats';
    header.appendChild(headerText);
    // Content
    const content: HTMLDivElement = document.createElement('div');
    content.classList.add('collapsible-body');
    li.appendChild(content);
    // Notes
    const innerUl: HTMLUListElement = document.createElement('ul');
    innerUl.classList.add('browser-default');
    content.appendChild(innerUl);
    for (const note of notes) {
        const innerLi: HTMLLIElement = document.createElement('li');
        innerLi.textContent = note;
        innerUl.appendChild(innerLi);
    }
    // Tabel
    const tbl: HTMLTableElement = document.createElement('table');
    tbl.classList.add('highlight');
    content.appendChild(tbl);
    // Table head
    const thead: HTMLTableSectionElement = document.createElement('thead');
    tbl.appendChild(thead);
    const headingTr: HTMLTableRowElement = document.createElement('tr');
    thead.appendChild(headingTr);
    for (const head of ['Type', 'Example']) {
        const th: HTMLTableHeaderCellElement = document.createElement('th');
        th.textContent = head;
        headingTr.appendChild(th);
    }
    // Table body
    const tbody: HTMLTableSectionElement = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const [type, example] of Object.entries(formats)) {
        const tr: HTMLTableRowElement = document.createElement('tr');
        tbody.appendChild(tr);
        const typeTd: HTMLTableCellElement = document.createElement('td');
        tr.appendChild(typeTd);
        const keyText: HTMLSpanElement = document.createElement('em');
        keyText.textContent = type;
        typeTd.appendChild(keyText);
        const exampleTd: HTMLTableCellElement = document.createElement('td');
        exampleTd.textContent = example.join('; ');
        tr.appendChild(exampleTd);
    }
    // Return
    return li;
}

/**
 * Generate help list
 * 
 * @param   {HTMLLIElement} noteLi     - Notes
 * @param   {HTMLLIElement} shortcutLi - Shortcuts
 * @param   {HTMLLIElement} formatLi   - Accepted input formats
 * @returns {HTMLUListElement}         - Final list
 */
function helpGen(noteLi: HTMLLIElement, shortcutLi: HTMLLIElement, formatLi: HTMLLIElement): HTMLUListElement {
    const ul: HTMLUListElement = document.createElement('ul');
    ul.classList.add('collapsible');
    for (const li of [noteLi, shortcutLi, formatLi]) {
        ul.appendChild(li);
    }
    return ul;
}

/**
 * Scientific notations
 * 
 * @param   {number} n   - Input number
 * @param   {number} sfn - SigFigs
 * @returns {string}     - Output string
 */
function sciNotation(n: number, sfn: number): string {
    const absN: number = Math.abs(n);
    if (sfn <= 0) return '0';
    if (absN < 1e6 && absN > 1e-1 || absN === 0) {
        return n.toPrecision(sfn);
    }
    return n.toExponential(sfn - 1);
}

/**
 * Format result
 * 
 * @param   {number} avg - Avg
 * @param   {number} sd  - SD
 * @param   {number} sf  - Decimal accuracy
 * @returns {string}     - Result string
 */
function resultToString(avg: number, sd: number, sf: number): string {
    let sfnAvg: number;
    if (sigFig) {
        if (sigFig2) sf -= 2;
        sfnAvg = sigFigDecimalConversion(avg, sf);
    } else {
        sfnAvg = 15;
        sf = sigFigDecimalConversion(avg, sfnAvg);
    }
    const avgStr: string = sciNotation(avg, sfnAvg);
    let resStr: string;
    if (avgStr.includes('e')) {
        const [avgCo, avgExp]: string[] = avgStr.split('e');
        const sdStr: string = (sd * Math.pow(10, -avgExp)).toFixed(-sf + +avgExp);
        resStr = `\\(({\\color{red} ${avgCo}}\\pm{\\color{blue} ${sdStr}})\\times 10^{${+avgExp}}\\)`;
    } else {
        let sdStr: string;
        if (sf > 0) {
            const exp: number = Math.pow(10, sf);
            sdStr = (Math.round(sd * exp) / exp).toString();
        } else sdStr = sd.toFixed(-sf);
        resStr = `\\({\\color{red} ${avgStr}}\\pm{\\color{blue} ${sdStr}}\\)`;
    }
    return resStr;
}

/**
 * Set counter only
 */
function setAnsCounter(): void {
    const keys: string[] = Object.keys(window.localStorage).filter((val: string): boolean => ['Err', 'Var', 'Lin'].includes(val.slice(0, 3)));
    // Check if localStorage is empty
    if (!keys.length) {
        ansCounter = 1;
        return;
    }
    // List of Ans IDs present
    const ids: number[] = keys.map((val: string): number => +val.slice(3));
    // Ensure no overlapping ID
    ansCounter = Math.max(...ids) + 1;
}

/**
 * Display Ans from localStorage, also set counter
 */
function displayAns(): void {
    const keys: string[] = Object.keys(window.localStorage).filter((val: string): boolean => ['Err', 'Var', 'Lin'].includes(val.slice(0, 3)));
    // Check if localStorage is empty
    if (!keys.length) {
        ansCounter = 1;
        return;
    }
    // Whether to display sigfig
    if (sigFigInp === null) {
        sigFig = false;
        sigFig2 = false;
    } else {
        sigFig = (<HTMLInputElement>sigFigInp).checked;
        sigFig2 = (<HTMLInputElement>sigFig2Inp!).checked;
    }
    // List of Ans IDs present
    const ids: number[] = [];
    // Clear and reassemble table
    clearChildren(outDiv);
    const tbl: HTMLTableElement = document.createElement('table');
    tbl.classList.add('highlight', 'responsive-table', 'centered', 'margin-bottom');
    outDiv.appendChild(tbl);
    // Table header
    const thead: HTMLTableSectionElement = document.createElement('thead');
    tbl.appendChild(thead);
    const trHead: HTMLTableRowElement = document.createElement('tr');
    thead.appendChild(trHead);
    for (const title of ['Ans', 'Formula', 'Result']) {
        const th: HTMLTableHeaderCellElement = document.createElement('th');
        th.textContent = title;
        trHead.appendChild(th);
    }
    // 'Remove all' btn
    const clearTh: HTMLTableHeaderCellElement = document.createElement('th');
    clearTh.classList.add('center');
    trHead.appendChild(clearTh);
    const clearBtn: HTMLAnchorElement = document.createElement('a');
    clearBtn.classList.add('waves-effect', 'btn', 'red');
    clearBtn.textContent = 'All';
    clearBtn.addEventListener('click', (): void => {
        if (!confirm('Do you want to delete all results?')) return;
        for (const key of Object.keys(window.localStorage)) window.localStorage.removeItem(key);
        clearChildren(outDiv);
    });
    clearTh.appendChild(clearBtn);
    // Table body
    const tbody: HTMLTableSectionElement = document.createElement('tbody');
    tbl.appendChild(tbody);
    for (const key of keys.sort((a: string, b: string): number => +a.slice(3) - +b.slice(3))) {
        const data: string = window.localStorage.getItem(key)!;
        // Register ID
        ids.push(+key.slice(3));
        // Parse from localStorage
        const [form, avg, sd, sf]: [string, number, number, number] = JSON.parse(data);
        let formStr: string;
        if (key.slice(0, 3) === 'Err') {
            formStr = `\\(${form}\\)`;
        } else {
            formStr = '';
            for (const n of form.split(';')) {
                if (formStr.length < 13) {
                    formStr += `${n};`;
                } else {
                    formStr += '...';
                    break;
                }
            }
            formStr = `\\(${formStr}\\)`;
        }
        const resStr: string = resultToString(avg, sd, sf);
        const tr: HTMLTableRowElement = document.createElement('tr');
        tbody.appendChild(tr);
        for (const item of [key, formStr, resStr]) {
            const td: HTMLTableCellElement = document.createElement('td');
            td.textContent = item;
            tr.appendChild(td);
        }
        // Remove button
        const td: HTMLTableCellElement = document.createElement('td');
        tr.appendChild(td);
        const btn: HTMLAnchorElement = document.createElement('a');
        btn.classList.add('waves-effect', 'btn', 'red');
        btn.textContent = '×';
        btn.addEventListener('click', (ev: MouseEvent): void => {
            if (ev.isTrusted && !confirm('Do you want to delete this result?')) return;
            window.localStorage.removeItem(key);
            if (Object.keys(window.localStorage).length) tbody.removeChild(tr);
            else clearChildren(outDiv);
        });
        td.appendChild(btn);
    }
    // Ensure no overlapping ID
    ansCounter = Math.max(...ids) + 1;
    // Parse MathJax
    parse();
}

/**
 * Parse MathJax, ignoring errors
 */
function parse(): void {
    try {
        MathJax.typeset!();
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', (): void => {
    document.getElementById('no-script')!.style.display = 'none';
    // Set in/out divs
    inDiv = <HTMLDivElement>document.getElementById('indiv');
    outDiv = <HTMLDivElement>document.getElementById('outdiv');
    helpDiv = <HTMLDivElement>document.getElementById('helpdiv');
    // Check support
    if (!Object.entries || !window.localStorage) {
        const supportedBrowsers: string[] = [
            'Google Chrome 54+',
            'Mozilla Firefox 47+',
            'Apple Safari 11+',
            'Microsoft Edge 14+',
            'Opera 41+'
        ];
        const noSupportP: HTMLParagraphElement = document.createElement('p');
        noSupportP.textContent = 'Your browser is not supported. Please use:'
        outDiv.appendChild(noSupportP);
        const supportedList: HTMLUListElement = document.createElement('ul');
        supportedList.classList.add('browser-default');
        for (const b of supportedBrowsers) {
            const bLI: HTMLLIElement = document.createElement('li');
            bLI.textContent = b;
            supportedList.appendChild(bLI);
        }
        outDiv.appendChild(supportedList);
        return;
    }
    // Function btns
    const propBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('prop');
    const statBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('stat');
    const lregBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('lreg');
    propBtn.addEventListener('click', (): void => {
        propBtn.parentElement!.classList.add('active');
        statBtn.parentElement!.classList.remove('active');
        lregBtn.parentElement!.classList.remove('active');
        // Initialize
        propInit();
    });
    statBtn.addEventListener('click', (): void => {
        statBtn.parentElement!.classList.add('active');
        propBtn.parentElement!.classList.remove('active');
        lregBtn.parentElement!.classList.remove('active');
        // Initialize
        statInit();
    });
    // lregBtn.addEventListener('click', (): void => {
    //     lregBtn.parentElement!.classList.add('active');
    //     propBtn.parentElement!.classList.remove('active');
    //     statBtn.parentElement!.classList.remove('active');
    //     // Initialize
    //     lregInit();
    // });
    // Initialize error propagation
    propInit();
});