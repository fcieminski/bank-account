<template>
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
</template>

<script>
	import { mapState } from "vuex";

	export default {
		name: "CopyInfo",
		data() {
			return {
				copiedInfo: ""
			};
		},
		props: {
			account: {
				type: Object,
				default: () => {}
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
			}
		},
		filters: {
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
	.info-box__account-data {
		div {
			font-size: 1rem;
		}
	}
</style>