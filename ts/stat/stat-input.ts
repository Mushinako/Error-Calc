"use strict";

/**
 * One-variable statistics input functions
 *
 * - Create outputs
 */

/**
 * Create single stat output div, half-width
 * 
 * @param   {string} name    - Name of output
 * @param   {string} formula - Formula of output
 * @returns {HTMLDivElement} - The div element
 */
function createStatOutputHalfDiv(name: string, formula: string): HTMLDivElement {
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

/**
 * Create single stat output div, full-width
 * 
 * @param   {string} name    - Name of output
 * @param   {string} formula - Formula of output
 * @returns {HTMLDivElement} - The div element
 */
function createStatOutputFullDiv(name: string, formula: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('col', 's1', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    // Output
    const output: HTMLTextAreaElement = document.createElement('textarea');
    output.classList.add('col', 's11', 'materialize-textarea');
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    // Return
    return div;
}