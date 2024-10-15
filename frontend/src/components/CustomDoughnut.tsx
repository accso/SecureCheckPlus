import {Doughnut} from 'react-chartjs-2'
import React from "react";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import localization from "../utilities/localization"
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useNavigate} from "react-router-dom";

interface ChartOptions {
    labels: string[]
    colors: string[]
}

interface ChartProps {
    data: {}
    options: ChartOptions
    status?: string[]
}

/**
 * A pie diagramm displaying the number of detected vulnerabilities and their severity.
 * @param {PieProps} props - A ProjectData object containing the severities as keys and the frequency as values.
 */
const CustomDoughnut: React.FunctionComponent<ChartProps> = (props: ChartProps) => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    ChartJS.register(ChartDataLabels)

    const navigate = useNavigate();
    const values: string[] = []

    for (const key in props.data) {
        values.push(props.data[key as keyof typeof props.data])
    }

    const projectData = {
        labels: props.options.labels,
        datasets: [{
            data: values,
            backgroundColor: props.options.colors,
            borderWidth: 0
        }]
    }

    function redirect(event: any, property: any){
        let severity = event.chart.data.labels[property[0].index].toUpperCase()
        if (severity === "N/A"){
            severity = "NA"
        }

        if (Object.keys(localization.misc.severity).includes(severity)) {
            navigate("reports", {
                state: {
                    status: props.status,
                    severity: [severity],
                }
            })
        }
    }

    const options = {
        responsive: true,
        onClick: redirect,
        plugins: {
            plugin: {},
            datalabels: {
                color: '#003c3c',
                formatter: (value: number) => {
                    return value > 0 ? value : '';
                },
                font: {
                    size: 20
                }
            },
            tooltip: {
                bodyFont: {
                    size: 15
                }
            },
            legend: {
                labels: {
                    color: "#FFFFFF",
                    font: {
                        size: 15
                    }
                },
                position: "bottom" as "bottom",
            }
        }
    }

    return (
        <Doughnut data={projectData} options={options}/>
    )
}

export default CustomDoughnut





















