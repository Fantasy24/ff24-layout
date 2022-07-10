<template>
  <div class="topbar">
    <hamburger
        id="hamburger-container"
        :is-active="$store.getters.sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
    />

    <div class="left-menu">
      <header-search
          id="header-search"
          class="left-menu-item"
      />
    </div>

    <div class="right-menu">
      <template v-if="$store.getters.device !== 'mobile'">
        <el-tooltip
            v-if="showChangeLanguage"
            :open-delay="500"
            class="item"
            content="Chuyển ngôn ngữ"
            effect="dark"
            placement="top-start"
        >
          <lang-select
              class="right-menu-item hover-effect"
          />
        </el-tooltip>
        <el-tooltip
            v-if="false"
            :open-delay="500"
            class="item"
            content="Thông báo"
            effect="dark"
            placement="bottom"
        >
          <notification class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>

      <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          size="small"
          trigger="click"
      >
        <div class="avatar-wrapper">
          <em class="el-icon-caret-bottom"/>
          <div class="user-info">
            <div class="user-name">
              {{ name }}
              <el-tag v-if="pos" size="mini" type="warning">{{ pos }}</el-tag>
            </div>
            <div class="user-role">
              {{ orgInfo }}
            </div>
          </div>
          <el-avatar icon="el-icon-user"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              <font-awesome-icon icon="user"/>
              {{ $t('topbar.profile') }}
            </el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <font-awesome-icon icon="sign-out-alt"/>
            {{ $t('topbar.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Hamburger from './Hamburger/index.vue'
import Notification from './Notification/Notification.vue'
import HeaderSearch from './HeaderSearch/HeaderSearch.vue'
import LangSelect from './LangSelect/index.vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {asyncRoutes} from '@/router/routerFactory'
import apiFactory from "etc-js/src/api/apiFactory";
import ConstantAPI from "etc-js/src/utils/ConstantAPI";
import {getToken} from "etc-js/src/utils/authCookie";

export default {
  components: {
    HeaderSearch,
    Notification,
    Hamburger,
    LangSelect,
    FontAwesomeIcon
  },
  data() {
    return {
      showChangeLanguage: process.env.VUE_APP_SHOW_CHANGE_LANGUAGE === '1',
      listChucVu: []
    }
  },
  computed: {
    name() {
      return this.$store.getters.ufn
    },
    pos() {
      return this.$store.getters.posName
    },
    orgInfo() {
      return this.$store.getters.orgName
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await apiFactory.callAPI(ConstantAPI.LOGIN.LOGOUT, getToken())
      asyncRoutes.length = 0
      await this.$store.dispatch('user/logout')
      await this.$router.push(`/login?redirect=/dashboard`)
    }
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  height: 55px;
  overflow: hidden;
  position: relative;
  background: #3ec1d3;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgb(255 255 255 / 7%);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .left-menu {
    float: left;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .left-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: whitesmoke;
      vertical-align: text-bottom;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: whitesmoke;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgb(255 255 255 / 7%);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 4px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 25px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
          color: whitesmoke;
        }
      }
    }
  }
}

.user-info {
  display: inline-block;
  color: #f6f7d7;
  font-size: 13px;
  margin-right: 10px;
  margin-left: 10px;

  .user-name {
    height: 12px;
    margin-top: -13px;
    opacity: 1;
    font-size: 1.01rem;
  }

  .user-role {
    margin-top: 10px;
    opacity: 0.9;
    font-size: 0.75rem;
    text-align: right;
  }
}

.el-button--text:hover,
.el-button--text:focus {
  color: #46a6ff !important;
}
</style>
