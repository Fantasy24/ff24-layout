<template>
  <div class="header-search show">

    <el-select
        ref="headerSearchSelect"
        v-model="search"
        :remote-method="querySearch"
        class="header-search-select"
        default-first-option
        filterable
        placeholder="Tìm kiếm chức năng"
        remote
        size="small"
        @change="change"
    >
      <span slot="prefix"><svg-icon class-name="search-icon" icon-class="search" @click.stop="click"/></span>
      <el-option
          v-for="menu in options"
          :key="menu.path"
          :label="menu.item.title.join(' > ')"
          :value="menu"
      />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
// import path from 'path'
//import i18n from 'ff24-js/src/lang'
import { generateTitle } from 'ff24-js/src/utils/i18n'
// const path = require('path')

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    },
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    lang() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.item.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: false,
        findAllMatches: true,
        threshold: 0.4,
        ignoreLocation: true,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: [{
          name: 'title',
          weight: 2
        }, {
          name: 'path',
          weight: 1.5
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []
      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue
        }

        //  path: path.resolve(basePath, router.path),
        const data = {
          path: router.path,
          title: [...prefixTitle]
        }
        if (router.meta && router.meta.title) {
          // generate internationalized title
          const i18ntitle = generateTitle(router.name, this)
          data.title = [...data.title, i18ntitle]
          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }
        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 15px;
    vertical-align: middle;
    color: ghostwhite;
  }

  .header-search-select {
    font-size: 18px;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 1px solid #1a4792;
      background-color: inherit;
      padding-right: 0;
      box-shadow: none !important;
      vertical-align: middle;

      &:hover {
        background: rgb(255 255 255 / 7%)
      }

      &:focus {
        color: whitesmoke;
      }
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
