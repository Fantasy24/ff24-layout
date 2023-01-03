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
        <strong>{{ data.itemName }}</strong>
        <el-divider style="font-size: 13px">
          {{ formatFullDateTime_VN(new Date(data.createdAt)) }}</el-divider
        >
        <!-- <span
          v-html="
            data.viewContent ? data.viewContent.replaceAll('\n', '<br/>') : ''
          "
        /> -->
        <span v-html="content" />

        <span v-if="data.viewUrl">
          <el-divider />
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
import { formatFullDateTime_VN, formatDate } from "ff24-js/src/filters";

export default {
  name: "DetailNotify",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    show: Boolean,
  },
  computed: {
    syncShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
    content() {
      return this.getContentByItemType(this.data);
    },
  },
  methods: {
    goBack() {
      this.syncShow = false;
    },
    formatFullDateTime_VN,
    formatDate,
    getContentByItemType(item) {
      let content = "";
      const lstMasterDataAll = JSON.parse(
        localStorage.getItem("LIST_MASTER_DATA")
      );
      const lstDVT = lstMasterDataAll.filter((obj) => obj.type === "DVT");
      const dvt = lstDVT.filter((objDvt) => item.unit === objDvt.propertyValue);
      let unit = "";
      if (dvt != null && dvt.length > 0) {
        unit = dvt[0].propertyName;
      }
      switch (item.itemType) {
        case "RESOURCE":
          content = "Số lượng ".concat(
            item.itemName,
            " còn lại trong kho là: ",
            item.quantityWarning,
            " ",
            unit
          );
          break;
        case "TOOL":
          content = "Số lượng ".concat(
            item.itemName,
            " còn lại trong kho là: ",
            item.quantityWarning,
            " ",
            unit
          );
          break;
        case "DEVICE":
          content = "".concat(
            item.itemName,
            " sắp đến ngày bảo dường: ",
            formatDate(new Date(item.nextMaintainDate))
          );
          break;
        case "APPLICATION":
          content = item.content;
          break;
      }

      return content;
    },
  },
};
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
  max-height: calc(100vh - 325px) !important;
}
</style>
