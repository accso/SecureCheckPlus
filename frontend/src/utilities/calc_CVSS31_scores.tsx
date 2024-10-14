/* Copyright (c) 2019, FIRST.ORG, INC.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *    disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *    following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
 *    products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// More Info here https://www.first.org/cvss/calculator/cvsscalc31.js

interface CVSS31Result {
    success: boolean;
    errorType?: string;
    errorMetrics?: string[];
    baseMetricScore?: string | null;
    baseSeverity?: string | number | null;
    baseISS?: number | null;
    baseImpact?: string | null;
    baseExploitability?: string | null;
    temporalMetricScore?: string | null;
    temporalSeverity?: string | number | null;
    environmentalMetricScore?: string | null;
    environmentalSeverity?: string | number | null;
    environmentalMISS?: number | null;
    environmentalModifiedImpact?: string | null;
    environmentalModifiedExploitability?: number | null;
    overallMetricScore?: string | null;
    overallSeverity?: string | null;
    vectorString?: string | null;
}

interface CVSS31Weight {
    AV: Record<string, number>;
    AC: Record<string, number>;
    PR: { U: Record<string, number>; C: Record<string, number> };
    UI: Record<string, number>;
    S: Record<string, number>;
    CIA: Record<string, number>;
    E: Record<string, number>;
    RL: Record<string, number>;
    RC: Record<string, number>;
    CIAR: Record<string, number>;
}

interface SeverityRating {
    name: string;
    bottom: number;
    top: number;
}

const CVSS31 = {
    CVSSVersionIdentifier: "CVSS:3.1",
    exploitabilityCoefficient: 8.22,
    scopeCoefficient: 1.08,
    vectorStringRegex_31: /^CVSS:3\.1\/((AV:[NALP]|AC:[LH]|PR:[UNLH]|UI:[NR]|S:[UC]|[CIA]:[NLH]|E:[XUPFH]|RL:[XOTWU]|RC:[XURC]|[CIA]R:[XLMH]|MAV:[XNALP]|MAC:[XLH]|MPR:[XUNLH]|MUI:[XNR]|MS:[XUC]|M[CIA]:[XNLH])\/)*(AV:[NALP]|AC:[LH]|PR:[UNLH]|UI:[NR]|S:[UC]|[CIA]:[NLH]|E:[XUPFH]|RL:[XOTWU]|RC:[XURC]|[CIA]R:[XLMH]|MAV:[XNALP]|MAC:[XLH]|MPR:[XUNLH]|MUI:[XNR]|MS:[XUC]|M[CIA]:[XNLH])$/,
    Weight: {
        AV: {N: 0.85, A: 0.62, L: 0.55, P: 0.2},
        AC: {H: 0.44, L: 0.77},
        PR: {
            U: {N: 0.85, L: 0.62, H: 0.27},
            C: {N: 0.85, L: 0.68, H: 0.5}
        },
        UI: {N: 0.85, R: 0.62},
        S: {U: 6.42, C: 7.52},
        CIA: {N: 0, L: 0.22, H: 0.56},
        E: {X: 1, U: 0.91, P: 0.94, F: 0.97, H: 1},
        RL: {X: 1, O: 0.95, T: 0.96, W: 0.97, U: 1},
        RC: {X: 1, U: 0.92, R: 0.96, C: 1},
        CIAR: {X: 1, L: 0.5, M: 1, H: 1.5}
    } as CVSS31Weight,
    severityRatings: [
        {name: "NONE", bottom: 0.0, top: 0.0},
        {name: "LOW", bottom: 0.1, top: 3.9},
        {name: "MEDIUM", bottom: 4.0, top: 6.9},
        {name: "HIGH", bottom: 7.0, top: 8.9},
        {name: "CRITICAL", bottom: 9.0, top: 10.0}
    ] as SeverityRating[]
};

function calculateCVSSFromMetrics(
    AttackVector: string, AttackComplexity: string, PrivilegesRequired: string, UserInteraction: string, Scope: "U" | "C",
    Confidentiality: string, Integrity: string, Availability: string,
    ExploitCodeMaturity?: string, RemediationLevel?: string, ReportConfidence?: string,
    ConfidentialityRequirement?: string, IntegrityRequirement?: string, AvailabilityRequirement?: string,
    ModifiedAttackVector?: string, ModifiedAttackComplexity?: string, ModifiedPrivilegesRequired?: string, ModifiedUserInteraction?: string, ModifiedScope?: "U" | "C",
    ModifiedConfidentiality?: string, ModifiedIntegrity?: string, ModifiedAvailability?: string
): CVSS31Result {
    // If input validation fails, this array is populated with strings indicating which metrics failed validation.
    const badMetrics: string[] = [];

    // ENSURE ALL BASE METRICS ARE DEFINED
    if (!AttackVector) badMetrics.push("AV");
    if (!AttackComplexity) badMetrics.push("AC");
    if (!PrivilegesRequired) badMetrics.push("PR");
    if (!UserInteraction) badMetrics.push("UI");
    if (!Scope) badMetrics.push("S");
    if (!Confidentiality) badMetrics.push("C");
    if (!Integrity) badMetrics.push("I");
    if (!Availability) badMetrics.push("A");

    if (badMetrics.length > 0) {
        return {success: false, errorType: "MissingBaseMetric", errorMetrics: badMetrics};
    }

    // STORE THE METRIC VALUES THAT WERE PASSED AS PARAMETERS
    const AV = AttackVector;
    const AC = AttackComplexity;
    const PR = PrivilegesRequired;
    const UI = UserInteraction;
    const S = Scope;
    const C = Confidentiality;
    const I = Integrity;
    const A = Availability;

    const E = ExploitCodeMaturity || "X";
    const RL = RemediationLevel || "X";
    const RC = ReportConfidence || "X";

    const CR = ConfidentialityRequirement || "X";
    const IR = IntegrityRequirement || "X";
    const AR = AvailabilityRequirement || "X";
    const MAV = ModifiedAttackVector || "X";
    const MAC = ModifiedAttackComplexity || "X";
    const MPR = ModifiedPrivilegesRequired || "X";
    const MUI = ModifiedUserInteraction || "X";
    const MS = ModifiedScope || "X";
    const MC = ModifiedConfidentiality || "X";
    const MI = ModifiedIntegrity || "X";
    const MA = ModifiedAvailability || "X";

    // CHECK VALIDITY OF METRIC VALUES
    if (!CVSS31.Weight.AV.hasOwnProperty(AV)) badMetrics.push("AV");
    if (!CVSS31.Weight.AC.hasOwnProperty(AC)) badMetrics.push("AC");
    if (!CVSS31.Weight.PR.U.hasOwnProperty(PR)) badMetrics.push("PR");
    if (!CVSS31.Weight.UI.hasOwnProperty(UI)) badMetrics.push("UI");
    if (!CVSS31.Weight.S.hasOwnProperty(S)) badMetrics.push("S");
    if (!CVSS31.Weight.CIA.hasOwnProperty(C)) badMetrics.push("C");
    if (!CVSS31.Weight.CIA.hasOwnProperty(I)) badMetrics.push("I");
    if (!CVSS31.Weight.CIA.hasOwnProperty(A)) badMetrics.push("A");

    if (!CVSS31.Weight.E.hasOwnProperty(E)) badMetrics.push("E");
    if (!CVSS31.Weight.RL.hasOwnProperty(RL)) badMetrics.push("RL");
    if (!CVSS31.Weight.RC.hasOwnProperty(RC)) badMetrics.push("RC");

    if (!(CR === "X" || CVSS31.Weight.CIAR.hasOwnProperty(CR))) badMetrics.push("CR");
    if (!(IR === "X" || CVSS31.Weight.CIAR.hasOwnProperty(IR))) badMetrics.push("IR");
    if (!(AR === "X" || CVSS31.Weight.CIAR.hasOwnProperty(AR))) badMetrics.push("AR");
    if (!(MAV === "X" || CVSS31.Weight.AV.hasOwnProperty(MAV))) badMetrics.push("MAV");
    if (!(MAC === "X" || CVSS31.Weight.AC.hasOwnProperty(MAC))) badMetrics.push("MAC");
    if (!(MPR === "X" || CVSS31.Weight.PR.U.hasOwnProperty(MPR))) badMetrics.push("MPR");
    if (!(MUI === "X" || CVSS31.Weight.UI.hasOwnProperty(MUI))) badMetrics.push("MUI");
    if (!(MS === "X" || CVSS31.Weight.S.hasOwnProperty(MS))) badMetrics.push("MS");
    if (!(MC === "X" || CVSS31.Weight.CIA.hasOwnProperty(MC))) badMetrics.push("MC");
    if (!(MI === "X" || CVSS31.Weight.CIA.hasOwnProperty(MI))) badMetrics.push("MI");
    if (!(MA === "X" || CVSS31.Weight.CIA.hasOwnProperty(MA))) badMetrics.push("MA");

    if (badMetrics.length > 0) {
        return {success: false, errorType: "UnknownMetricValue", errorMetrics: badMetrics};
    }

    // GATHER WEIGHTS FOR ALL METRICS
    const metricWeightAV = CVSS31.Weight.AV[AV];
    const metricWeightAC = CVSS31.Weight.AC[AC];
    const metricWeightPR = CVSS31.Weight.PR[S][PR];
    const metricWeightUI = CVSS31.Weight.UI[UI];
    const metricWeightS = CVSS31.Weight.S[S];
    const metricWeightC = CVSS31.Weight.CIA[C];
    const metricWeightI = CVSS31.Weight.CIA[I];
    const metricWeightA = CVSS31.Weight.CIA[A];

    const metricWeightE = CVSS31.Weight.E[E];
    const metricWeightRL = CVSS31.Weight.RL[RL];
    const metricWeightRC = CVSS31.Weight.RC[RC];

    const metricWeightCR = CVSS31.Weight.CIAR[CR];
    const metricWeightIR = CVSS31.Weight.CIAR[IR];
    const metricWeightAR = CVSS31.Weight.CIAR[AR];
    const metricWeightMAV = CVSS31.Weight.AV[MAV !== "X" ? MAV : AV];
    const metricWeightMAC = CVSS31.Weight.AC[MAC !== "X" ? MAC : AC];
    const metricWeightMPR = CVSS31.Weight.PR[MS !== "X" ? MS : S][MPR !== "X" ? MPR : PR];
    const metricWeightMUI = CVSS31.Weight.UI[MUI !== "X" ? MUI : UI];
    const metricWeightMS = CVSS31.Weight.S[MS !== "X" ? MS : S];
    const metricWeightMC = CVSS31.Weight.CIA[MC !== "X" ? MC : C];
    const metricWeightMI = CVSS31.Weight.CIA[MI !== "X" ? MI : I];
    const metricWeightMA = CVSS31.Weight.CIA[MA !== "X" ? MA : A];

    // CALCULATE THE CVSS BASE SCORE
    let iss: number; // Impact Sub-Score
    let impact: number;
    let exploitability: number;
    let baseScore: number;

    iss = 1 - (1 - metricWeightC) * (1 - metricWeightI) * (1 - metricWeightA);

    if (S === 'U') {
        impact = metricWeightS * iss;
    } else {
        impact = metricWeightS * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    exploitability = CVSS31.exploitabilityCoefficient * metricWeightAV * metricWeightAC * metricWeightPR * metricWeightUI;

    if (impact <= 0) {
        baseScore = 0;
    } else {
        if (S === 'U') {
            baseScore = roundUp1(Math.min(exploitability + impact, 10));
        } else {
            baseScore = roundUp1(Math.min(CVSS31.scopeCoefficient * (exploitability + impact), 10));
        }
    }

    // CALCULATE THE CVSS TEMPORAL SCORE
    const temporalScore = roundUp1(baseScore * metricWeightE * metricWeightRL * metricWeightRC);

    // CALCULATE THE CVSS ENVIRONMENTAL SCORE
    let miss: number; // Modified Impact Sub-Score
    let modifiedImpact: number;
    let envScore: number;
    let modifiedExploitability: number;

    miss = Math.min(1 - (1 - metricWeightMC * metricWeightCR) * (1 - metricWeightMI * metricWeightIR) * (1 - metricWeightMA * metricWeightAR), 0.915);

    if (MS === "U" || (MS === "X" && S === "U")) {
        modifiedImpact = metricWeightMS * miss;
    } else {
        modifiedImpact = metricWeightMS * (miss - 0.029) - 3.25 * Math.pow(miss * 0.9731 - 0.02, 13);
    }

    modifiedExploitability = CVSS31.exploitabilityCoefficient * metricWeightMAV * metricWeightMAC * metricWeightMPR * metricWeightMUI;

    if (modifiedImpact <= 0) {
        envScore = 0;
        modifiedImpact = 0;
    } else if (MS === "U" || (MS === "X" && S === "U")) {
        envScore = roundUp1(roundUp1(Math.min(modifiedImpact + modifiedExploitability, 10)) * metricWeightE * metricWeightRL * metricWeightRC);
    } else {
        envScore = roundUp1(roundUp1(Math.min(CVSS31.scopeCoefficient * (modifiedImpact + modifiedExploitability), 10)) * metricWeightE * metricWeightRL * metricWeightRC);
    }

    // CONSTRUCT THE VECTOR STRING
    let vectorString =
        `${CVSS31.CVSSVersionIdentifier}/AV:${AV}/AC:${AC}/PR:${PR}/UI:${UI}/S:${S}/C:${C}/I:${I}/A:${A}`;

    if (E !== "X") vectorString += `/E:${E}`;
    if (RL !== "X") vectorString += `/RL:${RL}`;
    if (RC !== "X") vectorString += `/RC:${RC}`;
    if (CR !== "X") vectorString += `/CR:${CR}`;
    if (IR !== "X") vectorString += `/IR:${IR}`;
    if (AR !== "X") vectorString += `/AR:${AR}`;
    if (MAV !== "X") vectorString += `/MAV:${MAV}`;
    if (MAC !== "X") vectorString += `/MAC:${MAC}`;
    if (MPR !== "X") vectorString += `/MPR:${MPR}`;
    if (MUI !== "X") vectorString += `/MUI:${MUI}`;
    if (MS !== "X") vectorString += `/MS:${MS}`;
    if (MC !== "X") vectorString += `/MC:${MC}`;
    if (MI !== "X") vectorString += `/MI:${MI}`;
    if (MA !== "X") vectorString += `/MA:${MA}`;

    const overallScore = envScore
    let overallSeverityValue = severityRating(envScore.toFixed(1))
    const overallSeverity = typeof overallSeverityValue === "number" ? null : overallSeverityValue;

    // Return an object containing the scores for all three metric groups, and an overall vector string.
    // Sub-formula values are also included.
    return {
        success: true,
        baseMetricScore: baseScore.toFixed(1),
        baseSeverity: severityRating(baseScore.toFixed(1)),
        baseISS: iss,
        baseImpact: impact.toFixed(1),
        baseExploitability: exploitability.toFixed(1),
        temporalMetricScore: temporalScore.toFixed(1),
        temporalSeverity: severityRating(temporalScore.toFixed(1)),
        environmentalMetricScore: envScore.toFixed(1),
        environmentalSeverity: severityRating(envScore.toFixed(1)),
        environmentalMISS: miss,
        environmentalModifiedImpact: modifiedImpact.toFixed(1),
        environmentalModifiedExploitability: modifiedExploitability,
        overallMetricScore: overallScore.toFixed(1),
        overallSeverity: overallSeverity,
        vectorString: vectorString
    };
}

export function calculateCVSSFromVector(vectorString: string): CVSS31Result {
    const metricValues: Record<string, string | undefined> = {
        AV: undefined, AC: undefined, PR: undefined, UI: undefined, S: undefined,
        C: undefined, I: undefined, A: undefined,
        E: undefined, RL: undefined, RC: undefined,
        CR: undefined, IR: undefined, AR: undefined,
        MAV: undefined, MAC: undefined, MPR: undefined, MUI: undefined, MS: undefined,
        MC: undefined, MI: undefined, MA: undefined
    };

    const badMetrics: string[] = [];

    if (!CVSS31.vectorStringRegex_31.test(vectorString)) {
        return {success: false, errorType: "MalformedVectorString"};
    }

    const metricNameValue = vectorString.substring(CVSS31.CVSSVersionIdentifier.length).split("/");

    for (const singleMetric of metricNameValue) {
        const [metric, value] = singleMetric.split(":");
        if (metricValues[metric] === undefined) {
            metricValues[metric] = value;
        } else {
            badMetrics.push(metric);
        }
    }

    if (badMetrics.length > 0) {
        return {success: false, errorType: "MultipleDefinitionsOfMetric", errorMetrics: badMetrics};
    }

    // Type assertion to ensure Scope and ModifiedScope are correctly typed
    const scope = metricValues.S as "U" | "C";
    const modifiedScope = metricValues.MS as "U" | "C" | undefined;

    return calculateCVSSFromMetrics(
        metricValues.AV!, metricValues.AC!, metricValues.PR!, metricValues.UI!, scope,
        metricValues.C!, metricValues.I!, metricValues.A!,
        metricValues.E, metricValues.RL, metricValues.RC,
        metricValues.CR, metricValues.IR, metricValues.AR,
        metricValues.MAV, metricValues.MAC, metricValues.MPR, metricValues.MUI, modifiedScope,
        metricValues.MC, metricValues.MI, metricValues.MA
    );
}

function roundUp1(input: number): number {
    const intInput = Math.round(input * 100000);
    if (intInput % 10000 === 0) {
        return intInput / 100000;
    } else {
        return (Math.floor(intInput / 10000) + 1) / 10;
    }
}

export function severityRating(score: string | number): string | number | undefined {
    const validatedScore = Number(score);
    if (isNaN(validatedScore)) {
        return validatedScore;
    }

    for (const rating of CVSS31.severityRatings) {
        if (validatedScore >= rating.bottom && validatedScore <= rating.top) {
            return rating.name;
        }
    }

    return undefined;
}