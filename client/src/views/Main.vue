<template>
	<div class="main">
		<div class="login">
			<bank-login />
		</div>
	</div>
</template>

<script>
	import BankLogin from "@/components/BankLogin.vue";
	export default {
		name: "Main",
		data() {
			return {};
		},
		components: {
			BankLogin
		},
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background-image: url(../../public/img/bg_2.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login {
		width: auto;
		height: auto;
		background-color: white;
		border-radius: 10px;
        padding: 30px;
		border: 1px solid $mainColor;
	}
</style>