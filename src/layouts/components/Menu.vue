<template>
  <a-menu theme="dark" mode="inline"
          :inline-collapsed="collapsed"
          :default-selected-keys="[11]"
          :default-open-keys="[1]"
          :open-keys="[curOpenkey]"
          :selected-keys="[curSelectKey]"
  >
    <template v-for="item of menuList">
      <!-- 存在children子菜单 -->
      <a-sub-menu v-if="item.childrenList" :key="item.id">
          <span slot="title">
            <a-icon :type="item.icon"/>
            <span>{{item.name}}</span>
          </span>
        <!-- 子菜单 -->
        <a-menu-item :key="child.id" v-for="child of item.childrenList"
                     @click="handleMenuItem(child.path)"
                     @select="handleMenuItem(child.path)"
        >
          <a-icon :type="child.icon"/>
          <span>{{child.name}}</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item :key="item.id" v-else
                   @click="handleMenuItem(item.path)"
                   @select="handleMenuItem(item.path)"
      >
        <a-icon :type="item.icon"/>
        <span>{{item.name}}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
export default {
  name: 'BaseMenu',
  props: {
    collapsed: Boolean
  },
  data () {
    return {
      menuList:
      [
        {
          id: 1,
          icon: 'profile',
          name: '流程管理',
          path: '/manageFlow'
        },
        {
          id: 2,
          icon: 'profile',
          name: '流程编排',
          path: '/createFlow'
        }
      ]
    }
  },
  methods: {
    handleMenuItem (path) {
      this.$router.push({path: path})
    }
  },
  computed: {
    // 计算当前路由url对应的selectKey
    curSelectKey () {
      let path = this.$route.path.toString()
      let id = 1
      if (path.includes('planRunDetail') || path.includes('planDetail')) {
        return 32
      } else if (path.includes('/expertiseDetail')) {
        return 3
      }
      this.menuList.forEach(obj => {
        if (obj.path) {
          if (obj.path.includes(path)) {
            id = obj.id
            return id
          }
        } else {
          obj.childrenList.forEach(child => {
            if (path.includes('planAdd')) {
              path = '/planAdd'
            }
            if (child.path.includes(path)) {
              id = child.id
              return id
            }
          })
        }
      })
      return id
    },
    curOpenkey () {
      let path = this.$route.path.toString()
      let id = 1
      if (path.includes('planRunDetail') || path.includes('planDetail')) {
        return 3
      } else if (path.includes('/expertiseDetail')) {
        return 3
      }
      this.menuList.forEach(obj => {
        if (obj.path) {
          if (obj.path.includes(path)) {
            id = obj.id
            return id
          }
        } else {
          obj.childrenList.forEach(child => {
            if (child.path.includes(path)) {
              id = obj.id
              return id
            }
          })
        }
      })
      return id
    }
  }
}
</script>

<style scoped>
</style>
