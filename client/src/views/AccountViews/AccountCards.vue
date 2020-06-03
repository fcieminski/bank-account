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
				<div>Twoje karty</div>
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
</style>