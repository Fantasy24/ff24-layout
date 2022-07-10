<template>
  <div class="container">
    <el-card>
      <div slot="header" class="clearfix">

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

        <el-form ref="formSearch" :model="formSearch" :rules="rules" label-width="450px" style="margin: auto"
                 @keyup.enter.native="getListQuestions()">
          <el-form-item prop="query">
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
      </div>

      <div>

        <div v-if="isShowResult" slot="header" class="clearfix" style="font-size: larger; color: #42464e">
          <div class="EmptyBox5"></div>
          <el-button type="primary" style="float: right; margin-right: 2%" @click="goBack"><em class="el-icon-back"/>
            Quay lại
          </el-button>
          <div class="EmptyBox5"></div>
          <p>Kết quả tìm kiếm cho <span style="font-weight: bold; font-size:large">"{{ varResult }}"</span>
          </p>
        </div>

        <div v-if="isShowNoRs" style="text-align: center">
          <div class="EmptyBox20"/>
          <span style="font-weight: bold; font-size: large; color: #42464e;">Xin lỗi bạn, không có kết quả nào phù hợp với từ khóa trên</span>
        </div>

        <div v-if="!isShowListFind">
          <el-row :gutter="20">
            <el-col :offset="6" :span="12">
              <el-card>
                <el-container v-if="!isShowContentSubTitle">
                  <el-header>
                    <h3 style="text-align: center;">
                      <em class="el-icon-reading" style="font-size: larger"/>
                      Chủ đề: {{ subTitle }}
                    </h3>
                  </el-header>
                  <div class="EmptyBox20"></div>
                  <el-main>
                    <el-button
                        v-for="detail in listDetail" style="display:block; width: 100%"
                        :key="detail.id"
                        type="text"
                        v-if="detail.body"
                        @click="getContentSubtitle(detail.id, detail.title)"
                    >
                      <el-card shadow="hover" style="color: #409eff; font-size: 14px;">
                        <em class="el-icon-tickets" style="font-size: large;"/>
                        {{ detail.title }}
                      </el-card>
                    </el-button>
                  </el-main>
                </el-container>

                <el-container v-if="isShowContentSubTitle">
                  <el-header height="30%">
                    <h3 style="text-align: center;">
                      <em class="el-icon-reading" style="font-size: larger"/>
                      {{ titleDetail }}</h3>
                    <el-button style="float: right" type="text">
                      <el-button type="primary" style="float: right; margin-right: 2%" @click="comeBack">
                        <em class="el-icon-back" style="font-weight: bold;"/>Quay lại
                      </el-button>
                    </el-button>
                  </el-header>
                  <div class="EmptyBox20"></div>
                  <el-main>
                    <p v-html="content" class="bodyContent"></p>
                    <em class="el-icon-check"/> <span>Cập nhật lúc {{ upadateDetail | formatFullDateTime_VN }}</span>
                  </el-main>
                </el-container>

              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-if="isShowListFind">
          <el-collapse v-for="(e,index) in tableData" :key="e.title + index" v-if="!isShowBodySubTl" accordion>
            <el-collapse-item>
              <template slot="title">
                <p class="idParaHover" style="font-weight: bold">{{ e.title }}
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
                  <a :href="`${getUrl}/questions/BodyDetailView?${e.title}`" target="_blank">
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

      </div>

      <div id="refDlg" class="EmptyBox20"/>

    </el-card>
  </div>

</template>

<script>
import apiFactory from 'etc-js/src/api/apiFactory';
import ConstantAPI from 'etc-js/src/utils/ConstantAPI';
import {ERROR, showAlert} from 'etc-js/src/utils/AlertMessage';
import {API_HELPDESK, MENU_CODE_API_HELPDESK} from 'etc-js/src/utils/Constant';

