import React, { useCallback, useEffect, useState } from "react";
import { Stack, TextField } from "@mui/material";
import localization from "../utilities/localization";
import { debounce } from "../utilities/debouncing";

export interface Props {
  commentState: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  };
  multiline?: boolean;
  maxRows?: number;
  editable?: boolean;
}

export default function CommentBox(props: Props) {
  const [maxRows, setMaxRows] = useState(2);
  const [localCommentValue, setLocalCommentValue] = useState(
    props.commentState.value
  );

  /**
   * Debounce comment state update by 300ms.
   * Otherwise, user input is laggy
   */
  const debouncedCommentUpdate = useCallback(
    debounce((commentValue: string) => {
      props.commentState.setValue(commentValue);
    }, 300), // Debounce of 300ms
    [props.commentState]
  );

  useEffect(() => {
    debouncedCommentUpdate(localCommentValue);
  }, [localCommentValue]);

  return (
    <Stack>
      <TextField
        label={
          props.commentState.value == ""
            ? localization.ReportDetailPage.waiverConfig.main.hint.commentBox
            : localization.ReportDetailPage.waiverConfig.main.hint.commentBox2
        }
        size={"small"}
        multiline={props.multiline ? props.multiline : true}
        maxRows={maxRows}
        InputProps={{
          readOnly: props.editable ? !props.editable : false,
        }}
        value={localCommentValue}
        onFocus={() => setMaxRows(props.maxRows ? props.maxRows : 5)}
        onMouseEnter={() => {
          setMaxRows(props.maxRows ? props.maxRows : 5);
        }}
        // onMouseLeave={() => setMaxRows(2)}
        onChange={(event) => setLocalCommentValue(event.target.value)}
      />
    </Stack>
  );
}
