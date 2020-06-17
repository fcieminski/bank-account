<template>
	<section class="planned-transfers">
		<div>
			<div>Zaplanowane transfery</div>
			<div class="horizontal--divider"></div>
		</div>
		<section>
			<button class="btn btn--auto mb-5" @click="modal = !modal">
				Zaplanuj nowy transfer
			</button>
			<div v-if="allPlannedTransfers.length !== 0">
				<div class="planned__box d-flex" v-for="(transfer, key) in allPlannedTransfers" :key="key">
					<div class="column box__column wrap--text">
						<span>
							Nazwa
						</span>
						<div>
							{{ transfer.name }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span>
							Okres
						</span>
						<div>
							{{ new Date(transfer.startDate).toLocaleDateString() }}
							-
							{{ new Date(transfer.endDate).toLocaleDateString() }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span>
							Kwota
						</span>
						<div>
							{{ transfer.amount }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span>
							Powtarzalność
						</span>
						<div class="wrap--text">
							{{ transfer.period === "d" ? "codziennie" : "raz w miesiącu" }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span>
							Tytuł przelewu
						</span>
						<div>
							{{ transfer.title }}
						</div>
					</div>
					<div class="column box__column wrap--text">
						<span>
							Odbiorca
						</span>
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
				no: 'Anuluj'
			}"
		>
			<div class="mt-5">
				<form ref="form" @submit.prevent>
					<div class="d-flex flex-column input__box">
						<label for="date">Okres działania zlecenia stałego</label>
						<date-picker
							value-type="format"
							type="date"
							input-class="input__main"
							v-model="plannedTransfer.date"
							name="date"
							:default-value="new Date()"
							:disabled-date="disabledDates"
							range
						/>
					</div>
					<div class="input__box">
						<label for="period">Powtarzalność</label>
						<select v-model="plannedTransfer.period" class="input__main" name="period" type="text">
							<option value="d">codziennie</option>
							<option value="m">raz w miesiącu</option>
						</select>
					</div>
					<div class="input__box mr-2" name="Nazwa przelewu">
						<label for="name">Nazwa przelewu</label>
						<input v-model="plannedTransfer.name" class="input__main" name="name" type="text" />
					</div>
					<div class="d-flex">
						<div class="input__box column mr-2" name="Numer konta">
							<label for="accountNumber">Numer konta</label>
							<input
								v-model="plannedTransfer.to.accountNumber"
								class="input__main"
								name="accountNumber"
								type="text"
							/>
						</div>
						<div class="input__box column ml-2" name="Nazwa odbiorcy">
							<label for="name">Nazwa odbiorcy</label>
							<input v-model="plannedTransfer.to.name" class="input__main" name="name" type="text" />
						</div>
					</div>
					<div class="d-flex">
						<div class="input__box column mr-2" name="Dane adresowe">
							<label for="adress">Dane adresowe</label>
							<textarea class="input__main" name="adress" type="text" />
						</div>
						<div class="input__box column ml-2" name="Tytuł">
							<label for="title">Tytuł przelewu</label>
							<textarea v-model="plannedTransfer.title" class="input__main" name="title" type="text" />
						</div>
					</div>
					<div class="input__container--right">
						<div class="input__box input__box--small" name="Kwota">
							<label for="amount">Kwota</label>
							<input
								v-model.number="plannedTransfer.amount"
								class="input__main"
								name="amount"
								type="number"
							/>
						</div>
					</div>
				</form>
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
	export default {
		name: "AccountPlannedTransfers",
		data() {
			return {
				loading: false,
				modal: false,
				plannedTransfer: {
					date: "2020-06-10",
					amount: null,
					currency: "",
					title: "",
					name: "",
					to: {
						name: "",
						accountNumber: ""
					},
					period: ""
				},
				allPlannedTransfers: [],
				plannedError: "",
				editingTransfer: false
			};
		},
		components: { DatePicker },
		created() {
			plannedTransferService
				.getUserPlannedTransfers(this.user._id)
				.then(response => {
					this.allPlannedTransfers = response;
				})
				.catch(() => {
					this.plannedError = "Błąd pobierania danych";
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			disabledDates(date) {
				return date < new Date(Date.now());
			},
			saveTransfer() {
				if (!this.editingTransfer) {
					this.createPlannedTransfer();
				} else {
					this.updatePlannedTransfer();
				}
			},
			createPlannedTransfer() {
				plannedTransferService
					.create(this.user._id, {
						transfer: {
							...this.plannedTransfer,
							currency: "PLN",
							startDate: this.plannedTransfer.date[0],
							endDate: this.plannedTransfer.date[1]
						}
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
							date: "2020-06-10",
							amount: null,
							currency: "",
							title: "",
							name: "",
							to: {
								name: "",
								accountNumber: ""
							},
							period: ""
						};
					});
			},
			updatePlannedTransfer() {
				plannedTransferService
					.updatePlannedTransfer(this.plannedTransfer._id, {
						update: {
							...this.plannedTransfer,
							currency: "PLN",
							startDate: this.plannedTransfer.date[0],
							endDate: this.plannedTransfer.date[1]
						}
					})
					.then(response => {
						console.log(response);
					})
					.catch(() => {
						console.warn("error");
					})
					.finally(() => {
						this.modal = false;
						this.plannedTransfer = {
							date: "2020-06-10",
							amount: null,
							currency: "",
							title: "",
							name: "",
							to: {
								name: "",
								accountNumber: ""
							},
							period: ""
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
					date: "2020-06-10",
					amount: null,
					currency: "",
					title: "",
					name: "",
					to: {
						name: "",
						accountNumber: ""
					},
					period: ""
				};
			}
		}
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