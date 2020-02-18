"use strict";
function createStatOutputDiv(name, formula) {
    const div = document.createElement('div');
    div.classList.add('col', 's12', 'm6', 'input-field');
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('col', 's2', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    const output = document.createElement('input');
    output.classList.add('col', 's10');
    output.type = 'text';
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    return div;
}
