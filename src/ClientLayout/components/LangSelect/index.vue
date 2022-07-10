<template>
  <el-dropdown
    class="international"
    trigger="click"
    @command="handleSetLanguage"
  >
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'vi'" command="vi">
        Tiếng việt
      </el-dropdown-item>

      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {showAlert, SUCCESS} from 'ff24-js/src/utils/AlertMessage'

const VI_MSG = 'Chuyển ngôn ngữ sang [Tiếng việt]'
const EN_MSG = 'Changed language to [English]'

export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      showAlert(this, SUCCESS, `${lang === 'vi' ? VI_MSG : EN_MSG}`)
    }
  }
}
</script>

<style scoped>
.international-icon {
  height: 20px;
  width: 20px;
}
</style>
