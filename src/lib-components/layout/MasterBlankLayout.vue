<template>
  <div class="app-wrapper">
    <div/>
    <div>
      <app-main />
    </div>
  </div>
</template>

<script>
import AppMain from './components/AppMainBlank.vue';

export default {
  name: 'MasterLayoutBase',
  components: {
    AppMain
  }
}
</script>
