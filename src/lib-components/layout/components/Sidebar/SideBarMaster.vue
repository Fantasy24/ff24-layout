<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" :sidebar-logo="sidebarLogo" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :active-text-color="variablesCss.menuActiveText"
        :background-color="variablesCss.menuBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :default-openeds="defaultOpen"
        :text-color="variablesCss.menuText"
        :unique-opened="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :base-path="route.path"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarLogo from "./SidebarLogo.vue";
import SidebarItem from "./SidebarItem.vue";
import * as variables from "../../../../theme/lib/variables.css";

export default {
  components: { SidebarItem, Logo: SidebarLogo },
  props: {
    sidebarLogo: String,
  },
  computed: {
    permission_routes() {
      return this.$store.getters.permission_routes;
    },
    sidebar() {
      return this.$store.getters.sidebar;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variablesCss() {
      // console.log(variables);
      // console.log(this.variablesCss);
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    defaultOpen() {
      const path = this.permission_routes.filter(
        (item) => location.pathname.includes(item.path) && item.path !== "/"
      );
      const mainAppPath = path.length ? path[0].path : "";
      return [mainAppPath];
    },
  },
};
</script>
