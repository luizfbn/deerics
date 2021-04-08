<template>
	<li class="artist-card">
		<router-link :to="{ name: 'artist', params: { id: artist.id } }">
			<img :src="artist.picture_medium" alt="Foto do artista">
			<b class="text-center">{{ artist.name }}</b>
		</router-link>
	</li>
</template>

<script>
	export default {
		name: 'ArtistCard',
		props: ['artist']
	}
</script>

<style lang="scss">
	@import "../../assets/styles/custom.scss";

	.artist-card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 5px;
		width: 150px;
		border-radius: 5px;
		background-color: $background;
        box-shadow: 0px 0px 2px grey;	
	}
	.artist-card:hover {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
	}
	.artist-card > a {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 10px;
	}
	.artist-card > a:hover{
		text-decoration: none;	
	}
	li.artist-card > a > img {
		border-radius: 50%;
		margin: 5px 0px 10px 0px;
		max-width:115px;
		max-height:115px;
		width: auto;
		height: auto;
	}
</style>