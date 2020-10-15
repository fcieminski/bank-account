<template>
	<section class="transfer">
		<div v-if="!loading">
			<div>Wykonaj Przelew</div>
			<div class="horizontal--divider"></div>
			<div class="transfer__container">
				<div class="container__account">
					<div>Wybierz konto</div>
					<div
						v-for="(account, key) in accounts"
						:key="key"
						@click="makeActiveAccount(account)"
						class="account--name"
						:class="{ active: activeAccount && activeAccount._id === account._id }"
					>
						{{ account.description }}
					</div>
				</div>
				<div class="divider mr-5 ml-5"></div>
				<div class="container__data">
					<transition name="fade" mode="out-in">
						<div :key="1" v-if="!activeAccount && !transferDone" class="d-flex align-center info--data">
							<i class="material-icons mr-2">error</i>Najpierw wybierz konto!
						</div>
						<div :key="activeAccount._id" v-else-if="activeAccount && !transferDone">
							<ValidationObserver v-slot="{ invalid }">
								<form @submit.prevent="modal = true" action="">
									<ValidationProvider
										class="input__box"
										:rules="{ required: true, numeric: true, length: 26 }"
										name="numer konta"
										v-slot="{ errors }"
									>
										<label for="accountNumber">Numer konta</label>
										<the-mask
											v-model="transferData.to.accountNumber"
											class="input__main"
											name="accountNumber"
											type="text"
											:mask="['##-####-####-####-####-####-####']"
											:masked="false"
										/>
										<input-error left :error="errors[0]" />
									</ValidationProvider>
									<ValidationProvider
										class="input__box"
										rules="required"
										name="nazwa odbiorcy"
										v-slot="{ errors }"
									>
										<label for="name">Nazwa odbiorcy</label>
										<input
											v-model="transferData.to.name"
											class="input__main"
											name="name"
											type="text"
										/>
										<input-error left :error="errors[0]" />
									</ValidationProvider>
									<div class="input__group">
										<ValidationProvider
											class="input__box"
											rules="required"
											name="miasto"
											v-slot="{ errors }"
										>
											<label for="city">Miasto</label>
											<input
												v-model="transferData.to.city"
												class="input__main"
												name="city"
												type="text"
											/>
											<input-error left :error="errors[0]" />
										</ValidationProvider>

										<ValidationProvider
											class="input__box"
											rules="required"
											name="kod pocztowy"
											v-slot="{ errors }"
										>
											<label for="postalCode">Kod pocztowy</label>
											<the-mask
												v-model="transferData.to.postalCode"
												class="input__main"
												name="postalCode"
												type="text"
												:mask="['##-###']"
												:masked="false"
												placeholder="00-000"
											/>
											<input-error left :error="errors[0]" />
										</ValidationProvider>
									</div>
									<div class="input__group">
										<ValidationProvider
											class="input__box"
											rules="required"
											name="adres"
											v-slot="{ errors }"
										>
											<label for="address">Ulica</label>
											<input
												v-model="transferData.to.street"
												class="input__main"
												name="address"
												type="text"
											/>
											<input-error left :error="errors[0]" />
										</ValidationProvider>
										<ValidationProvider
											class="input__box"
											rules="required"
											name="numer domu"
											v-slot="{ errors }"
										>
											<label for="home">Numer domu/mieszkania</label>
											<input
												v-model="transferData.to.home"
												class="input__main"
												name="home"
												type="text"
											/>
											<input-error left :error="errors[0]" />
										</ValidationProvider>
									</div>

									<ValidationProvider
										class="input__box"
										rules="required"
										name="tytuł"
										v-slot="{ errors }"
									>
										<label for="title">Tytuł przelewu</label>
										<textarea
											v-model="transferData.title"
											class="input__main"
											name="title"
											type="text"
										/>
										<input-error left :error="errors[0]" />
									</ValidationProvider>

									<ValidationProvider
										class="input__box"
										rules="required"
										name="rodzaj przelewu"
										v-slot="{ errors }"
									>
										<label for="type">Rodzaj przelewu</label>
										<select v-model="transferType" class="input__main" name="type" type="text">
											<option :value="1">Przelew ekspressowy + 5 zł</option>
											<option :value="0">Przelew zwykły</option>
										</select>
										<input-error left :error="errors[0]" />
									</ValidationProvider>

									<div class="input__container--right">
										<ValidationProvider
											class="input__box input__box--small"
											rules="required|numeric"
											name="kwota"
											v-slot="{ errors }"
										>
											<label for="amount">Kwota</label>
											<input
												v-model="transferData.amount"
												class="input__main"
												name="amount"
												type="text"
												v-mask="['#######']"
											/>
											<input-error left :error="errors[0]" />
										</ValidationProvider>
									</div>
									<div class="actions--container">
										<button
											:disabled="invalid || activeAccount.balance < transferData.amount"
											class="btn pa-2"
										>
											Wykonaj
										</button>
									</div>
								</form>
							</ValidationObserver>
						</div>
						<div v-else-if="transferDone && !balanceError">Przelew w trakcie realizacji...</div>
						<div v-else>Masz za mało środków na koncie, aby wykonać przelew.</div>
					</transition>
				</div>
			</div>
		</div>
		<loading-indicator v-else />
		<dialog-modal
			@yes="makeTransfer"
			:show="modal"
			:modal="{ text: 'Przepisz kod, aby potwierdzić przelew', yes: 'Wykonaj' }"
		>
			<div>
				<div>
					{{ code }}
				</div>
				<div>
					<label for="code">Wprowadź kod</label>
					<input v-model="checkCode" class="input__main" name="code" type="text" />
					<input-error left :error="codeError" />
				</div>
			</div>
		</dialog-modal>
	</section>
