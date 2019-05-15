import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard'),
      name: 'dashboard',
      meta: { title: '首页' }
    }]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [{
      path: 'resetPwd',
      name: 'resetPwd',
      meta: { title: '重置密码' },
      component: () => import('@/views/resetPwd/index')
    }]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'doctorManage',
        name: 'doctorManage',
        meta: {
          title: '医生管理'
        },
        component: () => import('@/views/doctorManage/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'departManage',
        name: 'departManage',
        meta: {
          title: '科室管理'
        },
        component: () => import('@/views/departManage/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'applyManage',
        name: 'applyManage',
        meta: {
          title: '器械管理'
        },
        component: () => import('@/views/applyManage/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'infoManage',
        name: 'infoManage',
        meta: {
          title: '医院信息管理'
        },
        component: () => import('@/views/infoManage/index')
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表

export const asyncRouterMap = [
]
