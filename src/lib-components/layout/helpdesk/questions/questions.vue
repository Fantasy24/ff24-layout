<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>CÂU HỎI THƯỜNG GẶP</span>
      </div>

      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-form ref="formSearch" :model="formSearch" :rules="rules" label-width="400px" style="margin: auto"
                   @keyup.enter.native="getListQuestions('formSearch')">
            <el-form-item prop="query" required>
              <el-autocomplete
                  v-model="formSearch.query"
                  :fetch-suggestions="querySearch"
                  :maxlength="255"
                  class="inline-input"
                  clearable
                  placeholder="Bạn cần trợ giúp điều gì...?"
                  prefix-icon="el-icon-search"
                  style="width: 600px; margin-right: 10px"
                  @select="handleSelect"
              />
              <el-button type="primary" @click="getListQuestions('formSearch')">Tìm Kiếm</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div>
        <div v-if="isShowResult" slot="header" class="clearfix" style="font-size: larger; color: #42464e">
          <div class="EmptyBox5"></div>
          <el-button type="primary" style="float: right; margin-right: 2%" @click="goBack"><em class="el-icon-back"/>Quay
            lại
          </el-button>
          <div class="EmptyBox5"></div>
          <p>Kết quả tìm kiếm cho <span style="font-weight: bold; font-size:large">"{{ varResult }}"</span>
          </p>
        </div>

        <div v-if="isShowNoRs" style="text-align: center">
          <div class="EmptyBox20"/>
          <span style="font-weight: bold; font-size: large; color: #42464e;">Xin lỗi bạn, không có kết quả nào phù hợp với từ khóa trên</span>
        </div>
        <div v-else>
          <div v-if="!isShowListFind">
            <el-container>
              <el-aside width="400px">
                <el-collapse
                    v-model="activeCategories"
                    accordion
                    @change="getListTitle"
                    v-for="(category, i) in listCategories"
                    :key="category + i"
                >
                  <el-collapse-item :name=category>
                    <template slot="title">
                      <em class="el-icon-folder-add" style="font-size: xx-large;"/> {{ category }}
                    </template>
                    <div v-for="title in listTitles">
                      <el-button type="text" @click="getListSubTilte(title)">
                        <em class="el-icon-folder" style="font-size: x-large;"/>
                        {{ title }}
                      </el-button>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-aside>

              <el-container>
                <el-main>
                  <div v-if="showTableData">
                    <el-collapse accordion v-for="(e, index) in listSearchAll" :key="e.title + index" v-if="!isShowBodySubTl">
                      <el-collapse-item>
                        <template slot="title">
                          <p class="idParaHover" style="font-weight: bold">{{ e.subtitle }}
                          </p>
                        </template>
                        <el-form>
                          <el-form-item label-width="130px">
                            <template slot="label">
                              <em class="el-icon-folder" style="font-size: x-large;"/> Danh mục
                            </template>
                            <span>{{ e.title }}</span>
                          </el-form-item>
                          <el-form-item label="Nội dung" label-width="130px">
                            <template slot="label">
                              <em class="el-icon-document" style="font-size: x-large;"/> Nội dung
                            </template>
                            <a target="_blank" :href="`${getUrl}/questions/BodyDetailView?${e.title}`">
                              <el-button type="text">
                                <el-tag>Xem chi tiết</el-tag>
                              </el-button>
                            </a>
                          </el-form-item>
                          <el-form-item label="Cập nhật lúc" label-width="130px">
                            <template slot="label">
                              <em class="el-icon-time" style="font-size: x-large;"/> Cập nhật lúc
                            </template>
                            <span>{{ e.date | formatFullDateTime_VN }}</span>
                          </el-form-item>

                        </el-form>
                      </el-collapse-item>
                    </el-collapse>
                  </div>

                  <div>
                    <el-collapse
                        v-model="activeSubTitles"
                        accordion
                        @change="getListBody"
                        v-for="(subTitle, i) in listSubTitles"
                        :key="subTitle + i"
                        v-if="isShowBodySubTl"
                    >
                      <el-collapse-item :name=subTitle>
                        <template slot="title">
                          <p class="idParaHover" style="font-weight: bold">{{ subTitle }}
                          </p>
                        </template>
                        <el-form v-for="(body, i) in listBody" :key="body.subtitle + i">
                          <el-form-item label-width="120px">
                            <template slot="label">
                              <em class="el-icon-folder"/> Danh mục
                            </template>
                            <span>{{ body.subtitle }}</span>
                          </el-form-item>
                          <el-form-item label-width="120px">
                            <template slot="label">
                              <em class="el-icon-document"/> Nội dung
                            </template>
                            <a target="_blank" :href="`${getUrl}/questions/BodyDetailView?${subTitle}`">
                              <el-button type="text">
                                <el-tag>Xem chi tiết</el-tag>
                              </el-button>
                            </a>
                          </el-form-item>
                          <el-form-item label-width="120px">
                            <template slot="label">
                              <em class="el-icon-time"/> Cập nhật lúc
                            </template>
                            <span>{{ body.date | formatFullDateTime_VN }}</span>
                          </el-form-item>

                        </el-form>

                      </el-collapse-item>
                    </el-collapse>
                  </div>

                </el-main>
              </el-container>

            </el-container>
          </div>
          <!--                  end-collapse body Subtitle-->

          <div v-if="isShowListFind">
            <el-collapse accordion v-for="(e, index) in tableData" :key="e.title + index" v-if="!isShowBodySubTl">
              <el-collapse-item>
                <template slot="title">
                  <p class="idParaHover" style="font-weight: bold">{{ e.title }}
                    <em v-if="e.isShowIcon" class="header-icon el-icon-info"/>
                  </p>
                </template>
                <el-form>
                  <el-form-item label-width="130px">
                    <template slot="label">
                      <em class="el-icon-folder" style="font-size: x-large;"/> Danh mục
                    </template>
                    <span>{{ e.subtitle }}</span>
                  </el-form-item>
                  <el-form-item label-width="130px">
                    <template slot="label">
                      <em class="el-icon-document" style="font-size: x-large;"/> Nội dung
                    </template>
                    <a target="_blank" :href="`${getUrl}/questions/BodyDetailView?${e.title}`">
                      <el-button type="text">
                        <el-tag>Xem chi tiết</el-tag>
                      </el-button>
                    </a>
                  </el-form-item>
                  <el-form-item label-width="130px">
                    <template slot="label">
                      <em class="el-icon-time" style="font-size: x-large;"/> Cập nhật lúc
                    </template>
                    <span>{{ e.date | formatFullDateTime_VN }}</span>
                  </el-form-item>

                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!--                  end-collapse tableData-->
        </div>
      </div>
      <div id="refDlg" class="EmptyBox20"/>
    </el-card>
  </div>
