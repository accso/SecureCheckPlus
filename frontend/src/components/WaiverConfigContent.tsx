import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import localization from "../utilities/localization";
import dayjs from "dayjs";
import { mainTheme } from "../style/globalStyle";
import ScoreRow from "./ScoreRow";
import CommentBox from "./CommentBox";
import WaiverConfigSelect from "./WaiverConfigSelect";
import { calculateCVSSFromVector } from "../utilities/calc_CVSS31_scores";
import {
  CompressedScoreMetricCategoriesData,
  getScoreMetricCategoriesData,
  ScoreMetricCategory,
} from "../utilities/ScoreMetricCategoriesData";
import { WaiverConfigData } from "../utilities/interfaces/WaiverConfigData";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface WaiverConfigContentProps {
  vulnerabilityVectorValues:
    | {
        attackVector: string;
        attackComplexity: string;
        privilegesRequired: string;
        userInteraction: string;
        scope: string;
        confidentialityImpact: string;
        integrityImpact: string;
        availabilityImpact: string;
      }
    | undefined;
  waiverConfigData: WaiverConfigData;
  setWaiverConfigData: React.Dispatch<React.SetStateAction<WaiverConfigData>>;
  compressedScoreMetricCategoryData: CompressedScoreMetricCategoriesData[];
  setCalculatedCVSSScores: React.Dispatch<React.SetStateAction<any>>;
}

const isJSONEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const WaiverConfigContent: React.FC<WaiverConfigContentProps> = ({
  vulnerabilityVectorValues,
  waiverConfigData,
  setWaiverConfigData,
  compressedScoreMetricCategoryData,
  setCalculatedCVSSScores,
}) => {
  const initialScoreMetricCategoriesData = getScoreMetricCategoriesData(
    compressedScoreMetricCategoryData,
    vulnerabilityVectorValues
  );

  const [scoreMetricCategoriesData, setScoreMetricCategoriesData] = useState<
    ScoreMetricCategory[]
  >(() => initialScoreMetricCategoriesData);

  useEffect(() => {
    const updatedScoreMetricCategoriesData = scoreMetricCategoriesData.map(
      (category) => ({
        ...category,
        scoreMetrics: category.scoreMetrics.map((metric) => ({
          ...metric,
          selectedScoreMetricValue: {
            ...metric.selectedScoreMetricValue,
            setValue: (value: React.SetStateAction<string>) => {
              setScoreMetricCategoriesData((prevData) => {
                const newData = [...prevData];
                const categoryIndex = newData.findIndex(
                  (c) =>
                    c.scoreMetricCategoryLabel ===
                    category.scoreMetricCategoryLabel
                );
                const metricIndex = newData[
                  categoryIndex
                ].scoreMetrics.findIndex(
                  (m) => m.scoreMetricLabel === metric.scoreMetricLabel
                );
                newData[categoryIndex].scoreMetrics[
                  metricIndex
                ].selectedScoreMetricValue.value =
                  typeof value === "function"
                    ? value(
                        newData[categoryIndex].scoreMetrics[metricIndex]
                          .selectedScoreMetricValue.value
                      )
                    : value;
                return newData;
              });
            },
          },
          comment: {
            ...metric.comment,
            setValue: (value: React.SetStateAction<string>) => {
              setScoreMetricCategoriesData((prevData) => {
                const newData = [...prevData];
                const categoryIndex = newData.findIndex(
                  (c) =>
                    c.scoreMetricCategoryLabel ===
                    category.scoreMetricCategoryLabel
                );
                const metricIndex = newData[
                  categoryIndex
                ].scoreMetrics.findIndex(
                  (m) => m.scoreMetricLabel === metric.scoreMetricLabel
                );
                newData[categoryIndex].scoreMetrics[metricIndex].comment.value =
                  typeof value === "function"
                    ? value(
                        newData[categoryIndex].scoreMetrics[metricIndex].comment
                          .value
                      )
                    : value;
                return newData;
              });
            },
          },
        })),
      })
    );
    setScoreMetricCategoriesData(updatedScoreMetricCategoriesData);
    calculateCVSSScores();
    setWaiverConfigData((prevState) => ({
      ...prevState,
      scoreMetricCategoriesData: scoreMetricCategoriesData,
    }));
  }, []);

  /**
   * useEffect-Hook to update waiverConfigData in ReportPage and recalculate CVSS Scores
   */
  useEffect(() => {
    setWaiverConfigData((prevState) => ({
      ...prevState,
      scoreMetricCategoriesData: scoreMetricCategoriesData,
    }));
    calculateCVSSScores();
  }, [scoreMetricCategoriesData]);

  // Sidebar
  const [cvssCalculatorScores, setCvssCalculatorScores] = useState(
    calculateCVSSFromVector("")
  );
  let previousCvssCalculatorScores = useRef<any>(undefined);
  let sidebarPath = localization.ReportDetailPage.waiverConfig.sidebar;

  /**
   * useEffect-Hook to update calculatedCVSSScores in ReportPage
   */
  useEffect(() => {
    if (
      cvssCalculatorScores !== undefined &&
      !isJSONEqual(
        cvssCalculatorScores,
        previousCvssCalculatorScores.current
      ) &&
      cvssCalculatorScores.success
    ) {
      setCalculatedCVSSScores(cvssCalculatorScores);
    }
    previousCvssCalculatorScores.current = cvssCalculatorScores;
  }, [cvssCalculatorScores]);

  /**
   * Convert the current CVSS calculator settings to a CVSS vector
   */
  function convertToCVSSVector(): string {
    if (
      vulnerabilityVectorValues !== undefined &&
      scoreMetricCategoriesData.length > 0
    ) {
      const {
        attackVector,
        attackComplexity,
        privilegesRequired,
        userInteraction,
        scope,
        confidentialityImpact,
        integrityImpact,
        availabilityImpact,
      } = vulnerabilityVectorValues;

      const baseMetrics = {
        AV: attackVector,
        AC: attackComplexity,
        PR: privilegesRequired,
        UI: userInteraction,
        S: scope,
        C: confidentialityImpact,
        I: integrityImpact,
        A: availabilityImpact,
      };

      let temporalMetrics: any = {
        E: "NOT_DEFINED",
        RL: "NOT_DEFINED",
        RC: "NOT_DEFINED",
      };
      let environmentalMetrics: any = {
        CR: "NOT_DEFINED",
        IR: "NOT_DEFINED",
        AR: "NOT_DEFINED",
        MAV: "NOT_DEFINED",
        MAC: "NOT_DEFINED",
        MPR: "NOT_DEFINED",
        MUI: "NOT_DEFINED",
        MS: "NOT_DEFINED",
        MC: "NOT_DEFINED",
        MI: "NOT_DEFINED",
        MA: "NOT_DEFINED",
      };

      const scoreMetricValues: { [key: string]: string } = {
        NOT_DEFINED: "X",
        UNPROVEN: "U",
        "PROOF-OF-CONCEPT": "P",
        FUNCTIONAL: "F",
        HIGH: "H",
        OFFICIAL_FIX: "O",
        TEMPORARY_FIX: "T",
        WORKAROUND: "W",
        UNAVAILABLE: "U",
        UNKNOWN: "U",
        REASONABLE: "R",
        CONFIRMED: "C",
        NETWORK: "N",
        ADJACENT: "A",
        LOCAL: "L",
        PHYSICAL: "P",
        LOW: "L",
        MEDIUM: "M",
        NONE: "N",
        REQUIRED: "R",
        UNCHANGED: "U",
        CHANGED: "C",
      };

      scoreMetricCategoriesData.forEach((category) => {
        category.scoreMetrics.forEach((metric) => {
          const value = metric.selectedScoreMetricValue.value
            .toUpperCase()
            .replace(/ /g, "_");
          const mappedValue = scoreMetricValues[value] || "X";
          switch (metric.scoreMetricLabel) {
            case "Exploit Code Maturity":
              temporalMetrics.E = mappedValue;
              break;
            case "Remediation Level":
              temporalMetrics.RL = mappedValue;
              break;
            case "Report Confidence":
              temporalMetrics.RC = mappedValue;
              break;
            case "Confidentiality Requirement":
              environmentalMetrics.CR = mappedValue;
              break;
            case "Integrity Requirement":
              environmentalMetrics.IR = mappedValue;
              break;
            case "Availability Requirement":
              environmentalMetrics.AR = mappedValue;
              break;
            case "Modified Attack Vector":
              environmentalMetrics.MAV = mappedValue;
              break;
            case "Modified Attack Complexity":
              environmentalMetrics.MAC = mappedValue;
              break;
            case "Modified Privileges Required":
              environmentalMetrics.MPR = mappedValue;
              break;
            case "Modified User Interaction":
              environmentalMetrics.MUI = mappedValue;
              break;
            case "Modified Scope":
              environmentalMetrics.MS = mappedValue;
              break;
            case "Modified Confidentiality":
              environmentalMetrics.MC = mappedValue;
              break;
            case "Modified Integrity":
              environmentalMetrics.MI = mappedValue;
              break;
            case "Modified Availability":
              environmentalMetrics.MA = mappedValue;
              break;
            default:
              break;
          }
        });
      });

      let vector = `CVSS:3.1/AV:${scoreMetricValues[baseMetrics.AV]}/AC:${
        scoreMetricValues[baseMetrics.AC]
      }/PR:${scoreMetricValues[baseMetrics.PR]}/UI:${
        scoreMetricValues[baseMetrics.UI]
      }/S:${scoreMetricValues[baseMetrics.S]}/C:${
        scoreMetricValues[baseMetrics.C]
      }/I:${scoreMetricValues[baseMetrics.I]}/A:${
        scoreMetricValues[baseMetrics.A]
      }`;

      if (temporalMetrics.E !== "X") vector += `/E:${temporalMetrics.E}`;
      if (temporalMetrics.RL !== "X") vector += `/RL:${temporalMetrics.RL}`;
      if (temporalMetrics.RC !== "X") vector += `/RC:${temporalMetrics.RC}`;

      if (environmentalMetrics.CR !== "X")
        vector += `/CR:${environmentalMetrics.CR}`;
      if (environmentalMetrics.IR !== "X")
        vector += `/IR:${environmentalMetrics.IR}`;
      if (environmentalMetrics.AR !== "X")
        vector += `/AR:${environmentalMetrics.AR}`;
      if (environmentalMetrics.MAV !== "X")
        vector += `/MAV:${environmentalMetrics.MAV}`;
      if (environmentalMetrics.MAC !== "X")
        vector += `/MAC:${environmentalMetrics.MAC}`;
      if (environmentalMetrics.MPR !== "X")
        vector += `/MPR:${environmentalMetrics.MPR}`;
      if (environmentalMetrics.MUI !== "X")
        vector += `/MUI:${environmentalMetrics.MUI}`;
      if (environmentalMetrics.MS !== "X")
        vector += `/MS:${environmentalMetrics.MS}`;
      if (environmentalMetrics.MC !== "X")
        vector += `/MC:${environmentalMetrics.MC}`;
      if (environmentalMetrics.MI !== "X")
        vector += `/MI:${environmentalMetrics.MI}`;
      if (environmentalMetrics.MA !== "X")
        vector += `/MA:${environmentalMetrics.MA}`;

      return vector;
    }
    return "";
  }

  /**
   * Calculate and set cvssCalculatorScores
   */
  function calculateCVSSScores() {
    const cvssVector = convertToCVSSVector();
    const cvssVectorParts = cvssVector.split("/");
    let cvssCalculatorScores = calculateCVSSFromVector(cvssVector);

    if (cvssVectorParts.length <= 9) {
      cvssCalculatorScores = {
        ...cvssCalculatorScores,
        temporalMetricScore: null,
        temporalSeverity: null,
        environmentalMetricScore: null,
        environmentalSeverity: null,
        environmentalMISS: null,
        environmentalModifiedImpact: null,
        environmentalModifiedExploitability: null,
        overallMetricScore: null,
        vectorString: null,
      };
    }

    setCvssCalculatorScores(cvssCalculatorScores);
  }

  return (
    <Stack sx={waiverConfigContainer}>
      <Stack sx={leftSideContainer}>
        <Stack sx={leftSideSubContainer}>
          <Stack sx={projectDataContainer}>
            <Stack sx={projectDataIDContainer}>
              <Stack sx={projectDataTitle}>
                {sidebarPath.project.projectId}
              </Stack>
              <Stack sx={projectDataTextGreen}>
                {waiverConfigData.projectId}
              </Stack>
            </Stack>
            <Stack sx={projectDataTinyText}>
              {sidebarPath.project.lastEdited}
            </Stack>
            <Stack sx={projectDataTinyText} style={{ margin: "0 0 24px 0" }}>
              {waiverConfigData.lastEdited
                ? new Date(waiverConfigData.lastEdited).toLocaleString(
                    "de-DE"
                  ) + " UTC"
                : "-"}
            </Stack>
            <Stack sx={projectDataTinyText}>{sidebarPath.project.author}</Stack>
            <Stack sx={projectDataTinyText}>
              {waiverConfigData.author ? waiverConfigData.author : "–"}
            </Stack>
          </Stack>
          <Stack>
            <ScoreRow
              text={sidebarPath.score.baseScore}
              score={
                cvssCalculatorScores?.baseMetricScore
                  ? cvssCalculatorScores.baseMetricScore
                  : "–"
              }
              big={true}
            />
            <ScoreRow
              text={sidebarPath.score.impact}
              score={
                cvssCalculatorScores?.baseImpact
                  ? cvssCalculatorScores.baseImpact
                  : "–"
              }
              big={false}
            />
            <ScoreRow
              text={sidebarPath.score.exploitability}
              score={
                cvssCalculatorScores?.baseExploitability
                  ? cvssCalculatorScores.baseExploitability
                  : "–"
              }
              big={false}
            />
            <ScoreRow
              text={sidebarPath.score.temporalScore}
              score={
                cvssCalculatorScores?.temporalMetricScore
                  ? cvssCalculatorScores.temporalMetricScore
                  : "–"
              }
              big={true}
            />
            <ScoreRow
              text={sidebarPath.score.environmental}
              score={
                cvssCalculatorScores?.environmentalMetricScore
                  ? cvssCalculatorScores.environmentalMetricScore
                  : "–"
              }
              big={true}
            />
            <ScoreRow
              text={sidebarPath.score.modifiedImpact}
              score={
                cvssCalculatorScores?.environmentalModifiedImpact
                  ? cvssCalculatorScores.environmentalModifiedImpact
                  : "–"
              }
              big={false}
            />
            <Stack
              style={{
                borderTop: "2px solid #003c3c",
                width: "100%",
                alignSelf: "center",
                margin: "1rem 0 1rem 0",
              }}
            />
            <ScoreRow
              text={sidebarPath.score.overall}
              score={
                cvssCalculatorScores?.overallMetricScore
                  ? cvssCalculatorScores.overallMetricScore
                  : "–"
              }
              big={true}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={rightSideContainer}>
        <Stack
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: mainTheme.palette.primary.main,
            width: "100%",
            textAlign: "left",
          }}
        >
          {localization.ReportDetailPage.waiverConfig.main.title}
        </Stack>
        {scoreMetricCategoriesData.map((scoreMetricCategory) => (
          <Stack
            sx={scoreMetricCategoryContainer}
            key={scoreMetricCategory.scoreMetricCategoryLabel}
          >
            <Stack sx={scoreMetricCategorySubContainer}>
              <Stack sx={scoreMetricCategoryName}>
                {scoreMetricCategory.scoreMetricCategoryLabel}
              </Stack>
              <Stack
                sx={boldHint(
                  scoreMetricCategory.scoreMetricCategoryLabel ===
                    localization.ReportDetailPage.waiverConfig.main
                      .scoreMetricCategories.esmModifier
                )}
              >
                <Stack sx={legendContainer}>
                  <Stack style={{ fontWeight: "bold" }}>
                    {
                      localization.ReportDetailPage.waiverConfig.main.hint
                        .buttonDescr
                    }
                  </Stack>
                  <Stack sx={originalValueBox}>
                    <Stack
                      style={{
                        margin: "0.5rem",
                        userSelect: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      {
                        localization.ReportDetailPage.waiverConfig.main.hint
                          .buttonText
                      }
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack sx={categoryContainer}>
                <Stack
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: ".4rem",
                  }}
                >
                  {scoreMetricCategory.scoreMetrics.map((scoreMetric) => (
                    <Stack key={scoreMetric.scoreMetricLabel}>
                      <Stack sx={categoryName}>
                        {scoreMetric.scoreMetricLabel}
                      </Stack>
                      <Stack sx={categoryBox}>
                        <WaiverConfigSelect
                          scoreMetricValues={scoreMetric.scoreMetricValues}
                          selectedScoreMetricValue={
                            scoreMetric.selectedScoreMetricValue
                          }
                          originalScoreMetricValue={
                            scoreMetric.originalScoreMetricValue
                          }
                          margin={"0.4rem 0.4rem 0rem 0rem"}
                        />
                        <Stack sx={commentContainer}>
                          <CommentBox
                            commentState={{
                              value: scoreMetric.comment.value,
                              setValue: scoreMetric.comment.setValue,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

/**************
 * Styles
 **************/

const waiverConfigContainer = {
  flexDirection: "row",
  width: "100%",
  fontFamily: mainTheme.typography.fontFamily
    ? mainTheme.typography.fontFamily
    : "Arial",
};

const leftSideContainer = {
  width: "30%",
  borderTopLeftRadius: "10px",
  borderBottomLeftRadius: "10px",
  borderRight: "1px solid #003c3c",
};

const leftSideSubContainer = {
  margin: "0 2rem 0 2rem",
  textAlign: "left",
  flexDirection: "column",
};

const projectDataContainer = {
  margin: "0 0 1.5rem 0",
};

const projectDataIDContainer = {
  flexDirection: "column",
  borderBottom: "2px solid #003c3c",
  marginBottom: "5%",
};

const projectDataTitle = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  marginBottom: "5px",
};

const projectDataTextGreen = {
  fontSize: "1.0rem",
  fontWeight: "bold",
  color: mainTheme.palette.primary.contrastText,
  marginBottom: "5px",
};

const projectDataTinyText = {
  fontSize: "1rem",
  marginBottom: "5px",
};

const rightSideContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  padding: "1rem",
  textAlign: "left",
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
};

const scoreMetricCategoryContainer = {
  display: "flex",
  flexDirection: "column",
  textAlign: "left",
  borderBottom: "1px solid #003c3c",
};

const scoreMetricCategorySubContainer = {
  display: "flex",
  flexDirection: "column",
};

const scoreMetricCategoryName = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "5px",
  color: mainTheme.palette.primary.contrastText,
};

const boldHint = (visible: boolean) => {
  return {
    flexDirection: "row",
    alignItems: "center",
    display: visible ? "flex" : "none",
  };
};

const categoryContainer = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
};

const categoryBox = {
  backgroundColor: "#F5F5F5",
  padding: "1rem",
  //border: "1px solid #003c3c",
  borderRadius: "5px",
  width: "220px",
};

const categoryName = {
  width: "100%",
  fontSize: "1rem",
  fontWeight: "bold",
  margin: "1rem 0 .5rem 0",
  justifyContent: "space-between",
  alignItems: "center",
};

const commentContainer = {
  display: "flex",
  width: "100%",
  alignItems: "stretch",
  justifyContent: "flex-start",
  height: "auto",
};

/**************
 * Hint for the original value box
 * legend / caption
 **************/

const legendContainer = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: ".5rem",
};

const originalValueBox = {
  fontSize: "0.8rem",
  Height: "36px",
  Width: "148px",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #003c3c",
  borderRadius: "4px",
  padding: "0 6px 0 6px",
  marginLeft: "1rem",
};

/**************/

export default WaiverConfigContent;
