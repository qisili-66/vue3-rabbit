<script setup>
import { ref } from 'vue'

defineProps({
  imageList:{
    type:Array,
    default:()=>[]
  }
})

const activeIndex = ref(0)
const target = ref(null)
const layerLeft = ref(0)
const layerTop = ref(0)
const positionX = ref(0)
const positionY = ref(0)
const isOutside = ref(true)

const LAYER_W = 200
const LAYER_H = 200

function setActive(i) {
  activeIndex.value = i
}

function onMouseEnter() {
  isOutside.value = false
}

function onMouseLeave() {
  isOutside.value = true
}

function onMouseMove(e) {
  if (!target.value) return
  const rect = target.value.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top

  let left = x - LAYER_W / 2
  let top = y - LAYER_H / 2

  left = Math.max(0, Math.min(left, rect.width - LAYER_W))
  top = Math.max(0, Math.min(top, rect.height - LAYER_H))

  layerLeft.value = left
  layerTop.value = top
  positionX.value = -left * 2
  positionY.value = -top * 2
}
</script>

<template>
  <div class="goods-image">
    <!-- 左侧大图 -->
    <div class="middle" ref="target" @mousemove="onMouseMove" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <img :src="imageList[activeIndex]" alt="" />
      <!-- 蒙层小滑块 -->
      <div class="layer" :style="{ left: `${layerLeft}px`, top: `${layerTop}px` }"></div>
    </div>

    <!-- 小图列表 -->
    <ul class="small">
      <li
        v-for="(img, i) in imageList"
        :key="i"
        :class="{ active: activeIndex === i }"
        @click="setActive(i)"
      >
        <img :src="img" alt="" />
      </li>
    </ul>

    <!-- 放大镜大图 -->
    <div
      class="large"
      :style="{
        backgroundImage: `url(${imageList[activeIndex]})`,
        backgroundPositionX: `${positionX}px`,
        backgroundPositionY: `${positionY}px`
      }"
      v-show="!isOutside"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }

  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    z-index: 500;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .layer {
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.2);
    left: 0;
    top: 0;
    position: absolute;
  }

  .small {
    width: 80px;
    display: flex;
    flex-direction: column;
    margin-left: 20px;

    li {
      width: 68px;
      height: 68px;
      margin-bottom: 15px;
      cursor: pointer;
      overflow: hidden;

      &.active,
      &:hover {
        border: 2px solid $xtxColor;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
