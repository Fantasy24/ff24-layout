<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
            v-if="item.redirect==='noRedirect'||index===levelList.length-1"
            :title="generateTitle(item.name)"
            class="no-redirect"
        >
          {{ generateTitle(item.name) }}
        </span>
        <a v-else :title="generateTitle(item.name)">
          {{ generateTitle(item.name) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import {cutLongTitle, generateTitle} from 'ff24-js/src/utils/i18n';
import { compile } from 'path-to-regexp';

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    cutLongTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.name)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.name && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 13px;
  line-height: min(3vh, 100px);
  padding: 5px 5px 5px 20px;
  width: 100%;
  background: white;
  box-shadow: 0 1px 3px 0 rgb(66 185 131 / 26%);

  .no-redirect {
    color: #8396af;
    cursor: auto;
  }
}

.app-breadcrumb a {
  color: #5a7189 !important;
}
</style>
