<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
            sub="Configurações e afins" /> 

        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Letras" active>
                        <LyricAdmin />
                    </b-tab>
                    <b-tab title="Usuários">
                        <UserAdmin />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
    import PageTitle from '../template/PageTitle'
    import LyricAdmin from './LyricAdmin'
    import UserAdmin from './UserAdmin'

    export default {
        name: 'AdminPages',
        components: { PageTitle, LyricAdmin, UserAdmin }
    }
</script>

<style>

</style>