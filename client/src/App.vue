<template>
	<div id="app">
		<router-view />
	</div>
</template>


<script>
	import accountService from "@services/AccountService";
	export default {
		created() {
			if (localStorage.getItem("user")) {
				const data = JSON.parse(localStorage.getItem("user"));
                this.$store.dispatch("setUser", data);
			} else {
				this.$router.push("/");
			}
		}
	};
</script>

<style lang="scss">
	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
</style>
