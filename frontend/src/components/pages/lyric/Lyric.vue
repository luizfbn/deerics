<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>
        <PageTitle :main="trackInfo.title" :sub="artistInfo.name"></PageTitle>
        <router-link :to="{ name: 'track', params: { id: trackId } }"><i class="fa fa-arrow-circle-left"></i> Voltar</router-link>

        <!-- Título, datas e avaliações -->
        <h3 class="text-center mb-1 h3-title">{{ lyricInfo.title }} <i v-if="lyricInfo.verified" class="fa fa-check-circle" style="color:#007bff"></i></h3>
        <b-row class="text-muted" align-h="center">
            Por: <router-link :to="{ name: 'user', params: { id: lyricInfo.user_id } }">{{ lyricInfo.name }}</router-link>
        </b-row>
        <b-row class="text-muted" align-h="center" align-v="center">
            <b-button :disabled="!user" @click="rateLyric(1)" :variant="likeButtonColor" class="m-1"><i class="fa fa-thumbs-up"></i></b-button>{{ lyricInfo.likes }}
            <b-button :disabled="!user" @click="rateLyric(0)" :variant="dislikeButtonColor" class="m-1"><i class="fa fa-thumbs-down"></i></b-button>{{ lyricInfo.dislikes }}
        </b-row>
        <!-- Botão para administador verificar letra -->
        <b-row v-if="user && user.admin" class="text-muted mr-3" align-h="end">
            <b-button @click="verifyLyric(!lyricInfo.verified)" :variant="lyricInfo.verified? 'outline-danger' : 'info'" class="mt-1 mb-1">
                <span v-if="lyricInfo.verified">Remover verificado</span>
                <span v-else>Verificar letra</span>
            </b-button>
        </b-row>
        <b-row class="text-muted mr-3" align-h="end">
            Criado em: {{ lyricInfo.created_at | convertDate }}
        </b-row>
        <b-row class="text-muted mr-3" align-h="end" v-if="lyricInfo.modified_at">
            Editado em: {{ lyricInfo.modified_at | convertDate }}
        </b-row>

        <!-- Conteúdo e tradução -->
        <b-row>
            <b-col class="lyric-content text-primary m-3" v-html="lyricInfo.content"></b-col>
            <b-col class="lyric-content m-3 lyric-translate text-muted" v-html="lyricInfo.translation ? lyricInfo.translation : 'Tradução não disponível'"></b-col>
        </b-row>
        
        <!-- Editar -->
        <b-button v-b-toggle.collapse-1 variant="primary" class="mb-3 mt-3" v-if="user && (user.id == lyricInfo.user_id || user.admin)">Editar</b-button>
        <b-collapse id="collapse-1" v-if="user && (user.id == lyricInfo.user_id || user.admin)">
            <b-form @submit="saveLyric">
                <div v-if="!removeMode">
                    <b-form-group label="Título da letra:" label-for="lyric-title">
                                <b-form-input id="lyric-title" type="text"
                                    v-model="lyricInfo.title" required
                                    placeholder="Informe o título da letra" />
                    </b-form-group>  

                    <b-form-group label="Conteúdo:" label-for="lyric-content">
                        <VueEditor v-model="lyricInfo.content"
                                placeholder="Informe o conteúdo da letra" />
                    </b-form-group>

                    <b-button v-b-toggle.collapse-2 variant="primary" class="mb-3">Tradução (opcional)</b-button>
                    <b-collapse id="collapse-2">
                        <b-form-group  label="Tradução:" label-for="lyric-translate">
                            <VueEditor v-model="lyricInfo.translation" 
                                    placeholder="Informe a tradução da letra (opcional)" />
                        </b-form-group>
                    </b-collapse> 

                    <b-row class="mt-2" align-h="end">
                            <b-button variant="danger" class="mr-2" @click="removeMode = true">Excluir letra</b-button>
                            <b-button v-b-toggle.collapse-1 variant="outline-danger" class="mr-2" @click="loadLyric()">Cancelar</b-button>
                            <b-button type="submit" variant="outline-success" class="mr-3">Salvar</b-button>
                    </b-row> 
                </div>

                <div v-else>
                    <b-row align-h="center">
                        <h4>Tem certeza que quer excluir a letra?</h4>
                    </b-row>
                    <b-row class="mt-2" align-h="center">
                        <b-button variant="danger" class="mr-2"
                            @click="removeLyric">Excluir letra</b-button>
                        <b-button v-b-toggle.collapse-1 v-if="removeMode" variant="secondary" @click="removeMode = false, loadLyric()">Cancelar</b-button>
                    </b-row>
                </div>  

            </b-form>
        </b-collapse>

        <!-- Comentários -->
        <Comment :lyricId="lyricId" />   

    </div>
