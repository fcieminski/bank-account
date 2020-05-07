<template>
	<section class="transfer">
		<div v-if="!loading">
			<div>Wykonaj Przelew</div>
			<div class="horizontal--divider"></div>
			<div class="transfer__container">
				<div class="container__account">
					<div>
						Wybierz konto
					</div>
					<div
						v-for="(account, key) in accounts"
						:key="key"
						@click="makeActiveAccount($event, account)"
						class="account--name"
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
						<div :key="2" v-else-if="activeAccount && !transferDone">
							<validation-observer v-slot="{ invalid }">
								<form @submit.prevent="modal = true" action="">
									<validation-provider
										class="input__box"
										rules="required"
										name="Numer konta"
										v-slot="{ errors }"
									>
										<label for="accountNumber">Numer konta</label>
										<input
											v-model="transferData.to.accountNumber"
											class="input__main"
											name="accountNumber"
											type="number"
										/>
										<input-error left :error="errors[0]" />
									</validation-provider>
									<validation-provider
										class="input__box"
										rules="required"
										name="Nazwa odbiorcy"
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
									</validation-provider>
									<validation-provider
										class="input__box"
										rules="required"
										name="Dane adresowe"
										v-slot="{ errors }"
									>
										<label for="adress">Dane adresowe</label>
										<textarea class="input__main" name="adress" type="text" />
										<input-error left :error="errors[0]" />
									</validation-provider>
									<validation-provider
										class="input__box"
										rules="required"
										name="Tytuł"
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
									</validation-provider>

									<validation-provider
										class="input__box"
										rules="required"
										name="Rodzaj przelewu"
										v-slot="{ errors }"
									>
										<label for="type">Rodzaj przelewu</label>
										<select v-model="transferType" class="input__main" name="type" type="text">
											<option value="express">Przelew ekspressowy + 5 zł</option>
											<option value="normal">Przelew zwykły</option>
										</select>
										<input-error left :error="errors[0]" />
									</validation-provider>

									<div class="input__container--right">
										<validation-provider
											class="input__box input__box--small"
											rules="required"
											name="Kwota"
											v-slot="{ errors }"
										>
											<label for="amount">Kwota</label>
											<input
												v-model="transferData.amount"
												class="input__main"
												name="amount"
												type="number"
											/>
											<input-error left :error="errors[0]" />
										</validation-provider>
									</div>
									<div class="actions--container">
										<button :disabled="invalid" class="btn pa-2">
											Wykonaj
										</button>
									</div>
								</form>
							</validation-observer>
						</div>
						<div v-else>
							Przelew wykonany!
						</div>
					</transition>
				</div>
			</div>
		</div>
		<loading-indicator v-else />
		<div class="modal" v-if="modal">
			<div class="modal__card">
				<div class="card__title">
					Przepisz kod, aby potwierdzić przelew
				</div>
				<div class="card__content">
					<div>
						<div>
							{{ code }}
						</div>
						<div>
							<label for="code">Wprowadź kod</label>
							<input v-model="checkCode" class="input__main" name="code" type="text" />
							<!-- <input-error left :error="errors[0]" /> -->
						</div>
					</div>
				</div>
				<div class="card__actions">
					<button :disabled="code !== checkCode" @click="makeTransfer" class="btn pa-2">
						Wykonaj
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import accountService from "@services/AccountService";
	import historyService from "@services/HistoryService";
	import InputError from "@utils/InputError";
	import { extend } from "vee-validate";
	import { required, email, alpha } from "vee-validate/dist/rules";
	import { mapState } from "vuex";

	extend("required", {
		...required,
		message: "Pole obowiązkowe!"
	});

	export default {
		name: "AccountTransfer",
		data() {
			return {
				activeAccount: null,
				accounts: null,
				loading: false,
				transferData: {
					date: new Date().toLocaleDateString(),
					amount: null,
					currency: "",
					title: "",
					from: null,
					to: {
						name: "",
						accountNumber: ""
					}
				},
				transferType: null,
				transferDone: false,
				modal: false,
                checkCode: "",
                code: "adFG12"
			};
		},
		components: {
			InputError
		},
		created() {
			this.loading = true;
			accountService
				.getUserAccounts(this.user._id)
				.then(account => {
					this.accounts = account;
				})
				.catch(e => {
					console.error("error!");
				})
				.finally(() => {
					this.loading = false;
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			makeActiveAccount(event, account) {
				this.activeAccount = account;
				event.target.classList.toggle("active");
			},
			makeTransfer() {
                this.modal = false;
				const transfer = { ...this.transferData, from: this.user, currency: "PLN", name: "transfer" };
				historyService
					.create(this.user._id, transfer)
					.then(data => {
						this.transferDone = true;
						this.activeAccount = null;
					})
					.catch(() => {
						console.error("error!");
					});
			}
		}
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