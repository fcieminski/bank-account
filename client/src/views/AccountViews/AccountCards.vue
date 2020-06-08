<template>
	<section class="cards">
		<div>
			<div>Twoje karty</div>
			<div class="horizontal--divider"></div>
			<section v-if="cards.length !== 0">
				<div class="d-flex">
					<div class="column" v-for="card in cards" :key="card._id">
						<p class="mb-2">{{ card.cardType }}</p>
						<bank-card @editCardLimits="editCardLimits" :card="card" />
					</div>
				</div>
				<div class="horizontal--divider"></div>
				<div class="d-flex align-center mt-5">
					<i class="material-icons mr-2">credit_card</i>
					Potrzebujesz kolejnej karty?
				</div>
				<button class="btn btn--auto mt-5" @click="createCardForm = !createCardForm">
					{{ createCardForm ? "Zamknij wniosek" : "Złóż wniosek" }}
				</button>
			</section>
			<section v-else>
				<div class="d-flex align-center">
					<i class="material-icons mr-2">credit_card</i>
					Nie masz jeszcze żadnych kart, złóż wniosek o swoją pierwszą kartę!
				</div>
				<button class="btn btn--auto mt-5" @click="createCardForm = true">Złóż wniosek</button>
			</section>
			<transition name="fade">
				<section class="mt-5" v-if="editCard">
					<div>Limity karty</div>
					<div v-for="(limits, key) in editCard.limits" :key="key">
						{{ limits }}
					</div>
				</section>
			</transition>
			<transition name="fade">
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
			</transition>
		</div>
	</section>
</template>

<script>
	import cardsService from "@services/CardsService";
	import BankCard from "@utils/BankCard";
	import { mapState } from "vuex";
	export default {
		name: "AccountCards",
		data() {
			return {
				cards: [],
				createCardForm: false,
				currency: "PLN",
				cardType: "Visa",
				editCard: null
			};
		},
		components: {
			BankCard
		},
		created() {
			cardsService
				.find(this.user._id)
				.then(({ cards }) => {
					this.cards = cards.map(this.mapCard);
				})
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
					.then(({ card }) => {
						this.cards.push(this.mapCard(card));
					})
					.catch(error => {
						console.warn(error);
					})
					.finally(() => {
						this.editCard = false;
					});
			},
			editCardLimits(e) {
				this.editCard = this.cards.find(card => card._id === e);
			},
			mapCard(card) {
				return {
					...card,
					expDate: `${new Date(card.expirationDate).getMonth()} ${new Date(card.expirationDate).getFullYear()}`,
					user: `${this.user.name} ${this.user.surname}`
				};
			}
		}
	};
</script>

<style lang='scss' scoped>
	.cards {
		margin-top: 30px;
	}
</style>