export const imagerror = {
	inserted (dom, options) {
		dom.src = dom.src || options.value

		dom.onerror = () => {
			dom.src = options.value
		}
	},

	componentUpdated (dom, options) {
		dom.src = dom.src || options.value
	}
}
