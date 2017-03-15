import cookie from 'react-cookie'

const cookieDomain = '192.168.66.106'
let cookieConfig = {}
if (cookieDomain !== '') {
  cookieConfig = {domain: cookieDomain}
}

export const setCookie = (key, value) => {
  cookie.save(key, value, cookieConfig)
}

export const getCookie = (key) => {
  cookie.load(key)
}

export const delCookie = (key) => {
  cookie.remove(key, cookieConfig)
}

export const signIn = (value) => {
  cookie.save('token', value, cookieConfig)
}

export const signOut = () => {
  cookie.remove('token', cookieConfig)
}

export const getToken = () => {
  return cookie.load('token')
}
