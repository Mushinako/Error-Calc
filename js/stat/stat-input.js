"use strict";
function createStatOutputHalfDiv(name, formula) {
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
function createStatOutputFullDiv(name, formula) {
    const div = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('col', 's1', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    const output = document.createElement('textarea');
    output.classList.add('col', 's11', 'materialize-textarea');
    output.id = `stat${name}`;
    output.disabled = true;
    div.appendChild(output);
    return div;
}
