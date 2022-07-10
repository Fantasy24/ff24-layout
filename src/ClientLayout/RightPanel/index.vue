<template>
  <div ref="rightPanel" :class="{ show: show }" class="rightPanel-container">
    <div class="rightPanel-background" />

    <div :style="{ maxWidth: changeMaxWidth + 'px' }" class="rightPanel">
      <div
        :style="{ top: buttonTop + 'px', 'background-color': '#42b983' }"
        class="handle-button"
        @click="show = !show"
        @mouseleave="hover = false"
        @mouseover="hover = true"
      >
        <em
          v-if="!show"
          :class="
            !hover
              ? 'el-icon-d-arrow-left'
              : show
                ? 'el-icon-close'
                : 'el-icon-setting'
          "
        />
        <em
          v-else
          :class="
            hover
              ? 'el-icon-d-arrow-right'
              : show
                ? 'el-icon-close'
                : 'el-icon-setting'
          "
        />
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import {addClass, removeClass} from 'etc-js/src/utils'

export default {
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 85,
      type: Number
    }
  },
  data() {
    return {
      show: false,
      hover: false,
      changeMaxWidth: '200'
    }
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
      this.changeMaxWidth = '500'
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(34, 42, 69, 0.96);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 500px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.15s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 25px;
  height: 40px;
  position: absolute;
  transition: 0.3s;
  left: -25px;
  text-align: center;
  font-size: 18px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 40px;

  &:hover {
    width: 70px;
    left: -70px;
  }

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
