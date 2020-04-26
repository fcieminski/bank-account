<template>
	<div>
		<acc-header />
		<button @click="createCard">create card</button>
	</div>
</template>

<script>
	import AccHeader from "@/components/Account/AccHeader.vue";
	import cardsService from "../services/CardsService";

	export default {
		name: "Account",
		data() {
			return {};
		},
		components: {
			AccHeader
		},
		created() {},
		computed: {},
		methods: {
			createCard() {
				const user = JSON.parse(localStorage.getItem("user"));
				cardsService
					.create({
						user: user._id,
						account: user.account
					})
					.then(response => console.log(response));
			}
		}
	};
</script>

<style lang='scss' scoped>
</style>