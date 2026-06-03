<script setup>
import LayoutNav from './LayoutNav.vue';
import LayoutHeader from './LayoutHeader.vue';
import LayoutFooter from './LayoutFooter.vue';
import LayoutFixed from './LayoutFixed.vue';
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore.js';

const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.getCategory().catch(() => {})
});
</script>

<template>
  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
  <RouterView />
  <LayoutFooter />
</template>

<style scoped></style>
