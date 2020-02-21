"use strict";

/**
 * One-variable statistics calculation functions
 * 
 * - Calculation
 */

/**
 * Factorial
 * 
 * @param   {number} n - The number to be factorialized
 * @returns {number}   - The result
 */
// const factorial = (n: number): number => [...Array(n).keys()].map((val: number): number => val + 1).reduce((acc: number, cur: number): number => acc * cur, 1);

/**
 * Sanitize statistics input
 * 
 * @param   {string} inpStr - Raw input string from textarea
 * @returns {string[]}      - Parsed values
 * @returns {string[]}      - Parsed inputs
 */
function statSanInp(inpStr: string): [string[], string[]] {
    const inps: string[] = inpStr.split('\n').filter((val: string): boolean => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    let sanVals: string[] = [];
    const sanInps: string[] = [];
    for (const inp of inps) {
        if (inp.slice(0, 3) === 'Var') {
            // Ans
            const parsedAnsKey: RegExpExecArray | null = /^(Var\d+)(?:\D|$)/.exec(inp);
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
            const nums: string[] = formula.split(';');
            sanVals = sanVals.concat(nums);
            sanInps.push(ansKey);
        } else if (['Err', 'Lin'].includes(inp.slice(0, 3))) {
            alert('\"Err\" and \"Lin\" are not allowed!');
            continue;
        } else {
            // No ans
            const parsed: RegExpExecArray | null = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
            if (parsed === null) continue;
            const parsedVal: string = parsed[1];
            if (parsedVal === '') continue;
            sanInps.push(parsedVal);
            sanVals.push(parsedVal);
        }
    }
    return [sanVals, sanInps];
}

/**
 * Calculate one-variable statistics
 */
function statCalc(): void {
    // Get input
    const inpStr: string = statInp.value;
    // Sanitize input
    const [sanValStrs, sanInpStrs]: [string[], string[]] = statSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check: boolean = sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Var';
    // Show parsed output
    statInp2.value = sanValStrs.join('\n');
    const name: string = `Var${ansCounter}`;
    if (!check) statInp2.value += `\n(Saved as \"${name}\")`;
    M.textareaAutoResize(statInp2);
    // Calculations
    const sanInps: number[] = sanValStrs.map((val: string): number => +val);
    // n
    const n: number = sanInps.length;
    (<HTMLInputElement>document.getElementById('statn')).value = n.toString();
    // xbar
    const sum: number = sanInps.reduce((acc: number, cur: number): number => acc + cur, 0);
    const avg: number = sum / n;
    (<HTMLInputElement>document.getElementById('statxbar')).value = avg.toString();
    // s^2
    const sumSquaredDiff: number = sanInps.reduce((acc: number, cur: number): number => acc + Math.pow(avg - cur, 2), 0);
    const variance: number = sumSquaredDiff / (n - 1);
    const qTextarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('statq');
    let sd: number;
    if (isNaN(variance)) {
        (<HTMLInputElement>document.getElementById('stats2')).value = 'N/A';
        sd = 0;
        (<HTMLInputElement>document.getElementById('stats')).value = 'N/A';
        (<HTMLInputElement>document.getElementById('statt')).value = 'N/A';
        (<HTMLInputElement>document.getElementById('statts')).value = 'N/A';
        qTextarea.value = 'No more data can be removed. Removing 1 more data point will remove 100% of all data.';
    } else {
        (<HTMLInputElement>document.getElementById('stats2')).value = variance.toString();
        // s
        sd = Math.sqrt(variance);
        (<HTMLInputElement>document.getElementById('stats')).value = sd.toString();
        // t
        const ciInp: HTMLInputElement = <HTMLInputElement>statTDiv.childNodes[0].childNodes[0];
        const alpha: number = +ciInp.value.split('/')[2];
        const t: number = jStat.studentt.inv(1 - alpha, n - 1);
        (<HTMLInputElement>document.getElementById('statt')).value = t.toString();
        // ts
        (<HTMLInputElement>document.getElementById('statts')).value = (t * sd).toString();
        // q
        // qTextarea.value = 'Not implemented yet';
    }
    M.textareaAutoResize(qTextarea);
    // SigFig
    const sigFig: number = Math.max(...sanValStrs.map((val: string): number => numAccuracy(val)));
    // Save
    if (!check) {
        window.localStorage.setItem(name, JSON.stringify([sanValStrs.join(';'), avg, sd, sigFig]));
        // Set counter
        setAnsCounter();
    }
}