import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']
// 导航守卫
router.beforeEach((to, from, next) => {
	NProgress.start()
	const token = store.getters.token
	if (token) {
		if (to.path === '/login') {
			next('/')
		} else {
			if (!store.getters.userId) {
				store.dispatch('user/getUserInfoAction')
			}
			next()
		}
	} else {
		if (whiteList.includes(to.path)) {
			next()
		} else {
			Message({
				message: '您还未登录',
				type: 'error'
			})
			next('/login')
		}
	}
	NProgress.done()
})

router.afterEach(() => {
	NProgress.done()
})
