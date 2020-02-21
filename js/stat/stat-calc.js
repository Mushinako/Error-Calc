"use strict";
function statSanInp(inpStr) {
    const inps = inpStr.split('\n').filter((val) => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    let sanVals = [];
    const sanInps = [];
    for (const inp of inps) {
        if (inp.slice(0, 3) === 'Var') {
            const parsedAnsKey = /^(Var\d+)(?:\D|$)/.exec(inp);
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
            const nums = formula.split(';');
            sanVals = sanVals.concat(nums);
            sanInps.push(ansKey);
        }
        else if (['Err', 'Lin'].includes(inp.slice(0, 3))) {
            alert('\"Err\" and \"Lin\" are not allowed!');
            continue;
        }
        else {
            const parsed = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
            if (parsed === null)
                continue;
            const parsedVal = parsed[1];
            if (parsedVal === '')
                continue;
            sanInps.push(parsedVal);
            sanVals.push(parsedVal);
        }
    }
    return [sanVals, sanInps];
}
function statCalc() {
    const inpStr = statInp.value;
    const [sanValStrs, sanInpStrs] = statSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check = sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Var';
    statInp2.value = sanValStrs.join('\n');
    const name = `Var${ansCounter}`;
    if (!check)
        statInp2.value += `\n(Saved as \"${name}\")`;
    M.textareaAutoResize(statInp2);
    const sanInps = sanValStrs.map((val) => +val);
    const n = sanInps.length;
    document.getElementById('statn').value = n.toString();
    const sum = sanInps.reduce((acc, cur) => acc + cur, 0);
    const avg = sum / n;
    document.getElementById('statxbar').value = avg.toString();
    const sumSquaredDiff = sanInps.reduce((acc, cur) => acc + Math.pow(avg - cur, 2), 0);
    const variance = sumSquaredDiff / (n - 1);
    const qTextarea = document.getElementById('statq');
    let sd;
    if (isNaN(variance)) {
        document.getElementById('stats2').value = 'N/A';
        sd = 0;
        document.getElementById('stats').value = 'N/A';
        document.getElementById('statt').value = 'N/A';
        document.getElementById('statts').value = 'N/A';
        qTextarea.value = 'No more data can be removed. Removing 1 more data point will remove 100% of all data.';
    }
    else {
        document.getElementById('stats2').value = variance.toString();
        sd = Math.sqrt(variance);
        document.getElementById('stats').value = sd.toString();
        const ciInp = statTDiv.childNodes[0].childNodes[0];
        const alpha = +ciInp.value.split('/')[2];
        const t = jStat.studentt.inv(1 - alpha, n - 1);
        document.getElementById('statt').value = t.toString();
        document.getElementById('statts').value = (t * sd).toString();
    }
    M.textareaAutoResize(qTextarea);
    const sigFig = Math.max(...sanValStrs.map((val) => numAccuracy(val)));
    if (!check) {
        window.localStorage.setItem(name, JSON.stringify([sanValStrs.join(';'), avg, sd, sigFig]));
        setAnsCounter();
    }
}
