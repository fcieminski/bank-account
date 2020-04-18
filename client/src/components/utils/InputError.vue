<template>
	<div class="input__error">
		<transition name="fade">
			<p v-if="error" class="error" :class="{ 'error--center': center, 'error--left': left }">{{
				error
			}}</p>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "InputError",
		props: {
			error: {
				type: String,
				default: null
			},
			left: {
				type: Boolean,
				default: false
			},
			center: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style lang='scss' scoped>
	.input__error {
		color: red;
		height: 19px;
		.error {
			font-size: 0.9rem;
			&.error--center {
				text-align: center;
			}
			&.error--left {
				text-align: left;
			}
		}
	}
</style>