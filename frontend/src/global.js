import Vue from 'vue'

export const deezerApiUrl = process.env.VUE_APP_DEEZER_URL || 'http://localhost:8080'  // URL do frontend que tem proxy no 'vue.config.js' para a API da Deezer
export const baseApiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3333'
export const userKey = process.env.VUE_APP_USER_KEY || '__qualquer_nome'

export function showError(e) {
    if(e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { deezerApiUrl, baseApiUrl, showError, userKey }
 