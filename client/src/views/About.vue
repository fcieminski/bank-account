<template>
	<div class="about">
		<h1>This is an about page</h1>
		<button @click="newTest">
			Click
		</button>
		<button @click="updateTest">
			upadte
		</button>
		<button @click="findTest">
			find
		</button>
	</div>
</template>


<script>
	import testService from "../services/TestService";
	export default {
		data() {
			return {
                updated: null,
            };
		},
		created() {
			testService.get().then(response => console.log(response));
		},
		methods: {
			newTest() {
				testService
					.post({
						title: "asdasdas",
						content: "asdasddddddddddddasdasdfsadf asdf asdf "
					})
					.then(response => console.log(response));
			},
			updateTest() {
				testService
					.update("5e9615c8b86417457855ddb3", {
						title: "asdaszzzzzzzzzzzzdas",
						content: "asdf "
					})
					.then(response => this.updated = response);
			},
			findTest() {
				testService.find("5e961aabbd2d6214d8b89fc0").then(response => console.log(response));
			}
		}
	};
</script>