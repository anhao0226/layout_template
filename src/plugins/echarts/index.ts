import ECharts from "vue-echarts";
import { App } from "@vue/runtime-core";
import { use } from "echarts/core"

import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart,
    LineChart,
    PieChart,
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent
} from 'echarts/components'

use([
    CanvasRenderer,
    BarChart,
    PieChart,
    GridComponent,
    TooltipComponent
])

use([
    LineChart
])

export function useECharts(app: App) {
    app.component('echarts', ECharts)
}