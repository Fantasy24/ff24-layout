<template>
  <div>
    <el-card v-if="syncTrigger" shadow="hover">
      <div class="bottom clearfix">
        <el-link
          :href="getUrlInsert()"
          icon="el-icon-plus"
          type="success"
          :underline="false"
          target="_blank"
          style="float: right"
        >
          Tạo mới yêu cầu
        </el-link>
      </div>
      <div
        v-for="(link, i) in listRequirement"
        :key="link.name"
        style="margin-bottom: 0.5em"
      >
        <el-link
          :href="getUrlDetail(link.id)"
          target="_blank"
          type="primary"
        >
          <span>{{ i + 1 }}. {{ link.title }}</span>
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import apiFactory from 'ff24-js/src/api/apiFactory';
import ConstantAPI from 'ff24-js/src/utils/ConstantAPI';
import {errAlert} from 'ff24-js/src/utils/AlertMessage';
import {WHITE_LIST} from 'ff24-js/src/utils/Constant';

export default {
  name: 'Requirement',
  props: {
    isShowRequirement: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listRequirement: []
    }
  },
  computed: {
    syncTrigger: {
      get() {
        return this.isShowRequirement
      },
      set(val) {
        this.$emit('update:isShowRequirement', val)
      }
    }
  },
  watch: {
    isShowRequirement() {
      this.listRequirement = []
      if (this.syncTrigger && WHITE_LIST.indexOf(this.$route.path) === -1 && this.$route.path !== '/dashboard') {
        this.onGetRequireByMenuCode()
      }
    },
    $route() {
      this.syncTrigger = false
    }
  },
  methods: {
    onGetRequireByMenuCode() {
      apiFactory.callAPI(ConstantAPI.REQUIREMENT.FIND_BY_MENU_CODE, {}, { menuCode: this.$route.name }).then(rs => {
        this.listRequirement = rs
      }).catch(err => {
        errAlert(this, err)
      })
    },

    getUrlDetail(id) {
      return `/erqms-ui/#/erqms-ui/require-management?id=${id}`
    },

    getUrlInsert() {
      return `/erqms-ui/#/erqms-ui/require-management?appCode=${process.env.VUE_APP_APP_CODE}&menuCode=${this.$route.name}`
    }
  }
}
</script>

<style scoped>

</style>
