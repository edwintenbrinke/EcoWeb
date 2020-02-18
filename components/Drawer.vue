<template>
  <v-navigation-drawer
    v-model="$store.state.navbar.show"
    :clipped="false"
    fixed
    app
    class="drawer"
  >
    <v-list-item two-line @click="openSLGPage()">
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <v-img
            :src="require(`~/assets/images/eco-logo-new.png`)"
            height="100%"
          />
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mb-1" />
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ]
    }
  },
  methods: {
    openSLGPage () {
      window.open('https://www.play.eco/', '_blank')
    }
  }

}
</script>

<style scoped>
  .drawer{
    background: url(~assets/images/pattern-2-dark.png);

    -webkit-box-shadow: 5px 0px 5px -5px rgba(0,0,0,0.3);
    /* box-shadow: 0px 3px 5px 3px rgba(0,0,0,0.3); */
    box-shadow: 5px 0 5px -5px rgba(0,0,0,0.3);
  }
</style>