</template>

<script>
    import PageTitle from '../../template/PageTitle'
    import Comment from './Comment'

    import moment from 'moment'
    import { deezerApiUrl, baseApiUrl, showError } from '@/global'
    import { mapState } from 'vuex'
    import { VueEditor } from 'vue2-editor'
    import axios from 'axios'

    export default {
        name: 'Lyric',
        components: { PageTitle, VueEditor, Comment },
        computed: mapState(['user']),
        data () {
            return {
                removeMode: false,
                loading: false,
                trackId: this.$route.params.trackId,
                lyricId: this.$route.params.lyricId,
                trackInfo: {},
                artistInfo: {},
                lyricInfo: {},
                likeButtonColor: 'secondary',
                dislikeButtonColor: 'secondary'
            }
        },
        created(){
            this.loadTrackInfo(),
            this.loadLyric(),
            this.userRate()
        },
        filters: {
            convertDate(date) {
                return moment(date).format("DD-MM-YYYY HH:mm:ss")
            }
        },
        methods: {
            loadTrackInfo() {
                this.loading = true
                axios.get(`${deezerApiUrl}/track/${this.trackId}`)
                .then(res => {
                    this.loading = false
                    this.trackInfo = res.data
                    this.artistInfo = res.data.artist
                })
                .catch(error => console.log(error))
            },
            loadLyric() {
                this.loading = true
                axios.get(`${baseApiUrl}/lyrics/${this.lyricId}`)
                .then(res => {
                    this.loading = false
                    this.lyricInfo = res.data
                })
                .catch(error => console.log(error))
            },
            saveLyric() {
                axios.put(`${baseApiUrl}/lyrics/${this.lyricId}`, this.lyricInfo)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.loadLyric()
                    })
                    .catch(showError)
            },
            removeLyric() {
                axios.delete(`${baseApiUrl}/lyrics/${this.lyricId}`)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                    })
                    .then(() => this.$router.push({ name: 'track',  params: { id: this.trackId } }) )
                    .catch(showError)
            },
            rateLyric(rate) {
                axios.post(`${baseApiUrl}/rating/${this.lyricId}`, { rating: rate })
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.userRate()
                        this.loadLyric()
                    })
                    .catch(showError)
            },
            userRate() {
                if(this.user){
                    axios.get(`${baseApiUrl}/rating/${this.lyricId}`)
                    .then(res =>{
                        if(res.data) {
                            if(res.data.rating == 1) {
                                this.likeButtonColor = 'success'
                                this.dislikeButtonColor = 'secondary'
                            } else {
                                this.likeButtonColor = 'secondary'
                                this.dislikeButtonColor = 'danger'
                            }
                        } else {
                            this.likeButtonColor = 'secondary'
                            this.dislikeButtonColor = 'secondary'
                        }
                    })
                    .catch(error => console.log(error))
                }
            },
            verifyLyric(verify) {
                axios.put(`${baseApiUrl}/verify/${this.lyricId}`, { verified: verify })
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.loadLyric()
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/styles/custom.scss";

    .lyric-content {
        padding: 25px;
        background-color: $background;
        border-radius: 5px;
        box-shadow: 0px 0px 2px $primary;
    }
    .lyric-content > img {
        max-width: 100%;
    }
    .lyric-content > iframe {
        max-width: 100%;
    }
    .lyric-content :last-child {
        margin-bottom: 0px;
    }
    .lyric-translate {
        box-shadow: 0px 0px 2px grey;
    }
</style>