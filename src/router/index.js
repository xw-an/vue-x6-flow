import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'BaseLayout',
      redirect: '/createFlow',
      component: () => import('@/layouts/BaseLayout'),
      children: [
        {
          path: '/createFlow',
          name: '创建流程',
          component: () => import('@/views/flows/CreateFlow'),
          meta: {requireAuth: true}
        },
        {
          path: '/manageFlow',
          name: '流程管理',
          component: () => import('@/views/flows/ManageFlow'),
          meta: {requireAuth: true}
        }
      ]
    }
  ]
})
