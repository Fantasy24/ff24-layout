<template>
  <div>
    <el-form-item
        :label="label"
        :prop="prop"
        :required="required"
        :rules="rules"
    >
      <el-select-tree
          v-model="syncValue"
          :check-strictly="true"
          :clearable="true"
          :data="listData"
          :default-expand-all="true"
          :placeholder="placeholder"
          :props="treeProps"
          filterable
          style="width: 100%"
          @change="onChange"
      />
    </el-form-item>
  </div>
</template>

<script>
import ElSelectTree from 'el-select-tree'
import ConstantAPI from "etc-js/src/utils/ConstantAPI";
import apiFactory from "etc-js/src/api/apiFactory";
import {errAlert} from "etc-js/src/utils/AlertMessage";

export default {
  name: 'SelectMenuCode',
  components: {
    ElSelectTree
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Chức năng'
    },
    placeholder: {
      type: String,
      default: 'Chức năng'
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    prop: {
      type: String,
      default: 'menuCode'
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          value: 'rowKey',
          children: 'children',
          label: 'name'
        }
      }
    }
  },
  computed: {
    syncValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      loading: false,
      listData: []
    }
  },
  mounted() {
    this.onGetListMenu()
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    },

    onGetListMenu() {
      this.listData = []
      const searchParam = {
        appCode: process.env.VUE_APP_APP_CODE,
        parentCode: process.env.VUE_APP_APP_CODE,
        types: '1' /* Menu FE*/
      }
      this.loading = true
      apiFactory.callAPI(ConstantAPI.EXPORT.LIST_MENU_TREE, {}, searchParam).then(rs => {
        this.listData.push(rs)
        this.loading = false
      }).catch(err => {
        this.loading = false
        errAlert(this, err)
      })
    },
  }
}
</script>

<style scoped>

</style>

