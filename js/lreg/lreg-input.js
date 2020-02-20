"use strict";
function createLregOutputPmDiv(name, formula) {
    const div = document.createElement('div');
    div.classList.add('col', 's12', 'input-field');
    const lblDiv = document.createElement('div');
    lblDiv.classList.add('col', 's1', 'center');
    lblDiv.textContent = `\\(${formula}\\)`;
    div.appendChild(lblDiv);
    const avgOut = document.createElement('input');
    avgOut.classList.add('col', 's5');
    avgOut.type = 'text';
    avgOut.id = `lreg${name}avg`;
    avgOut.disabled = true;
    div.appendChild(avgOut);
    const pmDiv = document.createElement('div');
    pmDiv.classList.add('col', 's1', 'center');
    div.appendChild(pmDiv);
    const pmBtn = document.createElement('a');
    pmBtn.classList.add('btn-flat', 'no-click');
    pmBtn.textContent = '±';
    pmDiv.appendChild(pmBtn);
    const sdOut = document.createElement('input');
    sdOut.classList.add('col', 's5');
    sdOut.type = 'text';
    sdOut.id = `lreg${name}sd`;
    sdOut.disabled = true;
    div.appendChild(sdOut);
    return div;
}
