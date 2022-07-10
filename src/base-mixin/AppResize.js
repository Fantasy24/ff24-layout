export default {
  data() {
    return {
      window: {
        width: 0,
        height: 0
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    const setWidthAndTitle4SelectItem = () => {
      const selects = document.getElementsByClassName('el-select-dropdown el-popper')
      for (const arrSelectKey of selects) {
        const containerWidth = arrSelectKey.style.minWidth
        const dropdownItems = document.getElementsByClassName('el-select-dropdown__item')
        for (const drItem of dropdownItems) {
          drItem.style.maxWidth = !arrSelectKey.classList.contains('headerSearch') ? containerWidth : '100%'
          const firstChild = drItem.firstChild
          drItem.title = firstChild.innerHTML
        }
      }
    }
    if (process.env.VUE_APP_FIT_WIDTH_SELECT === '1') {
      setInterval(setWidthAndTitle4SelectItem, 200)
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      if (this.window.width <= 1366) {
        this.$store.dispatch('app/closeSideBar', true)
      }
      this.$store.commit('app/SET_WINDOW', this.window)
    }
  }
}
