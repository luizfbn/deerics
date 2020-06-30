<template>
	<li class="lyric-card">
		<router-link :to="{ name: 'lyric', params: { trackId: lyric.track_id, lyricId: lyric.id } }">
			<b>{{ lyric.title }}
                <i v-if="lyric.verified" class="fa fa-check-circle"></i>
                <i v-if="lyric.translation" class="fa fa-language"></i>
            </b>
            <span class="text-muted">Por: {{ lyric.name }}</span>
			<span class="text-muted">Criação: {{ lyric.created_at | convertDate }}</span>
            <span class="text-muted"><i class="fa fa-thumbs-up"></i> {{ lyric.likes }} <i class="fa fa-thumbs-down"></i> {{ lyric.dislikes }}</span>
		</router-link>
	</li>
</template>

<script>
	import moment from 'moment'
	export default {
		name: 'LyricCard',
		props: ['lyric'],
		filters: {
			convertDate(date) {
				return moment(date).format("DD-MM-YYYY HH:mm:ss")
			}
		}
	}
</script>

<style>
	.lyric-card {
		display: flex;
		align-items: center;
		width: 350px;
		margin: 5px;
		border-radius: 5px;
		background-color: #FFF;
        box-shadow: 0px 0px 2px grey;
		
	}
	.lyric-card:hover {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
	}

	.lyric-card > a {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 10px;
	}
	.lyric-card > a:hover{
		text-decoration: none;	
	}

	.lyric-card > a > b > i {
		margin-left: 3px;
	}
</style>