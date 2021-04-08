<template>
    <div class="home">
        <PageTitle main="Bem-vindo ao Deerics!"
            sub="Acostumado a ver e não gostar da tradução de uma letra? Aqui você pode interpretar as letras das suas músicas favoritas!" />
        <div class="home-content">

            <!-- Top tracks -->
            <h3 class="m-2 mt-4 h3-title">Top tracks</h3>
            <hr>
            <b-row align-h="center" class="m-2 mb-4">
                <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
                <TrackCard v-else v-for="track in topTrackList" :key="track.id" :track="track" />
            </b-row>
            <div class="text-center">
                <b-button v-if="!loading" variant="outline-primary" @click="loadTracks(loadMore.load)">{{ loadMore.msg }}</b-button>
            </div>

            <!-- Top artistas -->
            <b-row align-h="between" class="m-2">
                <h3 class="ml-0 h3-title">Top artistas</h3>
                <router-link class="see-more" to="/topartists">Ver mais artistas <i class="fa fa-long-arrow-right"></i></router-link>
            </b-row>
            <hr>
            <b-row align-h="center" class="m-2 mb-4">
                <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
                <ArtistCard v-else v-for="artist in charts.artists.data.slice(0, 3)" :key="artist.id" :artist="artist" />
            </b-row>
            
            <!-- Letras recentes -->
            <h3 class="m-2 h3-title">Letras recentes</h3>
            <hr>
            <b-row align-h="center" class="m-2">
                <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
                <LyricCard v-else v-for="lyric in lyricList" :key="lyric.id" :lyric="lyric" />
            </b-row>
        </div>
    </div>
</template>

<script>
    import PageTitle from '../../template/PageTitle'
    import TrackCard from '../../cards/TrackCard'
    import ArtistCard from '../../cards/ArtistCard'
    import LyricCard from '../../cards/LyricCard'

    import { deezerApiUrl, baseApiUrl } from '@/global'
    import axios from 'axios'

    export default {
        name: 'Home',
        components: { PageTitle, TrackCard, ArtistCard, LyricCard },
        data() {
                return {
                    charts: {},
                    lyricList: [],
                    topTrackList: [],
                    loadMore: {load: true, msg: 'Ver mais tracks'},
                    loading: false
                }
            },
        created() {
            this.loadCharts(),
            this.loadLyrics()
        },
        methods: {
            loadCharts() {
                this.loading = true
                axios.get(`${deezerApiUrl}/chart`)
                    .then(res => {
                        this.loading = false
                        this.charts = res.data
                        this.topTrackList = res.data.tracks.data.slice(0, 3)
                    })
                    .catch(error => console.log(error))
            },
            loadLyrics() {
                axios.get(`${baseApiUrl}/lyrics`)
                    .then(res => {
                        this.lyricList = res.data.lyricList
                    })
                    .catch(error => console.log(error))
            },
            loadTracks(load) {
                if (load) {
                    this.loadMore.load = false
                    this.loadMore.msg = 'Ver menos'
                    this.topTrackList = this.charts.tracks.data
                } else {
                    this.loadMore.load = true
                    this.loadMore.msg = 'Ver mais tracks'
                    this.topTrackList = this.charts.tracks.data.slice(0, 3)
                }
                
            }
        }
        
    }
</script>

<style>
    .see-more {
        color: #777;
        align-self: flex-end;
        padding: 0px 5px;
        font-weight: bold;
    }
    .see-more:hover {
        color: #343a40;
        background-color: rgba(0, 0, 0, 0.05);
		border-radius: 5px;
        text-decoration: none;
    }
</style>