</template>

<script>
	import accountService from "@services/AccountService";
	import historyService from "@services/HistoryService";
	import InputError from "@utils/InputError";
	import { mapState } from "vuex";

	export default {
		name: "AccountTransfer",
		data() {
			return {
				activeAccount: null,
				accounts: null,
				loading: false,
				transferData: {
					amount: null,
					currency: "",
					title: "",
					from: null,
					to: {
						name: "",
						accountNumber: "",
						city: "",
						street: "",
						home: "",
						postalCode: "",
					},
				},
				transferType: null,
				transferDone: false,
				modal: false,
				code: "",
				checkCode: "",
				codeError: null,
				balanceError: null,
			};
		},
		components: {
			InputError,
		},
		created() {
			this.loading = true;
			accountService
				.getUserAccounts(this.user._id)
				.then((accounts) => {
					this.accounts = accounts;
					this.checkTransactionParams();
				})
				.catch((e) => {
					console.log(e);
					console.error("error!");
				})
				.finally(() => {
					this.loading = false;
				});
		},
		computed: {
			...mapState(["user"]),
		},
		watch: {
			modal(value) {
				if (value) {
					historyService
						.getCode(this.user._id)
						.then((data) => {
							this.code = data.code;
						})
						.catch(() => {
							console.error("error!");
						});
				}
			},
		},
		methods: {
			makeActiveAccount(account) {
				this.activeAccount = account;
				this.balanceError = false;
			},
			makeTransfer() {
				historyService
					.sendCode(this.user._id, {
						code: this.checkCode,
					})
					.then((data) => {
						if (data.status === "success") {
							this.modal = false;
							const transfer = {
								...this.transferData,
								amount: Number(this.transferData.amount),
								from: this.user._id,
								currency: "PLN",
								type: "transfer",
								accountId: this.activeAccount._id,
							};
							setTimeout(
								() => {
									historyService.create(this.user._id, transfer).catch(() => {
										this.balanceError = true;
									});
								},
								this.transferType === 0 ? 5000 : 10
							);
							this.transferDone = !this.balanceError;
							this.activeAccount = null;
						} else {
							this.codeError = "Kod nieprawidłowy!";
						}
					});
			},
			checkTransactionParams() {
				if (this.$route.params?.transaction) {
					const { _id, amount, title, to, currency, from } = this.$route.params.transaction;
					this.activeAccount = this.accounts.find((account) => account.history.includes(_id));
					if (!this.activeAccount) {
						this.activeAccount = this.accounts.find((account) => account.type !== "savings");
					}
					this.transferData = {
						amount,
						currency,
						title,
						from,
						to,
						accountId: this.activeAccount._id,
					};
				}
			},
		},
	};
</script>

<style lang='scss' scoped>
	.transfer {
		margin-top: 30px;
		.transfer__container {
			display: flex;
		}
		.container__account {
			flex: 1;
		}
		.container__data {
			flex: 3;
		}
		textarea {
			resize: vertical;
			max-height: 300px;
			min-height: 100px;
		}
	}
</style>