import request from '@/utils/http'

export const getMemberOrderListAPI = (params) => {
  return request({
    url: '/member/order',
    method: 'get',
    params
  })
}

export const getMemberAddressListAPI = () => {
  return request({
    url: '/member/address',
    method: 'get'
  })
}

export const getMemberInfoAPI = () => {
  return request({
    url: '/member/profile',
    method: 'get'
  })
}

export const getLikeListAPI = (params = {}) => {
  return request({
    url: '/goods/relevant',
    method: 'get',
    params: {
      limit: 4,
      ...params
    }
  })
}
