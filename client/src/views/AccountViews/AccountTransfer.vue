<template>
	<section class="transfer">
		<div>Wykonaj Przelew</div>
		<div class="horizontal--divider"></div>
		<div class="transfer__container">
			<div class="container__account">
				<div>
					Wybierz konto
				</div>
				<div @click="makeActiveAccount" class="account--name">
					{{ account.description }}
				</div>
			</div>
            <div class="divider mr-5 ml-5"></div>
			<div class="container__data">
				<transition name="fade" mode="out-in">
					<div :key="1" v-if="!activeAccount" class="d-flex align-center info--data">
						<i class="material-icons mr-2">error</i>Najpierw wybierz konto!
					</div>
					<div :key="2" v-else>
						<validation-observer v-slot="{ invalid }">
							<form @submit.prevent="" action="">
								<validation-provider
									class="input__box"
									rules="required"
									name="Numer konta"
									v-slot="{ errors }"
								>
									<label for="accountNumber">Numer konta</label>
									<input class="input__main" name="accountNumber" type="number" />
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
									<textarea class="input__main" name="title" type="text" />
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
										<input class="input__main" name="amount" type="number" />
										<input-error left :error="errors[0]" />
									</validation-provider>
								</div>
								<div class="actions--container">
									<div :disabled="invalid" class="btn pa-2">
										Wykonaj
									</div>
								</div>
							</form>
						</validation-observer>
					</div>
				</transition>
			</div>
		</div>
	</section>
</template>

<script>
	import accountService from "@services/AccountService";
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
				activeAccount: null
			};
		},
		components: {
			InputError
		},
		created() {},
		computed: {
			...mapState(["user", "account"])
		},
		methods: {
			makeActiveAccount(event) {
				this.activeAccount = this.account;
				event.target.classList.toggle("active");
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