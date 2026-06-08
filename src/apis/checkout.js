import request from '@/utils/http'

//获取详情接口
export const getCheckInfoAPI = () => {
  return request({
    url: '/member/order/pre'
  })
}

//新增收货地址
export const addAddressAPI = (data) => {
  return request({
    url: '/member/address',
    method: 'post',
    data
  })
}

// 创建订单
export const createOrderAPI = (data) => {
  return request({
    url: '/member/order',
    method: 'post',
    data
  })
}
