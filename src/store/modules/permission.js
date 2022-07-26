import { constantRoutes, asyncRoutes } from '@/router'

const state = {
	routes: constantRoutes
}

const mutations = {
	setRoutes (state, newRoures) {
		state.routes = [...constantRoutes, ...newRoures]
	}
}

const actions = {
	filterRoutes (context, menus) {
		const routes = []
		menus.forEach(key => {
			const newAsyncRoutes = asyncRoutes.filter(item => item.name === key)
			routes.push(...newAsyncRoutes)
		})
		context.commit('setRoutes', routes)
		return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions

}
