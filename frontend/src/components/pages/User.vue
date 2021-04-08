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
        <div v-if="user && user.id == userInfo.id">
            <b-button v-b-modal.modal-prevent-closing variant="primary" class="mb-3 mt-3">Editar perfil</b-button>

            <b-modal
            id="modal-prevent-closing"
            title="Editar perfil"
            hide-footer
            >
                <b-form @submit="updateUser()">
                    <b-form-group label="Nome:" label-for="user-name">
                            <b-form-input id="user-name" type="text"
                                v-model="userUpdate.name" required
                                placeholder="Informe o nome do usuário" />
                    </b-form-group>

                    <b-form-group label="E-mail:" label-for="user-email">
                            <b-form-input id="user-email" type="text"
                                v-model="userUpdate.email" required
                                placeholder="Informe o e-mail do usuário" />
                    </b-form-group>

                    <b-button v-b-toggle.collapse-2 variant="primary" class="mb-3">Mudar senha</b-button>
                    <b-collapse id="collapse-2">
                        <b-form-group label="Nova senha:" label-for="user-newpassword">
                            <b-form-input id="user-newpassword" type="password"
                                v-model="userUpdate.password"
                                placeholder="Informe a sua nova senha" />
                        </b-form-group>

                        <b-form-group label="Confirmação da senha:" 
                                label-for="user-confirm-newpassword">
                                <b-form-input id="user-confirm-newpassword" type="password"
                                    v-model="userUpdate.confirmPassword"
                                    placeholder="Confirme a sua nova senha" />
                        </b-form-group>
                    </b-collapse>
                
                    <b-row class="mt-2" align-h="end">
                            <b-button class="mr-2" variant="outline-danger" @click="$bvModal.hide('modal-prevent-closing'), loadUserInfo()">Cancelar</b-button>
                            <b-button type="submit" class="mr-3" variant="outline-success">Salvar</b-button>
                    </b-row>
                </b-form>
            </b-modal>
        </div>
 
    </div>
</template>

<script>
    import LyricCard from '../cards/LyricCard'
    import PageTitle from '../template/PageTitle'

    import { baseApiUrl, showError, userKey } from '@/global'
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
                    this.userUpdate = { name: res.data.name, email: res.data.email}
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
                        this.user.name = this.userUpdate.name
                        localStorage.setItem(userKey, JSON.stringify(this.user))

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