//axios的基础封装
import axios from 'axios'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import{ useUserStore } from '../stores/userStore'
import route from '@/router'

const httpInstance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

//拦截器
// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  //1、从pinia中获取token数据
const userStore = useUserStore()
  //2、将token添加到请求头中
  const token= userStore.userInfo.token
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, e=> Promise.reject(e))

// axios响应拦截器
httpInstance.interceptors.response.use(res => res.data,e => {
  const userStore = useUserStore()
  //统一错误提示
  ElMessage({
    type: 'warning',
    message: e.response.data.message 
  })
  //统一错误处理:1、401:删除用户信息。跳转到登录页面
  if(e.response.status === 401){
    userStore.clearUserInfo()
    route.push('/login')
  }
    return Promise.reject(e)
})

export default httpInstance