<template>
	<div class="widget--margin">
		<div class="widget--title">
			<div>
				Stan konta w tym miesiącu
			</div>
			<i @click="$emit('delete')" class="material-icons cp">delete</i>
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
	import accountService from "@/services/AccountService";
	export default {
		name: "AccountStatsWidget",
		data() {
			return {
				stats: null
			};
		},
		components: {},
		created() {
			const accountsPromises = this.user.accounts.map(account => accountService.getAccountStats(account));
			Promise.all(accountsPromises)
				.then(stats => {
					[this.stats] = stats;
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
