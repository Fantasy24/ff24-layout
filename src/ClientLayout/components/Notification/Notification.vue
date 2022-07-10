<template>
  <el-dropdown size="small" trigger="click">
    <el-badge is-dot>
      <el-icon class="el-icon-message-solid notification-icon" />
    </el-badge>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <span>Thông báo 1</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span>Thông báo 2</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span>Thông báo 3</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span>Thông báo 4</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span>Thông báo 5</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'Notification'
}
</script>

<style scoped>
.notification-icon {
  font-size: 1.3rem;
  color: white;
}
</style>
