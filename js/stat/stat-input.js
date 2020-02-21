"use strict";
function createStatOutputFullDiv(name, formula, hint) {
    const div = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center', 'tooltipped');
    lblDiv.setAttribute('data-position', 'bottom');
    lblDiv.setAttribute('data-tooltip', hint);
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    const output = document.createElement('textarea');
    output.classList.add('col', 's10', 'materialize-textarea');
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    return div;
}
