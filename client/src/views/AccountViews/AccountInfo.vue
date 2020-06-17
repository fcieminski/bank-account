<template>
	<section class="account">
		<div v-if="!loading" class="account__info-box">
			<div class="info-box__account-data">
				<span>{{ user.name }} {{ user.surname }}</span>
				<div class="d-flex align-center">
					<div id="account-number" class="mr-2">
						{{ account.accountNumber | formatAccountNumber }}
					</div>
					<i @click="copyAccountNumber" class="material-icons icon--xsmall cp">file_copy</i>
					<transition name="fade">
						<small v-if="copiedInfo" class="ml-2">{{ copiedInfo }}</small>
					</transition>
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
						<div class="small--box text--white">
							<i class="material-icons icon--white">account_balance</i>
							Oszczędności
						</div>
						<div class="content__info">
							Twoje oszczędności
						</div>
					</div>
					<div class="content-box">
						<div @click="generateBlik" class="small--box text--white">
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
		<dialog-modal
			:show="modal"
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
						....
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
	import { mapState } from "vuex";
	export default {
		name: "AccountInfo",
		data() {
			return {
				history: null,
				account: null,
				loading: false,
				copiedInfo: "",
				modal: false,
				publicPath: process.env.BASE_URL,
				blikCode: null,
				interval: null,
				blikProgress: null
			};
		},
		components: {
			History
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
			copyAccountNumber() {
				const ele = document.querySelector("#account-number");
				const field = document.createElement("textarea");
				field.setAttribute("readonly", "");
				field.value = `Mój numer konta w Purple Banku to: ${ele.textContent.trim()}`;
				document.body.appendChild(field);
				field.select();
				document.execCommand("copy");
				document.body.removeChild(field);
				this.copiedInfo = "Zawartość skopiowana!";
				setTimeout(() => {
					this.copiedInfo = null;
				}, 2000);
			},
			generateBlik() {
				this.blikCode = Math.floor(Math.random() * 900000 + 100000);
				this.modal = true;
				this.blikProgress = 100;
				this.interval = setInterval(() => {
					if (this.blikProgress === 0) {
						clearInterval(this.interval);
					}
					this.blikProgress--;
					console.log(this.blikProgress);
				}, 200);
			}
		},
		filters: {
			addSeparator(val) {
				return val.toString().replace(/(.{3})/, "$1 ");
			},
			formatAccountNumber(val) {
				return val
					.toString()
					.split("")
					.reverse()
					.join("")
					.replace(/[^\dA-Z]/g, "")
					.replace(/(.{4})/g, "$1 ")
					.split("")
					.reverse()
					.join("")
					.trim();
			}
		}
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
		}
	}
</style>