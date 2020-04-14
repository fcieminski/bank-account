<template>
	<div class="about">
		<h1>This is an about page</h1>
	</div>
</template>


<script>
	import postService from "../services/PostService";
	export default {
		data() {
			return {};
		},
		created() {
			postService.getPosts().then(response => console.log(response));
		}
	};
</script>