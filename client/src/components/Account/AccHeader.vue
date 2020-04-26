<template>
	<header class="main__header">
		<div class="header__box">
			<div class="header__logo"></div>
			<div class="header__user">
				<span>{{ $store.state.user.name }}</span>
				<div class="btn--transparent btn--small" @click="logout">Wyloguj</div>
			</div>
		</div>
	</header>
</template>

<script>
	import authService from "@/services/AuthService";

	export default {
		name: "AccHeader",
		data() {
			return {};
		},
		components: {},
		created() {},
		computed: {},
		methods: {
			logout() {
				authService.logout();
			}
		}
	};
</script>

<style lang='scss' scoped>
	.main__header {
		height: 56px;
		display: flex;
		justify-content: center;
		.header__box {
			border-bottom: 2px solid $mainColor;
			height: 100%;
			margin: 0 20px;
			width: 1100px;
			display: flex;
			justify-content: space-between;
		}
		.header__user {
            display: flex;
            justify-content: center;
            align-items: center;
		}
		.header__logo {
		}
	}
</style>