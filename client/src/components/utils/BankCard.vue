<template>
	<div class="card">
		<div class="card__container">
			<div class="cointainer__top">
				<div class="container__mark"></div>
				<div class="container__logo">
					<img class="logo" src="@/assets/logo.png" alt="" />
				</div>
			</div>
			<div class="container__number">
				{{card.cardNumber | formatCardNumber}}
			</div>
			<div class="container__bottom">
				<div>
					John Kowalski
				</div>
				<div class="bottom__valid">
					<div>
						valid
					</div>
					<div>
						12/02
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "BankCard",
		data() {
			return {};
		},
		props: {
			card: {
				type: Object,
				default: () => {}
			}
        },
        
		components: {},
		created() {},
		computed: {},
        methods: {},
        filters: {
            formatCardNumber(value){
                return value.replace(/(.{4})/g, "$1 ")
            }
        }
	};
</script>

<style lang='scss' scoped>
	.card {
		width: 350px;
		height: 200px;
		max-width: 100%;
		display: flex;
		background: $gradient;
		box-shadow: $mainShadow;
		border-radius: 10px;
		.card__container {
			width: 80%;
			height: 80%;
			margin: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.cointainer__top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.container__logo {
					width: 100px;
					height: 50px;
					display: flex;
					justify-content: flex-end;
					img {
						height: 100%;
					}
				}
				.container__mark {
					width: 50px;
					height: 35px;
					border-radius: 5px;
					background: #ccc;
					position: relative;
					&::before {
						content: " ";
						display: block;
						width: 70%;
						height: 60%;
						border-top-right-radius: 5px;
						border-bottom-right-radius: 5px;
						background: #d9d9d9;
						position: absolute;
						top: 20%;
					}
				}
			}
			.container__number {
				background: linear-gradient(90deg, rgba(204, 204, 204, 1) 0%, rgba(245, 245, 245, 1) 54%);
				background-clip: text;
				color: transparent;
				font-size: 24px;
				word-spacing: 12px;
			}
			.container__bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient(90deg, rgba(204, 204, 204, 1) 0%, rgba(245, 245, 245, 1) 54%);
				background-clip: text;
				color: transparent;
				.bottom__valid {
					div {
						font-size: 14px;
					}
				}
			}
		}
	}
</style>