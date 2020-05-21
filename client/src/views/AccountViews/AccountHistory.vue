<template>
	<section class="history">
		<div v-if="!loading">
			<div>Historia</div>
			<div class="horizontal--divider"></div>
			<section class="pr">
				<history v-if="history" :history="history" />
				<div class="d-flex align-center" v-else>
					<i class="material-icons mr-2">history</i>
					Twoja historia jest pusta, wkonaj pierwszy
					<router-link class="link__inline ml-2" to="/">przelew!</router-link>
				</div>
				<div v-if="loadingMoreHistory" class="loading__box">
					<loading-indicator />
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
				error: null,
				limit: 0,
				offset: 0,
				pagination: 0,
				loadingMoreHistory: false
			};
		},
		components: {
			History
		},
		created() {
			this.loading = true;
			historyService
				.getHistory(this.user._id, `?limit=10&offset=0`)
				.then(data => {
					this.history = data.history;
					this.pagination = data.pagination;
					document.addEventListener("scroll", this.loadMore);
				})
				.catch(() => {
					this.error = "Błąd ładowania danych!";
				})
				.finally(() => {
					this.loading = false;
				});
		},
		mounted() {},
		computed: {
			...mapState(["user"])
		},
		methods: {
			loadMore(e) {
				const { target } = e;
				if (
					window.scrollMaxY - 10 < window.scrollY &&
					!this.loadingMoreHistory &&
					this.history.length !== this.pagination
				) {
					this.limit += 5;
					this.offset = this.history.length;
					this.loadingMoreHistory = true;
					historyService
						.getHistory(this.user._id, `?limit=${this.limit}&offset=${this.offset}`)
						.then(data => {
							this.history.push(...data.history);
						})
						.catch(() => {
							this.error = "Błąd ładowania danych!";
						})
						.finally(() => {
							this.loadingMoreHistory = false;
						});
				}
			},
		}
	};
</script>

<style lang='scss' scoped>
	.history {
		margin-top: 30px;
	}
</style>