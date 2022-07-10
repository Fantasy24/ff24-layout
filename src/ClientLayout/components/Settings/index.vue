<template>
  <div class="drawerContainer">
    <h1 class="drawer-title" style="text-align: center">TRỢ GIÚP KHÁCH HÀNG</h1>

    <el-menu v-if="false" class="el-menu-vertical-demo">
    </el-menu>

    <div class="footer">
      <h3>THÔNG TIN TIẾP NHẬN HỖ TRỢ TRỰC TUYẾN HỆ THỐNG</h3>
      <el-row v-for="tel in objContact.tel" :key="tel">
        <el-tag class="tag-info" size="default" type="primary">
          <span v-html="tel"></span>
        </el-tag>
      </el-row>

      <el-row v-for="mail in objContact.email" :key="mail">
        <el-tag class="tag-info" size="default" type="primary">
          <span v-html="mail"></span>
        </el-tag>
      </el-row>
      <div class="EmptyBox20"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userManualContent: '',
      nameTitle: '',
      isShowSubMenu: true,
      isActiveScroll: false,
      menuCode: '',
      setMaxWidthDrawer: false,
      isShowViewDetail: false,
      showUM: false,
      menuCodeNew: '',
      isShowRequirement: false
    }
  },

  computed: {
    objContact() {
      return this.$store.state.dashboardNotify.objFormLoginNotifyJson.objContact
    },
    getMenuCode() {
      this.menuCodeNew = this.$route.name
      if (this.menuCodeNew !== this.menuCode) {
        this.isShowViewDetail = false
        this.isShowSubMenu = true
      }
      return this.$route.name
    },
    getUrl() {
      return `${process.env.VUE_APP_CONTEXT_ROOT}/#/helpdesk/user-manual/user-manual?menuCode=${this.getMenuCode}`
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #c7c7c7;
  background-color: #f0f1f1;
  color: #211d1d;
  text-align: center;
}

.icon-style {
  font-size: 1.5em;
  margin-right: 20px;
}

.tag-info {
  margin-top: 10px !important;
  font-size: 14px;
}

.el-menu {
  border-right: none;
}

.showUserManual {
  overflow: auto;
  position: fixed;
  //width: fit-content;
  background: #e6ebf5;
  width: 450px;
  height: 87%;
  font-size: 14px;
  padding: 5px;
}

.drawerContainer {
  //display: grid;
  //grid-auto-columns: 450px;
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}

.cssSpan {
  color: #2f3133;
  //line-height: 35px !important;

  font-weight: bold;
}

h1 {
  text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9,
  0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1),
  0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2),
  0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2),
  0 20px 20px rgba(0, 0, 0, 0.15);
}

.userManualContent {
  //width: fit-content(300px) !important;
  //background-color: #8ca0ff;
  //padding: 5px;
}

img {
  width: 100%;
}

.support-info {
}
</style>
