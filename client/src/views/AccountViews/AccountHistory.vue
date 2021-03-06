<template>
	<section class="history">
		<div v-if="!loading">
			<div>Historia</div>
			<div class="horizontal--divider"></div>
			<section>
				<span>Wyszukiwarka</span>
				<form>
					<label for="date">Data</label>
					<date-picker input-class="input__main" v-model="searchQuery.date" name="date" range />
					<div class="d-flex">
						<div class="column mr-2">
							<label for="title">Tytuł</label>
							<input class="input__main" name="title" v-model="searchQuery.title" />
						</div>
						<div class="column ml-2">
							<label for="type">Typ transakcji</label>
							<select v-model="searchQuery.type" class="input__main" name="type" type="text">
								<option :value="0">Wszystkie</option>
								<option :value="1">Uznania</option>
								<option :value="2">Obciążenia</option>
							</select>
						</div>
					</div>
					<div class="d-flex">
						<div class="column mr-2">
							<label for="amount-from">Kwota od</label>
							<input
								v-model.number="searchQuery.amountFrom"
								v-mask="['#########']"
								type="text"
								class="input__main"
								name="amount-from"
							/>
						</div>
						<div class="column ml-2">
							<label for="amount-to">Kwota do</label>
							<input
								v-model.number="searchQuery.amountTo"
								v-mask="['#########']"
								type="text"
								class="input__main"
								name="amount-to"
							/>
						</div>
					</div>
				</form>
				<div class="card__actions card__actions--no-padding mt-4">
					<button @click="clearForm" class="btn--transparent pa-2 mr-4">Wyczyść</button>
					<button @click="searchInHistory" class="btn pa-2">Szukaj</button>
				</div>
				<section>
					<div>
						<input name="reports" :disabled="history.length === 0" v-model="reports" type="checkbox" />
						<label @click="reports = !reports" for="reports" class="ml-4">Raport zbiorowy</label>
					</div>
					<button
						v-if="reports"
						@click="createReports"
						:disabled="reportIds.length === 0"
						class="btn btn--auto pa-2 mt-5"
					>
						Generuj raport
					</button>
				</section>
				<div class="horizontal--divider"></div>

				<section class="pr">
					<div v-if="searchMessage">
						{{ searchMessage }}
					</div>
					<history
						v-if="history"
						:history="history"
						:reports="reports"
						@add-element-to-reports="reportFromElements"
					/>
					<div class="d-flex align-center" v-else-if="!error">
						<i class="material-icons mr-2">history</i>
						Twoja historia jest pusta, wkonaj pierwszy
						<router-link class="link__inline ml-2" to="/">przelew!</router-link>
					</div>
					<div v-if="loadingMoreHistory" class="loading__box">
						<loading-indicator />
					</div>
					<div v-if="searchInfo">
						{{ searchInfo }}
					</div>
				</section>
			</section>
		</div>

		<loading-indicator v-else-if="!history && !error" />
		<div v-if="error">
			{{ error }}
		</div>
	</section>
</template>

<script>
	import DatePicker from "vue2-datepicker";
	import "vue2-datepicker/index.css";
	import "vue2-datepicker/locale/pl";
	import { mapState } from "vuex";
	import historyService from "@services/HistoryService";
	import History from "@/components/Account/History";
	export default {
		name: "AccountHistory",
		data() {
			return {
				loading: false,
				history: null,
				error: null,
				limit: 0,
				offset: 0,
				pagination: 0,
				loadingMoreHistory: false,
				searchQuery: {
					date: null,
					type: null,
					amountFrom: null,
					amountTo: null,
					title: null,
				},
				searchInfo: "",
				reports: false,
				reportIds: [],
				searchMessage: "",
			};
		},
		components: {
			History,
			DatePicker,
		},
		created() {
			this.loading = true;
			this.getHistory();
		},
		mounted() {},
		computed: {
			...mapState(["user"]),
		},
		methods: {
			myFormat(e) {
				console.log(e);
			},
			getHistory() {
				historyService
					.getHistory(this.user._id, `?limit=10&offset=0`)
					.then((data) => {
						this.history = data.history;
						this.pagination = data.pagination;
						document.addEventListener("scroll", this.loadMore);
					})
					.catch(() => {
						this.error = "Błąd ładowania danych!";
					})
					.finally(() => {
						this.loading = false;
					});
			},
			loadMore(e) {
				const { target } = e;
				if (
					window.scrollMaxY - 10 < window.scrollY &&
					!this.loadingMoreHistory &&
					this.history.length !== this.pagination
				) {
					this.limit += 5;
					this.offset = this.history.length;
					this.loadingMoreHistory = true;
					historyService
						.getHistory(this.user._id, `?limit=${this.limit}&offset=${this.offset}`)
						.then((data) => {
							this.history.push(...data.history);
						})
						.catch(() => {
							this.error = "Błąd ładowania danych!";
						})
						.finally(() => {
							this.loadingMoreHistory = false;
						});
				}
			},
			formatQuery() {
				if (this.searchQuery.date.length !== 0) {
					return {
						...this.searchQuery,
						date: this.searchQuery.date.map((date) => new Date(date).toISOString()),
					};
				}
				return this.searchQuery;
			},
			searchInHistory() {
				const isEmpty = Object.values(this.searchQuery).every((value) => value === null);
				if (!isEmpty) {
					historyService
						.searchInHistory(this.user._id, {
							searchQuery: this.searchQuery,
						})
						.then(({ history }) => {
							this.history = history;
							this.searchMessage = history.length === 0 ? "Brak wyników" : "Wyniki wyszukiwania:";
							document.removeEventListener("scroll", this.loadMore);
						});
				}
			},
			clearForm() {
				this.searchQuery = {
					date: null,
					type: null,
					amountFrom: null,
					amountTo: null,
					title: null,
				};
				this.searchMessage = "";
				this.getHistory();
			},
			reportFromElements(e) {
				this.reportIds = e;
			},

			createReports() {
				if (this.reportIds.length !== 0) {
					historyService.getPDF(this.reportIds).then((response) => {
						const blob = new Blob([response.data], { type: '"application/pdf' });
						const link = document.createElement("a");
						link.href = URL.createObjectURL(blob);
						link.download = "transaction.pdf";
						document.body.append(link);
						link.click();
						link.remove();
					});
				}
			},
		},
		destroyed() {
			document.removeEventListener("scroll", this.loadMore);
		},
	};
</script>

<style lang='scss' scoped>
	.history {
		margin-top: 30px;
	}
</style>