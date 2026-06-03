//封装购物车相关的接口
import request from '@/utils/http'


//加入购物车
export const insertCartAPI = ({skuId, count}) => {
  return request({
      url: '/member/cart',
      method: 'post',
        data: {
          skuId,
          count
        }
        
  })
}
//获取最新的购物车列表
export const findNewCartListAPI = () => {
    return request({
        url: '/member/cart',
        method: 'get'
    })
}


//删除购物车商品
export const delCartAPI = (ids) => {
  return request({
      url: '/member/cart' ,
      method: 'delete',
      data: {
          ids
      }
  })
}