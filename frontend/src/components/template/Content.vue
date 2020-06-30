<template>
    <div class="content">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'Content'
    }
</script>

<style>
    .content {
        grid-area: content;
        background-color: ghostwhite;
        width: 80%;
        margin: auto;
        height: 100%;
        padding: 20px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);      
    }


</style>