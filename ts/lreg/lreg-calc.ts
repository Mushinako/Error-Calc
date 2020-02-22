"use strict";

/**
 * Linear regression calculation functions
 *
 * - Calculation
 */

/**
 * Sanitize linear regression input
 *
 * @param   {string} inpStr - Raw input string from textarea
 * @returns {string[][]}    - Parsed values
 * @returns {string[]}      - Parsed inputs
 */
function lregSanInp(inpStr: string): [string[][], string[]] {
    const inps: string[] = inpStr.split('\n').filter((val: string): boolean => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    let sanVals: string[][] = [];
    const sanInps: string[] = [];
    for (const inp of inps) {
        if (inp.slice(0, 3) === 'Lin') {
            // Ans
            const parsedAnsKey: RegExpExecArray | null = /^(Lin\d+)(?:\D|$)/.exec(inp);
            if (parsedAnsKey === null) {
                alert(`\"${inp}\" is not a parsable previous answer!`);
                continue;
            }
            const ansKey: string = parsedAnsKey[1];
            const ans: string | null = window.localStorage.getItem(ansKey);
            if (ans === null) {
                alert(`\"${ansKey}\" does not exist!`);
                continue;
            }
            const formula: string = JSON.parse(ans)[0];
            const points: string[] = formula.split(';');
            const nums: string[][] = points.map((val: string): string[] => val.slice(1, val.length - 1).split(','));
            sanVals = sanVals.concat(nums);
            sanInps.push(ansKey);
        } else if (['Err', 'Var'].includes(inp.slice(0, 3))) {
            alert('\"Err\" and \"Var\" are not allowed!');
            continue;
        } else {
            // No ans
            const separated: string[] = inp.split(/[ \t]+/);
            if (separated.length < 2) continue;
            const inp2: string = `${separated[0]};${separated[separated.length - 1]}`;
            const parsed: RegExpExecArray | null = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?);([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp2);
            if (parsed === null) continue;
            const parsedVals: string[] = [parsed[1], parsed[2]];
            if (parsedVals.includes('')) continue;
            sanVals.push(parsedVals);
            sanInps.push(`(${parsedVals.join(',')})`);
        }
    }
    return [sanVals, sanInps];
}

/**
 * Calculate linear regression
 * 
 * @param {boolean} saveable - Whether to save
 */
function lregCalc(saveable: boolean): void {
    clearChildren(lregInp2);
    // Get input
    const inpStr: string = lregInp.value;
    // Sanitize input
    const [sanValStrs, sanInpStrs]: [string[][], string[]] = lregSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check: boolean = !saveable || (sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Lin');
    // Show parsed output
    for (const vars of sanValStrs) {
        const tr: HTMLTableRowElement = document.createElement('tr');
        lregInp2.appendChild(tr);
        for (const v of vars) {
            const td: HTMLTableCellElement = document.createElement('td');
            td.textContent = v;
            tr.appendChild(td);
        }
    }
    const name: string = `Lin${ansCounter}`;
    if (!check) {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = `(Saved as \"${name}\")`;
        lregInp2.parentElement!.parentElement!.appendChild(p);
    }
    // Calculations
    const sanInps: number[][] = sanValStrs.map((val: string[]): number[] => val.map((v: string): number => +v));
    // n
    const n: number = sanInps.length;
    // df
    const df: number = n - 2;
    (<HTMLInputElement>document.getElementById('lregdf')).value = df.toString();
    // Intercept?
    const zeroInt: boolean = lregInpIntercept.checked;
    // Avgs
    let xSum: number = 0;
    let ySum: number = 0;
    let x2Sum: number = 0;
    let xySum: number = 0;
    for (const [x, y] of sanInps) {
        xSum += x;
        ySum += y;
        x2Sum += x * x;
        xySum += x * y;
    }
    const xAvg: number = xSum / n;
    const yAvg: number = ySum / n;
    const x2Avg: number = x2Sum / n;
    const xyAvg: number = xySum / n;
    // Sum squared diff
    let xS2N: number = 0;
    let xySN: number = 0;
    let yS2N: number = 0;
    for (const [x, y] of sanInps) {
        const xDiff: number = x - xAvg;
        const yDiff: number = y - yAvg;
        xS2N += xDiff * xDiff;
        xySN += xDiff * yDiff;
        yS2N += yDiff * yDiff;
    }
    // m, b
    const m: number = xySN / xS2N;
    const b: number = yAvg - m * xAvg;
    const m0: number = xyAvg / x2Avg;
    if (zeroInt) {
        (<HTMLInputElement>document.getElementById('lregm')).value = sciNotation(m0);
        (<HTMLInputElement>document.getElementById('lregb')).value = '0';
    } else {
        (<HTMLInputElement>document.getElementById('lregm')).value = sciNotation(m);
        (<HTMLInputElement>document.getElementById('lregb')).value = sciNotation(b);
    }
    // r^2
    let e2Sum: number = 0;
    let e02Sum: number = 0;
    for (const [x, y] of sanInps) {
        const e: number = y - m * x - b;
        const e0: number = y - m0 * x;
        e2Sum += e * e;
        e02Sum += e0 * e0;
    }
    const coeffDet: number = 1 - (zeroInt ? e02Sum : e2Sum) / yS2N;
    (<HTMLInputElement>document.getElementById('lregr2')).value = sciNotation(coeffDet);
    // sm, sb, sy
    const sm: number = Math.sqrt(e2Sum / xS2N / df);
    const sm0: number = Math.sqrt(e02Sum / xS2N / df);
    const sb: number = sm * Math.sqrt(x2Avg);
    const sy: number = Math.sqrt(e2Sum / df);
    const sy0: number = Math.sqrt(e02Sum / df);
    if (zeroInt) {
        (<HTMLInputElement>document.getElementById('lregsm')).value = sciNotation(sm0);
        (<HTMLInputElement>document.getElementById('lregsb')).value = 'N/A';
        (<HTMLInputElement>document.getElementById('lregsy')).value = sciNotation(sy0);
    } else {
        (<HTMLInputElement>document.getElementById('lregsm')).value = sciNotation(sm);
        (<HTMLInputElement>document.getElementById('lregsb')).value = sciNotation(sb);
        (<HTMLInputElement>document.getElementById('lregsy')).value = sciNotation(sy);
    }
    // F-statistic
    (<HTMLInputElement>document.getElementById('lregf')).value = 'Not implemented yet';
    // SigFig
    const sigFig: number = Math.max(...sanValStrs.map(([x, y]: string[]): number => numAccuracy(y) - numAccuracy(x)));
    // Save
    if (!check) {
        const formula: string = sanValStrs.map((val: string[]): string => `(${val.join(',')})`).join(';');
        window.localStorage.setItem(name, JSON.stringify([formula, 0, 0, 0]));
        window.localStorage.setItem(`${name}m`, JSON.stringify(['', m, sm, sigFig]));
        window.localStorage.setItem(`${name}m0`, JSON.stringify(['', m0, sm0, sigFig]));
        window.localStorage.setItem(`${name}b`, JSON.stringify(['', b, sb, sigFig]));
        // Set counter
        setAnsCounter();
    }
}