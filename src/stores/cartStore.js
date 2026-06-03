//封装购物车模块

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', ()=>{
    //1.定义状态-cartlist
    const cartList= ref([])
    //2.定义方法
    const addCart = (goods)=>{
        //添加购物车
     const item=cartList.value.find((item) => goods.skuId===item.skuId)
     if(item){
         //如果存在，数量增加
         item.count+=goods.count
     }else{
         //如果不存在，添加新的商品
         cartList.value.push(goods)
     }

    }
    // 删除购物车商品
    const delCart = (skuId) => {
        cartList.value = cartList.value.filter(item => item.skuId !== skuId)
    }

    // 计算总数和总价
    const totalCount = computed(() => {
        return cartList.value.reduce((sum, item) => sum + (item.count || 0), 0)
    })

    const totalPrice = computed(() => {
        return cartList.value.reduce((sum, item) => sum + (item.count || 0) * (item.price || 0), 0)
    })
    return{
        cartList,
        addCart,
        delCart,
        totalCount,
        totalPrice
    }
},{
    persist:true
})
    
