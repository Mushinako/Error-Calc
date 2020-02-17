"use strict";
let propInpsDiv;
let sigFigInp;
let sigFig2Inp;
let sigFig;
let sigFig2;
function keyProp(ev) {
    if (ev.altKey || ev.metaKey || ev.ctrlKey)
        return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            ev.preventDefault();
            document.getElementById('propcalc').click();
        }
        return;
    }
    if (ev.shiftKey)
        return;
    if (ev.key.toLowerCase() === 'q') {
        ev.preventDefault();
        const addRowBtn = document.getElementById('propaddrow');
        if (addRowBtn !== null)
            addRowBtn.click();
        return;
    }
    if (ev.key.toLowerCase() === 'w') {
        ev.preventDefault();
        if (!['as', 'md'].includes(mode))
            return;
        const rows = propInpsDiv.childNodes[0].childNodes;
        const inpRow = rows[rows.length - 2];
        if (inpRow.childNodes.length < 3)
            return;
        const btn = inpRow.childNodes[2].childNodes[0];
        btn.click();
        return;
    }
    if (ev.key.toLowerCase() === 'z') {
        ev.preventDefault();
        if (!outDiv.hasChildNodes() && confirm('Do you want to delete the last result?'))
            return;
        const tbody = outDiv.childNodes[0].childNodes[1];
        const lastRes = tbody.lastChild;
        const btn = lastRes.lastChild.childNodes[0];
        btn.click();
        return;
    }
    if (ev.key.toLowerCase() === 's') {
        ev.preventDefault();
        sigFigInp.checked = !sigFigInp.checked;
        sigFig2Inp.disabled = !sigFigInp.checked;
        displayAns();
        return;
    }
    if (ev.key.toLowerCase() === 'd') {
        ev.preventDefault();
        if (sigFig2Inp.disabled)
            return;
        sigFig2Inp.checked = !sigFig2Inp.checked;
        displayAns();
        return;
    }
    const funcKeys = ['r', 't', 'y', 'u', 'i', 'o', 'p'];
    const func = funcKeys.indexOf(ev.key.toLowerCase());
    if (func > -1) {
        ev.preventDefault();
        const btnNodes = document.getElementById('btns').childNodes;
        const btns = Array.from(btnNodes).filter((val) => {
            const tn = val.tagName;
            if (tn === undefined)
                return false;
            return tn.toLowerCase() === 'a';
        });
        btns[func].click();
        return;
    }
}
function propInit() {
    document.addEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyLreg);
    clearChildren(inDiv);
    const ttlElmt = createTtl('Error Propagation');
    inDiv.appendChild(ttlElmt);
    const btnsDiv = document.createElement('div');
    btnsDiv.classList.add('center', 'margin-bottom');
    setBtns(copers, btnsDiv);
    setBtns(nopers, btnsDiv);
    setBtns(topers, btnsDiv);
    inDiv.appendChild(btnsDiv);
    appendHr(inDiv);
    propInpsDiv = document.createElement('div');
    inDiv.appendChild(propInpsDiv);
    appendHr(inDiv);
    const switches = createSwitches();
    inDiv.appendChild(switches);
    const notes = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'All variables are assumed to be independent of one another',
        'Use respective answer (e.g., \"Err1\", \"Var2\", \"Lin3\", etc.) as the average to use previously calculated values for better precision',
        'Use \"×/÷\" to calculate reciprocals. Put the number on the first line, choose \"÷\", remove the second line, and hit \"Calculate\"',
        'To calculate SigFigs, use appropriate SigFigs in the input (e.g., \"3.0\" instead of \"3\")'
    ];
    const shortcuts = {
        'Enter': 'Open dropdown (when applicable); Submit choice (when applicable)',
        'Shift+Enter': 'Run calculation',
        'Tab': 'Next input/element',
        'Shift+Tab': 'Previous input/element',
        '↓': 'Next dropdown choice',
        '↑': 'Previous dropdown choice',
        'q': 'Add row (when applicable)',
        'w': 'Remove row (when applicable)',
        's': 'Change \"Calculate SigFigs\" switch',
        'd': 'Change \"2 more SigFigs\" switch',
        'z': 'Remove last result (if any)',
        'r': 'Change mode to \"+/-\"',
        't': 'Change mode to \"×/÷\"',
        'y': 'Change mode to \"ln\"',
        'u': 'Change mode to \"log\"',
        'i': 'Change mode to \"e^\"',
        'o': 'Change mode to \"10^\"',
        'p': 'Change mode to \"a^x\"'
    };
    const formats = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32'],
        'Previous Answers': ['Err1', 'Var3', 'Lin15']
    };
    const formatNote = ['All empty inputs are treated as 0'];
    const noteLi = noteGen(notes);
    const shortcutsLi = shortcutGen(shortcuts);
    const formatLi = formatGen(formats, formatNote);
    const helpUl = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    btnsDiv.childNodes[1].click();
}
