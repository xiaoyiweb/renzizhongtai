import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent } from 'echarts/components'
echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer, TooltipComponent])

export default {
	install (Vue) {
		Vue.prototype.echarts = echarts
	}
}
