<template>
    <div class="top-artists">
        <PageTitle main="Top Artists" sub="Top 10 da semana" />

        <!-- Botão de voltar (na pesquisa de artista) -->
        <b-button variant="link" v-if="search" @click="loadTopArtists"><i class="fa fa-arrow-circle-left"></i> Voltar</b-button>

        <!-- Caixa de busca e botão -->
        <b-row class="m-2">
            <b-col sm="11" class="pr-1 pl-0">
                <b-form-input class="type-search mr-0" type="search" placeholder="Search artist" v-model="data"></b-form-input>
            </b-col>
            <b-col sm="1" class="ml-0 p-0">
                <b-button variant="primary" v-on:click="searchArtists(data)"><i class="fa fa-search fa-lg"></i></b-button>
            </b-col>
        </b-row>

        <!-- Artistas -->
        <b-row align-h="center" class="m-3">
            <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
            <ArtistCard v-else v-for="artist in topArtistList" :key="artist.id" :artist="artist" />
        </b-row>
    </div>
</template>

<script>
    import ArtistCard from '../cards/ArtistCard'
    import PageTitle from '../template/PageTitle'

    import { deezerApiUrl } from '@/global'
    import axios from 'axios'

    export default {
        name:  'TopArtists',
        components: { ArtistCard, PageTitle },
        data() {
            return {
                loading: false,
                data: '',
                search: '',
                topArtistList: []
            }
        },
        mounted () {
            this.loadTopArtists()
        },
        methods: {
            loadTopArtists() {
                this.loading = true
                axios.get(`${deezerApiUrl}/chart`)
                    .then(res => {
                        this.loading = false
                        this.topArtistList = res.data.artists.data
                        this.search = false
                    })
                    .catch(error => console.log(error))
            },
            searchArtists(artist_name) {
                this.loading = true
                axios.get(`${deezerApiUrl}/search/artist?q=${artist_name.split(' ').join('%20')}`)
                    .then(res => {
                        this.loading = false
                        this.topArtistList = res.data.data
                        this.search = true
                    })
                    .catch(error => console.log(error))
            }
        }
    }
</script>

<style>

</style>