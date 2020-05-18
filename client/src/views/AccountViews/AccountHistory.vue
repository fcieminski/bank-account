<template>
	<section class="history">
		<div v-if="!loading">
			<div>Historia</div>
			<div class="horizontal--divider"></div>
			<section>
				<history v-if="history" :history="history" />
				<div class="d-flex align-center" v-else>
					<i class="material-icons mr-2">history</i>
					Twoja historia jest pusta, wkonaj pierwszy
					<router-link class="link__inline ml-2" to="/">przelew!</router-link>
				</div>
			</section>
		</div>
		<loading-indicator v-else-if="!history && !error" />
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
				.getHistory(this.user._id, "?limit=10&offset=10")
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