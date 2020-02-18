export const state = () => ({
  show: true
})

export const mutations = {
  toggle (state) {
    state.show = !state.show
  }
}
