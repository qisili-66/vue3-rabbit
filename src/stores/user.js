//管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'




export const useUserStore = defineStore('user',()=>{
    //1.定义状态
    const userInfo=ref({})

    //2.定义获取接口数据的action函数
    const getUserInfo=async({account,password})=>{
       const res = await loginAPI({account,password})
       userInfo.value = res.result
       return userInfo.value
    }
  //退出时清除用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
  }
    //3.定义修改状态数据的action函数
    return{
        userInfo,
        getUserInfo,
        clearUserInfo
    }
},{
    persist:true
})