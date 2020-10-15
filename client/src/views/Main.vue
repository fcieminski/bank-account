<template>
	<div class="main">
		<div class="login">
			<router-view />
		</div>
	</div>
</template>

<script>
	export default {
		name: "Main",
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
		transform: translateX(0);
		width: auto;
		height: auto;
		background-color: white;
		border-radius: 10px;
		padding: 30px;
		border: 1px solid $mainColor;
	}
</style>