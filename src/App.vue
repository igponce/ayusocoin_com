<template>
  <div id="app">
    <LandingPage/>
    <Airdrop eth_addr="0x0000000000000000"/>
  </div>
</template>

<script>
require ('./assets/app.css');
import LandingPage from './components/LandingPage.vue'
import Airdrop from './components/AirdropWizard.vue'
  
export default {
  name: 'App',
  components: {
    // HelloWorld, 
    Airdrop,
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
