<template>
	<section class="account">
		<div v-if="!loading" class="account__info-box">
			<div class="info-box__account-data">
				<span>{{ user.name }} {{ user.surname }}</span>
				<div class="d-flex align-center">
					<div class="mr-2">
						54 2490 0005 0627 1988 8043 1753
					</div>
					<i class="material-icons icon--xsmall">file_copy</i>
				</div>
			</div>
			<div class="info-box__account-content">
				<div class="account-content_account-balance">
					<router-link tag="div" :to="{ name: 'account.transfer' }" class="cp big--box">
						<i class="material-icons icon--white icon--big">account_balance_wallet</i>
						<div class="text--white">
							Stan konta
						</div>
						<div class="text--white">{{ account.balance }} PLN</div>
					</router-link>
				</div>
				<div class="divider"></div>
				<div class="account-content__content">
					<div class="content-box">
						<div class="small--box text--white">
							<i class="material-icons icon--white">credit_card</i>
							Karty
						</div>
						<div class="content__info">
							Twoje karty
						</div>
					</div>
					<div class="content-box">
						<div class="small--box text--white">
							<i class="material-icons icon--white">account_balance</i>
							Oszczędności
						</div>
						<div class="content__info">
							Twoje oszczędności
						</div>
					</div>
					<div class="content-box">
						<div class="small--box text--white">
							<i class="material-icons icon--white">smartphone</i>
							Blik
						</div>
						<div class="content__info">
							Wygeneruj kod blik
						</div>
					</div>
				</div>
			</div>
		</div>
		<loading-indicator v-else />
		<history v-if="!loading" :history="history" />
		<div class="d-flex align-center" v-else-if="!history">
			<i class="material-icons mr-2">history</i>
			Twoja historia jest pusta, wkonaj pierwszy
			<router-link class="link__inline ml-2" to="/">przelew!</router-link>
		</div>
		<loading-indicator v-else />
		<div v-if="!loading" class="account__more-box">
			<div class="more-box__widgets">
				<div class="widget--margin">
					<div class="widget--title">
						Przelewy zaplanowane
					</div>
					<div>
						<span class="pt-2">MAJ 2020</span>
						<div class="d-flex justify-between pt-2">
							<span>Ilość: 3</span>
							<span>Łączna kwota: 549 zł</span>
						</div>
					</div>
				</div>
				<div class="widget--margin">
					<div class="widget--title">
						Stan konta w tym miesiącu
					</div>
					<div>
						<div class="d-flex justify-between pt-2">
							<span>Przychód:</span>
							<span>6542 zł</span>
						</div>
						<div class="d-flex justify-between pt-2">
							<span>Wydatki:</span>
							<span class="amount--less">- 3210 zł</span>
						</div>
					</div>
				</div>
			</div>
			<div class="actions--container">
				<div class="btn pa-2">
					dodaj widget
				</div>
			</div>
		</div>
		<loading-indicator v-else />
	</section>
</template>

<script>
	import accountService from "@services/AccountService";
	import historyService from "@services/HistoryService";
	import History from "@/components/Account/History";
	import { mapState } from "vuex";
	export default {
		name: "AccountInfo",
		data() {
			return {
				history: null,
				account: null,
				loading: false
			};
		},
		components: {
			History
		},
		async created() {
			this.loading = true;
			try {
				const account = await accountService.findUserAccount(this.user._id);
				const history = await historyService.getHistory(this.user._id, "?limit=4");
				this.history = history;
				this.account = account;
			} catch {
				console.error("error!");
			} finally {
				this.loading = false;
			}
		},
		computed: {
			...mapState(["user"])
		},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	.account {
		margin-top: 30px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, auto);
		grid-template-areas:
			"info info info"
			"info info info"
			"history history more";
		.account__info-box {
			grid-area: info;
		}

		.account__more-box {
			margin-top: 30px;
			padding-left: 16px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			grid-area: more;
		}
		.info-box__account-data {
			div {
				font-size: 1rem;
			}
		}
		.info-box__account-content {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.account-content_account-balance {
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
		.account-content__content {
			display: flex;
			justify-content: center;
			flex: 1;

			.small--box {
				box-shadow: $mainShadow;
				height: 100px;
				width: 100px;
				border-radius: 10px;
				background: linear-gradient(90deg, rgba(169, 84, 238, 1) 0%, rgba(92, 85, 240, 1) 100%);
				font-size: 30px;
				padding: 20px;
				font-size: 1rem;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				flex-direction: column;
			}

			.content-box {
				width: 100px;
				text-align: center;
				&:nth-child(even) {
					margin: 20px;
				}
				.content__info {
					margin-top: 10px;
					font-size: 0.8rem;
				}
			}
		}

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