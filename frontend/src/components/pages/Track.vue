<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>
        <PageTitle :main="trackInfo.title" :sub="artistInfo.name"></PageTitle>

        <b-row class="m-2" align-h="between">

            <!-- Informações sobre a track -->
            <b-col md="7" sm="12" class="lyric-info">
                <h3 class="text-center h3-title" >{{ trackInfo.title }}</h3>
                <img :src="albumInfo.cover" alt="Imagem da música">
                <b-list-group>
                    <b-list-group-item>Artista: <router-link v-if="artistInfo.id" :to="{ name: 'artist', params: { id: artistInfo.id } }">{{ artistInfo.name }}</router-link></b-list-group-item>
                    <b-list-group-item>Duração: {{ trackInfo.duration ? trackInfo.duration : 'Não disponível' }} segundos</b-list-group-item>
                    <b-list-group-item>Álbum: <router-link v-if="albumInfo.id" :to="{ name: 'album', params:  { id: albumInfo.id }  }"> {{ albumInfo.title ? albumInfo.title : 'Não disponível' }}</router-link></b-list-group-item>
                    <b-list-group-item>Lançamento: {{ trackInfo.release_date ? trackInfo.release_date : 'Não disponível' }}</b-list-group-item>
                    <b-list-group-item class="text-center">
                        <a v-if="trackInfo.link" :href="trackInfo.link"><img src="../../assets/pt_BR-light.png" alt="deezerLogo" style="width:150px"> 
                        </a>
                        <span v-else>Link deezer não disponível</span>
                    </b-list-group-item>
                </b-list-group>
                
            </b-col>

            <!-- Lista de letras da track -->
            <b-col md="4" sm="12" class="lyric-list" >
                <b-row class="m-0" align-h="end">
                    <LyricCard style="width:100%" v-for="lyric in trackLyrics" :key="lyric.id" :lyric="lyric" />
                </b-row>
                <div class="text-right m-1">
                    <b-button variant="outline-primary" v-if="loadMore" @click="loadLyrics">Carregar Mais Letras</b-button>
                </div>
            </b-col>
            <div class="w-100"></div>

            <!-- Criar uma nova letra -->
            <div v-if="user">
                <b-button v-b-modal.modal-prevent-closing variant="primary" class="mb-3 mt-3">Criar letra</b-button>

                <b-modal
                id="modal-prevent-closing"
                title="Criar letra para a música"
                hide-footer
                >
                    <b-form @submit="createLyric()">
                        <b-form-group label="Título da letra:" label-for="lyric-title">
                                    <b-form-input id="lyric-title" type="text" 
                                        v-model="lyricInfo.title"
                                        placeholder="Informe o título da letra" />
                        </b-form-group>

                        <b-form-group  label="Conteúdo:" label-for="lyric-content">
                            <VueEditor v-model="lyricInfo.content" 
                                    placeholder="Informe o Conteúdo da letra" />
                        </b-form-group>

                        <b-button v-b-toggle.collapse-2 variant="primary" class="mb-3">Faça sua tradução (opcional)</b-button>
                        <b-collapse id="collapse-2">
                            <b-form-group  label="Tradução:" label-for="lyric-translate">
                                <VueEditor v-model="lyricInfo.translation"
                                        placeholder="Informe a tradução da letra (opcional)" />
                            </b-form-group>
                        </b-collapse>
                    
                        <b-row class="mt-2" align-h="end">
                                <b-button class="mr-2" variant="outline-danger" @click="$bvModal.hide('modal-prevent-closing')">Cancelar</b-button>
                                <b-button type="submit"  class="mr-3" variant="outline-success">Salvar</b-button>
                        </b-row>
                    </b-form>
                </b-modal>

            </div>  
        </b-row>
        
    </div>
</template>

<script>
    import PageTitle from '../template/PageTitle'
    import LyricCard from '../cards/LyricCard'

    import { deezerApiUrl, baseApiUrl, showError } from '@/global'
    import { mapState } from 'vuex'
    import { VueEditor } from 'vue2-editor'
    import axios from 'axios'

    export default {
        name: 'Track',
        components: { PageTitle, LyricCard, VueEditor },
        computed: mapState(['user']),
        data () {
            return {
                loading: false,
                trackId: this.$route.params.id,
                trackInfo: {},
                artistInfo: {},
                albumInfo: {},
                trackLyrics: [],
                lyricInfo: {
                    track_id: this.$route.params.id
                },
                currentPage: 1,
                loadMore: true
            }
        },
        mounted(){
            this.loadTrackInfo(),
            this.loadLyrics()
        },
        methods: {
            loadTrackInfo() {
                this.loading = true
                axios.get(`${deezerApiUrl}/track/${this.trackId}`)
                .then(res => {
                    this.loading = false
                    this.trackInfo = res.data
                    this.artistInfo = res.data.artist
                    this.albumInfo = res.data.album
                })
                .catch(error => console.log(error))
            },
            loadLyrics() {
                axios.get(`${baseApiUrl}/track/${this.trackId}?page=${this.currentPage}`)
                .then(res => {
                    this.trackLyrics = this.trackLyrics.concat(res.data.lyricList)
                    this.currentPage++

                    if(res.data.lyricList.length === 0) this.loadMore = false
                    if(this.loading) this.trackLyrics = res.data.lyricList
                    this.loading = false
                })
                .catch(error => console.log(error))
            },
            createLyric() {
                axios.post(`${baseApiUrl}/lyrics`, this.lyricInfo)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.loading = true
                        this.loadMore = true
                        this.currentPage = 1
                        this.lyricInfo = { track_id: this.$route.params.id }
                        this.loadLyrics()
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/styles/custom.scss";

    .lyric-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: $background;
        border-radius: 5px;
        box-shadow: 0px 0px 2px grey;
        padding: 20px;
        margin-bottom: 10px;
    }
    .lyric-info > img {
        align-self: center;
        margin: 15px;
        border-radius: 25px;
    }
    .lyric-list {
        height: 510px;
        overflow-y: auto;
        padding: 3px;
    }
</style>