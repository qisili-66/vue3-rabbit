//封装购物车模块

import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    return{
        cartList,
        addCart
    }
},{
    persist:true
})
    
