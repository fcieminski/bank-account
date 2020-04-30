<template>
	<header class="main__header">
		<div class="header__box">
			<div class="box__top">
				<div class="header__logo"></div>
				<div class="header__user">
					<span>{{ $store.state.user.name }}</span>
					<div class="btn--transparent btn--small" @click="logout">Wyloguj</div>
				</div>
			</div>
			<nav class="box__bottom">
				<div class="bottom__nav">
					<router-link :to="{ name: 'account.start' }">
						Start
					</router-link>
					<router-link to="/">
						Historia
					</router-link>
					<router-link to="/">
						Przelew
					</router-link>
					<router-link to="/">
						Zlecenia stałe
					</router-link>
				</div>
			</nav>
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
		display: flex;
		justify-content: center;
		.header__box {
			border-bottom: 2px solid $mainColor;
			height: 100%;
			margin: $contentMargin;
			padding: $contentPadding;
			width: $pageWidth;
		}
		.header__user {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.header__logo {
		}
		.box__top {
			margin-top: 10px;
			display: flex;
			justify-content: space-between;
		}
		.box__bottom {
			.bottom__nav {
				.router-link-exact-active.router-link-active {
					border-bottom: 4px solid $accent;
					padding-bottom: 6px;
				}
				a {
					text-align: center;
					margin-right: 16px;
					display: inline-block;
					&:not(.router-link-exact-active)::after {
                        transition: all 0.2s;
						content: "";
						display: block;
						background-color: $accent;
						top: 10px;
						height: 4px;
						width: 0%;
						margin-top: 6px;
					}
					&:hover:not(.router-link-exact-active) {
						&::after {
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>