"use strict";
function lregSanInp(inpStr) {
    const inps = inpStr.split('\n').filter((val) => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    let sanVals = [];
    const sanInps = [];
    for (const inp of inps) {
        if (inp.slice(0, 3) === 'Lin') {
            const parsedAnsKey = /^(Lin\d+)(?:\D|$)/.exec(inp);
            if (parsedAnsKey === null) {
                alert(`\"${inp}\" is not a parsable previous answer!`);
                continue;
            }
            const ansKey = parsedAnsKey[1];
            const ans = window.localStorage.getItem(ansKey);
            if (ans === null) {
                alert(`\"${ansKey}\" does not exist!`);
                continue;
            }
            const formula = JSON.parse(ans)[0];
            const points = formula.split(';');
            const nums = points.map((val) => val.slice(1, val.length - 1).split(','));
            sanVals = sanVals.concat(nums);
            sanInps.push(ansKey);
        }
        else if (['Err', 'Var'].includes(inp.slice(0, 3))) {
            alert('\"Err\" and \"Var\" are not allowed!');
            continue;
        }
        else {
            const parsed = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)[ \t]+([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
            if (parsed === null)
                continue;
            const parsedVals = [parsed[1], parsed[2]];
            if (parsedVals.includes(''))
                continue;
            sanVals.push(parsedVals);
            sanInps.push(`(${parsedVals.join(',')})`);
        }
    }
    return [sanVals, sanInps];
}
function lregCalc() {
    const inpStr = lregInp.value;
    const [sanValStrs, sanInpStrs] = lregSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check = sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Lin';
    for (const vars of sanValStrs) {
        const tr = document.createElement('tr');
        lregInp2.appendChild(tr);
        for (const v of vars) {
            const td = document.createElement('td');
            td.textContent = v;
            tr.appendChild(td);
        }
    }
    const name = `Var${ansCounter}`;
    if (!check) {
        const p = document.createElement('p');
        p.textContent = `(Saved as \"${name}\")`;
        lregInp2.parentElement.parentElement.appendChild(p);
    }
}
