<template>
  <div id="app">
    <Walletconnect eth_addr="0x0000000000000000"/>
    <LandingPage/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Walletconnect from './components/Walletconnect.vue'
import LandingPage from './components/LandingPage.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld, 
    Walletconnect,
    LandingPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
