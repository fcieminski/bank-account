<template>
	<div class="account__more-box">
		<div class="more-box__widgets">
			<planned-transfers-widget />
			<account-status-widget />
		</div>
		<div class="actions--container">
			<div class="btn pa-2">
				dodaj widget
			</div>
		</div>
	</div>
</template>

<script>
	import PlannedTransfersWidget from "./Widgets/PlannedTransfersWidget";
	import AccountStatusWidget from "./Widgets/AccountStatusWidget";
	export default {
		name: "WidgetsSection",
		data() {
			return {};
		},
		components: {
			PlannedTransfersWidget,
			AccountStatusWidget
		},
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.account__more-box {
		margin-top: 30px;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		grid-area: more;
		.more-box__widgets {
			.widget--margin {
				margin-bottom: 16px;
			}
			.widget--title {
				line-height: 18px;
				margin-bottom: 5px;
			}
		}
	}
</style>