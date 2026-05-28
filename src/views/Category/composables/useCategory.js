//封装分类数据业务相关代码
import {getCategoryAPI} from '@/apis/category'
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router';

export function useCategory() {
  //获取分类数据
const categoryData =ref({})
const route = useRoute()

const getCategory = async (id = route.params.id) => {
  try {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result || {}
  } catch (error) {
    console.error('getCategory failed:', error)
    categoryData.value = {}
  }
}

onMounted(() => {
    getCategory()
})

//目标：当路由参数发生变化时 重新获取分类数据
onBeforeRouteUpdate((to) => {
    getCategory(to.params.id)
})
    return {categoryData}
}