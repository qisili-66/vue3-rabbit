//封装购物车模块
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import {insertCartAPI, findNewCartListAPI, delCartAPI} from '@/apis/cart'

export const useCartStore = defineStore('cart', ()=>{
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token) // 判断用户是否登录
    //1.定义状态-cartlist
    const cartList= ref([])

    //获取最新购物列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    //2.定义方法
    const addCart = async (goods) => {
        if (isLogin.value) {
            const { skuId, count } = goods
            // 如果用户登录，调用添加购物车接口
            await insertCartAPI({ skuId, count })
            await updateNewList()
        } else {
            //如果用户未登录，调用本地存储添加购物车
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                //如果存在，数量增加
                item.count += goods.count
            } else {
                //如果不存在，添加新的商品
                cartList.value.push(goods)
            }
        }
    }

    // 删除购物车商品
    const delCart = async (skuId) => {
        // 登录用户，调用接口删除并刷新最新列表；未登录，直接从本地移除
        if (isLogin.value) {
            await delCartAPI([skuId])
            await updateNewList()
        } else {
            cartList.value = cartList.value.filter(item => item.skuId !== skuId)
        }
    }
    
    //清除购物车
    const clearCart = () => {
        cartList.value = []
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
        clearCart,
        totalCount,
        totalPrice
    }
},{
    persist:true
})
    
