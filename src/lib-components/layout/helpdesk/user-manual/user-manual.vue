<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>HƯỚNG DẪN SỬ DỤNG</span>
      </div>
      <el-container>
        <el-header>
          <h1>{{ nameTitle }}</h1>
        </el-header>
        <el-main>
          <tinymce disabled v-model="userManualContent" height="1000"/>
        </el-main>
      </el-container>

    </el-card>
  </div>

</template>

<script>
import apiFactory from 'ff24-js/src/api/apiFactory'
import ConstantAPI from 'ff24-js/src/utils/ConstantAPI'
import { errAlert } from 'ff24-js/src/utils/AlertMessage'
import Tinymce from '../../../../components/Tinymce/index.vue'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      userManualContent: '',
      menuCode: '',
      nameTitle: ''
    }
  },
  mounted() {
    this.menuCode = this.$route.query.menuCode
    this.getUserManual()
  },

  methods: {
    getUserManual() {
      apiFactory.callAPI(ConstantAPI['ql-chuc-nang'].SELECT_ITEM, {}, {
        appCode: process.env.VUE_APP_APP_CODE,
        menuCode: this.menuCode
      }).then(rs => {
        this.userManualContent = rs.userManual
        this.nameTitle = (rs.name).substr(rs.name.indexOf(' ') + 1)
      }).catch(err => {
        errAlert(this, err)
      })
    }
  }
}
</script>
<style scoped>

</style>
