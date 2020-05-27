<template>
	<section class="history">
		<div v-if="!loading">
			<div>Historia</div>
			<div class="horizontal--divider"></div>
			<section>
				<span>
					Wyszukiwarka
				</span>
				<form>
					<label for="date">Data</label>
					<date-picker
						value-type="timestamp"
						input-class="input__main"
						v-model="searchQuery.date"
						name="date"
						range
					/>
					<label for="title">Tytuł</label>
					<input class="input__main" name="title" v-model="searchQuery.title" />
					<label for="type">Typ transakcji</label>
					<select v-model="searchQuery.type" class="input__main" name="type" type="text">
						<option :value="0">Wszystkie</option>
						<option :value="1">Uznania</option>
						<option :value="2">Obciążenia</option>
					</select>
					<label for="amount-from">Kwota od</label>
					<input v-model="searchQuery.amountFrom" class="input__main" name="amount-from" />
					<label for="amount-to">Kwota do</label>
					<input v-model="searchQuery.amountTo" class="input__main" name="amount-to" />
				</form>
				<div class="card__actions mt-4">
					<button @click="clearForm" class="btn--transparent pa-2 mr-4">
						Wyczyść
					</button>
					<button @click="searchInHistory" class="btn pa-2">
						Szukaj
					</button>
				</div>
			</section>
			<section>
				<div>
					<input name="raports" v-model="raports" type="checkbox" />
					<label @click="raports = !raports" for="raports" class="ml-4">Raport zbiorowy</label>
				</div>
				<button v-if="raports" @click="createRaports" class="btn btn--auto pa-2 mt-5">
					Generuj raport
				</button>
			</section>
			<div class="horizontal--divider"></div>

			<section class="pr">
				<history
					v-if="history"
					:history="history"
					:raports="raports"
					@addElementToRaports="reportFromElements"
				/>
				<div class="d-flex align-center" v-else>
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
					title: null
				},
				searchInfo: "",
				raports: false,
				raportIds: []
			};
		},
		components: {
			History,
			DatePicker
		},
		created() {
			this.loading = true;
			this.getHistory();
		},
		mounted() {},
		computed: {
			...mapState(["user"])
		},
		methods: {
			getHistory() {
				historyService
					.getHistory(this.user._id, `?limit=10&offset=0`)
					.then(data => {
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
						.then(data => {
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
			searchInHistory() {
				historyService
					.searchInHistory(this.user._id, {
						searchQuery: this.searchQuery
					})
					.then(data => {
						this.history = data;
						document.removeEventListener("scroll", this.loadMore);
					});
			},
			clearForm() {
				this.searchQuery = {
					date: null,
					type: null,
					amountFrom: null,
					amountTo: null,
					title: null
				};
				this.getHistory();
			},
			reportFromElements(e) {
				this.raportIds = e;
			},

			createRaports() {
				if (this.raportIds.length !== 0) {
					historyService.getPDF(this.raportIds).then(response => {
						const blob = new Blob([response.data], { type: '"application/pdf' });
						const link = document.createElement("a");
						link.href = URL.createObjectURL(blob);
						link.download = "transaction.pdf";
						document.body.append(link);
						link.click();
						link.remove();
					});
				}
			}
		},
		destroyed() {
			document.removeEventListener("scroll", this.loadMore);
		}
	};
</script>

<style lang='scss' scoped>
	.history {
		margin-top: 30px;
	}
</style>