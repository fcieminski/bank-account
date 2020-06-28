<template>
	<div class="account__more-box">
		<div class="more-box__widgets">
			<loading-indicator v-if="loading" />
			<component v-else :is="`${widget.name}Widget`" v-for="(widget, key) in widgets" :key="key" />
		</div>
		<div class="actions--container">
			<div @click="createWidgetModal = true" class="btn pa-2">
				dodaj widget
			</div>
		</div>
		<dialog-modal
			@yes="createWidget"
			@no="createWidgetModal = false"
			:show="createWidgetModal"
			:modal="{ text: 'Dodaj widget', yes: 'Dodaj', no: 'Anuluj' }"
		>
			<div>
				<label for="file">Wybierz widget</label>
				<select v-model="name" readonly class="input__main cp">
					<option v-for="(available, key) in availableWidgets" :key="key" :value="available.value">{{
						available.text
					}}</option>
				</select>
			</div>
		</dialog-modal>
	</div>
</template>

<script>
	import PlannedTransfersWidget from "./Widgets/PlannedTransfersWidget";
	import AccountStatsWidget from "./Widgets/AccountStatsWidget";
	import widgetsService from "@/services/WidgetsService";
	import { mapState } from "vuex";

	export default {
		name: "WidgetsSection",
		data() {
			return {
				widgets: [],
				name: "",
				widgetOptions: [
					{
						text: "Statystyki",
						value: "AccountStats"
					},
					{
						text: "Planowane transfery",
						value: "PlannedTransfers"
					}
				],
				loading: false,
				createWidgetModal: false
			};
		},
		components: {
			PlannedTransfersWidget,
			AccountStatsWidget
		},
		created() {
			this.loading = true;
			widgetsService
				.list(this.user._id)
				.then(data => {
					this.widgets = data;
				})
				.catch(error => {
					console.warn(error);
				})
				.finally(() => {
					this.loading = false;
				});
		},
		computed: {
			...mapState(["user"]),
			availableWidgets() {
				return this.widgetOptions.filter(option => this.widgets.some(current => current.name !== option.value));
			}
		},
		methods: {
			createWidget() {
				widgetsService
					.create({ name: this.name, userId: this.user._id })
					.then(() => {
						this.widgets.push({
							name: this.name
						});
						this.createWidgetModal = false;
					})
					.catch(error => {
						console.warn(error);
					});
			}
		}
	};
</script>

<style lang='scss' scoped>
	.account__more-box {
		margin-top: 30px;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		grid-area: more;
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