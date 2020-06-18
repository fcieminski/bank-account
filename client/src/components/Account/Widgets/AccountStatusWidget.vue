<template>
	<div class="widget--margin">
		<div class="widget--title">
			Stan konta w tym miesiącu
		</div>
		<div v-if="stats">
			<div class="d-flex justify-between pt-2">
				<span>Przychód:</span>
				<span>{{ stats.income }} zł</span>
			</div>
			<div class="d-flex justify-between pt-2">
				<span>Wydatki:</span>
				<span class="amount--less">- {{ stats.transfer }} zł</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import historyService from "@/services/HistoryService";
	export default {
		name: "AccountStatusWidget",
		data() {
			return {
				stats: null
			};
		},
		components: {},
		created() {
			historyService
				.getAccountStats(this.user._id)
				.then(data => {
					this.stats = data;
				})
				.catch(error => {
					console.warn(error);
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {}
	};
</script>

<style lang='scss' scoped>
</style>