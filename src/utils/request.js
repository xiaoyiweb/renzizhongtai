import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  // 动态配制
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

const timeout = 86400
// request interceptor 请求拦截器（发请求之前执行）
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (isTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('登录超时')
      return Promise.reject(new Error('token超时了'))
    } else {
      config.headers.Authorization = store.getters.token
    }
  }
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
}
)

// response interceptor 响应拦截器（发请求之后执行）
service.interceptors.response.use(response => {
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('登录超时')
    return Promise.reject(new Error('token超时了'))
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
}
)

const isTimeOut = () => {
  const timenow = Date.now()
  const timelast = getTime()
  return (timenow - timelast) / 1000 > timeout
}

export default service