export default {
  name: 'BodyDetailView',
  data() {
    return {
      isShowContentSubTitle: false,
      isShowListFind: false,
      isShowNoRs: false,
      isShowResult: false,
      isShowBodySubTl: false,
      subTitle: '',
      upadateDetail: '',
      varResult: '',
      titleDetail: '',
      getUrl: '',
      content: '',
      formSearch: {
        query: ''
      },
      rules: {
        query: [
          {required: true, message: 'Hãy điền vào ô tìm kiếm'},
          {min: 3, message: 'Câu hỏi cần ít nhất 3 kí tự', trigger: 'blur'}
        ]
      },
      b: [],
      listDetail: [],
      tableData: [],
      listSearchAll: [],
      listFileImg: [],
      typeList: 'KnowledgeBase::Answer::Translation'
    };
  },
  mounted() {
    this.callApiAutoComplete();
    this.getSubTitleRoute();
    this.getUrl = `${process.env.VUE_APP_CONTEXT_ROOT}/#/helpdesk`;
  },
  methods: {
    getSubTitleRoute() {
      this.subTitle = '';
      for (let property in this.$route.query) {
        this.subTitle = property;
      }
      this.listCategories = [];
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach(element => {
          if (element.subtitle === this.subTitle || element.title === this.subTitle) {
            this.listDetail.push(element);
          }
        });

      });
    },
    getListQuestions(formSearch) {
      if (this.formSearch.query.trim() && this.formSearch.query.trim().length >= 3) {
        this.isShowResult = true;
      }
      this.$refs[formSearch].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.isShowNoRs = false;
        this.isShowListFind = true;

        apiFactory.callAPIDetail(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS, {}, this.formSearch, {}).then(rs => {
          if (rs.details.length === 0) {
            this.isShowNoRs = true;
          }
          this.tableData = rs.details;
          this.varResult = this.formSearch.query;
          this.isShowBodySubTl = false;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isShowIcon = this.tableData[i].body !== undefined;
          }
        }).catch(err => {
          showAlert(this, ERROR, 'Lỗi! ' + err.message);
          this.loadingData = false;
        });

      });
    },
    callApiAutoComplete() {
      this.b = [];
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].POST_QUESTIONS).then(rs => {
        rs.details.forEach((item) => {
          if (item.type === this.typeList) {
            this.listSearchAll.push(item);
          }
        });
        rs.details.forEach(element => {
          if (element.body) {
            this.b.push({value: element.subtitle, link: element.url});
          }
        });

      });
    },
    handleSelect(item) {
      console.log(item);
    },
    loadAll() {
      return this.b;
    },
    querySearch(queryString, cb) {
      this.links = this.loadAll();
      var links = this.links;
      var results = queryString ? links.filter(this.createFilter(queryString)) : links;
      // call callback function to return suggestions
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    getContentSubtitle(id, title) {
      this.content = '';

      this.isShowContentSubTitle = !this.isShowContentSubTitle;
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API_HELPDESK].DETAIL_QUESTIONS, {}, {answer_id: `${id}`}).then(rs => {
        this.upadateDetail = rs.details.updated_at;
        this.titleDetail = title;

        if (rs.file_id) {
          this.content = rs.details_content.body;
          const doc = new DOMParser().parseFromString(this.content, 'text/html');
          const imgTag = doc.body.getElementsByTagName('img');
          for (var i = 0; i < rs.file_id.length; i++) {
            if (doc.body.hasChildNodes() && imgTag && imgTag.length) {
              this.content = this.content.replace(imgTag[i].src, `${API_HELPDESK}/attachments/${rs.file_id[i].value}`);
            }
          }
        } else {
          this.content = rs.details_content.body;
        }
      });

    },
    goBack() {
      this.isShowListFind = !this.isShowListFind;
      this.isShowResult = !this.isShowResult;
    },
    comeBack() {
      this.isShowContentSubTitle = !this.isShowContentSubTitle;
      this.isShowResult = false;
    }
  }
};
</script>

<style scoped>

</style>
