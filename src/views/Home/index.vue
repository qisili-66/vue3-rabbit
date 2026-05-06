<script setup>
import HomeCategory from './components/HomeCategory.vue';
import HomeBanner from './components/HomeBanner.vue';
import HomeNew from './components/HomeNew.vue';
import HomeHot from './components/HomeHot.vue';
import HomeProduct from './components/HomeProduct.vue';
import HomePanel from './components/HomePanel.vue';

</script>


<template>
    <div class="container">
             <HomeCategory />
        <HomeBanner />
    </div>
        <HomeNew />
        <HomeHot />
        <HomeProduct />
        <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱" />
         <div>
            我是新鲜好物的插槽
         </div>
        <HomePanel title="人气推荐" subTitle="热门推荐 不容错过" />
            <div>
                我是人气推荐的插槽
            </div>
</template>