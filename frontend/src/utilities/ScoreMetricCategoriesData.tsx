import React from "react";
import localization from "./localization";

interface ScoreMetric {
    scoreMetricLabel: string;
    scoreMetricValues: {title: string, tooltip: string}[];
    selectedScoreMetricValue: {
        value: string;
        setValue: React.Dispatch<React.SetStateAction<string>>;
    };
    comment: {
        value: string;
        setValue: React.Dispatch<React.SetStateAction<string>>;
    };
    originalScoreMetricValue: string;
}

export interface ScoreMetricCategory {
    scoreMetricCategoryLabel: string;
    scoreMetrics: ScoreMetric[];
}

interface VulnerabilityVectorValues {
    attackVector: string;
    attackComplexity: string;
    privilegesRequired: string;
    userInteraction: string;
    scope: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
}

export const getScoreMetricCategoriesData = (
    scoreMetricCategoriesDbData: CompressedScoreMetricCategoriesData[],
    vulnerabilityVectorValues: VulnerabilityVectorValues | undefined
): ScoreMetricCategory[] => {
    const scoreMetricCategoryLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetricCategories;
    const scoreMetricLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetrics;
    const scoreMetricValueLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetricValues;

    const emptyDbData: CompressedScoreMetricCategoriesData[] = [
        {
            scoreMetricCategoryLabel: scoreMetricCategoryLabels.temporalScoreMetrics,
            scoreMetrics: [
                {
                    scoreMetricLabel: scoreMetricLabels.exploitCodeMaturity,
                    selectedScoreMetricValue: scoreMetricValueLabels.exploitCodeMaturity.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.remediationLevel,
                    selectedScoreMetricValue: scoreMetricValueLabels.remediationLevel.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.reportConfidence,
                    selectedScoreMetricValue: scoreMetricValueLabels.reportConfidence.notDefined,
                    comment: "",
                }
            ]
        },
        {
            scoreMetricCategoryLabel: scoreMetricCategoryLabels.esmRequirements,
            scoreMetrics: [
                {
                    scoreMetricLabel: scoreMetricLabels.confidentialityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.confidentialityRequirement.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.integrityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.integrityRequirement.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.availabilityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.availabilityRequirement.notDefined,
                    comment: "",
                },
            ]
        },
        {
            scoreMetricCategoryLabel: scoreMetricCategoryLabels.esmModifier,
            scoreMetrics: [
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAttackVector,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedAttackVector.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAttackComplexity,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedAttackComplexity.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedPrivilegesRequired,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedPrivilegesRequired.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedUserInteraction,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedUserInteraction.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedScope,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedScope.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedConfidentiality,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedConfidentiality.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedIntegrity,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedIntegrity.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAvailability,
                    selectedScoreMetricValue: scoreMetricValueLabels.modifiedAvailability.notDefined,
                    comment: "",
                },
            ]
        },
    ];

    scoreMetricCategoriesDbData = scoreMetricCategoriesDbData.length > 0 ? scoreMetricCategoriesDbData : emptyDbData;

    const scoreMetricCategories = scoreMetricCategoriesDbData.map(categoryData => {
        const metrics = categoryData.scoreMetrics.map(metricData => ({
            scoreMetricLabel: metricData.scoreMetricLabel,
            scoreMetricValues: getScoreMetricValues(metricData.scoreMetricLabel),
            selectedScoreMetricValue: {
                value: metricData.selectedScoreMetricValue,
                setValue: () => {
                }
            },
            comment: {
                value: metricData.comment,
                setValue: () => {
                }
            },
            originalScoreMetricValue: setOriginalScoreMetricValue(metricData.scoreMetricLabel, vulnerabilityVectorValues)
        }));

        return {
            scoreMetricCategoryLabel: categoryData.scoreMetricCategoryLabel,
            scoreMetrics: metrics
        };
    });

    return scoreMetricCategories;
};

