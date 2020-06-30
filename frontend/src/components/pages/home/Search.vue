<template>
    <div>
        <PageTitle main="Resultados da pesquisa" :sub="this.$route.params.track"/>
        <b-row align-h="center">
            <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
            <TrackCard v-else v-for="track in trackList" :key="track.id" :track="track" />    
        </b-row>
    </div>
</template>

<script>
    import PageTitle from '../../template/PageTitle'
    import TrackCard from '../../cards/TrackCard'

    import { deezerApiUrl } from '@/global'
    import axios from 'axios'

    export default {
        name: 'Search',
        components: { PageTitle, TrackCard },
        data() {
            return {
                loading: false,
                trackList: []
            }
        },
        mounted() {
            this.doSearch()
        },
        watch: {
            '$route': 'doSearch'
        },
        methods: {
            doSearch() {
                this.loading = true
                axios.get(`${deezerApiUrl}/search/track?q=${this.$route.params.track}`)
                .then(res => {
                    this.loading = false
                    this.trackList = res.data.data
                })
                .catch(error => console.log(error))
            }
        }
    }
</script>

<style>

</style>