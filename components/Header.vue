<template>
  <v-app-bar
    :clipped-left="false"
    fixed
    app
    class="header-design"
  >
    <v-app-bar-nav-icon @click.stop="$store.commit('navbar/toggle')" />
    <v-toolbar-title v-text="title" />
    <v-spacer />
    <span>Server: test</span>
    <span>User: user</span>
  </v-app-bar>
</template>

<script>

export default {
  data () {
    return {
      imgSource: '',
      title: 'Title'
    }
  }
}
</script>

<style scoped>
    .header-design {
        background: url(~assets/images/pattern-2-dark.png);
        border-bottom: 5px solid rgba(0, 0, 0, 0.18);
        -webkit-box-shadow: 0px 3px 5px 3px rgba(0,0,0,0.3);
        box-shadow: 0px 3px 5px 3px rgba(0,0,0,0.3);
    }
</style>
