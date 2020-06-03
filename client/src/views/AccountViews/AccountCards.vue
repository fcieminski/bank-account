<template>
	<section class="cards">
		<div>
			<div>Twoje karty</div>
			<div class="horizontal--divider"></div>
			<div class="d-flex align-center" v-if="!cards">
				<i class="material-icons mr-2">credit_card</i>
				Nie masz jeszcze żadnych kart, złóż wniosek o swoją pierwszą kartę!
			</div>
			<button class="btn btn--auto mt-5" @click="createCard = true">Złóż wniosek</button>
			<div v-if="createCard" class="mt-5">
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
					<!-- <input
						v-model="transferData.to.accountNumber"
						class="input__main"
						name="accountNumber"
						type="text"
					/> -->
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import cardsService from "@services/CardsService";
	export default {
		name: "AccountCards",
		data() {
			return {
				cards: null,
				createCard: false,
                currency: "PLN",
                cardType: 'Visa'
			};
		},
		components: {},
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.cards {
		margin-top: 30px;
	}
</style>