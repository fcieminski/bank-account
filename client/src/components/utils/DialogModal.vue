<template>
	<transition name="fade">
		<div v-if="show" class="modal">
			<div class="modal__card">
				<div class="card__title">
					{{ modal.text }}
				</div>
				<div class="card__content">
					<slot />
				</div>
				<div class="card__actions">
					<button v-if="modal.no" @click="$emit('no')" class="btn pa-2 mr-2">
						{{ modal.no }}
					</button>
					<button @click="$emit('yes')" class="btn pa-2">
						{{ modal.yes }}
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "DialogModal",
		data() {
			return {};
		},
		props: {
			modal: {
				type: Object,
				default: () => {}
			},
			show: {
				type: Boolean,
				default: false
			}
        },
        watch: {
            show(value){
                const body = document.querySelector('body')
                if(value){
                    body.style.overflow = 'hidden'
                    body.style.height = '100vh';
                } else {
                    body.removeAttribute("style")
                }
            }
        }
	};
</script>

<style lang='scss' scoped>
</style>