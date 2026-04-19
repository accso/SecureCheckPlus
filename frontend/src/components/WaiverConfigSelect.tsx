import React from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import localization from "../utilities/localization";

export interface Props {
  /**
   * Texts displayed on the buttons
   */
  scoreMetricValues: {title: string, tooltip: string}[];
  /**
   * The useState Hook to transfer the choice
   */
  selectedScoreMetricValue: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  };
  /**
   * The option, that was found in the report file
   */
  originalScoreMetricValue: string;
  /**
   * Margin of each box. Example: "0rem 1rem 0rem 0rem"
   */
  margin: string;
}

export default function WaiverConfigSelect(props: Props) {
  return (
    <Stack sx={radioButtonBox}>
      {props.scoreMetricValues.map((value) => (
        <Tooltip title={value.tooltip}>
          <Button
            sx={radioButton(props, value.title)}
            onClick={() => props.selectedScoreMetricValue.setValue(value.title)}
          >
            {value.title}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  );
}

/**************
 * Styles
 **************/

const radioButtonBox = {};

const radioButton = (props: Props, label: string) => {
  return {
    border:
      props.originalScoreMetricValue === label
        ? "2px solid #000000"
        : "1px solid #00000080",
    backgroundColor:
      props.selectedScoreMetricValue.value === label
        ? "#00cb75"
        : "transparent",
    marginBottom: "0.5rem",
    "&:hover": {
      backgroundColor:
        props.selectedScoreMetricValue.value === label ? "#00cb75" : "#2dfa87",
    },
    fontSize: "0.8rem",
    fontWeight: 400,
    minHeight: "24px",
    minWidth: "96px",
  };
};
