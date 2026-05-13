
import httpInstance from '@/utils/http'
import request from '@/utils/http'

/**
 * 
 * @param {*} id 
 * @returns 
 */

export function getCategoryAPI(id){
    return request({
        url: '/category',
        params: {
            id
        }
    })
}

/**
 * 获取二级分类列表数据
 */


export const getCategoryFilterAPI=(id)=>{
    return httpInstance({
        url: '/category/sub/filter',
        params: {
            id
        }
    })
    
}
/**
 * 获取导航数据
 */
export const getSubCategoryAPI=(data)=>{
    return request({
        url: '/category/goods/temporary',
        method: 'post',
        data
    })
}