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
            const separated = inp.split(/[ \t]+/);
            if (separated.length < 2)
                continue;
            const inp2 = `${separated[0]};${separated[separated.length - 1]}`;
            const parsed = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?);([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp2);
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
function lregCalc(saveable) {
    clearChildren(lregInp2);
    const inpStr = lregInp.value;
    const [sanValStrs, sanInpStrs] = lregSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check = !saveable || (sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Lin');
    for (const vars of sanValStrs) {
        const tr = document.createElement('tr');
        lregInp2.appendChild(tr);
        for (const v of vars) {
            const td = document.createElement('td');
            td.textContent = v;
            tr.appendChild(td);
        }
    }
    const name = `Lin${ansCounter}`;
    if (!check) {
        const p = document.createElement('p');
        p.textContent = `(Saved as \"${name}\")`;
        lregInp2.parentElement.parentElement.appendChild(p);
    }
    const sanInps = sanValStrs.map((val) => val.map((v) => +v));
    const n = sanInps.length;
    const df = n - 2;
    document.getElementById('lregdf').value = df.toString();
    const zeroInt = lregInpIntercept.checked;
    let xSum = 0;
    let ySum = 0;
    let x2Sum = 0;
    let xySum = 0;
    for (const [x, y] of sanInps) {
        xSum += x;
        ySum += y;
        x2Sum += x * x;
        xySum += x * y;
    }
    const xAvg = xSum / n;
    const yAvg = ySum / n;
    const x2Avg = x2Sum / n;
    const xyAvg = xySum / n;
    let xS2N = 0;
    let xySN = 0;
    let yS2N = 0;
    for (const [x, y] of sanInps) {
        const xDiff = x - xAvg;
        const yDiff = y - yAvg;
        xS2N += xDiff * xDiff;
        xySN += xDiff * yDiff;
        yS2N += yDiff * yDiff;
    }
    const m = xySN / xS2N;
    const b = yAvg - m * xAvg;
    const m0 = xyAvg / x2Avg;
    if (zeroInt) {
        document.getElementById('lregm').value = sciNotation(m0);
        document.getElementById('lregb').value = '0';
    }
    else {
        document.getElementById('lregm').value = sciNotation(m);
        document.getElementById('lregb').value = sciNotation(b);
    }
    let e2Sum = 0;
    let e02Sum = 0;
    for (const [x, y] of sanInps) {
        const e = y - m * x - b;
        const e0 = y - m0 * x;
        e2Sum += e * e;
        e02Sum += e0 * e0;
    }
    const coeffDet = 1 - (zeroInt ? e02Sum : e2Sum) / yS2N;
    document.getElementById('lregr2').value = sciNotation(coeffDet);
    const sm = Math.sqrt(e2Sum / xS2N / df);
    const sm0 = Math.sqrt(e02Sum / xS2N / df);
    const sb = sm * Math.sqrt(x2Avg);
    const sy = Math.sqrt(e2Sum / df);
    const sy0 = Math.sqrt(e02Sum / df);
    if (zeroInt) {
        document.getElementById('lregsm').value = sciNotation(sm0);
        document.getElementById('lregsb').value = 'N/A';
        document.getElementById('lregsy').value = sciNotation(sy0);
    }
    else {
        document.getElementById('lregsm').value = sciNotation(sm);
        document.getElementById('lregsb').value = sciNotation(sb);
        document.getElementById('lregsy').value = sciNotation(sy);
    }
    document.getElementById('lregf').value = 'Not implemented yet';
    const sigFig = Math.max(...sanValStrs.map(([x, y]) => numAccuracy(y) - numAccuracy(x)));
    if (!check) {
        const formula = sanValStrs.map((val) => `(${val.join(',')})`).join(';');
        window.localStorage.setItem(name, JSON.stringify([formula, 0, 0, 0]));
        window.localStorage.setItem(`${name}m`, JSON.stringify(['', m, sm, sigFig]));
        window.localStorage.setItem(`${name}m0`, JSON.stringify(['', m0, sm0, sigFig]));
        window.localStorage.setItem(`${name}b`, JSON.stringify(['', b, sb, sigFig]));
        setAnsCounter();
    }
}
