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
    const sanInps = sanValStrs.map((val) => val.map((v) => +v));
    const n = sanInps.length;
    const df = n - 2;
    document.getElementById('lregdf').value = df.toString();
    const zeroInt = lregInpIntercept.checked;
    let m;
    let b;
    let yAvg;
    let x2Avg;
    let xS2N = 0;
    let yS2N = 0;
    if (zeroInt) {
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
        yAvg = ySum / n;
        x2Avg = x2Sum / n;
        const xyAvg = xySum / n;
        for (const [x, y] of sanInps) {
            const xDiff = x - xAvg;
            const yDiff = y - yAvg;
            xS2N += xDiff * xDiff;
            yS2N += yDiff * yDiff;
        }
        m = xyAvg / x2Avg;
        b = 0;
    }
    else {
        let xSum = 0;
        let ySum = 0;
        let x2Sum = 0;
        for (const [x, y] of sanInps) {
            xSum += x;
            ySum += y;
            x2Sum += x * x;
        }
        const xAvg = xSum / n;
        yAvg = ySum / n;
        x2Avg = x2Sum / n;
        let xySN = 0;
        for (const [x, y] of sanInps) {
            const xDiff = x - xAvg;
            const yDiff = y - yAvg;
            xS2N += xDiff * xDiff;
            xySN += xDiff * yDiff;
            yS2N += yDiff * yDiff;
        }
        m = xySN / xS2N;
        b = yAvg - m * xAvg;
    }
    document.getElementById('lregm').value = m.toString();
    document.getElementById('lregb').value = b.toString();
    let e2Sum = 0;
    for (const [x, y] of sanInps) {
        const e = y - m * x - b;
        e2Sum += e * e;
    }
    const coeffDet = 1 - e2Sum / yS2N;
    document.getElementById('lregr2').value = coeffDet.toString();
    const sm = Math.sqrt(e2Sum / xS2N / df);
    document.getElementById('lregsm').value = sm.toString();
    if (zeroInt) {
        document.getElementById('lregsb').value = 'N/A';
    }
    else {
        const sb = sm * Math.sqrt(x2Avg);
        document.getElementById('lregsb').value = sb.toString();
    }
    const sy = Math.sqrt(e2Sum / df);
    document.getElementById('lregsy').value = sy.toString();
    document.getElementById('lregf').value = 'Not implemented yet';
}
