<script setup>
import { useCategoryStore} from '@/stores/category';
const categoryStore = useCategoryStore();



</script>

<template>
  <header class="app-header">
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>
      
      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li class="app-header-nav-item" v-for="item in categoryStore.categoryList" :key="item.id">
          <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        </li>   
      </ul>


      
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>

    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;  

  .container {
    display: flex;
    align-items: center;         
    justify-content: space-between; 
    height: 132px;               
  }

  .logo {
    width: 200px;
    flex-shrink: 0;          

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
    }
  }

  .app-header-nav {
    display: flex;
    align-items: center;
    gap: 40px;                   
    margin: 0 30px;            
    list-style: none;            
    li {
      a {
        font-size: 16px;
        color: #333;
        text-decoration: none;
        white-space: nowrap;    

        &:hover {
          color: #27ba9b;
        }
      }

      &.home a {
        font-weight: 500;
      }
    }
  }

  .header-nav {
    flex: 1;                     
    display: flex;
    justify-content: flex-end;   
  }

  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    margin-left: 20px;
    flex-shrink: 0;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
      border: none;
      outline: none;
      background: transparent;
    }
  }

  .header-cart {
    width: 50px;
    margin-left: 15px;
    flex-shrink: 0;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>