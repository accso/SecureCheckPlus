import {ScoreMetricCategory} from "../ScoreMetricCategoriesData";

export interface WaiverConfigData {

    // Sidebar
    projectId: string,
    lastEdited: Date,
    author: string,

    // Metric data
    scoreMetricCategoriesData: ScoreMetricCategory[],
}

