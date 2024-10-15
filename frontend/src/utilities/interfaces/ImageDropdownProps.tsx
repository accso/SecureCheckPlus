export interface ImageDropdownProps {
    /************************************************************************************
     * All array attributes should correspond to each other regarding the element order.
     ************************************************************************************/

    /**
     * Texts shown in the DropDown (next to the images if imageURLs exists)
     */
    texts: string[]
    /**
     * Values the DropDown holds, after an option is selected
     */
    values: string[]
    /**
     * Key under which the held value will be saved in the local storage (set this key via constants.tsx "localStorageItemKeys")
     */
    localStorageItemKey?: string
    /**
     * Available colors
     */
    colors?: string[]
    /**
     * Index of the Item being selected as default
     */
    defaultIndex?: number
    /**
     * URLs of the images shown in the DropDown
     */
    imageURLs?: string[]
    /**
     * Image height
     */
    imageHeightInPixel?: number
    /**
     * Image width
     */
    imageWidthInPixel?: number
    /**
     * Show images only (no text)
     */
    imagesOnly?: boolean
}