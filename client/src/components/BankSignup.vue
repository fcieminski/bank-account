<template>
	<div class="signup__title">
		<h3 class="title__text">Zarejestruj swoje konto</h3>
		<ValidationObserver v-slot="{ invalid }">
			<form class="signup__form" @submit.prevent="submitForm($event)" action="">
				<ValidationProvider class="input__box" rules="required|alpha" name="Imię" v-slot="{ errors }">
					<label for="name">Imię</label>
					<input class="input__main" v-model="newUser.name" type="text" name="name" />
					<input-error left :error="errors[0]" />
				</ValidationProvider>
				<ValidationProvider class="input__box" rules="required|alpha" name="Nazwisko" v-slot="{ errors }">
					<label for="surname">Nazwisko</label>
					<input class="input__main" v-model="newUser.surname" type="text" name="surname" />
					<input-error left :error="errors[0]" />
				</ValidationProvider>
				<ValidationProvider class="input__box" rules="required" name="Login" v-slot="{ errors }">
					<label for="username">Kod pin</label>
					<input
						class="input__main"
						v-model.number="newUser.username"
						v-mask="['########']"
						type="text"
						name="username"
					/>
					<input-error left :error="errors[0]" />
				</ValidationProvider>
				<ValidationProvider class="input__box" rules="required|email" name="Adres e-mail" v-slot="{ errors }">
					<label for="email">Adres e-mail</label>
					<input class="input__main" v-model="newUser.email" type="text" name="email" />
					<input-error left :error="errors[0]" />
				</ValidationProvider>
				<ValidationProvider class="input__box" rules="required" name="Hasło" v-slot="{ errors }">
					<label for="password">Hasło</label>
					<div class="password__reveal">
						<i @click="reveal = !reveal" class="cp material-icons">{{
							reveal ? "visibility_off" : "visibility"
						}}</i>
						<input
							class="input__main"
							v-model="newUser.password"
							:type="reveal ? 'text' : 'password'"
							name="password"
						/>
					</div>
					<input-error left :error="errors[0]" />
				</ValidationProvider>
				<button class="btn btn__login" :disabled="invalid" type="submit">Wyślij</button>
			</form>
		</ValidationObserver>
	</div>
</template>

<script>
	import userService from "../services/UserService";
	import accountService from "../services/AccountService";
	import InputError from "@utils/InputError.vue";

	export default {
		name: "BankSignup",
		data() {
			return {
				reveal: false,
				newUser: {
					name: "",
					password: "",
					username: "",
					email: "",
					surname: "",
					phone: "",
				},
				error: null,
			};
		},
		components: {
			InputError,
		},
		methods: {
			submitForm(e) {
				userService
					.create(this.newUser)
					.then((response) => {
						if (response.redirect) {
							delete response.user.hash;
							delete response.user.salt;
							localStorage.setItem("user", JSON.stringify(response.user));
							this.$store.dispatch("setUser", response.user);
							this.$router.push({ name: "account.start" });
						}
					})
					.catch(({ message }) => {
						this.error = message;
					});
			},
		},
	};
</script>

<style lang='scss' scoped>
	.signup__title {
		text-align: center;
	}
	.title__text {
		font-size: 2rem;
		margin: 0 0 40px 0;
	}
	label {
		display: block;
	}
	.password__reveal {
		position: relative;
		.material-icons.cp {
			position: absolute;
			right: 13px;
			top: 13px;
		}
		.input__main {
			padding-right: 40px;
		}
	}
</style>