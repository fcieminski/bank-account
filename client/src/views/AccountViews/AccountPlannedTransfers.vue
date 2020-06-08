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
				<validation-observer v-slot="{ invalid }">
					<form @submit.prevent>
						<validation-provider
							class="input__box"
							:rules="{ required: true }"
							name="Nazwa przelewu"
							v-slot="{ errors }"
						>
							<label for="name">Nazwa przelewu</label>
							<input v-model="plannedTransfer.name" class="input__main" name="name" type="text" />
							<input-error left :error="errors[0]" />
						</validation-provider>
						<div class="d-flex">
							<validation-provider
								class="input__box column mr-2"
								:rules="{ required: true, numeric: true, length: 26 }"
								name="Numer konta"
								v-slot="{ errors }"
							>
								<label for="accountNumber">Numer konta</label>
								<input
									v-model="plannedTransfer.to.accountNumber"
									class="input__main"
									name="accountNumber"
									type="text"
								/>
								<input-error left :error="errors[0]" />
							</validation-provider>
							<validation-provider
								class="input__box column ml-2"
								rules="required"
								name="Nazwa odbiorcy"
								v-slot="{ errors }"
							>
								<label for="name">Nazwa odbiorcy</label>
								<input v-model="plannedTransfer.to.name" class="input__main" name="name" type="text" />
								<input-error left :error="errors[0]" />
							</validation-provider>
						</div>
						<div class="d-flex">
							<validation-provider
								class="input__box column mr-2"
								rules="required"
								name="Dane adresowe"
								v-slot="{ errors }"
							>
								<label for="adress">Dane adresowe</label>
								<textarea class="input__main" name="adress" type="text" />
								<input-error left :error="errors[0]" />
							</validation-provider>
							<validation-provider
								class="input__box column ml-2"
								rules="required"
								name="Tytuł"
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
							</validation-provider>
						</div>
						<div class="input__container--right">
							<validation-provider
								class="input__box input__box--small"
								rules="required|numeric"
								name="Kwota"
								v-slot="{ errors }"
							>
								<label for="amount">Kwota</label>
								<input
									v-model="plannedTransfer.amount"
									class="input__main"
									name="amount"
									type="number"
								/>
								<input-error left :error="errors[0]" />
							</validation-provider>
						</div>
						<div class="actions--container">
							<button :disabled="invalid" class="btn btn--auto mt-5">
								Wykonaj
							</button>
						</div>
					</form>
				</validation-observer>
			</div>
		</transition>
	</section>
</template>

<script>
	export default {
		name: "AccountPlannedTransfers",
		data() {
			return {
				loading: false,
				makePlannedTransfer: false,
				plannedTransfer: {
					date: Date.now(),
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
		components: {},
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