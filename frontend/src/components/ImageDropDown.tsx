import React, {useState} from "react";
import {ListItemText, MenuItem, Select} from "@mui/material";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import {ImageDropdownProps} from "../utilities/interfaces/ImageDropdownProps";

/*
 * A Dropdown containing text and/or images
 */
const ImageDropDown: React.FunctionComponent<ImageDropdownProps> = (props: ImageDropdownProps) => {
  let localStorageItemKey = props.localStorageItemKey ? props.localStorageItemKey : "";
  let localStorageItemValue = localStorageItemKey == "" ? null : localStorage.getItem(localStorageItemKey);
  let localStorageItemIndex = localStorageItemValue ? props.values.indexOf(localStorageItemValue) : 0;
  let currentIndex = props.defaultIndex ? props.defaultIndex : localStorageItemIndex;
  let currentValue = props.values[currentIndex];
  const [currentText, setText] = useState(props.texts[currentIndex]);
  const [currentBackgroundColor, setBackgroundColor] = props.colors ? useState(props.colors[currentIndex]) : useState("#ffffff");
  let gotImageURLs = props.imageURLs ? true : false;
  let showImagesOnly = false;
  const [currentImageURL, setImageURL] = props.imageURLs ? useState(props.imageURLs[currentIndex]) : useState("");
  let imageHeight = props.imageHeightInPixel ? props.imageHeightInPixel : 20;
  let imageWidth = props.imageWidthInPixel ? props.imageWidthInPixel : 35;

  const handleChange = (e: any) => {
    currentValue = e.target.value;
    props.localStorageItemKey ? localStorage.setItem(props.localStorageItemKey, currentValue) : gotImageURLs = gotImageURLs /* Do nothing */;
    currentIndex = props.values.indexOf(currentValue);
    const currText = props.texts[currentIndex]
    setText(currText);
    props.imageURLs ? setImageURL(props.imageURLs[currentIndex]) : setImageURL("");
    props.colors ? setBackgroundColor(props.colors[currentIndex]) : setBackgroundColor(currentBackgroundColor);
    props.onSelectionChange?.(currText, currentValue)
  }

  return (
      <Select
          sx={imageDropDownStyle(currentBackgroundColor)}
          IconComponent={KeyboardDoubleArrowDownRoundedIcon}
          onChange={handleChange}
          value={currentValue}
      >
        {props.texts.map((value, index) => (
            <MenuItem key={value} sx={menuItemStyle} value={props.values[index]}>
              <ListItemText sx={visibleElement(!showImagesOnly)} style={{textAlign:"left"}} primary={value}/>
            </MenuItem>
        ))}
      </Select>
  )
}

/**************
 * Styles
 **************/

const menuItemStyle = {
  alignItems:"center",
  justifyContent:"center",
  textAlign:"left",
}

const imageDropDownStyle = (backgroundColor: string) => {
  return {
    width: "144px",
    height: "36px",
    borderRadius: "0.5rem",
    background: backgroundColor,
  }
}

const visibleElement= (showEle: boolean) => {
  return {
    display: showEle ? "block" : "none",
  }
}

export default ImageDropDown