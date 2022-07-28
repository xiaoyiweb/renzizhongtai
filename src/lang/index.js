import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from 'element-ui/lib/locale/lang/en'
import zh from 'element-ui/lib/locale/lang/zh-CN'
import myEn from './en'
import myZh from './zh'
import cookie from 'js-cookie'
Vue.use(VueI18n)

const i18n = new VueI18n({
	locale: cookie.get('lang') || zh,

	messages: {
		en: {
			...en,
			...myEn
		},

		zh: {
			...zh,
			...myZh
		}

	}
})

export default i18n
