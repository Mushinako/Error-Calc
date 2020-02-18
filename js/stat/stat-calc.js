"use strict";
function statSanInp(inpStr) {
    const inps = inpStr.split('\n').filter((val) => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    const sanInps = [];
    for (const inp of inps) {
        const parsed = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
        if (parsed === null)
            continue;
        const parsedVal = parsed[1];
        if (parsedVal === '')
            continue;
        sanInps.push(parsedVal);
    }
    return sanInps;
}
function statCalc() {
    const inpStr = statInp.value;
    const sanInpStrs = statSanInp(inpStr);
    statInp2.value = sanInpStrs.join('\n');
    M.textareaAutoResize(statInp2);
    const sanInps = sanInpStrs.map((val) => +val);
    const n = sanInps.length;
    document.getElementById('statn').value = n.toString();
    const sum = sanInps.reduce((acc, cur) => acc + cur, 0);
    const avg = sum / n;
    document.getElementById('statxbar').value = avg.toString();
    const sumSquaredDiff = sanInps.reduce((acc, cur) => acc + Math.pow(avg - cur, 2), 0);
    const variance = sumSquaredDiff / (n - 1);
    document.getElementById('stats2').value = variance.toString();
    const sd = Math.sqrt(variance);
    document.getElementById('stats').value = sd.toString();
    window.localStorage.setItem(`Var${ansCounter}`, JSON.stringify([sanInpStrs.join(','), avg, sd, sigFigDecimalConversion(avg, 15)]));
    setAnsCounter();
}
