import request from '@/utils/http'
import { linkEmits } from 'element-plus'
import { id } from 'element-plus/es/locale/index.mjs'


export const getDetail = (id) => {
  return request({
    url: '/goods',
    params:{
        id
    }
  })
}

export const getHotGoodsAPI = ({id, type, limit=3}) => {
  return request({
    url: '/goods/hot',
    params:{
      id,
      type,
      limit
    }
    })
  }

