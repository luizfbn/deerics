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

<style lang="scss">
    @import "../../assets/styles/custom.scss";
    
    .content {
        grid-area: content;
        background-color: $mainBackground;
        width: 80%;
        margin: auto;
        height: 100%;
        padding: 20px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);      
    }
</style>