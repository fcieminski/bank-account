<template>
	<div class="account__more-box">
		<div class="actions--container mb-4">
			<div @click="createWidgetModal = true" class="btn pa-2">
				dodaj widget
			</div>
		</div>
		<div class="more-box__widgets">
			<loading-indicator v-if="loading" />
			<component
				v-else
				:is="`${widget.name}Widget`"
				v-for="(widget, key) in widgets"
				:key="key"
				@delete="removeWidget(widget._id)"
			/>
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
				return this.widgetOptions.filter(option => this.widgets.every(current => current.name !== option.value));
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
			},
			removeWidget(widgetId) {
				widgetsService
					.delete(widgetId)
					.then(data => {
						const index = this.widgets.findIndex(widget => widget._id === widgetId);
						this.widgets.splice(index, 1);
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
		grid-area: more;
	}
</style>