<template>
  <div>
    <div v-if="!isShowDtl" class="dialog-container infinite-list-wrapper">
      <el-timeline
        v-infinite-scroll="onPageInfinite"
        :infinite-scroll-disabled="disabled"
        class="list"
        style="margin-left: -6% !important"
      >
        <el-timeline-item
          v-for="(i, index) in syncData"
          :key="i.alertId"
          :timestamp="`${formatFullDateTime_VN(new Date(i.createdAt))}   #${
            index + 1
          }`"
          placement="top"
        >
          <span
            slot="dot"
            :style="{
              'background-color': `${!i.isReadStatus ? 'red' : 'green'}`,
            }"
            class="unRead"
          />

          <el-card>
            <el-row>
              <el-col :span="23">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="
                    onClickDetail(i);
                    i.isReadStatus = true;
                  "
                >
                  <span style="color: #1482f0">{{
                    i.itemCode + " - " + i.itemName
                  }}</span>
                  <p v-if="i.itemType !== 'APPLICATION'" class="content-notify">
                    {{ getContentByItemType(i) }}
                  </p>
                  <p
                    v-if="i.itemType === 'APPLICATION'"
                    class="content-notify"
                    v-html="getContentByItemType(i)"
                  />
                  <div class="bottom clearfix">
                    <p style="font-size: 11px; font-style: italic">
                      <em class="el-icon-user" />
                      {{ i.createdBy ? i.createdBy : "" }}
                    </p>
                  </div>
                </el-link>
              </el-col>

              <el-col :span="1">
                <el-tooltip
                  :open-delay="300"
                  content="Xóa"
                  placement="top-start"
                >
                  <el-popconfirm
                    cancel-button-text="Không"
                    confirm-button-text="Có"
                    icon="el-icon-info"
                    icon-color="red"
                    title="Bạn có chắc muốn xóa thông báo này?"
                    @cancel="onCancelDel"
                    @confirm="onClickDelNoity(i, index)"
                  >
                    <el-button
                      slot="reference"
                      icon="el-icon-close"
                      style="color: red"
                      type="text"
                    />
                  </el-popconfirm>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-divider v-if="loading"
        ><em class="el-icon-loading" /> Đang tải...</el-divider
      >
      <el-divider v-if="noMore">{{
        this.syncData.length <= 0 ? "Không có thông báo" : "Hết"
      }}</el-divider>
    </div>
    <detail
      v-else
      v-loading="loadDtl"
      :data="itemClicked"
      :show.sync="isShowDtl"
    />
  </div>
</template>

<script>
import apiFactory from "ff24-js/src/api/apiFactory";
import Detail from "./DetailNotify.vue";
import ConstantAPI from "ff24-js/src/utils/ConstantAPI";
import { errAlert } from "ff24-js/src/utils/AlertMessage";
import { formatFullDateTime_VN, formatDate } from "ff24-js/src/filters";
import { mapComputed } from "ff24-js/src/utils";

export default {
  name: "TabContent",
  components: {
    Detail,
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    total: Number,
    loading: Boolean,
  },
  data() {
    return {
      itemClicked: {},
      isShowDtl: false,
      loadDtl: false,
    };
  },
  computed: {
    noMore() {
      return this.syncData.length >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    syncData: mapComputed("data"),
  },
  methods: {
    onPageInfinite($event) {
      this.$emit("infiniteLoading", $event);
    },
    onClickDetail(item) {
      this.isShowDtl = true;
      this.loadDtl = true;
      const params = {
        appCode: process.env.VUE_APP_APP_CODE,
        id: item.alertId,
      };
      apiFactory
        .callAPI(ConstantAPI.NOTIFY.DETAIL, {}, params)
        .then((rs) => {
          this.refreshCount();
          if (!rs || rs === "") {
            this.itemClicked = {
              itemName: "",
              createdAt: "",
              viewContent: "",
              viewUrl: "",
            };
          } else {
            this.itemClicked = rs;
          }
        })
        .catch((err) => {
          errAlert(this, err);
        })
        .finally(() => {
          this.loadDtl = false;
        });
    },

    refreshCount() {
      this.$emit("refreshCount");
    },

    onClickDelNoity(item, index) {
      this.onCancelDel();
      const params = {
        appCode: process.env.VUE_APP_APP_CODE,
        id: item.alertId,
      };
      apiFactory
        .callAPI(ConstantAPI.NOTIFY.DELETE, {}, params)
        .then((rs) => {
          this.onCancelDel();
          this.refreshCount();
          this.$emit("reload");
        })
        .catch((err) => {
          errAlert(this, err);
        })
        .finally(() => {
          this.loadDtl = false;
        });
    },

    onCancelDel() {
      this.$parent.$parent.$parent.dropdown.show();
    },

    formatFullDateTime_VN,
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

<style>
.unRead {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
}
.content-notify {
  font-size: 12px;
}
</style>
