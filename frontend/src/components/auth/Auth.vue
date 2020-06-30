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

    export default {
        name: 'Auth',
        data() {
            return {
                showSignup: false,
                user: {}
            }
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

<style>
    .auth-content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .auth-box {
        background-color: #FFF;
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