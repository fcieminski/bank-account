<template>
	<section class="history">
		<div v-if="!loading">
			<div>Historia</div>
			<div class="horizontal--divider"></div>
			<section>
				<history :history="history" />
			</section>
		</div>
		<loading-indicator v-else />
		<div v-if="error">
			{{ error }}
		</div>
	</section>
</template>

<script>
	import { mapState } from "vuex";
	import historyService from "@services/HistoryService";
	import History from "@/components/Account/History";
	export default {
		name: "AccountHistory",
		data() {
			return {
				loading: false,
				history: null,
				error: null
			};
		},
		components: {
			History
		},
		created() {
			this.loading = true;
			historyService
				.getHistory(this.user._id)
				.then(data => {
					this.history = data;
				})
				.catch(() => {
					this.error = "Błąd ładowania danych!";
				})
				.finally(() => {
					this.loading = false;
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.history {
		margin-top: 30px;
	}
</style>