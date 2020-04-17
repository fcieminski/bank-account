<template>
	<div>
		<div>
			<h2>Zarejestruj swoje konto</h2>
			<div></div>
		</div>
		<validation-observer v-slot="{ invalid }">
			<form class="signup__form" @submit.prevent="submitForm($event)" action="">
				<validation-provider rules="required|alpha" name="Imię" v-slot="{ errors }">
					<label for="name">Imię</label>
					<input v-model="newUser.name" type="text" name="name" />
					<span>{{ errors[0] }}</span>
				</validation-provider>
				<validation-provider rules="required|alpha" name="Nazwisko" v-slot="{ errors }">
					<label for="surname">Nazwisko</label>
					<input v-model="newUser.surname" type="text" name="surname" />
					<span>{{ errors[0] }}</span>
				</validation-provider>
				<span v-if="username">{{ username }}</span>
				<validation-provider rules="required|email" name="Adres e-mail" v-slot="{ errors }">
					<label for="email">Adres e-mail</label>
					<input v-model="newUser.email" type="text" name="email" />
					<span>{{ errors[0] }}</span>
				</validation-provider>
				<validation-provider rules="required" name="Numer telefonu" v-slot="{ errors }">
					<label for="phone">Numer telefonu</label>
					<input v-model.number="newUser.phone" min="0" type="number" name="phone" />
					<span>{{ errors[0] }}</span>
				</validation-provider>
				<validation-provider rules="required" name="Hasło" v-slot="{ errors }">
					<label for="password">Hasło</label>
					<i @click="reveal = !reveal" class="cp material-icons">{{
						reveal ? "visibility_off" : "visibility"
					}}</i>
					<input v-model="newUser.password" :type="reveal ? 'text' : 'password'" name="password" />
					<span>{{ errors[0] }}</span>
				</validation-provider>
				<button :disabled="invalid" type="submit">Wyślij</button>
			</form>
			<button @click="checkAuth">isAuth?</button>
		</validation-observer>
	</div>
</template>

<script>
	import { extend } from "vee-validate";
	import { required, email, alpha } from "vee-validate/dist/rules";
	import authService from "../services/AuthService";

	extend("required", {
		...required,
		message: "This field is required"
	});
	extend("email", { ...email });
	extend("alpha", { ...alpha });

	export default {
		name: "BankSignup",
		data() {
			return {
				reveal: false,
				newUser: {
					name: "",
					password: "",
					email: "",
					surname: "",
					phone: ""
				},
				error: null
			};
		},
		components: {},
		created() {},
		computed: {
			username() {
				if (this.newUser.name && this.newUser.surname) {
					return this.newUser.name
						.substr(0, 3)
						.concat(this.newUser.surname.substr(0, 3))
						.toUpperCase();
				}
				return null;
			}
		},
		methods: {
			submitForm(e) {
				this.newUser.username = this.username;
				authService
					.create(this.newUser)
					.then(({ data }) => {
						console.log(data);
					})
					.catch(({ message }) => {
						this.error = message;
					});
			},
			checkAuth() {
				authService.doLogin({
					username: "FILCHA",
					password: "qwerty"
				});
			}
		}
	};
</script>

<style lang='scss' scoped>
	.signup__form {
	}
	label {
		display: block;
	}
</style>