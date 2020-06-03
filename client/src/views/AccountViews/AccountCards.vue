<template>
	<section class="cards">
		<div>
			<div>Twoje karty</div>
			<div class="horizontal--divider"></div>
			<section v-if="!cards">
				<div class="d-flex align-center">
					<i class="material-icons mr-2">credit_card</i>
					Nie masz jeszcze żadnych kart, złóż wniosek o swoją pierwszą kartę!
				</div>
				<button class="btn btn--auto mt-5" @click="createCardForm = true">Złóż wniosek</button>
			</section>
			<section v-else>
				<div class="card">
					<div class="card__container">
						<div class="cointainer__top">
							<div class="container__mark"></div>
							<div class="container__logo">
								<img class="logo" src="@/assets/logo.png" alt="" />
							</div>
						</div>
						<div class="container__number">
							1234 1234 1234 1234
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
			</section>
			<div v-if="createCardForm" class="mt-5">
				<div class="input__box" name="Numer konta">
					<label for="accountNumber">Waluta karty</label>
					<select v-model="currency" class="input__main" name="type" type="text">
						<option value="PLN">PLN</option>
						<option value="USD">USD</option>
						<option value="EURO">EURO</option>
					</select>
					<label for="accountNumber">Rodzaj karty</label>
					<select v-model="cardType" class="input__main" name="type" type="text">
						<option value="MasterCard">MasterCard</option>
						<option value="Visa">Visa</option>
					</select>
					<div class="actions--container">
						<button class="btn btn--auto mt-5" @click="createCard">Wyślij</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import cardsService from "@services/CardsService";
	import { mapState } from "vuex";
	export default {
		name: "AccountCards",
		data() {
			return {
				cards: null,
				createCardForm: false,
				currency: "PLN",
				cardType: "Visa"
			};
		},
		components: {},
		created() {
			cardsService
				.find(this.user._id)
				.then(({ cards }) => (this.cards = cards))
				.catch(error => {
					console.warn(error);
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			createCard() {
				cardsService
					.create({
						userId: this.user._id,
						accountId: this.user.accounts[0],
						cardCurrency: this.currency,
						cardType: this.cardType
					})
					.then(({ card }) => this.cards.push(card))
					.catch(error => {
						console.warn(error);
					});
			}
		}
	};
</script>

<style lang='scss' scoped>
	.cards {
		margin-top: 30px;
	}

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