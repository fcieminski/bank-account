<template>
	<div class="account__history-box">
		<div>
			<div class="history-box__element" v-for="element in history" :key="element._id">
				<div class="element__about">
					<div>
						{{ format(new Date(element.createdAt), "eeee do LLLL yyyy", { locale: $localePl }) }}
					</div>
					<div class="wrap--text">{{ element.to.name }}</div>
					<div class="wrap--text">{{ element.accountType }}</div>
					<div class="wrap--text text--end" :class="{ 'amount--less': element.name !== 'income' }">
						{{ element.name === "income" ? "" : "-" }} {{ element.amount }} {{ element.currency }}
					</div>
				</div>
				<div class="d-flex justify-between align-center">
					<div>
						{{ element.title }}
					</div>
					<div class="d-flex justify-between align-center">
						<input
							@change="$emit('addElementToRaports', raport)"
							v-if="raports"
							type="checkbox"
							name="raport"
							v-model="raport"
							:value="element._id"
						/>
						<i v-if="moreInfo" @click="toggleExpand(element._id)" class="material-icons cp">{{
							expandElement.id === element._id ? "expand_less" : "expand_more"
						}}</i>
					</div>
				</div>
				<div
					v-if="moreInfo"
					class="expand__panel mt-5"
					:class="[expandElement.id === element._id ? 'expand' : 'hidden']"
				>
					<div>
						<div class="d-flex justify-between">
							<div>Do: {{ element.to.name }}</div>
						</div>
						<div class="d-flex justify-between">
							<div>Tytuł: {{ element.title }}</div>
							<div>Konto: {{ element.to.accountNumber }}</div>
						</div>
						<div @click="getPDF(element)" class="text--end mt-5 cp">
							Wygeneruj potwierdzenie
						</div>
						<div @click="makeTransactionAgain(element)" class="text--end mt-5 cp">
							Powtórz przelew
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import historyService from "@services/HistoryService";
	import { format } from "date-fns";
	export default {
		name: "History",
		data() {
			return {
				expandElement: {
					id: null,
				},
				raport: [],
				format,
			};
		},
		props: {
			history: {
				type: Array,
				default: () => [],
			},
			moreInfo: {
				type: Boolean,
				default: true,
			},
			raports: {
				type: Boolean,
				default: false,
			},
		},
		components: {},
		created() {},
		computed: {},
		methods: {
			toggleExpand(id) {
				if (this.expandElement.id === id) {
					this.expandElement.id = "";
				} else {
					this.expandElement.id = id;
				}
			},
			getPDF(transactions) {
				if (typeof transactions === "object") {
					transactions = [transactions];
				}
				const ids = transactions.map((ele) => ele._id);
				historyService.getPDF(ids).then((response) => {
					const blob = new Blob([response.data], { type: '"application/pdf' });
					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.download = "transaction.pdf";
					document.body.append(link);
					link.click();
					link.remove();
				});
			},
			makeTransactionAgain(transaction) {
				this.$router.push({
					name: "account.transfer",
					params: {
						transaction,
					},
				});
			},
		},
	};
</script>

<style lang='scss' scoped>
	.account__history-box {
		margin-top: 30px;
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
				flex: 1;
				margin-right: 5px;
				font-size: 1rem;
			}
		}
	}
	.expand__panel {
		transition: all 0.2s;
		overflow: hidden;
		div {
			font-size: 1rem;
		}
		&.hidden {
			height: 0px;
		}
		&.expand {
			height: 150px;
		}
	}
</style>