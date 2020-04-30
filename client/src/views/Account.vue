<template>
	<div>
		<acc-header />
		<main class="main__container">
			<section class="container__content">
				<router-view />
			</section>
		</main>
	</div>
</template>

<script>
	import AccHeader from "@/components/Account/AccHeader.vue";
	import cardsService from "@/services/CardsService";

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
	.main__container {
		display: flex;
		justify-content: center;
		.container__content {
			width: $pageWidth;
			padding: $contentPadding;
			margin: $contentMargin;
		}
	}
</style>