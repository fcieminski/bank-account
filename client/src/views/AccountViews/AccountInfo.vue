<template>
	<section class="account">
		<div v-if="!loading" class="account__info-box">
			<copy-info :account="account" />
			<div class="info-box__account-content">
				<account-main-info :account="account" />
				<div class="divider"></div>
				<div class="account-content__content">
					<div class="content-box">
						<router-link :to="{ name: 'account.cards' }" class="cp small--box text--white">
							<i class="material-icons icon--white">credit_card</i>
							<span>
								Karty
							</span>
							<span v-if="this.account.cards.length !== 0">
								{{ this.account.cards.length }}
							</span>
						</router-link>
						<div class="content__info">
							Twoje karty
						</div>
					</div>
					<div class="content-box">
						<router-link :to="{ name: 'account.savings' }" class="small--box text--white cp">
							<i class="material-icons icon--white">account_balance</i>
							Oszczędności
						</router-link>
						<div class="content__info">
							Twoje oszczędności
						</div>
					</div>
					<div class="content-box">
						<div @click="generateBlik" class="small--box text--white cp">
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
		<history v-if="!loading" :history="history" :more-info="false" />
		<div class="d-flex align-center" v-else-if="!history">
			<i class="material-icons mr-2">history</i>
			Twoja historia jest pusta, wkonaj pierwszy
			<router-link class="link__inline ml-2" to="/">przelew!</router-link>
		</div>
		<loading-indicator v-else />
		<widgets-section v-if="!loading" />
		<loading-indicator v-else />
		<dialog-modal
			:show="modal"
			@no="generateBlik"
			@yes="closeModal"
			:modal="{
				text: 'Twój kod BLIK',
				yes: 'Zamknij',
				no: 'Generuj nowy'
			}"
		>
			<div>
				<div class="blik">
					<span class="blik__title">Kod</span>
					<img class="blik__logo" :src="`${publicPath}img/logo-blik.png`" alt="logo-blik" />
				</div>
				<div class="code">
					<div v-if="blikCode" class="code__number">
						{{ blikCode | addSeparator }}
					</div>
					<div class="code__progress">
						<div class="progress" :style="`width: ${blikProgress}%`"></div>
					</div>
					<small class="code__info">
						Wpisz swój kod blik, aby wykonać szybki przelew
					</small>
				</div>
			</div>
		</dialog-modal>
	</section>
</template>

<script>
	import accountService from "@services/AccountService";
	import historyService from "@services/HistoryService";
	import History from "@/components/Account/History";
	import AccountMainInfo from "@/components/Account/AccountMainInfo";
	import CopyInfo from "@/components/utils/CopyInfo";
	import WidgetsSection from "@/components/Account/WidgetsSection";
	import { mapState } from "vuex";
	export default {
		name: "AccountInfo",
		data() {
			return {
				history: null,
				account: null,
				loading: false,
				modal: false,
				publicPath: process.env.BASE_URL,
				blikCode: null,
				interval: null,
				blikProgress: null
			};
		},
		components: {
			History,
			WidgetsSection,
			AccountMainInfo,
			CopyInfo
		},
		async created() {
			this.loading = true;
			try {
				const account = await accountService.findUserAccount(this.user._id);
				const { history } = await historyService.getHistory(this.user._id, "?limit=4");
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
		methods: {
			generateBlik() {
				this.blikCode = Math.floor(Math.random() * 900000 + 100000);
				this.modal = true;
				this.blikProgress = 100;
				if (!this.interval) {
					this.interval = setInterval(() => {
						if (this.blikProgress === 0) {
							clearInterval(this.interval);
							return;
						}
						this.blikProgress--;
					}, 200);
				}
			},
			closeModal() {
				this.modal = false;
				clearInterval(this.interval);
				this.interval = null;
			}
		},
		filters: {
			addSeparator(val) {
				return val.toString().replace(/(.{3})/, "$1 ");
			}
		}
	};
</script>

<style lang="scss" scoped>
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

		.info-box__account-content {
			display: flex;
			justify-content: center;
			align-items: center;
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
	}
	.blik {
		display: flex;
		justify-content: center;
		align-items: center;
		.blik__title {
			margin-right: 10px;
			font-size: 30px;
		}
		.blik__logo {
			width: 100px;
		}
	}
	.code {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.code__number {
			font-size: 60px;
		}
		.code__progress {
			width: 210px;
			border-radius: 4px;
			background-color: #80808030;
			.progress {
				transition: width 0.2s linear;
				width: 0;
				height: 10px;
				background-color: $mainColor;
			}
		}
		.code__info {
			margin-top: 5px;
			font-size: 13px;
		}
	}
</style>
