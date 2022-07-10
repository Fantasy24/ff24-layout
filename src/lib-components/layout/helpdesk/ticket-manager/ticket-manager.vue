<template>
  <div class="app-container">
    <el-card>
      <span><strong>DANH SÁCH TICKET</strong></span>
      <el-form ref="formSearch" :model="formSearch" label-width="90px" @keyup.enter.native="getTokenZammad('')">
        <el-form-item style="float: right">
          <el-input
              id="querySearchTk"
              v-model="formSearch.query"
              :maxlength="255"
              clearable
              style="width: 300px; margin-right: 10px"
          />
          <el-button
              id="btnSearchTk"
              ref="btnSearch"
              icon="el-icon-search"
              plain
              type="primary"
              @click="getTokenZammad('')"
          >
            Tìm Kiếm
          </el-button>

          <el-button
              v-if="isShowBtnRefresh"
              id="btnRefeshTk"
              plain
              icon="el-icon-refresh"
              type="info"
              @click="refreshTicket"
          >
            Làm mới
          </el-button>

          <el-button
              id="btnOnPreInsertTk"
              plain
              icon="el-icon-plus"
              type="success"
              @click="onPreInsert()"
          >
            Thêm mới
          </el-button>
        </el-form-item>
      </el-form>

      <div class="EmptyBox20"/>

      <div>
        <el-table
            id="tableDataTk"
            v-loading="loadingData"
            :data="tableData"
            border
            fit
            style="width: 100%"
            @sort-change="sortChange"
        >
          <el-table-column
              id="colNumberTk"
              :index="(index) => {return ((formSearch.page >= 1 ? formSearch.page - 1 : formSearch.page >= 1) * formSearch.per_page) + index + 1}"
              align="center"
              label="STT"
              type="index"
              width="80"
          />
          <el-table-column id="colIDTk" align="center" label="ID" prop="id" sortable="custom" width="80"/>
          <el-table-column id="colTitleTk" label="Tiêu đề" prop="title" show-overflow-tooltip/>
          <el-table-column
              id="colPriority_idTk"
              align="center"
              label="Độ ưu tiên"
              prop="priority_id"
              show-overflow-tooltip
              sortable="custom"
              width="150"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.priority_id === 1" type="info">Thấp</el-tag>
              <el-tag v-if="scope.row.priority_id === 2" type="warning">Trung bình</el-tag>
              <el-tag v-if="scope.row.priority_id === 3" type="danger">Cao</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              id="colCreated_atTk"
              align="center"
              label="Ngày tạo"
              prop="created_at"
              sortable="custom"
              show-overflow-tooltip
              width="150"
          >
            <template slot-scope="{row}">
              <span>{{ row.created_at | formatFullDateTime_VN }}</span>
            </template>
          </el-table-column>
          <el-table-column
              id="colUpdated_atTk"
              align="center"
              label="Ngày cập nhật"
              sortable="custom"
              prop="updated_at"
              show-overflow-tooltip
              width="150"
          >
            <template slot-scope="{row}">
              <span>{{ row.updated_at | formatFullDateTime_VN }}</span>
            </template>
          </el-table-column>
          <el-table-column
              id="colClose_atTk"
              align="center"
              label="Ngày xử lý xong"
              sortable="custom"
              prop="close_at"
              show-overflow-tooltip
              width="150"
          >
            <template slot-scope="{row}">
              <span>{{ row.close_at | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
              id="colState_idTk"
              align="center"
              label="Trạng thái"
              prop="state_id"
              sortable="custom"
              width="150"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_id === 4" type="success">Đóng</el-tag>
              <el-tag v-if="scope.row.state_id === 1" type="danger">Mới</el-tag>
              <el-tag v-if="scope.row.state_id === 2" type="warning">Mở</el-tag>
              <el-tag v-if="scope.row.state_id === 3" type="danger">Lời nhắc đang xử lý</el-tag>
              <el-tag v-if="scope.row.state_id === 7" type="primary">Đang chờ đóng</el-tag>
            </template>
          </el-table-column>
          <el-table-column id="colHandleTk" align="center" fixed="right" label="Thao tác" width="80">
            <template slot-scope="scope">
              <el-tooltip
                  :open-delay="350"
                  content="Xem chi tiết nội dung Ticket"
                  effect="light"
                  placement="top-start"
              >
                <el-button
                    id="btnViewTk"
                    :loading="iconViewLoading"
                    circle
                    icon="el-icon-view"
                    size="mini"
                    type="success"
                    @click="onView(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="EmptyBox20"/>

      <pagination
          v-show="total > 0"
          id="pageTk"
          :limit.sync="formSearch.per_page"
          :page-sizes="[5, 10, 15, 20]"
          :page.sync="formSearch.page"
          :popper-class="changeSize"
          :total="total"
          @pagination="getTokenZammad"
      />
    </el-card>

    <div>
      <el-dialog
          id="dlgAddTk"
          :close-on-click-modal="false"
          :title="titleDlg"
          :visible.sync="isShowDlgAdd"
          width="40%"
          @close="onResetForm('formAdd')"
      >
        <el-form id="formAddTk" ref="formAdd" :model="formAdd" :rules="rules" label-width="200px">
          <el-form-item label="Tiêu đề" prop="title">
            <el-input
                id="formAddTitleTk"
                v-model="formAdd.title"
                :maxlength="250"
                placeholder="Tiêu đề"
                prefix-icon="el-icon-edit"
                show-overflow-tooltip
                show-word-limit
            />
          </el-form-item>

          <el-form-item v-if="hiddenInput" label="Name" prop="name">
            <span class="viewSpan">{{ ufn }}</span>
          </el-form-item>

          <el-form-item v-if="hiddenInput" label="Email" prop="email">
            <span class="viewSpan">{{ email }}</span>
          </el-form-item>

          <el-form-item label="Nội dung" prop="body">
            <el-input
                id="formAddBodyTk"
                v-model="formAdd.body"
                :maxlength="500"
                :rows="5"
                placeholder="Nhập nội dung..."
                show-word-limit
                type="textarea"
            />
          </el-form-item>

          <el-form-item label="Đính kèm tệp (nếu có)">
            <el-upload
                id="formAddFileUploadTk"
                ref="upload"
                :auto-upload="false"
                :on-change="onFileSelected"
                :on-remove="onRemove"
                accept="image/x-png,image/gif,image/jpeg"
                action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
                class="upload-demo"
            >
              <el-button id="formAddBtnUploadTk" slot="trigger" size="small" type="primary">Chọn file</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item v-if="hiddenInput" label="Thông báo lỗi" prop="title">
            <span class="viewSpan">{{ formAdd.title }}</span>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
              id="formAddBtnSubmitTk"
              :disabled="disSubmit"
              :loading="buttonSubmitCreateLoading"
              type="primary"
              @click="onSubmit('formAdd')"
          >Gửi</el-button>
          <el-button id="formAddBtnCancelTk" @click="CancelDlg">Hủy</el-button>
        </span>
      </el-dialog>
    </div>
    <!--    end-dialg-create-->

    <div>
      <el-dialog
          id="dlgViewTk"
          :close-on-click-modal="false"
          :lock-scroll="false"
          :title="titleDlg"
          :visible.sync="dialogTableVisible"
          width="70%"
          @close="closeViewTicket"
      >
        <div class="test-scroll" style="height: 600px; overflow: auto">
          <div class="block">
            <el-timeline>

              <el-timeline-item v-if="isHiddenReply">
                <el-card>
                  <el-form id="formReplyTk" ref="formReply" :model="formReply" :rules="rulesFormReply">
                    <el-form-item
                        label="Tiêu đề"
                        placeholder="Tiêu đề"
                        prefix-icon="el-icon-edit"
                        prop="subject"
                        show-overflow-tooltip
                        show-word-limit
                    >
                      <el-input id="formReplySubjectTk" v-model="formReply.subject" :maxlength="250" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="Nội dung" prop="body" required>
                      <el-input
                          id="formReplyBodyTk"
                          v-model="formReply.body"
                          :maxlength="500"
                          :rows="5"
                          placeholder="Nhập nội dung..."
                          show-word-limit
                          type="textarea"
                      />
                    </el-form-item>
                    <el-form-item label="Đính kèm tệp (nếu có)">
                      <el-upload
                          id="formReplyFileUploadTk"
                          ref="upload"
                          :auto-upload="false"
                          :on-change="onFileSelectedReponse"
                          :on-remove="onRemoveReponse"
                          accept="image/x-png,image/gif,image/jpeg"
                          action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
                          class="upload-demo"
                      >
                        <el-button id="formReplyBtnUploadTk" slot="trigger" size="small" type="primary">Chọn file
                        </el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button id="formReplyBtnSubmitTk" :disabled="disSubmitReply" type="primary"
                                 @click="onReply('formReply')"
                      >Gửi phản hồi
                      </el-button>
                      <el-button id="formReplyBtnCancelTk" @click="isHiddenReply = false; disSubmitReply = false">Hủy
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-timeline-item>

              <div v-else style="float: right; position: fixed; z-index: 999999999999; right: 347px">
                <el-button v-if="rowData.isCheckStatus " id="btnOnPreReplyTk" type="primary"
                           @click="onPreReply('formReply')"
                >Phản hồi
                </el-button>
                <el-button id="btnCancelReplyTk" @click="dialogTableVisible = false">Hủy</el-button>
              </div>
              <div class="EmptyBox20" style="height: 47px !important"/>

              <el-timeline-item
                  v-for="(element, index) in tableDataDetail"
                  :id="dataViewTk + index"
                  :key="index"
                  :timestamp="element.created_at | formatFullDateTime_VN "
                  placement="top"
              >
                <el-card :class="{active: element.isActive}">
                  <el-container>
                    <el-header>
                      <h4 id="dataFormTk">Người gửi: {{ element.from }}</h4>
                    </el-header>

                    <el-main>
                      <span id="dataSubjectTk" class="viewSpan">
                        <em class="el-icon-message"/> Tiêu đề: {{ element.subject }}
                      </span>

                      <p id="dataBodyTk" class="viewSpan" v-html="element.body"/>

                      <div v-if="element.attachments.length > 0" class="attachments attachments--list">
                        <div id="dataAttachmentsLengthTk" class="attachments-title">
                          <h3>
                            <em class="el-icon-paperclip"/>
                            Có {{ element.attachments.length }} file đính kèm </h3>
                        </div>

                        <el-row
                            v-for="e in (element.attachments)"
                            :key="e.index"
                            class="a"
                        >
                          <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                              <em class="custom-icon el-icon-document"/>
                              <div class="file">
                                <span id="dataFileNameUploadTk" class="attachment-name u-highlight">{{
                                    e.filename
                                  }}</span>
                                <div id="dataFileSizeUploadTk" class="attachment-size">{{ e.size }}</div>
                              </div>
                            </div>

                          </el-col>
                          <el-col
                              :span="4"
                          >
                            <el-button id="btnDownloadFileSelectedTk" type="primary"
                                       @click="DownloadFile(element.id, e.id, e.filename)"
                            >
                              Tải về
                              <em class="el-icon-download el-icon-right"/>
                            </el-button>
                          </el-col>

                        </el-row>

                      </div>
                    </el-main>

                    <el-footer>
                      <span id="dataUpdate_atTk">
                        <em class="el-icon-check"/> Cập nhật lúc {{ element.updated_at | formatFullDateTime_VN }}
                      </span>
                    </el-footer>
                  </el-container>
                </el-card>

              </el-timeline-item>

            </el-timeline>
          </div>
          <template>
            <el-backtop style="right: 220px" target=".test-scroll"/>
          </template>
        </div>
      </el-dialog>
    </div>
    <!--    end-detail-->
  </div>
</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory'
import ConstantAPI from 'etc-js/src/utils/ConstantAPI'
import {errAlert, showAlert, SUCCESS, WARNING} from 'etc-js/src/utils/AlertMessage'
import {mapGetters} from 'vuex'
import {MENU_CODE_API_HELPDESK, PAGINATION_PARAM} from 'etc-js/src/utils/Constant'
import Pagination from '../../../../components/Pagination/index.vue'
import Tinymce from '../../../../components/Tinymce/index.vue'

export default {
  components: {
    Pagination,
    Tinymce
  },
  data() {
    return {
      form: {
        data: this.fingerprint()
      },
      isShowBtnRefresh: false,
      isActiveCssSender: false,
      disSubmit: false,
      disSubmitReply: false,
      loadingData: false,
      dialogFormVisible: false,
      isHiddenReply: false,
      dialogTableVisible: false,
      buttonSubmitCreateLoading: false,
      iconViewLoading: false,
      isShowDlgAdd: false,
      hiddenInput: false,
      form_config: 'form_config',
      changeSize: 'changePageSizeTicket',
      titleDlg: '',
      dataViewTk: 'dataViewTk',
      tokenZammad: '',
      total: 0,
      tableData: [],
      tableDataDetail: [],
      rowData: {},
      formAdd: {
        title: '',
        name: '',
        file: [],
        email: '',
        body: '',
        token: '',
        fingerprint: this.fingerprint(),
        // formview
        ticket_id: '',
        subject: '',
        created_at: '',
        updated_at: '',
        close_at: ''
      },
      formReply: {
        formReply: '',
        to: '',
        cc: '',
        attachments: [],
        subject: '',
        body: '',
        content_type: 'text/html',
        type: 'note',
        internal: false,
        time_unit: '0'
      },
      options: [
        {
          value: 5,
          label: '05/trang'
        },
        {
          value: 10,
          label: '10/trang'
        },
        {
          value: 15,
          label: '15/trang'
        },
        {
          value: 20,
          label: '20/trang'
        }
      ],
      rules: {
        title: [
          {required: true, message: 'Tiêu đề bắt buộc nhập'}
        ],
        name: [
          {required: true, message: 'Tiêu đề bắt buộc nhập'}
        ],
        email: [
          {required: true, message: 'Email bắt buộc nhập'}
        ],
        body: [
          {required: true, message: 'Nội dung bắt buộc nhập'}
        ]
      },
      rulesFormReply: {
        body: [
          {required: true, message: 'Nội dung bắt buộc nhập'}
        ],
        subject: [
          {required: true, message: 'Tiêu đề bắt buộc nhập'}
        ]
      },
      formSearch: {
        page: PAGINATION_PARAM.pageTicket,
        per_page: PAGINATION_PARAM.size,
        query: '',
        expand: true
      },
      formOrder: {
        query: '',
        expand: true
      }
    }
  },
  mounted() {
    this.formAdd.name = this.ufn
    this.formAdd.email = this.email
    this.getTokenZammad()
  },

  computed: {
    ...mapGetters([
      'ufn',
      'email',
      'uid'
    ])
  },
  methods: {
    getTokenZammad(mode) {
      if (this.tokenZammad !== '') {
        this.onCallApiGetListTicket(mode)
        return
      }
      this.$refs['formSearch'].validate((valid) => {
        if (!valid) {
          return false
        }

        apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].GET_TOKEN_ZAMMAD).then(rs => {
          this.tokenZammad = rs
          this.onCallApiGetListTicket(mode)
        }).catch(() => {
          showAlert(this, WARNING, 'Bạn chưa có Ticket nào trên hệ thống ZAMMAD, vui lòng thêm mới Ticket')
        })
      })
    },

    onPreventChar($event) {
      if (($event.keyCode === 45 || $event.keyCode === 48 || ($event.keyCode < 48 || $event.keyCode > 57))) {
        $event.preventDefault()
      }
    },

    onCallApiGetListTicket(mode) {
      this.formSearch.page = mode === '' ? 1 : this.formSearch.page
      this.loadingData = true
      if (this.formSearch.page < 1) {
        this.formSearch.page = 1
      }
      this.formSearch.query = this.formSearch.query.trim()
      apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].GET_TABLE, {}, this.formSearch, {'Authorization': `Bearer ${this.tokenZammad}`}).then(rs => {
        this.tableData = rs.tickets
        if (this.tableData) {
          this.isShowBtnRefresh = true
        }
        this.total = rs.count
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].state_id === 1 || this.tableData[i].state_id === 2 || this.tableData[i].state_id === 3 || this.tableData[i].state_id === 7) {
            this.tableData[i].isCheckStatus = true
          }
        }
        this.loadingData = false

        const classAscending = document.getElementsByClassName('sort-caret ascending')
        for (let i = 0; i < classAscending.length; i++) {
          classAscending[i].id = `sort-caret ascending-` + i
        }

        const classDescending = document.getElementsByClassName('sort-caret descending')
        for (let i = 0; i < classDescending.length; i++) {
          classDescending[i].id = `sort-caret descending-` + i
        }
      }).catch(() => {
        this.loadingData = false
        showAlert(this, WARNING, 'Hệ thống đang bảo trì, vui lòng thử lại sau vài phút!')
      })
    },
    onView(rowData) {
      this.rowData = rowData
      this.onViewById(rowData.id)
    },
    onViewById(id) {
      this.titleDlg = `CHI TIẾT TICKET - ID : ${id}`
      this.formReply.ticket_id = id
      this.hiddenInput = true
      this.dialogTableVisible = true
      this.iconViewLoading = true
      apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].GET_DETAIL, {}, {}, {'Authorization': `Bearer ${this.tokenZammad}`}, `${id}`).then(rs => {
        this.tableDataDetail = rs

        this.reveseTableDetailData(this.tableDataDetail)

        for (let i = 0; i < this.tableDataDetail.length; i++) {
          if (this.tableDataDetail[i].created_by === this.uid) {
            this.isActiveCssSender = true
            this.tableDataDetail[i].isActive = this.isActiveCssSender
          }
          if (this.tableDataDetail[i].state_id === 4) {
            this.tableDataDetail[i].isHiddenReply = false
          }
          this.tableDataDetail[i].body = this.tableDataDetail[i].body.replace('src="/api/v1/ticket_attachment', `src="${process.env.VUE_APP_ZAMMAD}/api/v1/ticket_attachment`)
        }
        document.getElementsByClassName('test-scroll')[0].scrollTop = 0
        this.loadingData = false
        this.iconViewLoading = false
      }).catch(err => {
        this.loadingData = false
        this.iconViewLoading = false
        errAlert(this, err)
      })
    },

    reveseTableDetailData(tableDetail) {
      tableDetail.reverse()
    },

    onPreInsert() {
      this.titleDlg = 'GỬI YÊU CẦU'
      this.hiddenInput = false
      if (this.$refs.formAdd) {
        this.$refs.formAdd.resetFields()
      }
      if (this.$refs.upload) {
        this.$refs['upload'].value = ''
      }
      this.formAdd.title = ''
      this.formAdd.body = ''
      this.isShowDlgAdd = true
      this.fingerprint()
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].INSERT, {'fingerprint': this.fingerprint()}).then((rs) => {
        this.formAdd.token = rs.token
      }).catch(err => {
        errAlert(this, err)
      })
    },

    fingerprint() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const txt = 'https://zammad.com'
      ctx.textBaseline = 'top'
      ctx.font = '12px \'Arial\''
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText(txt, 2, 15)
      ctx.fillStyle = 'rgba(100, 200, 0, 0.7)'
      ctx.fillText(txt, 4, 17)
      return canvas.toDataURL()
    },

    //  create a question
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        var value = this
        this.buttonSubmitCreateLoading = true
        const formData = new FormData()
        formData.append('name', this.ufn)
        formData.append('email', this.formAdd.email)
        formData.append('body', this.formAdd.body)
        for (let i = 0; i < value.formAdd.file.length; i++) {
          formData.append('file[]', this.formAdd.file[i])
        }

        formData.append('title', this.formAdd.title)
        formData.append('token', this.formAdd.token)
        formData.append('fingerprint', this.formAdd.fingerprint)
        apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].SUBMIT, formData, {}, {'Authorization': `Bearer ${this.tokenZammad}`}).then(() => {
          showAlert(this, SUCCESS, 'Cảm ơn bạn đã đặt câu hỏi ! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. !')
          this.isShowDlgAdd = false
          this.buttonSubmitCreateLoading = false
          this.getTokenZammad()
        }).catch(err => {
          showAlert(this, WARNING, 'Hệ thống đang bảo trì!')

          this.buttonSubmitCreateLoading = false
        })
      })
    },

    onResetForm(formName) {
      this.disSubmit = false
      this.$refs.upload.clearFiles()
      this.$refs[formName].resetFields()
    },

    onPreReply() {
      document.getElementsByClassName('test-scroll')[0].scrollTop = 0
      this.dialogFormVisible = true
      this.isHiddenReply = true
      this.formReply.subject = ''
      this.formReply.body = ''
      this.formReply.attachments = []
    },

    onReply(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loadingData = true
        var value = this

        apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].REPLY, value.formReply, {}, {'Authorization': `Bearer ${this.tokenZammad}`}).then((rs) => {
          this.isHiddenReply = false
          this.onViewById(this.formReply.ticket_id)
          showAlert(this, SUCCESS, 'Cảm ơn bạn đã phản hồi ! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. !')
        }).catch(err => {
          this.buttonSubmitCreateLoading = false
          this.loadingData = false
          errAlert(this, err)
        })
      })
    },

    onchange(value) {
      this.formSearch.page = 2
      value = this.formSearch.per_page
      this.onCallApiGetListTicket()
      if (this.$refs.btnSearch !== undefined) {
        this.$nextTick(() => {
          this.$refs.btnSearch.$el.focus()
        })
      }
    },

    DownloadFile(idFile, id, name) {
      apiFactory.downloadFile(ConstantAPI[MENU_CODE_API_HELPDESK].DOWNLOAD_FILE, name, {}, {}, {'Authorization': `Bearer ${this.tokenZammad}`}, `${this.formReply.ticket_id}/${idFile}/${id}?disposition=attachment`).then((rs) => {
        this.isHiddenReply = false
      })
    },

    onFileSelected(event, eventList) {
      this.disSubmit = false
      var totalSize = 0
      const valueFormAdd = this
      valueFormAdd.formAdd.file = []
      eventList.forEach((item) => {
        const idxDot = item.name.lastIndexOf('.') + 1
        const extFile = item.name.substr(idxDot, item.name.length).toLowerCase()
        if (!',jpg,jpeg,png,'.includes(`,${extFile},`)) {
          showAlert(this, WARNING, 'File đính kèm chỉ cho phép dịnh dạng jpg/jpeg và png!')
          eventList.splice(eventList.indexOf(item), 1)
        } else {
          this.disSubmit = false
          totalSize += item.size
          valueFormAdd.formAdd.file.push(item.raw)
        }
      })
      if (totalSize >= 5242880) {
        showAlert(this, WARNING, 'Dung lượng file quá lớn, hãy chọn file nhỏ hơn 5MB')
        this.disSubmit = true
      }
    },

    onFileSelectedReponse(event, eventList) {
      var totalSize = 0
      const valueFormAdd = this
      valueFormAdd.formReply.attachments = []
      eventList.forEach((item) => {
        const idxDot = item.name.lastIndexOf('.') + 1
        const extFile = item.name.substr(idxDot, item.name.length).toLowerCase()
        if (!',jpg,jpeg,png,'.includes(`,${extFile},`)) {
          showAlert(this, WARNING, 'File đính kèm chỉ cho phép dịnh dạng jpg/jpeg và png!')
          eventList.splice(eventList.indexOf(item), 1)
        } else {
          totalSize += item.size
          var reader = new FileReader()
          reader.readAsBinaryString(item.raw)
          reader.onloadend = function () {
            valueFormAdd.formReply.attachments.push({
              'filename': item.raw.name,
              'mime-type': item.raw.type,
              'data': btoa(reader.result)
            })
          }
          reader.onerror = function (error) {
            console.log('Error: ', error)
          }
        }
      })
      if (totalSize >= 5242880) {
        showAlert(this, WARNING, 'Dung lượng file quá lớn, hãy chọn file nhỏ hơn 5MB')
        this.disSubmit = true
      } else {
        this.disSubmit = false
      }
    },

    onRemove(file, fileList) {
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

    onRemoveReponse(file, fileList) {
      var totalSize = 0
      fileList.forEach((item) => {
        totalSize += item.size
      })
      if (totalSize >= 5242880) {
        showAlert(this, WARNING, 'Dung lượng file lớn hơn 5MB, không thể gửi đi')
        this.disSubmitReply = true
      } else {
        this.disSubmitReply = false
        this.onFileSelectedReponse(event, fileList)
      }
    },

    CancelDlg() {
      this.disSubmit = false
      this.isShowDlgAdd = false
      this.$refs.upload.clearFiles()
    },

    sortChange(column) {
      this.formOrder.sort_by = column.prop
      // this.formOrder.order_by = column.order
      if (column.order === 'ascending') {
        this.formOrder.order_by = 'asc'
      }
      if (column.order === 'descending') {
        this.formOrder.order_by = 'desc'
      }
      this.formOrder.page = this.formSearch.page
      this.formOrder.per_page = this.formSearch.per_page
      apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].GET_TABLE, {}, this.formOrder, {'Authorization': `Bearer ${this.tokenZammad}`}).then(rs => {
        this.tableData = rs.tickets
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].index = (i + 1) + ((this.formSearch.page - 2) * this.formSearch.per_page)
        }
        this.loadingData = false
      }).catch(err => {
        this.loadingData = false
        errAlert(this, err)
      })
    },

    refreshTicket() {
      this.getTokenZammad()
    },
    closeViewTicket() {
      this.isShowDlgAdd = false
      this.isHiddenReply = false
      this.disSubmit = false
    }

  }
}
</script>

<style>

.file {
  display: inline-block;
}

.custom-icon {
  font-size: xx-large;
  padding-right: 10px;
}

.attachments-title {
  font-weight: bold;
}

.el-icon-close:hover {
  background-color: #409eff;
  border-radius: 50%;
  color: #FFFFFF;
}

.active {
  background-color: #C7e5fb;
  color: #585856;
}

.showPagination button:hover {
  color: #409eff;
}

</style>
