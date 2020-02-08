"use strict";

interface SpecHTMLFormElement extends HTMLFormElement {
    numInp: number;
    addRow: () => void;
}

var form: SpecHTMLFormElement;
const opers: string[] = ['+', '-', '×', '÷', '1÷'];

/**
 * document.getElementById shorthand
 * 
 * @param   {string}       e - ID of element
 * @returns {HTMLElement?}   - If exists, the element
 */
const byId = (e: string): HTMLElement | null => document.getElementById(e);


/**
 * Create HTMLDivElement containing the HTMLSelectELement used here
 *
 * @param   {string}         id - ID of select
 * @returns {HTMLDivElement}    - The element
 */
function createSelectDiv(id: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's2');
    const sel: HTMLSelectElement = document.createElement('select');
    return div;
}


/**
 * Create HTMLDivElement containing the HTMLInputELement used here
 * 
 * @param   {string}         id - ID of input
 * @returns {HTMLDivElement}    - The element
 */
function createInputDiv(id: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp: HTMLInputElement = document.createElement('input');
    inp.id = inp.name = id;
    inp.type = 'number';
    div.appendChild(inp);
    return div;
}


/**
 * Create HTMLLabelElement for first line
 * 
 * @param   {string}           id  - ID of corresponding input
 * @param   {string}           txt - Text in label
 * @returns {HTMLLabelElement}     - The label
 */
function createLabel(id: string, text: string): HTMLLabelElement {
    const lbl: HTMLLabelElement = document.createElement('label');
    lbl.htmlFor = id;
    const txt: Text = document.createTextNode(text);
    lbl.appendChild(txt);
    return lbl;
}


document.addEventListener('DOMContentLoaded', () => {
    form = <SpecHTMLFormElement>byId('inp');
    form.numInp = 0;
    form.addRow = function (): void {
        // Operation
        const opDiv: HTMLDivElement = createSelectDiv(`op${this.numInp}`);
        if (!this.numInp) {
            const opLbl: HTMLLabelElement = createLabel('op0', 'Operation');
            opDiv.appendChild(opLbl);
        }
        // Average
        const avDiv: HTMLDivElement = createInputDiv(`av${this.numInp}`);
        if (!this.numInp) {
            const avLbl: HTMLLabelElement = createLabel('av0', 'Average');
            avDiv.appendChild(avLbl);
        }
        // SD
        const sdDiv: HTMLDivElement = createInputDiv(`sd${this.numInp}`);
        if (!this.numInp) {
            const sdLbl: HTMLLabelElement = createLabel('sd0', 'SD');
            sdDiv.appendChild(sdLbl);
        }
        // Appending
        for (const e of [opDiv, avDiv, sdDiv]) this.appendChild(e);
        this.numInp++;
    };
    form.remRow = function (): void {
        if (this.numInp <= 1) return;
        this.removeChild(<ChildNode>this.lastChild);
        this.numInp--;
    }
    form.addRow();
});