<template>
	<div>
		<div>
			<h3>Zarejestruj swoje konto</h3>
			<div></div>
		</div>
		<form class="signup__form" @submit="check($event)" action="">
			<label for="name">Imię</label>
			<input type="text" name="name" />
			<label for="surname">Nazwisko</label>
			<input type="text" name="surname" />
			<label for="email">Adres e-mail</label>
			<input type="text" name="email" />
			<label for="phone">Numer telefonu</label>
			<input type="text" name="phone" />
			<label for="password">Hasło</label>
			<i class="material-icons">{{ reveal ? "visibility_off" : "visibility" }}</i>
			<input :type="reveal ? 'text' : 'password'" name="password" />
			<button type="submit"></button>
		</form>
	</div>
</template>

<script>
	export default {
		name: "BankSignup",
		data() {
			return {
				reveal: false
			};
		},
		components: {},
		created() {},
		computed: {},
		methods: {
			check(e) {
				e.preventDefault();
				console.log(document.forms[0].elements);
				console.log(e.elements);
			}
		}
	};
</script>

<style lang='scss' scoped>
	.signup__form {
	}
</style>