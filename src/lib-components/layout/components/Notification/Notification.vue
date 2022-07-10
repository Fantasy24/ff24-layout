<template>
  <el-dropdown
      ref="noityDropdown"
      trigger="click"
      @visible-change="onClickNotify"
  >
    <el-badge
        :value="total.all"
    >
      <el-icon class="el-icon-message-solid" style="color: white"/>
    </el-badge>

    <el-dropdown-menu
        slot="dropdown"
        style="width: 32%;padding: 5px"
    >
      <el-tabs
          v-model="activeTab"
          class="dialog-container"
          stretch
          style="overflow: hidden"
          @tab-click="onClickNotify(true)"
      >
        <el-tab-pane label="Cá nhân" name="1">
          <span slot="label" class="labelTab"><el-badge :value="total.username">Cá nhân</el-badge></span>
          <tab-content
              ref="1"
              :data.sync="listNotify"
              :loading="loading"
              :total="totalElements"
              @infiniteLoading="onLoad"
              @refreshCount="refreshCount"
              @reload="onClickNotify(true)"
          />
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" class="labelTab"><el-badge :value="total.groupCode">Nhóm</el-badge></span>
          <tab-content
              ref="2"
              :data.sync="listNotify"
              :loading="loading"
              :total="totalElements"
              @infiniteLoading="onLoad"
              @refreshCount="refreshCount"
              @reload="onClickNotify(true)"
          />
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" class="labelTab"><el-badge :value="total.orgCode">Đơn vị</el-badge></span>
          <tab-content
              ref="3"
              :data.sync="listNotify"
              :loading="loading"
              :total="totalElements"
              @infiniteLoading="onLoad"
              @refreshCount="refreshCount"
              @reload="onClickNotify(true)"
          />
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label" class="labelTab"><el-badge :value="total.appCode">Ứng dụng</el-badge></span>
          <tab-content
              ref="4"
              :data.sync="listNotify"
              :loading="loading"
              :total="totalElements"
              @infiniteLoading="onLoad"
              @refreshCount="refreshCount"
              @reload="onClickNotify(true)"
          />
        </el-tab-pane>
      </el-tabs>
      <div style="padding: 10px 0 5px 0;float: right;font-size: 13px">
        Âm thanh thông báo
        <el-switch v-model="alert" active-color="#13ce66"/>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory'
import {ALERT_URL, NOTIFY_INTERVAL, PAGINATION_PARAM} from 'etc-js/src/utils/Constant'
import {errAlert} from 'etc-js/src/utils/AlertMessage'
import TabContent from './TabContent.vue'
import ConstantAPI from 'etc-js/src/utils/ConstantAPI'
import Cookies from 'js-cookie'
import {getToken} from 'etc-js/src/utils/authCookie'

const alert = new Audio(ALERT_URL)
let getNewNoity

export default {
  name: 'Notification',
  components: {
    TabContent
  },
  data() {
    return {
      activeTab: '1',
      loading: false,
      total: 0,
      page: PAGINATION_PARAM.page,
      listNotify: [],
      totalElements: 0,
      isFirst: true
    }
  },
  computed: {
    param() {
      return {
        type: Number(this.activeTab),
        appCode: process.env.VUE_APP_APP_CODE,
        page: this.page,
        size: 10
      }
    },
    alert: {
      get() {
        return this.$store.state.app.alert
      },
      set(val) {
        this.$store.dispatch('app/setAlert', val)
      }
    }
  },
  mounted() {
    let token = getToken()
    if (this.checkEnv() && token) {
      this.refreshCount()
      getNewNoity = setInterval(() => {
        if (!getToken()) {
          clearInterval(getNewNoity)
          return
        }
        this.isFirst = false
        this.refreshCount()
      }, NOTIFY_INTERVAL)
    }
  },
  methods: {
    /* Xử lý thông báo tab*/
    onClickNotify(isShow) {
      this.$refs[this.activeTab].isShowDtl = false
      if (isShow && this.checkEnv()) {
        this.page = 1
        this.loading = true
        apiFactory.callAPI(ConstantAPI.NOTIFY.SEARCH, {}, this.param).then(async rs => {
          this.listNotify = rs.result
          this.totalElements = rs.totalElements
          if (this.activeTab === '1') {
            this.refreshCount()
          }
        }).catch(err => {
          errAlert(this, err)
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.activeTab = '1'
        this.loading = false
      }
    },

    onLoad() {
      this.loading = true
      this.page += 1
      this.param.page = this.page
      apiFactory.callAPI(ConstantAPI.NOTIFY.SEARCH, {}, this.param).then(rs => {
        this.listNotify.push(...rs.result)
      }).catch(err => {
        errAlert(this, err)
      }).finally(() => {
        this.loading = false
      })
    },

    refreshCount() {
      const param = {
        appCode: process.env.VUE_APP_APP_CODE
      }
      apiFactory.callAPI(ConstantAPI.NOTIFY.COUNT_UNREAD, {}, param).then(rs => {
        if (!this.isFirst && Cookies.get('alert') === '1' && rs.all > this.total) {
          alert.play()
        }
        this.total = rs
      }).catch(err => {
        errAlert(this, err)
      })
    },

    checkEnv() {
      return !process.env.VUE_APP_ACTIVE_NOTIFY || process.env.VUE_APP_ACTIVE_NOTIFY === 'true'
    }
    /* Xử lý thông báo tab*/
  }
}
</script>

<style scoped>
.labelTab {
  font-size: 16px;
  font-weight: bold;
}

.el-dropdown-menu__item--divided {
  background-color: #ffffff !important;
}

.el-dropdown-menu__item {
  font-weight: 550 !important;
  color: #070946 !important;
}

.el-dropdown-menu__item.is-disabled {
  color: #ffffff !important;
}

.el-dropdown-menu__item:hover {
  font-weight: bold !important;
  color: #363636 !important;
  background-color: #ffffff !important;
}

.el-dropdown-menu {
  background-color: #ffffff !important;
  border: 1px solid #ffffff !important;
}
</style>
