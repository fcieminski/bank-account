<template>
	<section class="savings">
		<div v-if="!loading">
			<div>Oszczędności</div>
			<div class="horizontal--divider"></div>
			<section>
				<section class="d-flex" v-if="savingAccount">
					<div class="column">
						<copy-info :account="savingAccount" />
						<account-main-info :account="savingAccount" />
					</div>
					<div class="column">
						hello
					</div>
				</section>
				<section v-else>
					<div class="d-flex align-center">
						<i class="material-icons mr-2">account_balance</i>
						Nie masz żadnego konta oszczędnościowego. Załóż je teraz i zacznij oszczędzać!
					</div>
					<button class="btn btn--auto mt-5" @click="createNewAccount">Złóż wniosek</button>
					<div class="mt-5" v-if="creatingAccount">
						Przygotowywanie Twojego wniosku, nie wyłączaj tej strony{{ dots }}
					</div>
				</section>
			</section>
		</div>
	</section>
</template>

<script>
	import accountService from "@/services/AccountService";
	import AccountMainInfo from "@/components/Account/AccountMainInfo";
	import CopyInfo from "@/components/utils/CopyInfo";
	import { mapState } from "vuex";
	export default {
		name: "AccountSavings",
		data() {
			return {
				loading: false,
				creatingAccount: false,
				dots: "",
				iteration: 0,
				interval: null,
				savingAccount: null
			};
		},
		components: { AccountMainInfo, CopyInfo },
		created() {
			this.loading = true;
			accountService
				.getUserAccounts(this.user._id)
				.then(data => {
					this.savingAccount = data.find(account => account.type === "savings");
				})
				.catch(() => {
					console.warn("error");
				})
				.finally(() => {
					this.loading = false;
				});
		},
		computed: {
			...mapState(["user"])
		},
		methods: {
			createNewAccount() {
				this.creatingAccount = true;
				if (!this.interval) {
					this.interval = setInterval(this.createDots, 300);
					setTimeout(this.sendAccountInfo, 5000);
				}
			},
			createDots() {
				const allDots = [".", ".", ".", "."];
				if (this.iteration !== allDots.length) {
					this.dots += allDots[this.iteration];
					this.iteration++;
				} else {
					this.dots = "";
					this.iteration = 0;
				}
			},
			sendAccountInfo() {
				clearInterval(this.interval);
				accountService
					.create({
						description: "Konto złotówa",
						type: "savings"
					})
					.then(data => {
						this.savingAccount = data;
						this.creatingAccount = false;
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.savings {
		margin-top: 30px;
	}
</style>
