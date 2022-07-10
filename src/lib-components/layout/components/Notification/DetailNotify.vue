<template>
  <div>
    <el-card shadow="never">
      <div class="back">
        <el-button
            icon="el-icon-back"
            size="medium"
            type="text"
            @click="goBack"
        >
          Quay lại
        </el-button>
      </div>
      <div class="card-block">
        <strong>{{ data.viewTitle }}</strong>
        <el-divider style="font-size: 13px"> {{ formatFullDateTime_VN(data.createdDate) }}</el-divider>
        <span v-html="data.viewContent ? data.viewContent.replaceAll('\n','<br/>') : ''"/>

        <span v-if="data.viewUrl">
          <el-divider/>
          <el-link
              :href="data.viewUrl"
              :underline="false"
              target="_blank"
              type="primary"
          >
            Link đính kèm
          </el-link>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
import {formatFullDateTime_VN} from 'ff24-js/src/filters'

export default {
  name: 'DetailNotify',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    show: Boolean
  },
  computed: {
    syncShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    goBack() {
      this.syncShow = false
    },
    formatFullDateTime_VN
  }
}
</script>

<style scoped>
.back {
  overflow: hidden;
  width: 100%;
  z-index: 10;
  height: 30px;
  line-height: 30px;
  position: fixed;
  background-color: white;
}

.card-block {
  margin-top: 40px;
  overflow: auto;
  max-height: calc(100vh - 325px) !important
}

</style>
