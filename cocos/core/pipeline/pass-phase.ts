
/**
 * @hidden
 */

export const getPhaseID = (() => {
    const phases: Map<string, number> = new Map<string, number>();
    let phaseNum = 0;
    return (phaseName: string | number) => {
        if (typeof phaseName === 'number') { return phaseName; }
        if (!phases.has(phaseName)) {
            phases.set(phaseName, 1 << phaseNum);
            phaseNum++;
        }
        return phases.get(phaseName)!;
    };
})();
