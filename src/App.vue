<template>
  <div id="app">
    <LandingPage/>
    <AirdropWizard eth_addr="0x0000000000000000"/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import AirdropWizard from './components/AirdropWizard.vue'
import LandingPage from './components/LandingPage.vue'
require ('./assets/app.css')

export default {
  name: 'App',
  components: {
    // HelloWorld, 
    AirdropWizard,
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
