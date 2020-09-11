<template>
	<ValidationProvider :rules="rules" :name="name" v-slot="{ errors }">
		<label :for="name">Kwota celu</label>
		<input v-model="data" class="input__main" :name="name" />
		<input-error left :error="errors[0]" />
	</ValidationProvider>
</template>

<script>
	export default {
		name: "ValidatedInput",

		props: {
			rules: {
				type: Object || String,
				default: "required",
			},
			name: {
				type: String,
				default: "",
			},
			data: {
				type: String || Number,
				default: "",
			},
		},
	};
</script>