import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.userid) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res => {
          var roles = []
          if (res.data) {
            if (res.data.id === '2319F311BE294CB9A8FBF05F267ED77A') {
              roles = ['1']
            } else {
              roles = ['0']
            }
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              router.addRoutes(store.getters.addRouters)
              next({ ...to, replace: true })
            })
          } else {
            store.dispatch('FedLogOut').then(() => {
              Message.error('登录状态失效，请重新登录')
              next({ path: '/' })
            })
          }
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
