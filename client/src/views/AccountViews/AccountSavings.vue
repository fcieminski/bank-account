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
								<span> Wykonaj przelew ze swojego konta głównego, na konto oszczędnościowe </span>
							</div>
							<button class="btn btn--auto mt-5" @click="makeLocalTransfer">Wykonaj przelew</button>
						</div>
						<div class="mt-5">
							<div>
								<span> Ustal nowy cel oszczędnościowy </span>
							</div>
							<button class="btn btn--auto mt-5" @click="newSavingGoal = true">Ustal cel</button>
						</div>
						<div v-if="this.currentGoals.length !== 0" class="mt-5">
							<div>
								<span> Wpłać pieniądze na cel oszczędnościowy </span>
							</div>
							<button class="btn btn--auto mt-5" @click="newSavingGoalTransfer = true">Wpłać</button>
						</div>
					</div>
					<section>
						<div class="horizontal--divider"></div>
						<div v-if="!currentGoals" class="d-flex align-center">
							<i class="material-icons mr-2">account_balance_wallet</i>
							Nie masz jeszcze żadnych celów oszczędnościowych!
						</div>
						<div v-else>
							<div
								class="goal__box"
								:class="{ goal__done: goal.isDone }"
								v-for="(goal, index) in currentGoals"
								:key="index"
							>
								<img class="goal__image goal__column" :src="goal.image" alt="" />
								<div class="goal__column pa-5">
									<span>Nazwa celu</span>
									<div>
										{{ goal.name }}
									</div>
								</div>
								<div class="goal__column pa-5">
									<span>Opis celu</span>
									<div>
										{{ goal.description }}
									</div>
								</div>
								<div class="goal__column pa-5">
									<span>Kwota</span>
									<div>
										{{ goal.amount }}
									</div>
								</div>
								<div class="goal__column pa-5">
									<span>Mam już</span>
									<div>
										{{ goal.currentAmount }}
									</div>
								</div>
								<div class="goal__column pa-5">
									<span>Kategoria</span>
									<div>
										{{ goal.category }}
									</div>
								</div>
								<div class="d-flex align-center pa-5">
									<div>
										<i
											@click="deleteModal = { id: goal._id, modal: true }"
											class="material-icons cp"
											>delete</i
										>
									</div>
								</div>
								<dialog-modal
									@yes="deleteGoal(goal._id, index)"
									@no="deleteModal = null"
									:show="deleteModal && deleteModal.modal && deleteModal.id === goal._id"
									:modal="{ text: 'Jesteś pewien?', yes: 'Tak', no: 'Nie' }"
								>
									<div>
										Czy na pewno chcesz usunąć ten cel oszczędnościowy? Pieniądzę wrócą na Twoje
										konto oszczędnościowe.
									</div>
								</dialog-modal>
							</div>
						</div>
					</section>
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

				<dialog-modal
					@yes="createNewGoal"
					@no="newSavingGoal = false"
					:show="newSavingGoal"
					:modal="{ text: 'Nowy cel', yes: 'Stwórz', no: 'Anuluj' }"
				>
					<ValidationObserver ref="validationObserver">
						<div class="d-flex">
							<ValidationProvider
								class="input__box column mr-2"
								rules="required"
								name="nazwa celu"
								v-slot="{ errors }"
							>
								<label for="name">Nazwa celu</label>
								<input v-model="goal.name" class="input__main" name="name" />
								<input-error left :error="errors[0]" />
							</ValidationProvider>
							<ValidationProvider
								class="input__box column mr-2 ml-2"
								rules="required"
								name="kwota celu"
								v-slot="{ errors }"
							>
								<label for="amount">Kwota celu</label>
								<input
									v-model.number="goal.amount"
									v-mask="['######']"
									class="input__main"
									name="amount"
								/>
								<input-error left :error="errors[0]" />
							</ValidationProvider>
							<ValidationProvider
								class="input__box column ml-2"
								rules="required"
								name="kategoria celu"
								v-slot="{ errors }"
							>
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
								<input-error left :error="errors[0]" />
							</ValidationProvider>
						</div>
						<ValidationProvider class="input__box" rules="required" name="opis celu" v-slot="{ errors }">
							<label for="description">Opis celu</label>
							<textarea v-model="goal.description" class="input__main" name="description" />
							<input-error left :error="errors[0]" />
						</ValidationProvider>
						<div class="input__box">
							<label for="file">Opcjonalnie, dodaj zdjęcie celu</label>
							<input
								@click="$refs.fileInput.click()"
								v-model="fileName"
								readonly
								name="file"
								class="input__main cp"
							/>
							<input
								@change="addFile"
								accept="image/x-png,image/jpeg"
								ref="fileInput"
								style="display: none"
								type="file"
								name="description"
							/>
							<input-error left :error="fileError" />
						</div>
					</ValidationObserver>
				</dialog-modal>
				<dialog-modal
					@yes="transferToGoal"
					@no="newSavingGoalTransfer = false"
					:show="newSavingGoalTransfer"
					:modal="{ text: 'Wpłać na cel', yes: 'Wpłać', no: 'Anuluj' }"
				>
					<div v-if="currentGoals">
						<label for="file">Wybierz cel oszczędnościowy</label>
						<select v-model="selectedGoal" readonly class="input__main cp">
							<option v-for="(goal, key) in notDoneGoals" :key="key" :value="goal">
								{{ goal.name }}, kategoria: {{ goal.category }}
							</option>
						</select>
						<transition name="fade">
							<div class="mt-5" v-if="selectedGoal">
								<input
									v-model.number="selectedGoalAmount"
									v-mask="['######']"
									class="input__main"
									name="amount"
								/>
								<input-error left :error="goalError" />
							</div>
						</transition>
					</div>
				</dialog-modal>
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
					amount: null,
					description: "",
					category: "",
					image: null,
				},
				currentGoals: null,
				fileName: "",
				fileError: null,
				newSavingGoalTransfer: false,
				selectedGoal: null,
				selectedGoalAmount: null,
				goalError: null,
				deleteModal: null,
			};
		},
		components: { AccountMainInfo, CopyInfo },
		async created() {
			this.loading = true;
			try {
				const accounts = await accountService.getUserAccounts(this.user._id);
				this.savingAccount = accounts.find((account) => account.type === "savings");
				const goals = await accountService.getGoals(this.savingAccount._id);
				this.currentGoals = goals;
			} catch (error) {
				console.warn(error);
			} finally {
				this.loading = false;
			}
		},
		mounted() {},
		computed: {
			...mapState(["user"]),
			notDoneGoals() {
				return this.currentGoals.filter((goal) => !goal.isDone);
			},
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
						description: "Konto Złotówa",
						type: "savings",
					})
					.then((data) => {
						this.savingAccount = data;
						this.creatingAccount = false;
					});
			},
			makeLocalTransfer() {
				const transaction = {
					to: { name: this.user.name, accountNumber: this.savingAccount.accountNumber },
					amount: 0,
					currency: "PLN",
					from: this.user._id,
					title: "Przelew na konto oszczędnościowe",
				};

				this.$router.push({
					name: "account.transfer",
					params: {
						transaction,
					},
				});
			},
			async createNewGoal() {
				const valid = await this.$refs.validationObserver.validate();
				if (valid) {
					const form = new FormData();

					form.append("file", this.goal.image);
					form.append("fileName", this.fileName);
					form.append("name", this.goal.name);
					form.append("amount", this.goal.amount);
					form.append("description", this.goal.description);
					form.append("category", this.goal.category);

					accountService
						.createSavingGoal(this.savingAccount._id, form)
						.then((data) => {
							this.currentGoals.push(data);
							this.newSavingGoal = false;
						})
						.catch((error) => {
							this.fileError = error.response.data.error;
						});
				}
			},
			deleteGoal(id, index) {
				accountService
					.deleteGoal(id, this.savingAccount._id)
					.then((data) => {
						this.currentGoals.splice(index, 1);
						if (data) {
							this.savingAccount.balance = data.balance;
						}
					})
					.catch((error) => {
						console.warn(error);
					})
					.finally(() => {
						this.deleteModal = null;
					});
			},
			transferToGoal() {
				accountService
					.transferToGoal(this.selectedGoal._id, {
						accountId: this.savingAccount._id,
						amount: this.selectedGoalAmount,
					})
					.then((data) => {
						this.savingAccount.balance = data.accountBalance;
						const influencedGoal = this.currentGoals.find((goal) => goal._id === data.goal._id);
						influencedGoal.currentAmount = data.goal.currentAmount;
						influencedGoal.isDone = data.goal.isDone;
						influencedGoal.updatedAt = data.goal.updatedAt;
						this.selectedGoalAmount = 0;
						this.selectedGoal = null;
						this.newSavingGoalTransfer = false;
					})
					.catch((error) => {
						this.goalError = error.response.data.error;
						console.warn(error);
						setTimeout(() => {
							this.goalError = null;
						}, 2000);
					});
			},
			addFile(e) {
				this.fileError = null;
				const [file] = e.target.files;
				this.fileName = file.name;
				this.goal.image = file;
			},
		},
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
	.goal__box {
		&.goal__done {
			border: 2px solid green;
		}
		border: 2px solid $mainColor;
		margin-bottom: 20px;
		padding: 18px;
		border-radius: 4px;
		display: flex;
		width: 100%;
		justify-content: space-between;
		.goal__image {
			object-fit: cover;
			width: 100px;
			height: 100px;
		}
		.goal__column {
			display: flex;
			flex-direction: column;
			flex: 0 0 16%;
			max-width: 16%;
			justify-content: center;
		}
	}
</style>
