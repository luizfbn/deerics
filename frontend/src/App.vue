<template>
    <div id="app">
        <Header title="Deerics"/>

        <b-row align-h="center" 
                v-if="validatingToken" 
                class="content">
            <b-spinner variant="primary" label="Loading..." class="mt-4"></b-spinner>
        </b-row>

        <Content v-else />
        <Footer title="Deerics" />
    </div>
</template>

<script>
    import Header from './components/template/Header'
    import Content from './components/template/Content'
    import Footer from './components/template/Footer'

    import axios from 'axios'
    import { baseApiUrl, userKey } from "@/global"
    import { mapState } from "vuex"

    export default {
        name: 'App',
        components: { Header, Content, Footer },
        computed: mapState(['user']),
        data() {
            return {
                validatingToken: true
            }
        },
        created() {
            this.validateToken()
        },
        methods: {
            async validateToken() {
                this.validatingToken = true
                const json = localStorage.getItem(userKey)
                const userData = JSON.parse(json)
                this.$store.commit('setUser', null)

                if(!userData) {
                    this.validatingToken = false
                    return
                }

                const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

                if(res.data) {
                    this.$store.commit('setUser', userData)
                    
                } else {
                    localStorage.removeItem(userKey)
                    this.$router.push({ name: 'auth' })
                }

                this.validatingToken = false
            }
        }
    }
</script>

<style>

	* {
		font-family: Avenir, Helvetica, Arial, sans-serif;
	}
    html {
        background: ghostwhite;
    }
	body {
		margin: 0;
	}
    h3 {
        color: #ce93d8;
    }

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        background: ghostwhite;   

		height: 100vh;
		display: grid;
		grid-template-rows: 56.2px auto auto;
		grid-template-columns: 1fr;
		grid-template-areas: 
			"header header header"
			"content content content"
			"footer footer footer";
    }

</style>
