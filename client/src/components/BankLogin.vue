<template>
	<div>
		<div>
			<div class="login__title">
				<h3 class="title__text">Zaloguj się do bankowości</h3>
				<div class="title__">
					<div for="login">Login</div>
					<input class="title__input" name="login" type="text" />
				</div>
			</div>
			<div class="input__password"></div>
		</div>
	</div>
</template>

<script>
	import authService from "../services/AuthService";
	export default {
		name: "BankLogin",
		data() {
			return {};
		},
		components: {},
		created() {},
		computed: {
			passwordProtect() {
				return Array.from({ length: 15 }).map(ele => Math.floor(Math.random() * 2));
			}
		},
		methods: {
			makeUser() {
				authService
					.create({
						email: "test@tesx.pl",
						username: "KOWALe",
						surname: "Kowalski",
						name: "Piotr",
						phone: "784514555",
						password: "qwerty"
					})
					.then(respon => console.log(respo))
					.catch(err => console.log(err));
			}
		}
	};
</script>

<style lang='scss' scoped>

	.login__title {
		text-align: center;
		margin-bottom: 36px;
	}
	.title__text {
		font-size: 2rem;
		margin: 0 0 20px 0;
	}
	.title__input {
		height: 56px;
		padding: 20px;
		font-size: 1rem;
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
</style>