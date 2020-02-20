"use strict";

/**
 * Linear regression input functions
 *
 * - Create outputs
 */

/**
 * Create single lreg output div with ±
 * 
 * @param   {string} name    - Name of output
 * @param   {string} formula - Formula of output
 * @returns {HTMLDivElement} - The div element
 */
function createLregOutputPmDiv(name: string, formula: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('col', 's1', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    // Avg
    const avgOut: HTMLInputElement = document.createElement('input');
    avgOut.classList.add('col', 's5');
    avgOut.type = 'text';
    avgOut.id = `lreg${name}avg`;
    avgOut.disabled = true;
    div.appendChild(avgOut);
    // ±
    const pmDiv: HTMLDivElement = document.createElement('div');
    pmDiv.classList.add('col', 's1', 'center');
    div.appendChild(pmDiv);
    const pmBtn: HTMLAnchorElement = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    // SD
    const sdOut: HTMLInputElement = document.createElement('input');
    sdOut.classList.add('col', 's5');
    sdOut.type = 'text';
    sdOut.id = `lreg${name}sd`;
    sdOut.disabled = true;
    div.appendChild(sdOut);
    // Return
    return div;
}
