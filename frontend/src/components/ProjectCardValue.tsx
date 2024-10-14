import {Stack, Typography} from "@mui/material";

type ValueProperty = {
    color: string
    label: string | number
    height?: string
    width?: string
    size?: string
}

export default function ProjectCardValue(props: ValueProperty){
    return(
        <Stack sx={valueBoxProperty(props)}>
            <Typography fontSize={"1.7rem"}>{props.label}</Typography>
        </Stack>
    )
}

const valueBoxProperty = ({color, size, height = "50px", width = "100px"}: ValueProperty) => {
    return {
        borderBottom: 5,
        borderColor: color,
        height: size || height,
        width: size || width,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
    }
}