<template>
	<section class="savings">
		<div v-if="!loading">
			<div>Oszczędności</div>
			<div class="horizontal--divider"></div>
			<section>
				<section v-if="savingAccount">
					<div class="info-box__account-data">
						<span>{{ user.name }} {{ user.surname }}</span>
						<div class="d-flex align-center">
							<div id="account-number" class="mr-2">
								{{ savingAccount.accountNumber | formatAccountNumber }}
							</div>
							<i @click="copyAccountNumber" class="material-icons icon--xsmall cp">file_copy</i>
							<transition name="fade">
								<small v-if="copiedInfo" class="ml-2">{{ copiedInfo }}</small>
							</transition>
						</div>
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
	import { mapState } from "vuex";
	export default {
		name: "AccountSavings",
		data() {
			return {
				loading: false,
				creatingAccount: false,
				dots: "",
				iteration: 0,
				copiedInfo: "",
				interval: null,
				savingAccount: null
			};
		},
		components: {},
		created() {

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
			},
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
			}
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
	};
</script>

<style lang="scss" scoped>
	.savings {
		margin-top: 30px;
	}
</style>
