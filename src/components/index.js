// 注册全局组件

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import imageUpload from './ImageUpload'
import Print from 'vue-print-nb'

export default {
	install (Vue) {
		Vue.component('PageTools', PageTools)
		Vue.component('UploadExcel', UploadExcel)
		Vue.component('imageUpload', imageUpload)
		Vue.use(Print)
	}
}
