import httpInstance from "@/utils/http";


// 测试接口
export function getCategory() {
    return httpInstance(
        {
            url: 'home/category/head', // 请求地址
            method: 'get', // 请求方式
        }
    )
}