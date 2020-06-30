<template>
    <div class="lyric-admin">

        <!-- Formulário -->
        <b-form>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Código da música:" label-for="lyric-trackid">
                        <b-form-input id="lyric-trackid" type="text"
                            v-model="lyric.track_id" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o código da música" />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Título:" label-for="lyric-title">
                        <b-form-input id="lyric-title" type="text"
                            v-model="lyric.title" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o título da letra" />
                    </b-form-group>
                </b-col>
            </b-row>

            <b-form-radio-group id="lyric-verified"  v-show="mode === 'save'" class="mt-2 mb-3">
                <b-form-radio v-model="lyric.verified" value=0 >Não verificada</b-form-radio>
                <b-form-radio v-model="lyric.verified" value=1 >Verificada</b-form-radio>
            </b-form-radio-group>

            <b-form-group v-if="mode === 'save' && !lyric.id"
                label="Conteúdo:" label-for="lyric-content">
                <VueEditor v-model="lyric.content" placeholder="Informe o Conteúdo da letra" />
            </b-form-group>

            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'"
                        @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'"
                        @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>

        <!-- Tabela -->
        <b-table hover striped head-variant="light" :items="lyrics" :fields="fields" per-page="0" :current-page="currentPage">
            <template v-slot:cell(actions)="data">
                <b-button variant="warning" @click="loadLyric(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadLyric(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination align="center" :total-rows="totalLyrics" :per-page="pagination" v-model="currentPage"></b-pagination>
    </div>
</template>

<script>
    import { baseApiUrl, showError } from '@/global'
    import axios from 'axios'
    import moment from 'moment'
    import { VueEditor } from 'vue2-editor'

    export default {
        name: 'LyricAdmin',
        components: { VueEditor },
        data () {
            return {
                mode: 'save',
                lyric: {},
                lyrics: [],
                fields: [
                    { key: 'id', label: 'Código da letra', sortable: true },
                    { key: 'track_id', label: 'Código da música', sortable: true },
                    { key: 'title', label: 'Título', sortable: true },
                    { key: 'name', label: 'Criado por', sortable: true },
                    { key: 'verified', label: 'Verificada', sortable: true,
                        formatter: value => value ? 'Sim' : 'Não' },
                    { key: 'created_at', label: 'Criação', sortable: true,
                        formatter: value => moment(value).format("DD-MM-YYYY HH:mm:ss") },
                    { key: 'actions', label: 'Ações' }
                ],
                currentPage: 1,
                pagination: '',
                totalLyrics: ''
            }
        },
        mounted() {
            this.loadLyrics()
        },
        watch: {
            currentPage() {
                this.loadLyrics()
            }
        },
        methods: {
            loadLyrics() {
                axios.get(`${baseApiUrl}/lyrics?page=${this.currentPage}`)
                    .then(res => {
                        this.lyrics = res.data.lyricList
                        this.pagination = res.data.pagination
                        this.totalLyrics = res.data.count
                    })
                    .catch(error => console.log(error))
            },
            reset() {
                this.mode = 'save'
                this.lyric = {}
                this.loadLyrics()
                this.currentPage = 1
            },
            save() {
                const method = this.lyric.id ? 'put' : 'post'
                const id = this.lyric.id ? `/${this.lyric.id}` : ''
                axios[method](`${baseApiUrl}/lyrics${id}`, this.lyric)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            remove() {
                const id = this.lyric.id
                axios.delete(`${baseApiUrl}/lyrics/${id}`)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            loadLyric(lyric, mode = 'save') {
                this.mode = mode
                this.lyric = { ...lyric }
            }
        }
    }
</script>

<style>

</style>