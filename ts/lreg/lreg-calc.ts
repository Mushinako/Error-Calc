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
 */
function lregCalc(): void {
    // Get input
    const inpStr: string = lregInp.value;
    // Sanitize input
    const [sanValStrs, sanInpStrs]: [string[][], string[]] = lregSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check: boolean = sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Lin';
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
    // Show parsed output
    const name: string = `Var${ansCounter}`;
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
    // m, b
    let m: number;
    let b: number;
    let yAvg: number;
    let x2Avg: number;
    let xS2N: number = 0;
    let yS2N: number = 0;
    if (zeroInt) {
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
        yAvg = ySum / n;
        x2Avg = x2Sum / n;
        const xyAvg: number = xySum / n;
        // Sum squared diff
        for (const [x, y] of sanInps) {
            const xDiff: number = x - xAvg;
            const yDiff: number = y - yAvg;
            xS2N += xDiff * xDiff;
            yS2N += yDiff * yDiff;
        }
        m = xyAvg / x2Avg;
        b = 0;
    } else {
        // Avgs
        let xSum: number = 0;
        let ySum: number = 0;
        let x2Sum: number = 0;
        for (const [x, y] of sanInps) {
            xSum += x;
            ySum += y;
            x2Sum += x * x;
        }
        const xAvg: number = xSum / n;
        yAvg = ySum / n;
        x2Avg = x2Sum / n;
        // Sum squared diff
        let xySN: number = 0;
        for (const [x, y] of sanInps) {
            const xDiff: number = x - xAvg;
            const yDiff: number = y - yAvg;
            xS2N += xDiff * xDiff;
            xySN += xDiff * yDiff;
            yS2N += yDiff * yDiff;
        }
        m = xySN / xS2N;
        b = yAvg - m * xAvg;
    }
    (<HTMLInputElement>document.getElementById('lregm')).value = m.toString();
    (<HTMLInputElement>document.getElementById('lregb')).value = b.toString();
    // r^2
    let e2Sum: number = 0;
    for (const [x, y] of sanInps) {
        const e: number = y - m * x - b;
        e2Sum += e * e;
    }
    const coeffDet: number = 1 - e2Sum / yS2N;
    (<HTMLInputElement>document.getElementById('lregr2')).value = coeffDet.toString();
    // sm, sb, sy
    const sm: number = Math.sqrt(e2Sum / xS2N / df);
    (<HTMLInputElement>document.getElementById('lregsm')).value = sm.toString();
    if (zeroInt) {
        (<HTMLInputElement>document.getElementById('lregsb')).value = 'N/A';
    } else {
        const sb: number = sm * Math.sqrt(x2Avg);
        (<HTMLInputElement>document.getElementById('lregsb')).value = sb.toString();
    }
    const sy: number = Math.sqrt(e2Sum / df);
    (<HTMLInputElement>document.getElementById('lregsy')).value = sy.toString();
    // F-statistic
    (<HTMLInputElement>document.getElementById('lregf')).value = 'Not implemented yet';
}