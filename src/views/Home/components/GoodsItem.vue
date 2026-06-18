<script setup>
import { computed } from 'vue'

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({})
  },
  good: {
    type: Object,
    default: () => ({})
  }
})

const currentGoods = computed(() => {
  return Object.keys(props.goods || {}).length ? props.goods : props.good
})

const title = computed(() => currentGoods.value?.title || currentGoods.value?.name || '商品详情')
const description = computed(() => currentGoods.value?.alt || currentGoods.value?.desc || '')
const detailUrl = computed(() => `/detail/${currentGoods.value?.id || ''}`)
</script>

<template>
  <RouterLink :to="detailUrl" class="goods-item">
    <img v-img-lazy="currentGoods.picture" alt="" />
    <p class="name ellipsis">{{ title }}</p>
    <p class="desc ellipsis">{{ description }}</p>
    <p class="price">&yen;{{ currentGoods.price }}</p>
  </RouterLink>
</template>



<style scoped lang="scss">
 .goods-item {
  display: block;
  width: 220px;
  text-align: center;
  padding: 5px 5px;
  transition: all 0.5s;

  &:hover {
    transform: translate3d(0, -3px, 0);
    box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
  }

  img {
    width: 160px;
    height: 160px;
  }

  p {
    padding-top: 10px;
  }

  .name {
    font-size: 16px;
  }

  .desc {
    color: #999;
    height: 29px;
  }

  .price {
    color: $priceColor;
    font-size: 20px;
  }
}
</style>
