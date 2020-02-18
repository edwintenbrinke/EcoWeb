<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <!-- world view -->
      <Map />

      <!-- data blocks -->
      <ul>
        <li v-for="block in blocks" :key="block.id">
          <span class="localize" translate-key="104">
            <b>{{ block.title }}</b>
          </span>
          <span class="text-highlight">
            value.text
          </span>
        </li>
      </ul>

      <!-- graphs -->
    </v-flex>
  </v-layout>
</template>

<script>
import Map from '@/components/WorldMap/Map'
export default {
  components: {
    Map
  },
  data () {
    return {
      blocks: [
        { id: 1, title: 'block.online_players', value: 1 },
        { id: 2, title: 'block.2', value: 2 },
        { id: 3, title: 'block.3', value: 3 },
        { id: 4, title: 'block.4', value: 4 },
        { id: 5, title: 'block.5', value: 5 }
      ]
    }
  }
}
</script>
