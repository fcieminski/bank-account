<template>
	<div class="login__title">
		<h3 class="title__text">Zaloguj się do bankowości</h3>
		<validation-observer v-slot="{ invalid }">
			<form class="login__form" @submit.prevent="logIn($event)" action="">
				<validation-provider class="input__box" rules="required" name="Login" v-slot="{ errors }">
					<label for="username">Login</label>
					<input v-model="user.username" class="input__main" name="username" type="text" />
					<input-error left :error="errors[0]" />
				</validation-provider>
				<validation-provider class="input__box" rules="required" name="Hasło" v-slot="{ errors }">
					<label for="password">Hasło</label>
					<input v-model="user.password" class="input__main" name="password" type="password" />
					<input-error left :error="errors[0]" />
				</validation-provider>
				<button class="btn btn__login" :disabled="invalid" type="submit">Zaloguj</button>
				<div class="input__password">
					<router-link tag="span" :to="{ name: 'main.signup' }">
						Załóż konto
					</router-link>
					<span>
						Nie pamiętasz hasła?
					</span>
				</div>
			</form>
			<input-error center :error="error" />
		</validation-observer>
	</div>
</template>

<script>
	import { extend } from "vee-validate";
	import { required, email, alpha } from "vee-validate/dist/rules";
	import authService from "@/services/AuthService";
	import InputError from "@utils/InputError.vue";

	extend("required", {
		...required,
		message: "Pole obowiązkowe!"
	});

	export default {
		name: "BankLogin",
		data() {
			return {
				user: {
					username: "",
					password: ""
				},
				error: null
			};
		},
		components: {
			InputError
		},
		created() {},
		computed: {},
		methods: {
			logIn(e) {
				authService.signIn(this.user).then(response => {
					if (response.redirect) {
						delete response.user.hash;
						delete response.user.salt;
                        localStorage.setItem("user", JSON.stringify(response.user));
                        this.$store.dispatch('setUser', response.user);
						this.$router.push({ name: "account" });
					} else {
						this.error = response.message;
						setTimeout(() => {
							this.error = null;
						}, 2000);
					}
				});
			}
		}
	};
</script>

<style lang='scss' scoped>
	.login__title {
		text-align: center;
	}
	.title__text {
		font-size: 2rem;
		margin: 0 0 40px 0;
	}
	.input__password {
		display: flex;
		justify-content: space-between;
		text-align: right;
		span {
			font-size: 0.8rem;
		}
		width: 100%;
		margin-top: 5px;
	}
	.password__box {
		padding: 5px;
		display: flex;
		align-items: center;
	}
</style>