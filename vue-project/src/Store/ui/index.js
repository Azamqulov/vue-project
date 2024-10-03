export default {
    state: {
        chek: false
    },
    getters: {
        Is_chek: s => s.chek
    },
    mutations: {
        IS_Saidbar(state, user) {
            state.chek = user
        }
    },
    actions: {
        Is_Actions({ commit }) {
            let user = localStorage.getItem('saidbar-ui')
            if (user === null) return null
            user = JSON.parse(user)
            commit('IS_Saidbar', user)
            if (user) return true
            return false
        },
        Is_Menu({ commit }) {
            let user = localStorage.getItem('saidbar-ui')
            user = JSON.parse(user)
            if (user) {
                commit('IS_Saidbar', false)
                localStorage.setItem('saidbar-ui', JSON.stringify(false))
            } else {
                commit('IS_Saidbar', true)
                localStorage.setItem('saidbar-ui', JSON.stringify(true))
            }
        }
    },


    namespaced: true
}