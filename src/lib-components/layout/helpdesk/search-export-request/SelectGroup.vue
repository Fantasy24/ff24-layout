<template>
  <el-select
    v-model="val"
    :loading="loading"
    placeholder="Nhóm người dùng"
    clearable
    filterable
    style="width: 100%;"
    @change="change"
  >
    <el-option
      v-for="item in listGroup"
      :key="item.groupCode"
      :label="`${item.groupCode} - ${item.name}`"
      :value="item.groupCode"
    />
  </el-select>
</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory'
import ConstantAPI from 'etc-js/src/utils/ConstantAPI'
import {errAlert} from 'etc-js/src/utils/AlertMessage'

export default {
  name: 'SelectGroup',
  props: {
    value: {
      type: [String, Number],
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      listGroup: []
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  mounted() {
    this.getListGroupByOrg()
  },
  methods: {
    getListGroupByOrg() {
      const param = {
        appCode: process.env.VUE_APP_APP_CODE,
        orgCode: this.$store.getters.org
      }
      this.loading = true
      apiFactory.callAPI(ConstantAPI.EXPORT.GET_GROUP, {}, param).then(rs => {
        this.listGroup = rs
      }).catch(err => {
        this.listGroup = []
        errAlert(this, err)
      }).finally(() => {
        this.loading = false
      })
    },

    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>
