//管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { useCartStore }from './cartStore'
import {mergeCartAPI} from '@/apis/cart'


export const useUserStore = defineStore('user',()=>{
  const cartStore = useCartStore()
    //1.定义状态
    const userInfo=ref({})

    //2.定义获取接口数据的action函数
    const getUserInfo=async({account,password})=>{
       const res = await loginAPI({account,password})
       userInfo.value = res.result
       // 登录成功后，合并本地购物车到服务器
       if (cartStore.cartList.length > 0) {
         await mergeCartAPI(cartStore.cartList.map(item => ({
           skuId: item.skuId,
           selected: item.selected,
           count: item.count
         })))
         await cartStore.updateNewList() // 刷新购物车列表
       }
       return userInfo.value
    }
  //退出时清除用户信息
  const clearUserInfo = () => {
    userInfo.value = {} // 清空用户信息
   cartStore.clearCart() // 同时清空购物车
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