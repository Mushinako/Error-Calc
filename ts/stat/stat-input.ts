"use strict";

/**
 * One-variable statistics input functions
 *
 * - Create outputs
 */


function createStatOutputDiv(name: string, formula: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's12', 'm6', 'input-field');
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    // Output
    const output: HTMLInputElement = document.createElement('input');
    output.classList.add('col', 's10');
    output.type = 'text';
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    // Return
    return div;
}