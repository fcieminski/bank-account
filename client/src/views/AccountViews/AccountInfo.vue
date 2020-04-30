<template>
	<section class="account">
		<div class="account__info-box">
			<div class="info-box__account-data">
				<div>{{ user.name }} {{ user.surname }}</div>
				<div>54 2490 0005 0627 1988 8043 1753</div>
			</div>
			<div class="info-box__account-content">
				<div class="account-content_account-balance">
					<div class="big--box">
						<div class="text--white">
							Stan konta
						</div>
						<div class="text--white">{{ account.balance }} PLN</div>
					</div>
				</div>
                <div class="divider"></div>
				<div class="account-content__content">
					<div class="content-box">
						<div class="small--box text--white">
							Karty
						</div>
						<div class="content__info">
							Twoje karty
						</div>
					</div>
					<div class="content-box">
						<div class="small--box text--white">
							Oszczędności
						</div>
						<div class="content__info">
							Twoje oszczędności
						</div>
					</div>
					<div class="content-box">
						<div class="small--box text--white">
							Blik
						</div>
						<div class="content__info">
							Wygeneruj kod blik
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="account__history-box">
			history
		</div>
		<div class="account__more-box">
			more
		</div>
	</section>
</template>

<script>
	import accountService from "../../services/AccountService";
	import { mapState } from "vuex";
	export default {
		name: "AccountInfo",
		data() {
			return {
				account: null
			};
		},
		components: {},
		created() {
			const user = JSON.parse(localStorage.getItem("user"));
			accountService
				.getUserAccount({ owner: user })
				.then(response => {
					this.account = response.user.account;
				})
				.catch(error => {
					console.error("error!");
				});
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
		grid-template-rows: repeat(3, 1fr);
		grid-template-areas:
			"info info info"
			"info info info"
			"history history more";
		.account__info-box {
			grid-area: info;
			// border-bottom: 1px solid #a954ee;
		}
		.account__history-box {
			grid-area: history;
		}
		.account__more-box {
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
</style>