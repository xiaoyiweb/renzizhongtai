import Cookies from 'js-cookie'

const token = 'renzi'
const timekey = 'timestamp-key'

export function getToken () {
  return Cookies.get(token)
}

export function setToken (val) {
  return Cookies.set(token, val)
}

export function removeToken () {
  return Cookies.remove(token)
}

export function setTime () {
  return Cookies.set(timekey, Date.now())
}

export function getTime () {
  return Cookies.get(timekey)
}
