import Vue from 'vue'

// 重置浏览器默认样式包
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
// 全局样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 注册全局图标文件
import '@/icons' // icon
// 路由守卫
import '@/permission' // permission control

import * as directives from '@/directive'
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
