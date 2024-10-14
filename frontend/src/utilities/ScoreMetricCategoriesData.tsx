import React from "react";
import localization from "./localization";

interface ScoreMetric {
    scoreMetricLabel: string;
    scoreMetricValues: string[];
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
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.remediationLevel,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.reportConfidence,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                }
            ]
        },
        {
            scoreMetricCategoryLabel: scoreMetricCategoryLabels.esmRequirements,
            scoreMetrics: [
                {
                    scoreMetricLabel: scoreMetricLabels.confidentialityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.integrityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.availabilityRequirement,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
            ]
        },
        {
            scoreMetricCategoryLabel: scoreMetricCategoryLabels.esmModifier,
            scoreMetrics: [
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAttackVector,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAttackComplexity,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedPrivilegesRequired,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedUserInteraction,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedScope,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedConfidentiality,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedIntegrity,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
                    comment: "",
                },
                {
                    scoreMetricLabel: scoreMetricLabels.modifiedAvailability,
                    selectedScoreMetricValue: scoreMetricValueLabels.notDefined,
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

const getScoreMetricValues = (scoreMetricLabel: string): string[] => {
    const scoreMetricLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetrics;
    const scoreMetricValueLabels = localization.ReportDetailPage.waiverConfig.main.scoreMetricValues;

    switch (scoreMetricLabel) {
        case scoreMetricLabels.exploitCodeMaturity:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.unproven,
                scoreMetricValueLabels.proofOfConcept,
                scoreMetricValueLabels.functional,
                scoreMetricValueLabels.high,
            ];
        case scoreMetricLabels.remediationLevel:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.officialFix,
                scoreMetricValueLabels.temporaryFix,
                scoreMetricValueLabels.workaround,
                scoreMetricValueLabels.unavailable,
            ];
        case scoreMetricLabels.reportConfidence:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.unknown,
                scoreMetricValueLabels.reasonable,
                scoreMetricValueLabels.confirmed,
            ];
        case scoreMetricLabels.confidentialityRequirement:
        case scoreMetricLabels.integrityRequirement:
        case scoreMetricLabels.availabilityRequirement:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.low,
                scoreMetricValueLabels.medium,
                scoreMetricValueLabels.high,
            ];
        case scoreMetricLabels.modifiedAttackVector:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.network,
                scoreMetricValueLabels.adjacent,
                scoreMetricValueLabels.local,
                scoreMetricValueLabels.physical,
            ];
        case scoreMetricLabels.modifiedAttackComplexity:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.low,
                scoreMetricValueLabels.high,
            ];
        case scoreMetricLabels.modifiedPrivilegesRequired:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.none,
                scoreMetricValueLabels.low,
                scoreMetricValueLabels.high,
            ];
        case scoreMetricLabels.modifiedUserInteraction:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.none,
                scoreMetricValueLabels.required,
            ];
        case scoreMetricLabels.modifiedScope:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.unchanged,
                scoreMetricValueLabels.changed,
            ];
        case scoreMetricLabels.modifiedConfidentiality:
        case scoreMetricLabels.modifiedIntegrity:
        case scoreMetricLabels.modifiedAvailability:
            return [
                scoreMetricValueLabels.notDefined,
                scoreMetricValueLabels.none,
                scoreMetricValueLabels.low,
                scoreMetricValueLabels.high,
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
                output = scoreMetricValueLabels.network;
            } else if (originalValue === environmentalScoreMetricsLink.ADJACENT.toUpperCase()) {
                output = scoreMetricValueLabels.adjacent;
            } else if (originalValue === environmentalScoreMetricsLink.LOCAL.toUpperCase()) {
                output = scoreMetricValueLabels.local;
            } else if (originalValue === environmentalScoreMetricsLink.PHYSICAL.toUpperCase()) {
                output = scoreMetricValueLabels.physical;
            }
            break;
        }
        case scoreMetricLabels.modifiedAttackComplexity: {
            const originalValue = vulnerabilityVectorValues.attackComplexity.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.low;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.high;
            }
            break;
        }
        case scoreMetricLabels.modifiedPrivilegesRequired: {
            const originalValue = vulnerabilityVectorValues.privilegesRequired.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.none;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.low;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.high;
            }
            break;
        }
        case scoreMetricLabels.modifiedUserInteraction: {
            const originalValue = vulnerabilityVectorValues.userInteraction.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.none;
            } else if (originalValue === environmentalScoreMetricsLink.REQUIRED.toUpperCase()) {
                output = scoreMetricValueLabels.required;
            }
            break;
        }
        case scoreMetricLabels.modifiedScope: {
            const originalValue = vulnerabilityVectorValues.scope.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.UNCHANGED.toUpperCase()) {
                output = scoreMetricValueLabels.unchanged;
            } else if (originalValue === environmentalScoreMetricsLink.CHANGED.toUpperCase()) {
                output = scoreMetricValueLabels.changed;
            }
            break;
        }
        case scoreMetricLabels.modifiedConfidentiality: {
            const originalValue = vulnerabilityVectorValues.confidentialityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.none;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.low;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.high;
            }
            break;
        }
        case scoreMetricLabels.modifiedIntegrity: {
            const originalValue = vulnerabilityVectorValues.integrityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.none;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.low;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.high;
            }
            break;
        }
        case scoreMetricLabels.modifiedAvailability: {
            const originalValue = vulnerabilityVectorValues.availabilityImpact.toUpperCase();
            if (originalValue === environmentalScoreMetricsLink.NONE.toUpperCase()) {
                output = scoreMetricValueLabels.none;
            } else if (originalValue === environmentalScoreMetricsLink.LOW.toUpperCase()) {
                output = scoreMetricValueLabels.low;
            } else if (originalValue === environmentalScoreMetricsLink.HIGH.toUpperCase()) {
                output = scoreMetricValueLabels.high;
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