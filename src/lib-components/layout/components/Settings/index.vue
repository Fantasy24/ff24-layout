<template>
  <div class="drawerContainer">

    <h1 class="drawer-title" style="text-align: center">TRỢ GIÚP KHÁCH HÀNG</h1>

    <el-divider/>

    <el-menu class="el-menu-vertical-demo" router>
      <el-menu-item index="1" route="#" @click="getContentUserManual">
        <template slot="title">
          <em class="el-icon-s-claim" style="color: #303133"/>
          <el-button type="text">
            <span class="cssSpan">Hướng dẫn sử dụng</span>
          </el-button>
        </template>
      </el-menu-item>

      <div v-if="isShowSubMenu">
        <el-menu-item index="2" route="/helpdesk/questions">
          <template slot="title">
            <em class="el-icon-question"/>
            <span>Câu hỏi thường gặp</span>
          </template>
        </el-menu-item>

        <el-menu-item index="3" route="/helpdesk/ticket-manager">
          <template slot="title">
            <em class="el-icon-user-solid"/>
            <span>Quản lý Ticket</span>
          </template>
        </el-menu-item>

        <el-menu-item index="4" @click="isShowRequirement = !isShowRequirement" route="#">
          <template slot="title">
            <em class="el-icon-s-promotion"/>
            <span class="cssSpan">Danh sách Yêu cầu</span>
          </template>
        </el-menu-item>

        <el-menu-item index="5" route="/helpdesk/search-export-request">
          <template slot="title">
            <em class="el-icon-s-order"/>
            <span>Tra cứu yêu cầu kết xuất dữ liệu</span>
          </template>
        </el-menu-item>
      </div>

      <div class="EmptyBox10"/>

      <div v-if="showUM">
        <el-button
            icon="el-icon-back"
            type="text"
            @click="isShowViewDetail = false; isShowSubMenu = true; isShowRequirement = false"
        >
          Quay lại
        </el-button>
      </div>

      <div v-if="isShowViewDetail" :class="{ showUserManual : isActiveScroll }">
        <div class="resizable-content"
             style="position: fixed; z-index: 999999999999; width: 90%;padding: 5px;background-color: white;top: 135px"
        >
          <el-button
              icon="el-icon-back"
              type="text"
              @click="isShowViewDetail = false; isShowSubMenu = true; isShowRequirement = false"
          >
            Quay lại
          </el-button>
          <a v-if="userManualContent" target="_blank" :href="`${getUrl}`">
            <el-button
                icon="el-icon-view"
                type="text"
                style="float: right"
            >
              Xem chi tiết
            </el-button>
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px">
          <el-tag v-if="nameTitle" size="default" style="font-size: larger" effect="plain">{{ nameTitle }}</el-tag>
        </div>
        <div class="EmptyBox10"/>
        <p v-html="userManualContent" class="userManualContent"></p>
      </div>
    </el-menu>

    <requirement :is-show-requirement.sync="isShowRequirement"/>

    <div class="footer">
      <h4 style="text-align: center">THÔNG TIN HỖ TRỢ TRỰC TUYẾN HỆ THỐNG</h4>
      <el-row align="middle">
        <el-col :offset="6">
          <a href="tel:19009299">
            <p class="tag-info">
              <svg-icon icon-class="phone" class="icon-style"/>
              <strong>19009299 (nhánh 02)</strong>
            </p>
          </a>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="6">
          <a href="mailto:bophanhotrotchq@customs.gov.vn">
            <p class="tag-info">
              <svg-icon icon-class="emailSp" class="icon-style"/>
              <strong>bophanhotrotchq@customs.gov.vn</strong>
            </p>
          </a>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory'
import ConstantAPI from 'etc-js/src/utils/ConstantAPI'
import {showAlert, WARNING} from 'etc-js/src/utils/AlertMessage'
import Requirement from '../../helpdesk/requirement/requirement.vue'

export default {
  components: {
    Requirement
  },
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
    },
    getContentUserManual() {
      this.userManualContent = ''
      this.nameTitle = ''
      // Reset input
      this.menuCode = this.$route.name
      this.isActiveScroll = false
      this.isShowViewDetail = true
      this.setMaxWidthDrawer = true
      this.isShowSubMenu = false
      apiFactory.callAPI(ConstantAPI['ql-chuc-nang'].SELECT_ITEM, {}, {
        appCode: process.env.VUE_APP_APP_CODE,
        menuCode: this.$route.name
      }).then(rs => {
        if (rs.userManual.length > 0) {
          this.isActiveScroll = true
          this.showUM = false
        }

        if (rs.userManual === null) {
          this.isActiveScroll = false
          this.showUM = true
        }
        this.userManualContent = rs.userManual
        this.userManualContent = this.userManualContent.replaceAll('<img ', '<img width="100% !important"')
        this.nameTitle = (rs.name).substr(rs.name.indexOf(' ') + 1)
      }).catch(() => {
        showAlert(this, WARNING, 'Chưa có hướng dẫn sử dụng!')
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
  background-color: #daf4ff;
  color: #211d1d;
  padding: 5px;
}

.icon-style {
  font-size: 1.5em;
  margin-right: 20px;
}

.tag-info {
  margin-top: 0 !important;
  font-size: 13px;
  color: #4cafff;
}

.el-menu {
  border-right: none;
}

.showUserManual {
  overflow: auto;
  position: fixed;
  border: 1px solid #DCDFE6;
  width: 98%;
  height: 71.5%;
  font-size: 14px;
  padding: 10px;
}

.drawerContainer {
  padding: 5px;
  font-size: 14px;
  line-height: 1.2;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}

.cssSpan {
  color: #2f3133;
  font-weight: bold;
}

img {
  width: 100%;
}
</style>
