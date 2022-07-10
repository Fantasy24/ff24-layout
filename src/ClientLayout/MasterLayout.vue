<template v-once>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

    <sidebar v-once class="sidebar-container" />

    <div :class="{ hasTagsView: true }" class="main-container">
      <div class="fixed-header">
        <topbar v-once />

        <tags-view v-if="showTags" v-once />

        <breadcrumbs
          v-if="showBreadcrumbs"
          v-once
          id="breadcrumb-container"
          class="breadcrumb-container"
        />
      </div>

      <app-main />

      <right-panel v-if="showSettings" v-once>
        <settings v-once />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from './RightPanel/index.vue'
import AppMain from './components/AppMain.vue'
import Topbar from './components/Topbar.vue'
import Settings from './components/Settings/index.vue'
import Sidebar from './components/Sidebar/SideBarMaster.vue'
import TagsView from './components/TagsView/index.vue'
import Breadcrumbs from './components/Breadcrumb/BreadCrumbs.vue'
import {mapState} from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'MasterLayoutBase',
  components: {
    Breadcrumbs,
    AppMain,
    Topbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showBreadcrumbs: process.env.VUE_APP_SHOW_BREADCRUMBS === '1',
      showTags: process.env.VUE_APP_SHOW_TAGS === '1'
    }
  },
  computed: {
    ...mapState('app', ['window']),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.app.fixedHeader
    },
    showSettings() {
      return this.$store.state.settings.showSettings
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.window.width <= 1366
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 320px);
  transition: width 0.15s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.chat {
  position: fixed;
  right: 15px;
  bottom: 20px;
  z-index: 9000;
  font-size: 120%;
}
</style>
