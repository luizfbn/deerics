<template>
    <div class="user-admin">

        <!-- Formulário -->
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id" />
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="user-name">
                        <b-form-input id="user-name" type="text"
                            v-model="user.name" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o nome do usuário" />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="E-mail:" label-for="user-email">
                        <b-form-input id="user-email" type="text"
                            v-model="user.email" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o e-mail do usuário" />
                    </b-form-group>
                </b-col>
            </b-row>

           <!-- <b-form-checkbox id="user-admin" v-show="mode === 'save'"
                v-model="user.admin" class="mt-2 mb-3">
                Administrador
            </b-form-checkbox> -->
            <b-row align-v="center">
                <b-col md="6" sm="12">
                    <b-form-radio-group id="user-admin"  v-show="mode === 'save'" class="ml-1">
                        <b-form-radio v-model="user.admin" value=0 >Usuário padrão</b-form-radio>
                        <b-form-radio v-model="user.admin" value=1 >Administrador</b-form-radio>
                    </b-form-radio-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Apelido:" label-for="user-nickname">
                        <b-form-input id="user-nickname" type="text"
                            v-model="user.nickname" required
                            :readonly="user.id != null"
                            placeholder="Informe o apelido do usuário" />
                    </b-form-group>
                </b-col>
            </b-row>
            

            <b-button v-b-toggle.collapse-1 variant="danger" v-if="mode === 'save' && user.id" class="mb-3">Mudar senha</b-button>
            <b-collapse id="collapse-1" class="mt-2" v-if="mode === 'save' && user.id">
                <b-row>
                    <b-col md="6" sm="12">
                        <b-form-group label="Nova senha:" label-for="user-newpassword">
                            <b-form-input id="user-newpassword" type="password"
                                v-model="user.password" required
                                placeholder="Informe a nova senha do usuário" />
                        </b-form-group>
                    </b-col>
                    <b-col md="6" sm="12">
                        <b-form-group label="Confirmação da nova senha:" 
                            label-for="user-confirm-newpassword">
                            <b-form-input id="user-confirm-newpassword" type="password"
                                v-model="user.confirmPassword" required
                                placeholder="Confirme a nova senha do usuário" />
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-collapse>

            <b-row v-if="!user.id">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-password">
                        <b-form-input id="user-password" type="password"
                            v-model="user.password" required
                            placeholder="Informe a senha do usuário" />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha:" 
                        label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password"
                            v-model="user.confirmPassword" required
                            placeholder="Confirme a senha do usuário" />
                    </b-form-group>
                </b-col>
            </b-row>

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
        <b-table hover striped head-variant="light" :items="users" :fields="fields" per-page="0" :current-page="currentPage">
            <template v-slot:cell(link)="data">
                <router-link :to="{ name: 'user', params: { id: data.item.id} }">Acesse</router-link>
            </template>
            <template v-slot:cell(actions)="data">
                <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination align="center" :total-rows="totalUsers" :per-page="pagination" v-model="currentPage"></b-pagination>
    </div>
</template>

<script>
    import { baseApiUrl, showError } from '@/global'
    import axios from 'axios'

    export default {
        name: 'UserAdmin',
        data () {
            return {
                mode: 'save',
                user: {},
                users: [],
                fields: [
                    { key: 'id', label: 'Código', sortable: true },
                    { key: 'nickname', label: 'Apelido', sortable: true },
                    { key: 'name', label: 'Nome', sortable: true },
                    { key: 'email', label: 'E-mail', sortable: true },
                    { key: 'admin', label: 'Administrador', sortable: true,
                        formatter: value => value ? 'Sim' : 'Não' },
                    { key: 'link', label: 'Link', sortable: false },
                    { key: 'actions', label: 'Ações' }
                ],
                currentPage: 1,
                pagination: '',
                totalUsers: ''
            }
        },
        mounted() {
            this.loadUsers()
        },
        watch: {
            currentPage() {
                this.loadUsers()
            }
        },
        methods: {
            loadUsers() {
                axios.get(`${baseApiUrl}/users?page=${this.currentPage}`)
                    .then(res => {
                        this.users = res.data.userList
                        this.pagination = res.data.pagination
                        this.totalUsers = res.data.count
                    })
                    .catch(error => console.log(error))
            },
            reset() {
                this.mode = 'save'
                this.user = {}
                this.loadUsers()
                this.currentPage = 1
            },
            save() {
                const method = this.user.id ? 'put' : 'post'
                const id = this.user.id ? `/${this.user.id}` : ''
                axios[method](`${baseApiUrl}/users${id}`, this.user)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            remove() {
                const id = this.user.id
                axios.delete(`${baseApiUrl}/users/${id}`)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            loadUser(user, mode = 'save') {
                this.mode = mode
                this.user = { ...user }
            }
        }
    }
</script>

<style>

</style>