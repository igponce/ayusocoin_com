<template>

<div class="landing">

  <div class="heading">

    <h1>Ayuso Coin</h1>
    <p>{{ una_moneda }} para que nuestros políticos aprendan qué son las criptomonedas.</p> 

  </div>
  
  <div class="faq">
    <h1>¿Qué es?</h1>
    <p>
      AyusoCoin es un <em>token erc20</em> que está en la red Ethereum.
      En la red Ethereum todo se desarrolla mediante <em>contratos inteligentes</em>, es decir pequeños programas que se ejecutan en la propia red.
      Hacer cambios en los datos que almacena la red tiene un coste, y ese coste se paga con la criptomoneda Ethereum.
      Ayusocoin es un contrato inteligente ({{contract_address}}) que implementa un token (una ficha como las que se usaban antiguamente en las cabinas telefónicas).
      
    </p>

    <h1>¿Cómo conseguirla</h1>


    <h1>¿Qué limites tiene</h1>
    <p> </p>

  </div>
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
