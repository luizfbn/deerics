<template>
    <div class="header">
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <!-- Título -->
            <b-navbar-brand class="ml-3" to="/">{{ title }}</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <!-- Pesquisa -->
                    <b-nav-form @submit.prevent>
                        <b-form-input type="search" v-model="track_name" size="sm" class="mr-sm-1" placeholder="Search tracks"></b-form-input>
                    
                        <b-button size="sm" class="my-2 my-sm-0 mr-2" type="submit"
                                    v-if="track_name != ''" 
                                    :to="{ name: 'search', params: { track: track_name } }">
                                        <i class="fa fa-search fa-lg"></i>
                        </b-button>
                        <b-button v-else size="sm" type="submit" class="my-2 my-sm-0 mr-2"><i class="fa fa-search fa-lg"></i></b-button>
                    </b-nav-form>

                    <b-nav-item v-if="!user" to="/auth">Fazer login</b-nav-item>  

                    <!-- Botão dropdown -->
                    <b-nav-item-dropdown v-else right>
                        <template v-slot:button-content>
                            <em>{{ user.name }}</em>
                        </template>
                        <b-dropdown-item :to="{ name: 'user', params: { id: user.id } }">Meu Perfil</b-dropdown-item>
                        <b-dropdown-item v-if="user.admin" to="/admin">Administração</b-dropdown-item>
                        <b-dropdown-item @click.prevent="logout"><i class="fa fa-sign-out"></i> Sair</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div> 
</template>

<script>
    import { mapState } from 'vuex'
    import { userKey } from '@/global'
    
    export default {
        name: 'Header',
        computed: mapState(['user']),
        props: {
            title: String
        },
        data() {
            return {
                track_name: ''
            }
        },
        methods: {
            logout() {
                localStorage.removeItem(userKey)
                this.$store.commit('setUser', null)
                this.$router.push({ name: 'auth' })
            }
        }
    }
</script>

<style>
    .header {
        grid-area: header;   
    }
</style>