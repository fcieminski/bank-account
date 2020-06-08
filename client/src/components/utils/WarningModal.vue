<template>
	<div class="modal">
		<div class="modal__card">
			<div class="card__title">
				{{ modal.text }}
			</div>
			<div class="card__content">
				<slot />
			</div>
			<div class="card__actions">
				<button @click="$emit('yes')" class="btn pa-2">
					{{ modal.yes }}
				</button>
				<button v-if="modal.no" @click="$emit('no')" class="btn pa-2">
					{{ modal.no }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "WarningModal",
		data() {
			return {};
		},
		props: {
			modal: {
				type: Object,
				default: () => {}
			}
		},
		components: {},
		created() {},
		computed: {},
		methods: {}
	};
</script>

<style lang='scss' scoped>
</style>