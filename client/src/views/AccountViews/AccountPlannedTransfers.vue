<template>
	<section class="planned-transfers">
		<div>
			<div>Zaplanowane transfery</div>
			<div class="horizontal--divider"></div>
		</div>
		<section>
			<button class="btn btn--auto mb-5" @click="modal = !modal">Zaplanuj nowy transfer</button>
			<div v-if="allPlannedTransfers.length !== 0">
				<div class="planned__box d-flex" v-for="(transfer, key) in allPlannedTransfers" :key="key">
					<div class="column box__column wrap--text">
						<span> Nazwa </span>
						<div>
							{{ transfer.name }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span> Okres </span>
						<div>
							{{ new Date(transfer.startDate).toLocaleDateString() }}
							-
							{{ new Date(transfer.endDate).toLocaleDateString() }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span> Kwota </span>
						<div>
							{{ transfer.amount }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span> Powtarzalność </span>
						<div class="wrap--text">
							{{ transfer.period === "d" ? "codziennie" : "raz w miesiącu" }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span> Tytuł przelewu </span>
						<div>
							{{ transfer.title }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span> Odbiorca </span>
						<div>
							{{ transfer.to.name }}
						</div>
					</div>
					<div class="box__column box__column--actions">
						<i class="material-icons mr-2 cp" @click="editTransfer(transfer)">edit</i>
						<i class="material-icons mr-2 cp" @click="deleteTransfer(transfer._id, key)">delete</i>
					</div>
				</div>
			</div>
			<div v-else class="d-flex align-center">
				<i class="material-icons mr-2">schedule</i>
				Nie masz zaplanowanych transferów.
			</div>
		</section>
		<dialog-modal
			:show="modal"
			@no="cleanForm"
			@yes="saveTransfer"
			:modal="{
				text: this.editingTransfer ? 'Edytuj zaplanowany transfer' : 'Utwórz nowy zaplanowany transfer',
				yes: 'Zapisz',
				no: 'Anuluj',
			}"
		>
			<div class="mt-5">
				<ValidationObserver ref="validationObserver">
					<form ref="form" @submit.prevent>
						<ValidationProvider
							class="d-flex flex-column input__box"
							rules="required"
							name="data"
							v-slot="{ errors }"
						>
							<label for="date">Okres działania zlecenia stałego</label>
							<date-picker
								value-type="format"
								type="date"
								input-class="input__main"
								v-model="date"
								name="date"
								:default-value="new Date()"
								:disabled-date="disabledDates"
								range
							/>
							<input-error left :error="errors[0]" />
						</ValidationProvider>
						<ValidationProvider
							class="input__box"
							rules="required"
							name="powtarzalność"
							v-slot="{ errors }"
						>
							<label for="period">Powtarzalność</label>
							<select v-model="plannedTransfer.period" class="input__main" name="period" type="text">
								<option value="d">codziennie</option>
								<option value="m">raz w miesiącu</option>
							</select>
							<input-error left :error="errors[0]" />
						</ValidationProvider>
						<ValidationProvider
							class="input__box"
							rules="required"
							name="nazwa przelewu"
							v-slot="{ errors }"
						>
							<label for="name">Nazwa przelewu</label>
							<input v-model="plannedTransfer.name" class="input__main" name="name" type="text" />
							<input-error left :error="errors[0]" />
						</ValidationProvider>
						<div class="d-flex">
							<ValidationProvider
								class="input__box column mr-2"
								rules="required"
								name="numer konta"
								v-slot="{ errors }"
							>
								<label for="accountNumber">Numer konta</label>
								<the-mask
									v-model="plannedTransfer.to.accountNumber"
									class="input__main"
									name="accountNumber"
									type="text"
									:mask="['##-####-####-####-####-####-####']"
									:masked="false"
								/>
								<input-error left :error="errors[0]" />
							</ValidationProvider>
							<ValidationProvider
								class="input__box column ml-2"
								rules="required"
								name="nazwa odbiorcy"
								v-slot="{ errors }"
							>
								<label for="name">Nazwa odbiorcy</label>
								<input v-model="plannedTransfer.to.name" class="input__main" name="name" type="text" />
								<input-error left :error="errors[0]" />
							</ValidationProvider>
						</div>
						<div class="d-flex">
							<ValidationProvider
								class="input__box column mr-2"
								rules="required"
								name="dane adresowe"
								v-slot="{ errors }"
							>
								<label for="adress">Dane adresowe</label>
								<textarea
									v-model="plannedTransfer.to.street"
									class="input__main"
									name="adress"
									type="text"
								/>
								<input-error left :error="errors[0]" />
							</ValidationProvider>
							<ValidationProvider
								class="input__box column ml-2"
								rules="required"
								name="tytuł przelewu"
								v-slot="{ errors }"
							>
								<label for="title">Tytuł przelewu</label>
								<textarea
									v-model="plannedTransfer.title"
									class="input__main"
									name="title"
									type="text"
								/>
								<input-error left :error="errors[0]" />
							</ValidationProvider>
						</div>
						<div class="input__container--right">
							<ValidationProvider
								class="input__box input__box--small"
								rules="required"
								name="kwota"
								v-slot="{ errors }"
							>
								<label for="amount">Kwota</label>
								<input
									v-model.number="plannedTransfer.amount"
									class="input__main"
									name="amount"
									type="text"
									v-mask="['#######']"
								/>
								<input-error left :error="errors[0]" />
							</ValidationProvider>
						</div>
					</form>
				</ValidationObserver>
			</div>
		</dialog-modal>
	</section>
</template>

<script>
	import DatePicker from "vue2-datepicker";
	import "vue2-datepicker/index.css";
	import "vue2-datepicker/locale/pl";
	import plannedTransferService from "@services/PlannedTransferService";
	import { mapState } from "vuex";
	import { format } from "date-fns";
	export default {
		name: "AccountPlannedTransfers",
		data() {
			return {
				loading: false,
				modal: false,
				plannedTransfer: {
					amount: null,
					currency: "",
					title: "",
					name: "",
					to: {
						name: "",
						accountNumber: "",
						city: "",
						street: "",
						home: "",
						postalCode: "",
					},
					period: "",
					startDate: "",
					endDate: "",
				},
				allPlannedTransfers: [],
				plannedError: "",
				editingTransfer: false,
			};
		},
		components: { DatePicker },
		created() {
			plannedTransferService
				.getUserPlannedTransfers(this.user._id)
				.then((response) => {
					this.allPlannedTransfers = response;
				})
				.catch(() => {
					this.plannedError = "Błąd pobierania danych";
				});
		},
		computed: {
			...mapState(["user"]),
			date: {
				get() {
					const start = this.plannedTransfer.startDate;
					const end = this.plannedTransfer.endDate;
					if (start && end) {
						return [
							format(new Date(start), "yyyy-MM-dd", { locale: this.$localePl }),
							format(new Date(end), "yyyy-MM-dd", { locale: this.$localePl }),
						];
					}
					return "";
				},
				set(value) {
					this.plannedTransfer.startDate = value[0];
					this.plannedTransfer.endDate = value[1];
				},
			},
		},
		methods: {
			disabledDates(date) {
				return date < new Date(Date.now());
			},
			async saveTransfer() {
				const valid = await this.$refs.validationObserver.validate();
				if (valid) {
					if (!this.editingTransfer) {
						this.createPlannedTransfer();
					} else {
						this.updatePlannedTransfer();
					}
				}
			},
			createPlannedTransfer() {
				plannedTransferService
					.create(this.user._id, {
						transfer: {
							...this.plannedTransfer,
							currency: "PLN",
							accountId: this.user.accounts[0],
						},
					})
					.then(({ newTransfer }) => {
						this.allPlannedTransfers.push(newTransfer);
					})
					.catch(() => {
						console.warn("error");
					})
					.finally(() => {
						this.modal = false;
						this.plannedTransfer = {
							amount: null,
							currency: "",
							title: "",
							name: "",
							to: {
								name: "",
								accountNumber: "",
								city: "",
								street: "",
								home: "",
								postalCode: "",
							},
							period: "",
						};
					});
			},
			updatePlannedTransfer() {
				plannedTransferService
					.updatePlannedTransfer(this.plannedTransfer._id, {
						update: {
							...this.plannedTransfer,
							currency: "PLN",
						},
					})
					.catch(() => {
						console.warn("error");
					})
					.finally(() => {
						this.modal = false;
						this.plannedTransfer = {
							amount: null,
							currency: "",
							title: "",
							name: "",
							to: {
								name: "",
								accountNumber: "",
								city: "",
								street: "",
								home: "",
								postalCode: "",
							},
							period: "",
						};
					});
			},
			deleteTransfer(id, index) {
				plannedTransferService
					.deletePlannedTransfer(id)
					.then(() => {
						this.allPlannedTransfers.splice(index, 1);
					})
					.catch(() => {
						console.warn("error");
					});
			},
			editTransfer(transfer) {
				this.plannedTransfer = { ...transfer, to: { ...transfer.to } };
				this.modal = true;
				this.editingTransfer = true;
			},
			cleanForm() {
				this.modal = false;
				this.plannedTransfer = {
					amount: null,
					currency: "",
					title: "",
					name: "",
					to: {
						name: "",
						accountNumber: "",
						city: "",
						street: "",
						home: "",
						postalCode: "",
					},
					period: "",
				};
			},
		},
	};
</script>

<style lang='scss' scoped>
	.planned-transfers {
		margin-top: 30px;
	}
	.planned__box {
		border: 2px solid $mainColor;
		border-radius: 4px;
		margin-bottom: 20px;
		padding: 18px;
		.box__column {
			display: flex;
			flex-direction: column;
			justify-content: center;
			&.box__column--actions {
				flex-direction: row;
				align-items: center;
			}
		}
	}
</style>