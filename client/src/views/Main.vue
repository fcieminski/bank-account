<template>
	<div class="main">
		<div class="login">
			<bank-signup />
		</div>
	</div>
</template>

<script>
	import BankSignup from "@/components/BankSignup.vue";
	export default {
		name: "Main",
		data() {
			return {};
		},
		components: {
			BankSignup
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
		filter: opacity(60%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
    	.login {
		width: auto;
		height: 400px;
		background-color: white;
		border-radius: 4px;
		padding: 30px;
	}
</style>