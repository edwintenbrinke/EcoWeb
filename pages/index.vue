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
          <li>
            <span  class='localize' translate-key='104'>
              <b>  value.title </b>
            </span>
            <span class='text-highlight'>
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
    Map,
  },
  computed: {
    blocks: [
      {title:'block.online_players', value: 1},
      {title:'block.online_players', value: 1},
      {title:'block.online_players', value: 1},
      {title:'block.online_players', value: 1},
      {title:'block.online_players', value: 1},
    ]
  }
}
</script>