const getScoreMetricValues = (scoreMetricLabel: string): {title: string, tooltip: string}[] => {
    const scoreMetricLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetrics;
    const scoreMetricValueLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetricValues;

    switch (scoreMetricLabel) {
        case scoreMetricLabels.exploitCodeMaturity:
            return [
                scoreMetricValueLabels.exploitCodeMaturity.notDefined,
                scoreMetricValueLabels.exploitCodeMaturity.unproven,
                scoreMetricValueLabels.exploitCodeMaturity.proofOfConcept,
                scoreMetricValueLabels.exploitCodeMaturity.functional,
                scoreMetricValueLabels.exploitCodeMaturity.high,
            ];
        case scoreMetricLabels.remediationLevel:
            return [
                scoreMetricValueLabels.remediationLevel.notDefined,
                scoreMetricValueLabels.remediationLevel.officialFix,
                scoreMetricValueLabels.remediationLevel.temporaryFix,
                scoreMetricValueLabels.remediationLevel.workaround,
                scoreMetricValueLabels.remediationLevel.unavailable,
            ];
        case scoreMetricLabels.reportConfidence:
            return [
                scoreMetricValueLabels.reportConfidence.notDefined,
                scoreMetricValueLabels.reportConfidence.unknown,
                scoreMetricValueLabels.reportConfidence.reasonable,
                scoreMetricValueLabels.reportConfidence.confirmed,
            ];
        case scoreMetricLabels.confidentialityRequirement:
            return [
                scoreMetricValueLabels.confidentialityRequirement.notDefined,
                scoreMetricValueLabels.confidentialityRequirement.low,
                scoreMetricValueLabels.confidentialityRequirement.medium,
                scoreMetricValueLabels.confidentialityRequirement.high,
            ];
        case scoreMetricLabels.integrityRequirement:
            return [
                scoreMetricValueLabels.integrityRequirement.notDefined,
                scoreMetricValueLabels.integrityRequirement.low,
                scoreMetricValueLabels.integrityRequirement.medium,
                scoreMetricValueLabels.integrityRequirement.high,
            ];
        case scoreMetricLabels.availabilityRequirement:
            return [
                scoreMetricValueLabels.availabilityRequirement.notDefined,
                scoreMetricValueLabels.availabilityRequirement.low,
                scoreMetricValueLabels.availabilityRequirement.medium,
                scoreMetricValueLabels.availabilityRequirement.high,
            ];
        case scoreMetricLabels.modifiedAttackVector:
            return [
                scoreMetricValueLabels.modifiedAttackVector.notDefined,
                scoreMetricValueLabels.modifiedAttackVector.network,
                scoreMetricValueLabels.modifiedAttackVector.adjacent,
                scoreMetricValueLabels.modifiedAttackVector.local,
                scoreMetricValueLabels.modifiedAttackVector.physical,
            ];
        case scoreMetricLabels.modifiedAttackComplexity:
            return [
                scoreMetricValueLabels.modifiedAttackComplexity.notDefined,
                scoreMetricValueLabels.modifiedAttackComplexity.low,
                scoreMetricValueLabels.modifiedAttackComplexity.high,
            ];
        case scoreMetricLabels.modifiedPrivilegesRequired:
            return [
                scoreMetricValueLabels.modifiedPrivilegesRequired.notDefined,
                scoreMetricValueLabels.modifiedPrivilegesRequired.none,
                scoreMetricValueLabels.modifiedPrivilegesRequired.low,
                scoreMetricValueLabels.modifiedPrivilegesRequired.high,
            ];
        case scoreMetricLabels.modifiedUserInteraction:
            return [
                scoreMetricValueLabels.modifiedUserInteraction.notDefined,
                scoreMetricValueLabels.modifiedUserInteraction.none,
                scoreMetricValueLabels.modifiedUserInteraction.required,
            ];
        case scoreMetricLabels.modifiedScope:
            return [
                scoreMetricValueLabels.modifiedScope.notDefined,
                scoreMetricValueLabels.modifiedScope.unchanged,
                scoreMetricValueLabels.modifiedScope.changed,
            ];
        case scoreMetricLabels.modifiedConfidentiality:
            return [
                scoreMetricValueLabels.modifiedConfidentiality.notDefined,
                scoreMetricValueLabels.modifiedConfidentiality.none,
                scoreMetricValueLabels.modifiedConfidentiality.low,
                scoreMetricValueLabels.modifiedConfidentiality.high,
            ];
        case scoreMetricLabels.modifiedIntegrity:
            return [
                scoreMetricValueLabels.modifiedIntegrity.notDefined,
                scoreMetricValueLabels.modifiedIntegrity.none,
                scoreMetricValueLabels.modifiedIntegrity.low,
                scoreMetricValueLabels.modifiedIntegrity.high,
            ];
        case scoreMetricLabels.modifiedAvailability:
            return [
                scoreMetricValueLabels.modifiedAvailability.notDefined,
                scoreMetricValueLabels.modifiedAvailability.none,
                scoreMetricValueLabels.modifiedAvailability.low,
                scoreMetricValueLabels.modifiedAvailability.high,
            ];
        default:
            return [scoreMetricValueLabels.notDefined];
    }
};

