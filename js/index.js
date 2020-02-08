"use strict";
var form;
const opers = ['+', '-', '×', '÷', '1÷'];
/**
 * document.getElementById shorthand
 *
 * @param   {string}       e - ID of element
 * @returns {HTMLElement?}   - If exists, the element
 */
const byId = (e) => document.getElementById(e);
/**
 * Create HTMLDivElement containing the HTMLSelectELement used here
 *
 * @param   {string}         id - ID of select
 * @returns {HTMLDivElement}    - The element
 */
function createSelectDiv(id) {
    const div = document.createElement('div');
    div.classList.add('input-field', 'col', 's2');
    const sel = document.createElement('select');
    return div;
}
/**
 * Create HTMLDivElement containing the HTMLInputELement used here
 *
 * @param   {string}         id - ID of input
 * @returns {HTMLDivElement}    - The element
 */
function createInputDiv(id) {
    const div = document.createElement('div');
    div.classList.add('input-field', 'col', 's5');
    const inp = document.createElement('input');
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
function createLabel(id, text) {
    const lbl = document.createElement('label');
    lbl.htmlFor = id;
    const txt = document.createTextNode(text);
    lbl.appendChild(txt);
    return lbl;
}
document.addEventListener('DOMContentLoaded', () => {
    form = byId('inp');
    form.numInp = 0;
    form.addRow = function () {
        // Operation
        const opDiv = createSelectDiv(`op${this.numInp}`);
        if (!this.numInp) {
            const opLbl = createLabel('op0', 'Operation');
            opDiv.appendChild(opLbl);
        }
        // Average
        const avDiv = createInputDiv(`av${this.numInp}`);
        if (!this.numInp) {
            const avLbl = createLabel('av0', 'Average');
            avDiv.appendChild(avLbl);
        }
        // SD
        const sdDiv = createInputDiv(`sd${this.numInp}`);
        if (!this.numInp) {
            const sdLbl = createLabel('sd0', 'SD');
            sdDiv.appendChild(sdLbl);
        }
        // Appending
        for (const e of [opDiv, avDiv, sdDiv])
            this.appendChild(e);
        this.numInp++;
    };
    form.remRow = function () {
        if (this.numInp <= 1)
            return;
        this.removeChild(this.lastChild);
        this.numInp--;
    };
    form.addRow();
});
