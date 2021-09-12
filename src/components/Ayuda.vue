<template>
  <div class="ayuda_placeholder">
         <a v-show="!this.show_help" class="btn btn-outline btn-outline-lg outline-dark" href=#ayuda v-on:click="toggle()">Ayuda</a>

      <div class="ayuda" v-show ="this.show_help">



         <a id="close_help" class="btn btn-outline btn-outline-lg outline-dark fa fa-close" v-on:click="toggle()"/>
         <h2>Cómo conseguir tu AyusoCoin en 6 sencillos pasos</h2>

         <p> Si nunca has entrado en el mundo de las criptomonedas, ésta es tu guía:</p>

         <p>
            <ol>
               <li>Necesitas un “monedero” o wallet para tus criptomonedas. Hay distintas apps que
         puedes descargarte en tu móvil o el dispositivo que prefieras: CoinBase Wallet o
         MetaMask. Tu monedero virtual tendrá una dirección única, el código que lo identifica.</li>

               <li>AyusoCoin es totalmente gratuita (por el momento), pero necesitas tener otra moneda
         virtual llamada Ethereum para que el sistema te permita adquirirla. Es el equivalente a
         las comisiones de los bancos. Con 0,01 Ethereum debería bastarte para operar y
         obtener después tus AyusoCoin GRATIS.</li>

               <li>Una vez que tengas Ethereum, abre AyusoCoin.com desde el propio navegador de tu
         monedero virtual. Después haz clic sobre “quiero mis A¥USOS”.</li>

               <li>Ahí verás que en A¥usoCoin no almacenamos ninguna cookie, ningún dato personal
         tuyo. Eso sí, la red virtual en la que funcionan las criptomonedas, llamada blockchain,
         registrará tus transacciones. Serán públicas y no se podrán borrar. Nunca. Pero no
         saldrá tu nombre, sino el código que identifica tu wallet.</li>

               <li>Si quieres seguir adelante, haz clic sobre “Lo he entendido y estoy conforme”.</li>

               <li>Por fin conseguirás 1.000 A¥USOS. ¡ENHORABUENA!</li>
            </ol>
         </p>
         <p>
                  <a class="btn btn-outline btn-outline-lg outline-dark" href=#ayuda v-on:click="toggle()">Cerrar</a>
         </p>

      </div>
   </div>
</template>

<script>

var _MostrarAyuda = false


export default {
  name: 'Ayuda',
  data: function() {
     return { show_help: _MostrarAyuda }
  },
  methods: {
     toggle : async function() {
        _MostrarAyuda = (_MostrarAyuda == true ? false : true)
        this.show_help = _MostrarAyuda  
     }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ayuda {
   background: lightskyblue;
   border-radius: 1em;
}

ol {
   text-align: left;
}

p {
   margin-bottom: 1em;
}

h3 {
  margin: 40px 0 0;
  clear: none;
}

a {
  color: #42b983;
}
</style>
