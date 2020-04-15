<template>
	<div class="login">
		<div>
			<div class="login__title">
				<h3 class="title__text">Zaloguj się do bankowości</h3>
				<div class="title__">
					<div for="login">Login</div>
					<input class="title__input" name="login" type="text" />
				</div>
			</div>
			<div class="input__password">
				<div class="password__box" v-for="(password, index) in passwordProtect" :key="index">
					<input
						masked
						class="input--protect input--available"
						maxlength="1"
						type="password"
						v-if="password"
						:val="index"
						:ref="`input-${index}`"
					/>
					<div class="input--protect input--disabled" v-else></div>
				</div>
			</div>
			<button @click="makeUser">Log in</button>
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
						email: "test@tes.pl",
						username: "KOWAL",
						surname: "Kowalski",
						name: "Piotr",
                        phone: "784514555",
                        password: 'qwerty'
					})
					.then(respon => console.log(respo))
					.catch(err => console.log(err));
			}
		}
	};
</script>

<style lang='scss' scoped>
	.login {
		width: auto;
		height: 400px;
		background-color: white;
		border-radius: 4px;
		padding: 30px;
	}
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
	.input--protect {
		width: 20px;
		height: 20px;
		border-radius: 25%;
		background-color: white;
		border: 1px solid black;
		&.input--disabled {
			background-color: gray;
		}
		&.input--available {
			font-size: 1.4rem;
			text-align: center;
			width: 30px;
			height: 40px;
		}
	}
</style>