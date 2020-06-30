<template>
    <footer class="footer">
        <span>{{ title }} - © 2020</span>
        <div class="deezerFooter">
            <span>Explore mais sobre música em:</span>
            <a href="https://www.deezer.com/br/">
                <img src="../../assets/Mono_Full_White@2x.png" alt="Visite o Deezer" style="width:150px">
            </a>
        </div>
        
    </footer>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            title: String
        }
    }
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #343a40;
        color: ghostwhite;
        flex-direction: column;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
    }

    .deezerFooter {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px 0px;
    }
</style>