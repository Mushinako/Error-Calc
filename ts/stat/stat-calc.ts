"use strict";

/**
 * One-variable statistics calculation functions
 * 
 * - Calculation
 */

/**
 * Sanitize statistics input
 * 
 * @param   {string} inpStr - Raw input string from textarea
 * @returns {string[]}      - Parsed inputs
 */
function statSanInp(inpStr: string): string[] {
    const inps: string[] = inpStr.split('\n').filter((val: string): boolean => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    const sanInps: string[] = [];
    for (const inp of inps) {
        const parsed: RegExpExecArray | null = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
        if (parsed === null) continue;
        const parsedVal: string = parsed[1];
        if (parsedVal === '') continue;
        sanInps.push(parsedVal);
    }
    return sanInps;
}

/**
 * Calculate one-variable statistics
 */
function statCalc(): void {
    // Get input
    const inpStr: string = statInp.value;
    // Sanitize input
    const sanInpStrs: string[] = statSanInp(inpStr);
    // Show parsed output
    statInp2.value = sanInpStrs.join('\n');
    M.textareaAutoResize(statInp2);
    // Calculations
    const sanInps: number[] = sanInpStrs.map((val: string): number => +val);
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
    (<HTMLInputElement>document.getElementById('stats2')).value = variance.toString();
    // s
    const sd: number = Math.sqrt(variance);
    (<HTMLInputElement>document.getElementById('stats')).value = sd.toString();
    // Save
    window.localStorage.setItem(`Var${ansCounter}`, JSON.stringify([sanInpStrs.join(','), avg, sd, sigFigDecimalConversion(avg, 15)]));
    // Set counter
    setAnsCounter();
}