const setOriginalScoreMetricValue = (scoreMetricLabel: string, vulnerabilityVectorValues: VulnerabilityVectorValues | undefined): string => {
    const environmentalScoreMetricsLink = localization.ReportDetailPage.vulnerabilityDomain;
    const scoreMetricLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetrics;
    const scoreMetricValueLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetricValues;
    let output = "";
    if (!vulnerabilityVectorValues) {
        return output;
    }
    switch (scoreMetricLabel) {
        case scoreMetricLabels.modifiedAttackVector: {
            const originalValue = vulnerabilityVectorValues.attackVector.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NETWORK.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackVector.network.title;
            } else if (originalValue === environmentalScoreMetricsLink.ADJACENT.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackVector.adjacent.title;
            } else if (originalValue === environmentalScoreMetricsLink.LOCAL.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackVector.local.title;
            } else if (originalValue === environmentalScoreMetricsLink.PHYSICAL.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackVector.physical.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedAttackComplexity: {
            const originalValue = vulnerabilityVectorValues.attackComplexity.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackComplexity.low.title;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAttackComplexity.high.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedPrivilegesRequired: {
            const originalValue = vulnerabilityVectorValues.privilegesRequired.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedPrivilegesRequired.none.title;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedPrivilegesRequired.low.title;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedPrivilegesRequired.high.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedUserInteraction: {
            const originalValue = vulnerabilityVectorValues.userInteraction.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedUserInteraction.none.title;
            } else if (originalValue === environmentalScoreMetricsLink.REQUIRED.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedUserInteraction.required.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedScope: {
            const originalValue = vulnerabilityVectorValues.scope.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.UNCHANGED.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedScope.unchanged.title;
            } else if (originalValue === environmentalScoreMetricsLink.CHANGED.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedScope.changed.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedConfidentiality: {
            const originalValue = vulnerabilityVectorValues.confidentialityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedConfidentiality.none.title;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedConfidentiality.low.title;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedConfidentiality.high.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedIntegrity: {
            const originalValue = vulnerabilityVectorValues.integrityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedIntegrity.none.title;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedIntegrity.low.title;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedIntegrity.high.title;
            }
            break;
        }
        case scoreMetricLabels.modifiedAvailability: {
            const originalValue = vulnerabilityVectorValues.availabilityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAvailability.none.title;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAvailability.low.title;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.modifiedAvailability.high.title;
            }
            break;
        }
        default:
            break;
    }
    return output;
};

export interface CompressedScoreMetricCategoriesData {
    scoreMetricCategoryLabel: string,
    scoreMetrics: {
        scoreMetricLabel: string,
        selectedScoreMetricValue: string,
        comment: string
    }[]
}