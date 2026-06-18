//axios的基础封装
import axios from 'axios'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'
// 为避免与路由文件产生循环依赖，这里不静态导入 router，必要时动态导入

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
  // 保护性读取错误信息，避免二次异常
  const msg = e && e.response && e.response.data && e.response.data.message
    ? e.response.data.message
    : (e && e.message) || '请求失败'
  //统一错误提示
  try {
    ElMessage({ type: 'warning', message: msg })
  } catch (err) {
    // 忽略 ElMessage 异常
    console.warn('ElMessage failed:', err)
  }
  //统一错误处理: 401 -> 删除用户信息并跳转到登录页面
  if (e && e.response && e.response.status === 401) {
    try {
      userStore.clearUserInfo()
    } catch (err) {
      console.warn('clearUserInfo failed:', err)
    }
    try {
      // 动态导入路由以避免循环依赖
      import('@/router')
        .then(m => {
          try { m.default.push('/login') } catch (err) { console.warn('router.push failed:', err) }
        })
        .catch(err => console.warn('dynamic import router failed:', err))
    } catch (err) {
      console.warn('router dynamic import failed:', err)
    }
  }
  return Promise.reject(e)
})

export default httpInstance