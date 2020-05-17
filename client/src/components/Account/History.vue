<template>
	<div class="account__history-box">
		<div v-if="history">
			<div class="history-box__element" v-for="element in history" :key="element._id">
				<div class="element__about">
					<div>{{ new Date(element.date).toLocaleDateString() }}</div>
					<div class="wrap--text">{{ element.to.name }}</div>
					<div class="wrap--text">{{ element.accountType }}</div>
					<div class="wrap--text text--end" :class="{ 'amount--less': element.type !== 'transfer' }">
						{{ element.type === "transfer" ? "" : "-" }} {{ element.amount }} {{ element.currency }}
					</div>
				</div>
				<div>{{ element.title }}</div>
			</div>
		</div>
		<div class="d-flex align-center" v-else>
			<i class="material-icons mr-2">history</i>
			Twoja historia jest pusta, wkonaj pierwszy
			<router-link class="link__inline ml-2" to="/">przelew!</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		name: "History",
		data() {
			return {};
		},
		props: {
			history: {
				type: Array,
				default: () => []
			}
		},
		components: {},
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.account__history-box {
		margin-top: 30px;
		padding-right: 16px;
		width: 100%;
		grid-area: history;
	}
	.history-box__element {
		&:first-of-type {
			padding: 0 0 16px 0;
		}
		padding: 16px 0;
		border-bottom: 2px solid $secondaryColor;
		.element__about {
			display: flex;
			margin-bottom: 10px;
			div {
				&:first-of-type {
					flex: 0;
					margin-right: 20px;
				}
				flex: 1;
				margin-right: 5px;
				font-size: 1rem;
			}
		}
	}
</style>