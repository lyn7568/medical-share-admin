import { pageQueryDepart } from '@/api/api'
import request from '@/utils/request'

const depart = {
  state: {
    departArrs: []
  },
  mutations: {
    departDicts: (state, value) => {
      state.departArrs = value
    }
  },
  actions: {
    getDictDepart({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.get(pageQueryDepart, {
          active: 1,
          pageSize: 50,
          pageNo: 1
        }, function(response) {
          if (response.success) {
            if (response.data) {
              const dataS = response.data.data
              commit('departDicts', dataS)
            }
          }
          resolve(response)
        }, function(error) {
          reject(error)
        })
      })
    }
  }
}

export default depart
