<template>
	<div>
		<div>
			<div class="login__title">
				<h3 class="title__text">Zaloguj się do bankowości</h3>
				<validation-observer v-slot="{ invalid }">
					<form class="login__form" @submit.prevent="logIn($event)" action="">
						<validation-provider class="input__box" rules="required" name="Login" v-slot="{ errors }">
							<label for="username">Login</label>
							<input v-model="user.username" class="input__main" name="username" type="text" />
							<div class="input__error">{{ errors[0] }}</div>
						</validation-provider>
						<validation-provider class="input__box" rules="required" name="Hasło" v-slot="{ errors }">
							<label for="password">Hasło</label>
							<input v-model="user.password" class="input__main" name="password" type="password" />
							<div class="input__error">{{ errors[0] }}</div>
						</validation-provider>
						<button class="btn btn__login" :disabled="invalid" type="submit">Zaloguj</button>
					</form>
				</validation-observer>
			</div>
			<div class="input__password"></div>
		</div>
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
		components: {},
		created() {},
		computed: {},
		methods: {
			logIn(e) {
				authService.doLogin(this.user).then(response => {
					if (response.redirect) {
						delete response.user.hash;
						delete response.user.salt;
						localStorage.setItem("user", JSON.stringify(response.user));
						this.$router.push({ name: "account" });
					} else {
						this.error = response.message;
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
		flex-direction: row;
	}
	.password__box {
		padding: 5px;
		display: flex;
		align-items: center;
	}
	.login__form {
		padding: 0 30px 30px 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		label {
			display: block;
			text-align: left;
			margin-bottom: 5px;
		}
		.input__box {
			margin-bottom: 20px;
			width: 100%;
		}
	}
</style>