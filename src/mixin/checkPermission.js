import store from '@/store'

export default {
	methods: {
		checkPermission (key) {
			try {
				const { userInfo } = store.state.user
				if (userInfo.roles.points && userInfo.roles.points.length) {
					return userInfo.roles.points.some(item => item === key)
				}

				return false
			} catch (error) {
				console.log('退出登录成功')
			}
		}
	}
}
