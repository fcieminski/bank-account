<template>
	<section class="planned-transfers">
		<div>
			<div>Zaplanowane transfery</div>
			<div class="horizontal--divider"></div>
		</div>
		<section>
			<div class="d-flex align-center">
				<i class="material-icons mr-2">schedule</i>
				Nie masz zaplanowanych transferów.
			</div>
			<button class="btn btn--auto mt-5" @click="makePlannedTransfer = !makePlannedTransfer">
				{{ makePlannedTransfer ? "Anuluj planowanie transferu" : "Zaplanuj nowy transfer" }}
			</button>
		</section>
		<transition name="fade">
			<div v-if="makePlannedTransfer" class="mt-5">
				<form @submit.prevent>
					<div class="d-flex flex-column input__box">
						<label for="date">Data pierwszego przelewu</label>
						<date-picker
							value-type="format"
							type="date"
							input-class="input__main"
							v-model="plannedTransfer.date"
							name="date"
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
							<input v-model="plannedTransfer.amount" class="input__main" name="amount" type="number" />
						</div>
					</div>
					<div class="actions--container">
						<button class="btn btn--auto mt-5">
							Zapisz
						</button>
					</div>
				</form>
			</div>
		</transition>
	</section>
</template>

<script>
	import DatePicker from "vue2-datepicker";
	import "vue2-datepicker/index.css";
	import "vue2-datepicker/locale/pl";
	export default {
		name: "AccountPlannedTransfers",
		data() {
			return {
				loading: false,
				makePlannedTransfer: false,
				plannedTransfer: {
					date: "2020-06-10",
					amount: null,
					currency: "",
					title: "",
					name: "",
					from: null,
					to: {
						name: "",
						accountNumber: ""
					},
					period: ""
				}
			};
		},
		components: { DatePicker },
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.planned-transfers {
		margin-top: 30px;
	}
</style>