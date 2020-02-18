<template>
  <v-footer
    :fixed="true"
    app
    class="footer-design"
  >
    <span>&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
}
</script>

<style scoped>
  .footer-design {
    background: url(~assets/images/pattern-2.png);
    box-shadow: 0 -5px 5px -5px rgba(0,0,0,0.3);
  }
</style>
