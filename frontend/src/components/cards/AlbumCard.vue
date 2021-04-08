<template>
	<li class="album-card">
		<img :src="album.cover_small" alt="Foto do album">
		<router-link :to="{ name: 'album', params: { id: album.id } }" >
			<b>{{ album.title }}</b>
            <span class="text-muted">Lançamento: {{ album.release_date }}</span>
		</router-link>
	</li>
</template>

<script>
	export default {
		name: 'AlbumCard',
		props: ['album']
	}
</script>

<style lang="scss">
	@import "../../assets/styles/custom.scss";

	li.album-card {
		display: flex;
		align-items: center;
		padding: 5px;
		margin: 5px;
		width: 270px;
		border-radius: 5px;
		background-color: $background;
        box-shadow: 0px 0px 2px grey;
	}
	li.album-card:hover {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 5px;	
	}
	li.album-card > img {
		border-radius: 10px;
		margin-right: 5px;
	}
	li.album-card > img:hover {
		border-radius: 10px;
		margin-right: 5px;
	}
	li.album-card > a {
		display: flex;
		flex-direction: column;
		padding: 5px;
		max-width: 200px;
	}
	li.album-card > a:hover{
		text-decoration: none;
	}
</style>