<template>
	<div class="widget--margin">
		<div class="widget--title">
			Przelewy zaplanowane
		</div>
		<div v-if="plannedInfo && plannedInfo.amount > 0">
			<span class="pt-2">{{plannedInfo.date}}</span>
			<div class="d-flex justify-between pt-2">
				<span>Ilość: {{plannedInfo.items}}</span>
				<span>Łączna kwota: {{plannedInfo.amount}} zł</span>
			</div>
		</div>
	</div>
</template>

<script>
	import plannedTransferService from "@/services/PlannedTransferService";
	import { mapState } from "vuex";
	export default {
		name: "PlannedTransfersWidget",
		data() {
			return {
				plannedInfo: null
			};
		},
		components: {},
		created() {
			plannedTransferService
				.getUserPlannedTransfers(this.user._id)
				.then(data => {
					this.plannedInfo = data.reduce(
						(prev, curr) => {
							if (new Date(curr.date).getMonth === new Date().getMonth) {
								prev.date = curr.date;
								prev.amount += curr.amount;
								prev.items++;
							}
							return prev;
						},
						{ amount: 0, date: "", items: 0 }
					);
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