<template>
  <div class="upload-container">
    <el-button
        :style="{background:color,borderColor:color}"
        icon="el-icon-upload"
        size="mini"
        type="primary"
        @click="DlgOpened"
    >
      Tải ảnh
    </el-button>
    <el-dialog
        :visible.sync="dialogImageUpload"
        :modal="false"
        @close="closeDlg"
    >
      <el-upload
          ref="upload"
          :multiple="true"
          :show-file-list="true"
          class="editor-slide-upload"
          list-type="picture-card"
          :file-list="list"
          :limit="3"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="onFileSelected"
          :on-remove="handleRemove"
          accept="image/x-png,image/gif,image/jpeg"
          action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
      >
        <el-button size="small" type="primary">
          Chọn ảnh
        </el-button>
      </el-upload>
      <el-button @click="CancelDlgImg">
        Hủy
      </el-button>
      <el-button
          type="primary"
          :disabled="disSubmit"
          @click="handleSubmit"
      >
        Xác nhận
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

import {showAlert, WARNING} from 'ff24-js/src/utils/AlertMessage';

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogImageUpload: false,
      disSubmit: false,
      listObj: {},
      fileList: [],
      list: [],
      formBase64: {}
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.formBase64).map(v => this.formBase64[v])
      if (!this.checkAllSuccess()) {
        this.$message('Các ảnh đang được tải lên, Xin đợi vài phút! Nếu có vấn đề về mạng, hãy F5 lại trang hoặc tải lại File!')
        return
      }

      if (arr.length === 0) {
        this.$message('Bạn chưa tải ảnh nào lên')
        this.dialogImageUpload = false
      }

      this.dialogImageUpload = false
      this.$emit('successCBK', arr)
    },

    handleRemove(file, fileList) {
      delete this.formBase64[file.uid]
      var totalSize = 0
      fileList.forEach((item) => {
        totalSize += item.size
      })
      if (totalSize >= 5242880) {
        showAlert(this, WARNING, 'Dung lượng file lớn hơn 5MB, không thể gửi đi')
        this.disSubmit = true
      } else {
        this.disSubmit = false
        this.onFileSelected(event, fileList)
      }
    },
    onFileSelected(event, eventList) {
      this.list = []
      var totalSize = 0
      eventList.forEach((item) => {
        const idxDot = item.name.lastIndexOf('.') + 1
        const extFile = item.name.substr(idxDot, item.name.length).toLowerCase()
        if (!',jpg,jpeg,png,'.includes(`,${extFile},`)) {
          showAlert(this.$message, WARNING, 'File đính kèm chỉ cho phép dịnh dạng jpg/jpeg và png!')
          eventList.splice(eventList.indexOf(item), 1)
        } else {
          totalSize += item.size
          this.list.push(item)
        }
        const fileName = item.uid
        this.formBase64[fileName] = {}
        var reader = new FileReader()
        reader.readAsBinaryString(item.raw)
        reader.onloadend = () => {
          this.formBase64[fileName] = ({
            'filename': item.raw.name,
            'mime-type': item.raw.type,
            'data': btoa(reader.result)
          })
        }
        reader.onerror = function(error) {
          console.log('Error: ', error)
        }
      })
      if (totalSize >= 5242880) {
        showAlert(this, WARNING, 'Dung lượng file quá lớn, hãy chọn file nhỏ hơn 5MB')
        this.list.pop()
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`Bạn chỉ được chọn giới hạn là 3 ảnh một lần!`)
    },
    CancelDlgImg() {
      this.list = []
      this.dialogImageUpload = false
    },
    closeDlg() {
      this.list = []
    },
    DlgOpened() {
      this.disSubmit = false
      this.formBase64 = {}
      this.dialogImageUpload = true
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;

  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
