<template>
	<li>
		<router-link class="track-card" :to="{ name: 'track', params: { id: track.id } }">
			<span class="track-position text-muted" v-if="track.position">{{ track.position }}</span>
			<img v-if="track.album" :src="track.album.cover_small" alt="Foto do album da musica">
			<div class="track-cardInfo">
				<b>{{ track.title }}</b>
				<span class="text-muted">{{ track.artist.name }}</span>
			</div>
		</router-link>
	</li>
</template>

<script>
	export default {
		name: 'TrackCard',
		props: ['track']
	}
</script>

<style>

	li {
		list-style: none;
		margin: 5px;
	}

	.track-card {
		display: flex;
		align-items: center;
		padding: 5px;
		width: 250px;
		height: 100%;

		border-radius: 5px;
		background-color: #FFF;
        box-shadow: 0px 0px 2px grey;
	}
	.track-card:hover {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		text-decoration: none;
	}

	.track-card > span.track-position {
		padding: 5px 10px;
		font-size: 2.2rem;
	}

	.track-card > img {
		border-radius: 50%;
		margin-right: 5px;
	}
	.track-card > img:hover {
		border-radius: 50%;
		margin-right: 5px;
	}

	.track-cardInfo {
		display: flex;
		flex-direction: column;
		padding: 5px;
		max-width: 200px;
	}

</style>