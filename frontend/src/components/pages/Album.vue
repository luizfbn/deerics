<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>

        <!-- Título -->
        <div class="album-header">
            <img :src="albumInfo.cover" alt="Imagem do album">
            <div>
                <h1>{{ albumInfo.title }}</h1>
                <h2 class="text-muted"><router-link :to="{ name: 'artist', params: { id: albumInfo.artist.id } }">{{ albumInfo.artist.name }}</router-link></h2>
            </div>
        </div>
        <hr>

        <!-- Tracks do álbum -->
        <b-row align-h="center" class="m-2">
            <TrackCard v-for="track in albumTracks" :key="track.id" :track="track" />
        </b-row>     
    </div>
</template>

<script>
    import TrackCard from '../cards/TrackCard'

    import { deezerApiUrl } from '@/global'
    import axios from 'axios'

    export default {
        name: 'Album',
        components: { TrackCard },
        data() {
            return{
                loading: false,
                albumId: this.$route.params.id,
                albumInfo: '',
                albumTracks: []
            }
        },
        created() {
            this.loadAlbumInfo()
        },
        methods: {
            loadAlbumInfo() {
                this.loading = true
                axios.get(`${deezerApiUrl}/album/${this.albumId}`)
                .then(res => {
                    this.loading = false
                    this.albumInfo = res.data
                    this.albumTracks = this.albumInfo.tracks.data
                })
                .catch(error => console.log(error))
            }
        }
    }
</script>

<style>

    .album-header {
        display: flex;
        align-items: center;
        color: #ce93d8;
    }
    .album-header > div {
        display: flex;
        flex-direction: column;
    }
    .album-header > img {
        border-radius: 10px;
        margin-right: 10px;
    }

    h1 {
        margin: 0px;
    }
    h2 > a {
        font-size: 1.3rem;
    }
    h2 > a:hover {
        text-decoration: none;
    }
    
</style>