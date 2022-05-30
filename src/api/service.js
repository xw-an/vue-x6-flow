import axios from 'axios'
import {message} from 'ant-design-vue'

export const Service = axios.create({
  // baseURL: 'http://godaxe-api-stg.huolala.work', // 后端的api的baseurl服务地址
  // baseURL: process.env.BASE_URL, // 后端的api的baseurl服务地址
  timeout: 60000 // 请求超时时间
})

// 添加请求拦截器
Service.interceptors.request.use(config => {
  // let token = localStorage.getItem('token')
  // token ? config.headers.token = token : config.headers.token = '1111'
  return config
},
error => {
  Promise.reject(error)
})

// 添加响应拦截器
Service.interceptors.response.use(response => {
  return response.data
}, error => {
  const msg = error.message !== undefined ? error.message : ''
  message.error('数据获取失败 ' + msg)
  return Promise.reject(error)
})
