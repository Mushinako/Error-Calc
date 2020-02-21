"use strict";

/**
 * One-variable statistics input functions
 *
 * - Create outputs
 */

/**
 * Create single stat output div, full-width
 * 
 * @param   {string} name    - Name of output
 * @param   {string} formula - Formula of output
 * @param   {string} hint    - Hint of output
 * @returns {HTMLDivElement} - The div element
 */
function createStatOutputFullDiv(name: string, formula: string, hint: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    // Label
    const lblDiv: HTMLDivElement = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center', 'tooltipped');
    lblDiv.setAttribute('data-position', 'bottom');
    lblDiv.setAttribute('data-tooltip', hint);
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    // Output
    const output: HTMLTextAreaElement = document.createElement('textarea');
    output.classList.add('col', 's10', 'materialize-textarea');
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    // Return
    return div;
}