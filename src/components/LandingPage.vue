<template>
<div>
  <img src="images/ayusocoin_icon.svg">
  <h1>A¥USOCoin</h1>
  <p class="lead">{{ una_moneda }} para que nuestros políticos aprendan qué son las criptomonedas y los contratos inteligentes.</p>
 </div> 

</template>

<script>

const slogan = [ "Un experimento", "Una moneda virtual", "Un token", "Una iniciativa" ];
var myslogan = 0;


export default {
  name: 'LandingPage',
  props: { contractAddress: String },
  data: function() {
    return {
      contract_address: (this.contractAddress || "0x00000_NO_CONTRACT"),
      una_moneda: slogan[myslogan],
      polling: null
    }
  },
  methods: {  
    rotateSlogan() {
       this.polling = setInterval( () => { 
         myslogan = (myslogan+1) % slogan.length; 
         this.$data.una_moneda = slogan[myslogan];
         }, 4000);
    },
  },
  mounted () { this.rotateSlogan(); },
  beforeDestroy () { clearInterval(this.polling); }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
