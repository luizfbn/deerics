<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>
        <PageTitle :main="userInfo.name" :sub="userInfo.admin ? `@${userInfo.nickname} (Administrador)` : `@${userInfo.nickname}`"/>

        <h3>Letras do usuário</h3>
        <hr>
        <b-row align-h="center" class="m-2">
            <h4 v-if="userLyrics.length < 1">O usuário não possui letras</h4>
            <LyricCard v-else v-for="lyric in userLyrics" :key="lyric.id" :lyric="lyric" />
        </b-row>
        <b-row align-h="center">
            <b-button variant="outline-primary" v-if="loadMore" @click="loadLyrics">Carregar Mais Letras</b-button>
        </b-row>

        <!-- Editar dados do usuário -->
        <b-button v-b-toggle.collapse-1 variant="primary" class="mb-3 mt-3" v-if="user && user.id == userInfo.id">Editar perfil</b-button>
        <b-collapse id="collapse-1" v-if="user && user.id == userInfo.id">
            <b-form>
                <b-row>
                    <b-col md="6" sm="12">
                        <b-form-group label="Nome:" label-for="user-name">
                            <b-form-input id="user-name" type="text"
                                v-model="userUpdate.name" required
                                placeholder="Informe o nome do usuário" />
                        </b-form-group>
                    </b-col>
                    <b-col md="6" sm="12">
                        <b-form-group label="E-mail:" label-for="user-email">
                            <b-form-input id="user-email" type="text"
                                v-model="userUpdate.email" required
                                placeholder="Informe o e-mail do usuário" />
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col md="6" sm="12">
                        <b-form-group label="Senha*:" label-for="user-newpassword">
                            <b-form-input id="user-newpassword" type="password"
                                v-model="userUpdate.password" required
                                placeholder="Informe a nova senha do usuário" />
                        </b-form-group>
                    </b-col>
                    <b-col md="6" sm="12">
                        <b-form-group label="Confirmação da senha*:" 
                            label-for="user-confirm-newpassword">
                            <b-form-input id="user-confirm-newpassword" type="password"
                                v-model="userUpdate.confirmPassword" required
                                placeholder="Confirme a nova senha do usuário" />
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row class="mt-2">
                    <b-col xs="12">
                        <b-button variant="primary"
                            @click="updateUser">Salvar</b-button>
                    </b-col>
                </b-row> 
            </b-form>
        </b-collapse>
    </div>
</template>

<script>
    import LyricCard from '../cards/LyricCard'
    import PageTitle from '../template/PageTitle'

    import { baseApiUrl, showError } from '@/global'
    import { mapState } from 'vuex'
    import axios from 'axios'

    export default {
        name: 'User',
        components: { LyricCard, PageTitle },
        computed: mapState(['user']),
        data() {
            return{
                loading: false,
                userId: this.$route.params.id,
                userInfo: {},
                userUpdate: {},
                userLyrics: [],
                currentPage: 1,
                loadMore: true
            }
        },
        mounted() {
            this.loadUserInfo(),
            this.loadLyrics()
        },
        methods: {
            loadUserInfo() {
                this.loading = true
                axios.get(`${baseApiUrl}/users/${this.userId}`)
                .then(res => {
                    this.loading = false
                    this.userInfo = res.data
                })
                .catch(error => console.log(error))
            },
            loadLyrics() {
                axios.get(`${baseApiUrl}/lyrics/user/${this.userId}?page=${this.currentPage}`)
                .then(res => {
                    this.userLyrics = this.userLyrics.concat(res.data.lyricList)
                    this.currentPage++

                    if(res.data.lyricList.length === 0) this.loadMore = false
                })
                .catch(error => console.log(error))
            },
            updateUser() {
                axios.put(`${baseApiUrl}/users/${this.userId}`, this.userUpdate)
                .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.userUpdate = {}
                        this.loadUserInfo()
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style>

</style>