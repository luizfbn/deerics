<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>

        <!-- Nome e foto do artista -->
        <div class="artist-header">
            <img :src="artistInfo.picture" alt="Imagem do artista">
            <h1 class="text-primary">{{ artistInfo.name }}</h1>
        </div>
        <hr>

        <h3>Top tracks</h3>
        <hr>
        <b-row align-h="center" class="m-2">
            <TrackCard v-for="track in topTracks" :key="track.id" :track="track" />
        </b-row>
        
        <h3>Álbums</h3>
        <hr>
        <b-row align-h="center" class="m-2">
            <p v-if="albumList.length < 1"> Conteúdo não encontrado </p>
            <AlbumCard v-else v-for="album in albumList" :key="album.id" :album="album" />
        </b-row>
        
    </div>
</template>

<script>
    import AlbumCard from '../cards/AlbumCard'
    import TrackCard from '../cards/TrackCard'

    import { deezerApiUrl } from '@/global'
    import axios from 'axios'

    export default {
        name: 'Artist',
        components: { AlbumCard, TrackCard },
        data() {
            return {
                loading: false,
                artistId: this.$route.params.id,
                artistInfo: '',
                albumList: [],
                topTracks: []
            }
        },
        mounted(){
            this.loadArtistInfo(),
            this.loadArtistAlbums(),
            this.loadArtistTopTracks()
        },
        methods: {
            loadArtistInfo() {
                this.loading = true
                axios.get(`${deezerApiUrl}/artist/${this.artistId}`)
                .then(res => {
                    this.artistInfo = res.data
                })
                .catch(error => console.log(error))
            },
            loadArtistAlbums() {
                this.loading = true
                axios.get(`${deezerApiUrl}/artist/${this.artistId}/albums`)
                .then(res => {
                    this.loading = false
                    this.albumList = res.data.data
                })
                .catch(error => console.log(error))
            },
            loadArtistTopTracks() {
                this.loading = true
                axios.get(`${deezerApiUrl}/artist/${this.artistId}/top`)
                .then(res => {
                    this.loading = false
                    this.topTracks = res.data.data
                })
            }
        }

    }
</script>

<style>

    .artist-header {
        display: flex;
        align-items: center;
    }

    .artist-header > img {
        border-radius: 100%;
        margin-right: 10px;
    }

    h3 {
        margin: 5px;
        margin-top: 10px;
    }

</style>