</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory';
import ConstantAPI from 'etc-js/src/utils/ConstantAPI';
import {ERROR, showAlert} from 'etc-js/src/utils/AlertMessage';
import {MENU_CODE_API_HELPDESK} from 'etc-js/src/utils/Constant';

export default {
  data() {
    return {
      b: [],
      listSearchAll: [],
      listTitles: [],
      listCategories: [],
      tableData: [],
      listSubTitles: [],
      listBody: [],
      links: [],
      activeCategories: [''],
      activeSubTitles: [],
      isShowResult: false,
      isShowNoRs: false,
      isShowBodySubTl: false,
      isShowListFind: false,
      formSearch: {
        query: ''
      },
      varResult: '',
      getUrl: '',
      typeList: 'KnowledgeBase::Answer::Translation',
      isShowFolder: false,
      showTableData: true,
      rules: {
        query: [
          {required: true, message: 'Hãy điền vào ô tìm kiếm'},
          {min: 3, message: 'Câu hỏi cần ít nhất 3 kí tự', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.callApiAutoComplete()
    this.getListCategories()
    this.getListBody()
    this.getUrl = `${process.env.VUE_APP_CONTEXT_ROOT}/#/helpdesk`
  },

  methods: {
    getListQuestions(formSearch) {
      if (this.formSearch.query.trim() && this.formSearch.query.trim().length >= 3) {
        this.isShowResult = true
      }
      this.$refs[formSearch].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isShowNoRs = false
        this.isShowListFind = true

        apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS, {}, this.formSearch, {}).then(rs => {
          if (rs.details.length === 0) {
            this.isShowNoRs = true
          }
          this.tableData = rs.details
          this.varResult = this.formSearch.query
          this.isShowBodySubTl = false
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].body === undefined) {
              this.tableData[i].isShowIcon = false
            } else {
              this.tableData[i].isShowIcon = true
            }
          }
        }).catch(err => {
          showAlert(this, ERROR, 'Lỗi! ' + err.message)
          this.loadingData = false
        })

      })
    },
    getListCategories() {
      this.listCategories = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach(element => {
          if (element.subtitle === null)
            this.listCategories.push(element.title)
        })

      })
    },
    getListTitle(val) {
      this.listTitles = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach(element => {
          if (element.subtitle === val)
            this.listTitles.push(element.title)
        })

      })
    },
    getListSubTilte(val) {
      this.isShowBodySubTl = true
      this.listSubTitles = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach(element => {
          if (element.subtitle === val)
            this.listSubTitles.push(element.title)
        })
      })
    },

    getListBody(val) {
      this.listBody = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach(element => {
          if (element.title === val)
            this.listBody.push(element)
        })
      })
    },
    BodyDetailView(val) {
      console.log('val', val)
    },
    querySearch(queryString, cb) {
      this.links = this.loadAll()
      var links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links
      // call callback function to return suggestions
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    callApiAutoComplete() {
      this.b = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach((item) => {
          if (item.type === this.typeList) {
            this.listSearchAll.push(item)
          }
        })
        rs.details.forEach(element => {
          if (element.body) {
            this.b.push({value: element.subtitle, link: element.url})
          }
        })
      })

    },
    loadAll() {
      return this.b
    },
    handleSelect(item) {
      console.log(item)
    },
    goBack() {
      this.isShowListFind = !this.isShowListFind
      this.isShowResult = !this.isShowResult
    }
  }
}
</script>

<style scoped>
.idParaHover:hover {
  color: #1890ff;
}

hr {
  border: none;
  height: 1px;
  /* Set the hr color */
  color: #333; /* old IE */
  background-color: #333; /* Modern Browsers */
}

a {
  transition: border-bottom-color .2s;
}
</style>
