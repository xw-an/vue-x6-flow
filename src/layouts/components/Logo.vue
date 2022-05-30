<template>
  <div class="logo-container" v-if="!collapsed">
<!--    <img src="https://van-pre.huolala.cn/stone/56549/img/logo.a637b4da.png" alt="" class="logo-img">-->
    <img src="@/assets/images/测试用例.png" alt="" class="logo-img">
    <h1 class="logo-title">TestFlow</h1>
  </div>
</template>

<script>
export default {
  name: 'BaseLogo',
  props: {
    collapsed: Boolean
  }
}
</script>

<style scoped>

.logo-container {
  display: flex;
  align-items: center;
  /*padding-left: 18px;*/
  height: 85px;
  line-height: 85px;
  overflow: hidden;
  white-space: nowrap
}

.logo-container .logo-img {
  color: #fff;
  height: 30px;
  width: 28px;
  margin-left: 15px;
  margin-right: 5px;
}

.logo-container .logo-title {
  color: #fff;
  margin-top: 20px;
  font-size: 28px;
  font-weight: 500;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
</style>
