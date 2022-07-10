<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :active-text-color="variables.menuActiveText"
        :background-color="variables.menuBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :default-openeds="defaultOpen"
        :text-color="variables.menuText"
        :unique-opened="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="r in permission_routes"
          :key="r.path"
          :base-path="r.path"
          :item="r"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarLogo from './SidebarLogo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/theme/variables.css'

export default {
  components: { SidebarItem, Logo: SidebarLogo },
  computed: {
    permission_routes() {
      return this.$store.getters.permission_routes
    },
    sidebar() {
      return this.$store.getters.sidebar
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    defaultOpen() {
      const path = this.permission_routes.filter(
        item => location.pathname.includes(item.path) && item.path !== '/'
      )
      const mainAppPath = path.length ? path[0].path : ''
      return [mainAppPath]
    }
  }
}
</script>

<style>
.scrollbar-wrapper {
  background-color: #185f68;
}

.sidebar-container .is-active > .el-submenu__title > span {
  color: white !important;
}

#app .sidebar-container .el-submenu .nest-menu,
#app .sidebar-container li.el-menu-item.is-active {
  background-color: #3ec1d3 !important;
  color: white !important;
}

.sidebar-container .el-submenu__title i {
  color: white;
}
</style>
