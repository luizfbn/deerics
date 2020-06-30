<template>
    <div class="page-title">
        <h1><i v-if="icon" :class="icon"></i> {{ main }} </h1>
        <h2 class="text-muted"> {{ sub }} </h2>
        <hr>
    </div>
</template>

<script>
    export default {
        name: 'PageTitle',
        props: ['icon', 'main', 'sub']
    }
</script>

<style>
    .page-title > h1 {
        margin: 0px;
    }
    .page-title > h2 {
        margin-top: 5px;
        font-size: 1.3rem;
    }
</style>