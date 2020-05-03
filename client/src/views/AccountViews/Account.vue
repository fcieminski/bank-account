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

	export default {
		name: "Account",
		data() {
			return {};
		},
		components: {
			AccHeader
		},
		computed: {},
		methods: {
	
		}
	};
</script>

<style lang='scss' scoped>
	.main__container {
		display: flex;
        justify-content: center;
        margin-bottom: 20px;
		.container__content {
			width: $pageWidth;
			padding: $contentPadding;
			margin: $contentMargin;
		}
	}
</style>