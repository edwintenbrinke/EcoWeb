<template>
  <v-app>
    <!-- Navigation -->
    <Drawer />
    <!-- Header -->
    <Header />
    <!-- Show Content -->
    <Content />
    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<script>
import Drawer from '@/components/Drawer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Content from '@/components/Content'
export default {
  components: {
    Drawer,
    Header,
    Content,
    Footer
  }
}
</script>
