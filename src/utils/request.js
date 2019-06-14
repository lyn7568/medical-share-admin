import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import { comUrl } from '@/utils'

// 创建axios实例
const service = axios.create({
  baseURL: comUrl, // api的base_url
  timeout: 5000, // 请求超时时间
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// request拦截器
service.interceptors.request.use(config => {
  // 配置config
  config.headers.Accept = 'application/json'
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
    // 处理后后台无需添加RequestBody
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  let taR = response.data
  if (response && response.status === 200) {
    if (response.data === undefined) { // 解决IE9数据问题
      taR = response.request.responseText
    } else {
      taR = response.data
    }
    if (!(taR instanceof Object)) { // 判断taR不是Object时，解析成Object
      taR = JSON.parse(taR)
    }
    if (!taR.success && taR.code === 0) {
      Message.error(taR.msg || taR.detailMsg)
    }
    if (!taR.success && taR.code === 1) {
      store.dispatch('FedLogOut').then(() => {
        Message.error('登录状态失效，请重新登录')
        router.push({ path: '/' })
      })
    }
    return taR
  } else {
    return Promise.resolve(response)
  }
}, error => {
  return Promise.reject(error)
})

var ret = {
  get: function(url, data, sh) {
    service({
      method: 'get',
      url: url,
      params: data
    }).then(res => {
      sh(res)
    }).catch(err => {
      Message.error(err || '网络异常')
    })
  },
  post: function(url, data, sh) {
    service({
      method: 'post',
      url: url,
      data: data
    }).then(res => {
      sh(res)
    }).catch(err => {
      Message.error(err || '网络异常')
    })
  },
  put: function(url, Da, sh, eh) {
    service({
      method: 'put',
      url: url,
      data: Da
    }).then(res => {
      sh(res)
    }).catch(err => {
      if (eh) eh(err)
    })
  }
}

export default ret
