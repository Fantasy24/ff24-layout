<template>
  <div class="app-container">
    <el-card id="formSearh">
      <el-form
          ref="formSearch"
          :model="formSearch"
          label-width="190px"
          @keypress.native.enter="onSearch(true)"
      >
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
            <select-menu-code
                v-model="formSearch.menuCode"
            />
          </el-col>
          <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
            <el-form-item label="ID yêu cầu" prop="idRef">
              <el-input-etc
                  v-model="formSearch.idRef"
                  maxlength="40"
                  placeholder="ID yêu cầu"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
            <el-form-item :rules="rules.fromToDate" label="Ngày yêu cầu từ" prop="fromToDate" required>
              <date-range-picker v-model="formSearch.fromToDate" :picker-options="maxDate"/>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
            <el-form-item label="Trạng thái xử lý" prop="processStatus">
              <el-select
                  v-model="formSearch.processStatus"
                  placeholder="Trạng thái xử lý"
                  style="width: 100%;"
                  @clear="formSearch.processStatus = null"
              >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="float: right">
          <el-button
              ref="btnSearch"
              icon="el-icon-search"
              type="primary"
              @click="onSearch"
          >
            {{ $t('baseLabel.btnSearch') }}
          </el-button>
          <el-button
              icon="el-icon-refresh-left"
              type="primary"
              @click="resetForm('formSearch')"
          >
            {{ $t('baseLabel.btnClear') }}
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="EmptyBox5"/>

    <el-card id="formGrid">
      <el-table
          v-loading="loading"
          :data="listRequestExport"
          border
          fit
      >
        <el-table-column
            :index="(index) => {return ((formSearch.page >= 1 ? formSearch.page - 1 : formSearch.page >= 1) * formSearch.size) + index + 1}"
            align="center"
            fixed
            label="STT"
            type="index"
            width="45"
        />

        <el-table-column label="ID yêu cầu" min-width="150" prop="idRef" show-overflow-tooltip width="150"/>

        <el-table-column label="Định dạng" min-width="105" prop="fileFormat" sortable width="105"/>

        <el-table-column fixed label="Chức năng" min-width="350" prop="menuName" show-overflow-tooltip sortable/>

        <el-table-column label="Nhóm" min-width="170" prop="groupCode" show-overflow-tooltip sortable width="170"/>

        <el-table-column align="center" label="Ngày yêu cầu" min-width="125" prop="creadtedDate" sortable width="140">
          <template #default="{row}">
            <span>{{ formatFullDateTime_VN(row.createdDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Ngày xử lý" min-width="125" prop="processDate" sortable width="140">
          <template #default="{row}">
            <span>{{ formatFullDateTime_VN(row.processDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Lỗi xử lý" min-width="200" prop="processError" sortable width="200">
          <template #default="{row}">
            <el-popover
                placement="top-end"
                :open-delay="200"
                trigger="hover"
                width="400"
            >
              <span v-html="checkNewLineChar(row.processError)"/>
              <span slot="reference">{{ substrText(row.processError) }}</span>
            </el-popover>

          </template>
        </el-table-column>

        <el-table-column align="center" label="Trạng thái" min-width="115" prop="processStatus" width="115">
          <template #default="{row}">
            <el-tag v-if="row.processStatus === 0" disable-transitions size="medium" type="info">Chưa xử lý</el-tag>
            <el-tag v-if="row.processStatus === 1" disable-transitions size="medium" type="success">Thành công</el-tag>
            <el-tag v-if="row.processStatus === 2" disable-transitions size="medium" type="danger">Thất bại</el-tag>
          </template>
        </el-table-column>


        <el-table-column :label="$t('baseLabel.labelTableAction')" fixed="right" width="75" align="center">
          <template #default="{row}">
            <el-button-action
                v-if="row.fileSid"
                :loading="loadingBtn"
                describe="Tải file"
                el-icon="el-icon-download"
                type="success"
                @click="onDownFile(row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total > 0"
          :limit.sync="formSearch.size"
          :page.sync="formSearch.page"
          :total="total"
          @pagination="onSearch(false)"
      />
    </el-card>
  </div>
</template>

<script>
import ElPopup from 'ff24-customs-lib/src/components/ElPopup/index.vue'
import DateRangePicker from 'ff24-customs-lib/src/components/DateRangePicker/index.vue'
import ElInputEtc from 'ff24-customs-lib/src/components/ElInputETC/ElInputEtc.vue'
import Pagination from 'ff24-customs-lib/src/components/Pagination/index.vue'
import {deepClone, requiredRule} from 'ff24-js/src/utils'
import {PAGINATION_PARAM} from 'ff24-js/src/utils/Constant'
import SelectMenuCode from './SelectMenuCode.vue'
import SelectGroup from './SelectGroup.vue'
import apiFactory from 'ff24-js/src/api/apiFactory'
import ConstantAPI from 'ff24-js/src/utils/ConstantAPI'
import {errAlert, showAlert, SUCCESS} from 'ff24-js/src/utils/AlertMessage'
import {formatFullDateTime_VN} from 'ff24-js/src/filters'
import {SEARCH_RULES} from 'ff24-js/src/utils/KeySearchListObj'

export default {
  components: {
    ElPopup,
    ElInputEtc,
    SelectMenuCode,
    DateRangePicker,
    SelectGroup,
    Pagination
  },
  data() {
    return {
      listRequestExport: [],
      total: 0,
      loading: false,
      loadingBtn: false,
      isShowDlgShare: false,
      formShare: deepClone(FORM_SHARE),
      formSearch: {
        appCode: process.env.VUE_APP_APP_CODE,
        idRef: '',
        menuCode: '',
        fromToDate: [],
        processStatus: null,
        dateFrom: '',
        dateTo: '',
        page: PAGINATION_PARAM.page,
        size: PAGINATION_PARAM.size
      },
      rules: {
        fromToDate: SEARCH_RULES.fromToDate,
        groupCode: [requiredRule('Chia sẻ đến nhóm')]
      },
      maxDate: {
        disabledDate(date) {
          return date > new Date()
        }
      },
      options: [
        { value: null, label: 'Tất cả' },
        { value: 0, label: 'Chưa xử lý' },
        { value: 1, label: 'Thành công' },
        { value: 2, label: 'Thất bại' }
      ]
    }
  },
  mounted() {
    this.resetForm('formSearch')
    if (this.$route.query.idRef) {
      this.formSearch.idRef = this.$route.query.idRef
      this.onSearch(true)
    }
  },
  methods: {
    onSearch(isResetPage) {
      this.loading = true
      this.formSearch.page = isResetPage ? 0 : this.formSearch.page
      const date = this.formSearch.fromToDate
      this.formSearch.dateFrom = date[0]
      this.formSearch.dateTo = date[1]
      apiFactory.callAPI(ConstantAPI.EXPORT.EXPORT_SEARCH, {}, this.formSearch).then(rs => {
        this.listRequestExport = rs.result
        this.total = rs.totalElements
      }).catch(err => {
        this.listRequestExport = []
        this.total = 0
        errAlert(this, err)
      }).finally(() => {
        this.loading = false
      })
    },

    checkNewLineChar(text) {
      if (!text) return ''
      return text.replaceAll(/(\\r\\n|\\r|\\n|\n|\r|\r\n)/g, '<br/>')
    },

    substrText(text) {
      if (!text) return ''
      const cutText = text.substring(0, 30)
      return text.substring(0, cutText.lastIndexOf(' ')) + '...'
    },

    async onDownFile(row) {
      const params = {
        idRef: row.idRef,
        fileSid: row.fileSid
      }
      const fileName = `${row.menuName}.${row.fileFormat}`
      await apiFactory.download(ConstantAPI.EXPORT.DOWNLOAD, fileName, {}, params)
    },

    resetForm(formRef) {
      this.reset(formRef)
      const oneMonth = new Date()
      oneMonth.setDate(oneMonth.getDate() - 31)
      this.formSearch.fromToDate = [oneMonth, new Date()]
      this.formSearch.processStatus = null
      this.formSearch.appCode = process.env.VUE_APP_APP_CODE
      this.listRequestExport = []
      this.total = 0
    },

    reset(formRef) {
      this.$refs[formRef].resetFields()
    },

    clearValidate(formRef) {
      this.$refs[formRef].clearValidate()
    },

    formatFullDateTime_VN
  }
}

const FORM_SHARE = {
  appCode: '',
  groupCode: '',
  idRef: ''
}
</script>

<style>
.el-popover {
  white-space: break-spaces !important;
  word-break: break-word !important;
}

</style>
