<template>
  <a-layout class="base-layout">
    <!-- 左侧sider start-->
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <!--logo组件-->
      <base-logo :collapsed="collapsed"></base-logo>
      <!-- menu组件 -->
      <base-menu :collapsed="collapsed"></base-menu>
    </a-layout-sider>
    <!-- 左侧sider end-->
    <!-- 右侧 main -->
    <a-layout>
      <!-- 右侧header-->
      <a-layout-header style="background: #fff;padding: 0">
        <a-row style="height: 100%;">
          <a-col :span="5">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
            <span style="font-size: 20px;font-weight:500">{{this.$route.name}}</span>
          </a-col>
        </a-row>
      </a-layout-header>
      <!-- 右侧content-->
      <a-layout-content class="layout-content">
        <base-content style="height: 100%"></base-content>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import BaseLogo from './components/Logo'
import BaseMenu from './components/Menu'
import BaseContent from './components/Content'
export default {
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    BaseLogo,
    BaseMenu,
    BaseContent
  }
}
</script>

<style scoped>
.base-layout {
  display: flex;
  overflow: hidden;
  min-height: 100vh;
}
.base-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.base-layout .trigger:hover {
  color: #1890ff;
}
.base-layout .layout-content {
  margin: 0px 0px;
  padding: 0px 0px;
  background: #fff;
}
.header-avatar {
  color: #fff;
  background-color: #f58c00;
  /*position: absolute;*/
  /*right:15px;*/
  /*top:15px;*/
}
.header-avatar :hover {
  cursor: pointer;
}
</style>
