<template>
    <b-row align-h="center" v-if="loading">
        <b-spinner v-if="loading" variant="primary" label="Loading..."></b-spinner>
    </b-row>
    <div v-else>
        <b-row>
            <b-col>
                <b-row align-h="between" align-v="center" class="m-1">
                    <h3 class="mb-2 mt-3">Comentários</h3>
                    <h4 class="m-0 text-muted">Total: {{ commentCount }}</h4>
                </b-row>
                
                <b-card v-for="comment in commentList" :key="comment.id"
                :footer="comment.created_at | convertDate"
                footer-tag="footer"
                footer-text-variant="muted text-right"
                body-class="p-0"
                class="mb-2">
                    <b-card-header>
                        <b-row align-h="between" align-v="center">
                            <b-col md="11" sm="12 mb-1">
                                <router-link class="font-weight-bold" :to="{ name: 'user', params: { id: comment.user_id } }">{{ comment.name }}</router-link>
                                <span class="text-muted ml-1">@{{ comment.nickname }}</span>
                            </b-col>
                            <b-col md="1" sm="12" class="text-center">
                                <b-button v-if="user && (user.id == comment.user_id || user.admin)" @click="removeComment(comment.id)" variant="danger"><i class="fa fa-trash"></i></b-button>
                            </b-col>
                            
                        </b-row>
                    </b-card-header>
                    <b-card-body>
                        {{ comment.comment }}
                    </b-card-body>
                </b-card>   
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-button variant="outline-primary" v-if="loadMore" @click="loadComments">Carregar Mais Comentários</b-button>
        </b-row>

        <b-form class="mt-3" v-if="user">
            <b-form-textarea
                v-model="commentInfo.comment"
                placeholder="Faça um comentário :)"
                rows="3"
                no-resize
                ></b-form-textarea>
            <b-row class="mt-2">
                <b-col xs="12">
                    <b-button variant="primary" @click="saveComment">Comentar</b-button>
                </b-col>
            </b-row>    
        </b-form>
    </div>

</template>

<script>
    import moment from 'moment'
    import { baseApiUrl, showError } from '@/global'
    import { mapState } from 'vuex'
    import axios from 'axios'

    export default {
        name: 'Comment',
        props: ['lyricId'],
        computed: mapState(['user']),
        data () {
            return {
                loading: false,
                commentCount: '',
                commentList: [],
                commentInfo: {
                    comment: ''
                },
                currentPage: 1,
                loadMore: true
            }
        },
        created(){
            this.loadComments()
        },
        filters: {
            convertDate(date) {
                return moment(date).format("DD-MM-YYYY HH:mm:ss")
            }
        },
        methods: {
            loadComments() {
                axios.get(`${baseApiUrl}/comments/${this.lyricId}?page=${this.currentPage}`)
                .then(res => {
                    this.commentCount = res.data.count
                    this.commentList = this.commentList.concat(res.data.commentList)
                    this.currentPage++

                    if(res.data.commentList.length === 0) this.loadMore = false
                    if(this.loading) this.commentList = res.data.commentList
                    this.loading = false
                })
                .catch(error => console.log(error))
            },
            saveComment() {
                axios.post(`${baseApiUrl}/comment/${this.lyricId}`, this.commentInfo)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.loading = true
                        this.loadMore = true
                        this.currentPage = 1
                        this.loadComments()
                    })
                    .catch(showError)
            },
            removeComment(id) {
                axios.delete(`${baseApiUrl}/comment/${id}`)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.loading = true
                        this.loadMore = true
                        this.currentPage = 1
                        this.loadComments()
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style>

</style>