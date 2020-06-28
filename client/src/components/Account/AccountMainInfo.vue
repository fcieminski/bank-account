<template>
	<div class="account-content__account-balance">
		<div class="big--box">
			<i class="material-icons icon--white icon--big">{{ icon }}</i>
			<div class="text--white">
				Stan konta
			</div>
			<div class="text--white">{{ account.balance }} PLN</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "AccountMainInfo",
		props: {
			account: {
				type: Object,
				default: () => {}
			},
			icon: {
				type: String,
				default: "account_balance"
			}
		}
	};
</script>

<style lang='scss' scoped>
	.account-content__account-balance {
		display: flex;
		justify-content: center;
		flex: 1;
		.big--box {
			box-shadow: $mainShadow;
			height: 250px;
			width: 250px;
			border-radius: 10px;
			background: linear-gradient(90deg, rgba(169, 84, 238, 1) 0%, rgba(92, 85, 240, 1) 100%);
			font-size: 30px;
			padding: 20px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			flex-direction: column;
			margin: 20px;
		}
	}
</style>