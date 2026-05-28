//封装Banner轮播图相关的业务代码

import {ref} from 'vue';
import {getBannerAPI} from '@/apis/home';
import {onMounted} from 'vue';

export function useBanner() {
   const bannerList = ref([]);

const getBanner = async () => {
  try {
    const res = await getBannerAPI(
      {
        distributionSite:'2'
      }
    );
    console.log(res);
    bannerList.value = res.result || [];
  } catch (error) {
    console.error('getBanner failed:', error);
    bannerList.value = [];
  }
}
onMounted(() => {
  getBanner();
});

return {
  bannerList
}
}
