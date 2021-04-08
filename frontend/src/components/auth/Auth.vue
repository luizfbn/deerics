<template>
    <div class="auth-content">
        <div class="auth-box">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>

            <b-form-input class="mb-1" v-if="showSignup" v-model="user.name" type="text" placeholder="Nome"></b-form-input>
            <b-form-input class="mb-1" v-if="showSignup" v-model="user.nickname" type="text" placeholder="Apelido (Nickname)"></b-form-input>
            <b-form-input class="mb-1" v-model="user.email" name="email" type="email" placeholder="E-mail"></b-form-input>
            <b-form-input class="mb-1" v-model="user.password" name="password" type="password" placeholder="Senha"></b-form-input>
            <b-form-input class="mb-1" v-if="showSignup" v-model="user.confirmPassword"
                type="password" placeholder="Confirme a Senha"></b-form-input>

            <b-button class="mt-2" variant="primary" v-if="showSignup" @click="signup">Registrar-se</b-button>
            <b-button class="mt-2" variant="primary" v-else @click="signin">Entrar</b-button>

            <b-button class="mt-4" variant="info" @click.prevent="loginWithFacebook" >
                <i class="fa fa-facebook pr-2"></i> Entrar com o Facebook
            </b-button>
            <!--
            <div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div>
            -->
            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Já tem cadastro? Faça o Login!</span>
                <span v-else>Não tem cadastro? Registre-se aqui!</span>
            </a>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { baseApiUrl, showError, userKey } from '@/global'
    import { initFbsdk } from '@/config/fb.js'

    export default {
        name: 'Auth',
        data() {
            return {
                showSignup: false,
                user: {}
            }
        },
        mounted() {
            initFbsdk() 
        },
        methods: {
            signin() {
                axios.post(`${baseApiUrl}/signin`, this.user)
                    .then(res => {
                        this.$store.commit('setUser', res.data)
                        localStorage.setItem(userKey, JSON.stringify(res.data))
                        this.$router.push({ path: '/' })
                    })
                    .catch(showError)
            },
            loginWithFacebook () {
                try{
                    window.FB.login(response => {
                        axios.post(`${baseApiUrl}/facebook`, { accessToken: response.authResponse.accessToken})
                            .then(res => {
                                this.$store.commit('setUser', res.data)
                                localStorage.setItem(userKey, JSON.stringify(res.data))
                                this.$router.push({ path: '/' })
                            })
                            .catch(showError)
                    }, {
                        scope: 'email', 
                        return_scopes: true
                    })
                } catch(msg){
                    showError(msg)
                }
                
            },
            signup() {
                axios.post(`${baseApiUrl}/signup`, this.user)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.user = {}
                        this.showSignup = false
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/styles/custom.scss";
    
    .auth-content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .auth-box {
        background-color: $background;
        width: 350px;
        padding: 35px;
        border-radius: 5px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .auth-title {
        font-size: 1.2rem;
        font-weight: 100;
        margin-top: 10px;
        margin-bottom: 15px;
    }
    .auth-box a {
        margin-top: 35px;
    }
    .auth-box hr {
        border: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right,
            rgba(120, 120, 120, 0),
            rgba(120, 120, 120, 0.75),
            rgba(120, 120, 120, 0));
    }
</style>