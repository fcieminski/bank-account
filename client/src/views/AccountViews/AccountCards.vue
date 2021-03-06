<template>
	<section class="cards">
		<div>
			<div>Twoje karty</div>
			<div class="horizontal--divider"></div>
			<section v-if="cards.length !== 0">
				<div class="d-flex">
					<div class="column" v-for="card in cards" :key="card._id">
						<p class="mb-2">{{ card.cardType }} {{ card.cardCurrency }}</p>
						<bank-card @show-card-info="showCardInfo" :card="card" />
					</div>
				</div>
				<div class="horizontal--divider"></div>
				<div v-if="cards.length !== 3" class="mb-6">
					<div class="d-flex align-center mt-5">
						<i class="material-icons mr-2">credit_card</i>
						Potrzebujesz kolejnej karty? Pamiętaj, możesz wnioskować jeszcze tylko o
						{{ 3 - cards.length }} kar{{ languageFix }}
					</div>
					<button class="btn btn--auto mt-5" @click="createNewCardForm">
						{{ createCardForm ? "Zamknij wniosek" : "Złóż wniosek" }}
					</button>
				</div>
			</section>
			<section v-else>
				<div class="d-flex align-center">
					<i class="material-icons mr-2">credit_card</i>
					Nie masz jeszcze żadnych kart, złóż wniosek o swoją pierwszą kartę!
				</div>
				<button class="btn btn--auto mt-5" @click="createCardForm = true">Złóż wniosek</button>
			</section>
			<transition name="fade" mode="out-in">
				<section :key="editCard._id" v-if="editCard">
					<div>Limity karty {{ editCard.cardNumber }}</div>
					<div v-for="(limits, key) in editCard.limits" :key="key">
						<label for="daily">Limit dzienny transakcji</label>
						<input
							class="input__main"
							v-model.number="limits.daily"
							type="text"
							v-mask="['######']"
							name="daily"
						/>
						<label for="monthly">Limit miesięczny transakcji</label>
						<input
							class="input__main"
							v-model.number="limits.monthly"
							type="text"
							v-mask="['######']"
							name="monthly"
						/>
						<button @click="changeCardLimits" class="btn btn--auto mt-5">Zmień</button>
						<transition name="fade">
							<span class="ml-5" v-if="limitsChangedInfo">{{ limitsChangedInfo }}</span>
						</transition>
					</div>
					<div class="mt-5">Inne opcje</div>
					<button @click="blockCardWarning = true" class="btn btn--auto mt-5">Zablokuj kartę</button>
					<dialog-modal
						@yes="blockCard(editCard._id)"
						@no="blockCardWarning = false"
						:show="blockCardWarning"
						:modal="{ text: 'Jesteś pewien?', yes: 'Tak', no: 'Nie' }"
					>
						<div>Czy na pewno chcesz zablokować kartę? Tej operacji nie da się odwrócić!</div>
					</dialog-modal>
				</section>
				<section :key="editBlockedCard._id" v-else-if="editBlockedCard">
					<div>Nieaktywna karta {{ editBlockedCard.cardNumber }}</div>
					<button @click="deleteCard" class="btn btn--auto mt-5">Usuń kartę</button>
				</section>
				<div v-if="createCardForm" :key="3" class="mt-5">
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
				editCard: null,
				blockCardWarning: false,
				limitsChangedInfo: "",
				editBlockedCard: null,
			};
		},
		components: {
			BankCard,
		},
		created() {
			cardsService
				.find(this.user._id)
				.then(({ cards }) => {
					this.cards = cards.map(this.mapCard);
				})
				.catch((error) => {
					console.warn(error);
				});
		},
		computed: {
			...mapState(["user"]),
			languageFix() {
				return this.cards.length === 2 ? "tę" : "ty";
			},
		},
		methods: {
			createNewCardForm() {
				this.createCardForm = !this.createCardForm;
				this.editCard = null;
				this.editBlockedCard = null;
			},
			createCard() {
				cardsService
					.create({
						userId: this.user._id,
						accountId: this.user.accounts[0],
						cardCurrency: this.currency,
						cardType: this.cardType,
					})
					.then(({ card }) => {
						this.cards.push(this.mapCard(card));
					})
					.catch((error) => {
						console.warn(error);
					})
					.finally(() => {
						this.createCardForm = false;
					});
			},
			showCardInfo(e) {
				this.createCardForm = false;
				const currentCard = this.cards.find((card) => card._id === e);
				if (currentCard.cardValid) {
					this.editCard = currentCard;
					this.editBlockedCard = null;
				} else {
					this.editBlockedCard = currentCard;
					this.editCard = null;
				}
			},
			changeCardLimits() {
				cardsService
					.update(this.editCard._id, {
						cardToUpdate: this.editCard,
					})
					.then(({ card }) => {
						let current = this.cards.find((current) => current._id === card._id);
						current.limits = card.limits;
					})
					.catch((error) => {
						console.warn(error);
					})
					.finally(() => {
						this.limitsChangedInfo = "Limity zmienione!";
						setTimeout(() => {
							this.limitsChangedInfo = "";
						}, 2000);
					});
			},
			blockCard(id) {
				this.editCard.cardValid = false;
				cardsService
					.update(id, {
						cardToUpdate: this.editCard,
					})
					.then(({ card }) => {
						let current = this.cards.find((current) => current._id === card._id);
						current.cardValid = card.cardValid;
					})
					.catch((error) => {
						console.warn(error);
					})
					.finally(() => {
						this.blockCardWarning = false;
						this.editCard = null;
					});
			},
			mapCard(card) {
				return {
					...card,
					expDate: `${new Date(card.expirationDate).getMonth()} ${new Date(card.expirationDate).getFullYear()}`,
					user: `${this.user.name} ${this.user.surname}`,
				};
			},
			deleteCard() {
				cardsService
					.delete(this.editBlockedCard._id)
					.then((data) => {
						const index = this.cards.find((card) => card._id === this.editBlockedCard._id);
						this.cards.splice(index, 1);
						this.editBlockedCard = null;
					})
					.catch((error) => {
						console.warn(error);
					});
			},
		},
	};
</script>

<style lang='scss' scoped>
	.cards {
		margin-top: 30px;
	}
</style>