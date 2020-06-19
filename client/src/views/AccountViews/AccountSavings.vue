<template>
	<section class="savings">
		<div v-if="!loading">
			<div>Oszczędności {{ savingAccount && savingAccount.description }}</div>
			<div class="horizontal--divider"></div>
			<section>
				<section class="d-flex" v-if="savingAccount">
					<div class="column">
						<copy-info :account="savingAccount" />
						<account-main-info icon="account_balance" :account="savingAccount" />
					</div>
					<div class="column">
						<div>
							<div>
								<span>
									Wykonaj przelew ze swojego konta głównego, na konto oszczędnościowe
								</span>
							</div>
							<button class="btn btn--auto mt-5" @click="makeLocalTransfer">Wykonaj przelew</button>
						</div>
						<div class="mt-5">
							<div>
								<span>
									Ustal nowy cel oszczędnościowy
								</span>
							</div>
							<button class="btn btn--auto mt-5" @click="newSavingGoal = true">Ustal cel</button>
						</div>
					</div>
				</section>
				<section v-else>
					<div class="d-flex align-center">
						<i class="material-icons mr-2">account_balance</i>
						Nie masz żadnego konta oszczędnościowego. Załóż je teraz i zacznij oszczędzać!
					</div>
					<button class="btn btn--auto mt-5" @click="createNewAccount">Złóż wniosek</button>
					<div class="mt-5" v-if="creatingAccount">
						Przygotowywanie Twojego wniosku, nie wyłączaj tej strony{{ dots }}
					</div>
				</section>
				<section v-if="newSavingGoal">
					<div class="d-flex">
						<div class="input__box column mr-2">
							<label for="name">Nazwa celu</label>
							<input v-model="goal.name" class="input__main" name="name" />
						</div>
						<div class="input__box column ml-2">
							<label for="amount">Kwota celu</label>
							<input v-model.number="goal.amount" class="input__main" name="amount" />
						</div>
						<div class="input__box column ml-2">
							<label for="category">Kategoria celu</label>
							<select v-model="goal.category" class="input__main" name="category">
								<option value="samochód">Samochód</option>
								<option value="wakacje">Wakacje</option>
								<option value="dom">Dom</option>
								<option value="marzenia">Marzenia</option>
								<option value="emerytura">Emerytura</option>
								<option value="zaręczyny">Zaręczyny</option>
								<option value="komputer">Komputer</option>
								<option value="telefon">Telefon</option>
								<option value="inne">Inne</option>
							</select>
						</div>
					</div>
					<div>
						<label for="description">Opis celu</label>
						<textarea v-model="goal.description" class="input__main" name="description" />
					</div>
					<div class="actions--container">
						<button class="btn btn--auto mt-5" @click="createNewGoal">Stwórz</button>
					</div>
				</section>
			</section>
		</div>
	</section>
</template>

<script>
	import accountService from "@/services/AccountService";
	import AccountMainInfo from "@/components/Account/AccountMainInfo";
	import CopyInfo from "@/components/utils/CopyInfo";
	import { mapState } from "vuex";
	export default {
		name: "AccountSavings",
		data() {
			return {
				loading: false,
				creatingAccount: false,
				dots: "",
				iteration: 0,
				interval: null,
				savingAccount: null,
				newSavingGoal: false,
				goal: {
					name: "",
					amount: 0,
					description: "",
					category: ""
				},
				currentGoals: null
			};
		},
		components: { AccountMainInfo, CopyInfo },
		async created() {
			this.loading = true;
			try {
				const accounts = await accountService.getUserAccounts(this.user._id);
				this.savingAccount = accounts.find(account => account.type === "savings");
                const goals = await accountService.getGoals(this.savingAccount._id);
				this.currentGoals = goals;
			} catch (error) {
				console.warn(error);
			} finally {
				this.loading = false;
			}
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			createNewAccount() {
				this.creatingAccount = true;
				if (!this.interval) {
					this.interval = setInterval(this.createDots, 300);
					setTimeout(this.sendAccountInfo, 5000);
				}
			},
			createDots() {
				const allDots = [".", ".", ".", "."];
				if (this.iteration !== allDots.length) {
					this.dots += allDots[this.iteration];
					this.iteration++;
				} else {
					this.dots = "";
					this.iteration = 0;
				}
			},
			sendAccountInfo() {
				clearInterval(this.interval);
				accountService
					.create({
						description: "Konto złotówa",
						type: "savings"
					})
					.then(data => {
						this.savingAccount = data;
						this.creatingAccount = false;
					});
			},
			makeLocalTransfer() {},
			createNewGoal() {
				accountService
					.createSavingGoal(this.savingAccount._id, {
						...this.goal
					})
					.then(data => {
						console.log(data);
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.savings {
		margin-top: 30px;
	}
	textarea {
		resize: vertical;
		max-height: 300px;
		min-height: 100px;
	}
</style>
