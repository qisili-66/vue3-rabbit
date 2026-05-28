import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'

//引入初始化
import '@/styles/common.scss'

//引入懒加载指令并且注册
import { lazyPlugin } from '@/directives'
//引入全局组件插件
import { componentPlugins } from '@/components'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugins)
app.mount('#app')

//定义全局指令

