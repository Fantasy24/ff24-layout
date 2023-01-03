<template>
  <div class="topbar">
    <hamburger
      id="hamburger-container"
      :is-active="this.$store.getters.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="left-menu">
      <header-search id="header-search" class="left-menu-item" />
    </div>

    <div class="right-menu">
      <el-row :gutter="20">
        <!-- <template v-if="$store.getters.device !== 'mobile'"> -->
        <el-col :xs="24" :sm="24" :md="3" :lg="3" :xl="3">
          <el-tooltip
            v-if="isShowNoity"
            :open-delay="500"
            class="item"
            content="Thông báo"
            effect="dark"
            placement="bottom"
          >
            <notification
              class="right-menu-item hover-effect"
              style="margin-right: 10px !important"
            />
          </el-tooltip>
        </el-col>
        <!-- v-if="$store.getters.device !== 'mobile'" -->
        <el-col :xs="24" :sm="24" :md="3" :lg="3" :xl="3">
          <el-tooltip
            v-if="isShowLangSelect"
            :open-delay="500"
            class="item"
            content="Chuyển ngôn ngữ"
            effect="dark"
            placement="top-start"
          >
            <lang-select class="right-menu-item hover-effect" />
          </el-tooltip>
        </el-col>
        <!-- </template> -->

        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <el-dropdown
            v-if="isShowUserDropdown"
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
          >
            <div class="avatar-wrapper">
              <el-avatar icon="el-icon-user" :src="src" />
              <em class="el-icon-caret-bottom" />
              <div class="user-info">
                <div class="user-name">
                  {{ name }}
                </div>
                <!-- <div class="user-role">
              {{ orgInfo }}
            </div> -->
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- <router-link to="/profile/index">
                <el-dropdown-item>
                  <font-awesome-icon icon="user" />
                  {{ $t("topbar.profile") }}
                </el-dropdown-item>
              </router-link> -->

              <el-dropdown-item
                v-if="isTurnOffAuth"
                divided
                @click.native="logout"
              >
                <span style="display: block"
                  ><font-awesome-icon icon="sign-out-alt" />
                  {{ $t("topbar.logOut") }}</span
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Hamburger from "./Hamburger/index.vue";
import Notification from "./Notification/Notification.vue";
import HeaderSearch from "./HeaderSearch/HeaderSearch.vue";
import LangSelect from "./LangSelect/index.vue";
import { asyncRoutes } from "@/router/routerFactory";
import apiFactory from "ff24-js/src/api/apiFactory";
import ConstantAPI from "ff24-js/src/utils/ConstantAPI";
import { getToken } from "ff24-js/src/utils/authCookie";

export default {
  components: {
    HeaderSearch,
    Notification,
    Hamburger,
    LangSelect,
  },
  data() {
    return {
      listChucVu: [],
      src: "data:image/png;base64,".concat(this.$store.getters.avatar),
    };
  },
  computed: {
    isShowNoity() {
      return !process.env.VUE_APP_SHOW_NOITY;
    },
    isShowLangSelect() {
      return !process.env.VUE_APP_SHOW_CHANGE_LANGUAGE;
    },
    isShowUserDropdown() {
      return !process.env.VUE_APP_USER_INFO;
    },
    isTurnOffAuth() {
      return !process.env.VUE_APP_TURN_OFF_AUTH;
    },
    name() {
      return `${this.$store.getters.ufn} ${
        this.$store.getters.posName ? " | " + this.$store.getters.posName : ""
      }`;
    },
    orgInfo() {
      return this.$store.getters.orgName;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await apiFactory.callAPI(ConstantAPI.LOGIN.LOGOUT, getToken());
      asyncRoutes.length = 0;
      await this.$store.dispatch("user/logout");
      await this.$router.push(`/login?redirect=/dashboard`);
      location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #1a4792;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.2s;
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
      color: ghostwhite;
      vertical-align: text-bottom;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    min-width: 350px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.2s;

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
          width: 30px;
          height: 30px;
          border-radius: 25px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
          color: white;
        }
      }
    }
  }
}

.user-info {
  float: right;
  color: whitesmoke;
  font-size: 13px;
  margin-right: 10px;
  margin-left: 10px;

  .user-name {
    height: 12px;
    margin-top: -13px;
    opacity: 1;
    font-weight: bold;
  }

  .user-role {
    margin-top: 10px;
    opacity: 0.9;
    font-style: italic;
  }
}

.el-button--text:hover,
.el-button--text:focus {
  color: #46a6ff !important;
}
</style>
