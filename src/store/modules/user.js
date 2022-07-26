import { login, getUserInfo, getUserDeail } from '@/api/user'
import * as auth from '@/utils/auth'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: auth.getToken() || '',
    userInfo: {}

  },
  mutations: {
    setUserInfo (state, res) {
      state.userInfo = res
    },

    removeUserInfo (state) {
      state.userInfo = {}
    },

    setToken (state, token) {
      state.token = token
      auth.setToken(token)
    },

    removeToken (state) {
      state.token = ''
      auth.removeToken()
    }
  },
  actions: {
    async getTokenAction (context, loginForm) {
      const res = await login(loginForm)
      auth.setTime()
      context.commit('setToken', res)
    },

    async getUserInfoAction (context) {
      const res = await getUserInfo()
      const detail = await getUserDeail(res.userId)
      context.commit('setUserInfo', { ...res, ...detail })
      return res // 伏笔 后面要用
    },

    logout (context) {
      context.commit('removeToken')
      context.commit('removeUserInfo')
      resetRouter()

      context.commit('permission/setRoutes', [], { root: true })
    }
  }
}
