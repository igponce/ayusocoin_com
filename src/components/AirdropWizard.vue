<template>
  <div class="airdropwizard">

     <!-- stage0 - Botón de quiero mis ayusos -->

     <span v-show="1 < 2 && wizardStage == wizardStages[0] " align="center">
     <h2>¿Como conseguir A¥USOCoin?</h2>
     <img src="images/obras.gif" style="width: 25%">
     <p class="lead">Estamos migrando A¥USOCoin a la red <a href="polygon.technology" id="polygon">Polygon</a>. En breve podrás conseguir tus A¥USOCoin desde aquí.</p>
     <p class="lead">Gracias por tu paciencia</p>

     </span>

     <span v-show="wizardStage == wizardStages[0]">
       <!-- Deshabilitado hasta que la web apunte a Polygon
       <a href="#walletconnect" v-on:click="console.log('setWizardStage(connect_wallet)')" id="quieromisayusos" class="btn btn-outline btn-outline-lg outline-dark">&nbsp;Quiero MIS A&yen;USOS</a>
       -->
     </span>


     <!-- stage1 - conectar el wallet -->

     <!-- El navegador no soporta ethereum (metamask, etc) -->
     <div v-show="wizardStage == 'connect_wallet'" class="wizard">
         <span v-show="!isEthereumEnabled">
            <li class="warning"></li>
            <h3>:-(</h3>
            <p>Este navegador no soporta Ethereum.</p>
            <p>Para conseguir tus A¥USOs tienes que usar un navegador que soporte Ethereum, o instalar en tu navegador un plugin como <a href="https://metamask.io">Metamask</a>para activarlo.</p>
         </span>

        <span v-show="isEthereumEnabled && !isWalletConnected">
           <h2>Hola</h2>
           <p>Antes de conseguir tus A¥usoCoins, tienes que conectar una <em>Wallet</em> donde los vas a guardar.</p>
           <a href="#connectWallet" v-on:click="conectarWalletEthereum" class="btn btn-outline btn-outline-lg outline-dark">Conectar con Wallet Ethereum</a>
        </span>

        <span v-show="isEthereumEnabled && isWalletConnected">
           <h3> :-) </h3>
           <ul>
             <li>Tu navegados soporta Ethereum</li>
             <li>Tu billetera (wallet) ethereum está conectada</li>
           </ul>
           <a href="#gotoPreClaim" v-on:click="setWizardStage('pre-claim')" class="btn btn-outline btn-outline-lg outline-dark">Siguiente paso</a>
        </span>

     </div>

     <!-- error-wallet -->

     <div v-show="wizardStage == 'error-wallet'" class="wizard">
         <span>
            <h3>:-(</h3>
            <p>Opps! El saldo de la dirección {{displayEthAddress}} es 0.</p>
            <p>AyusoCoin se distribuye sin ánimo de lucro. Sin embargo, necesitas tener Ethereum en tu wallet para pagar las comisiones que se llevan los <em>mineros</em> la red Ethereum.</p>
         </span>
     </div>

     <!-- stage2 - Texto legal y mucho cuidadín a tener -->

     <div v-show="wizardStage == 'pre-claim'" class="wizard">
        <h3>¡¡¡ Aviso !!!</h3>
        <p>En esta web no se almacena ninguna información. Ni siquiera cookies.</p>

        <p>*Pero* al clicar en el botón de "solicitar mis A¥USOs", ocurrirá esto:</p>
           <ol>
              <li>Ejecutarás una transacción en el <a href="https://es.wikipedia.com/wiki/Ethereum">blockchain de Ethereum</a></li>
              <li>La transacción en el blockchain será pública. Nadie la podrá borrar. Nunca. No aparecerá tu nombre o teléfono; sino el código que identifica tu monedero virtual (wallet).</li>.
              <li>Cualquiera podrá consultar tus saldos presentes, pasados, y futuros de la criptomoneda Ethereum y cualquier otra moneda virtual que guardes en la wallet con la que te has conectado (que es {{displayEthAddress}})</li>
          </ol>

       <h3>Si no te sientes cómodo/a con esto, o tienes dudas, cierra esta página y no sigas.</h3>


       <a href="#getToken" v-on:click="setWizardStage('claim')" class="btn btn-outline btn-outline-lg outline-dark">Lo he entendido y estoy conforme</a>
     </div>

     <!-- stage3 - Comprobar si se ha reclamado los ayusos -->


      <div class="faucet wizard" v-show="wizardStage=='claim'">
         <span v-if="isClaimed">
            Ya se han reclamado los Ayusos que corresponden a este wallet.
         </span>

         <span v-if="!isClaimed">
            <p>Puedes conseguir 1000 A¥USOS haciendo clic en el botón de más abajo.</p>
            <p>(Esto sólo se puede hacer una vez).</p>
            <a href="#getToken" v-on:click="claimTokens" class="btn btn-outline btn-outline-lg outline-dark">Dame 1000 A¥USOS</a>
         </span>
      </div>

      <div class="postclaim wizard" v-show="wizardStage=='post-claim'">

         <h3>:-)</h3>

         <p>Acabas de solicitar tus A¥USOS.</p>
         <p>Puede que la transacción tarde unos minutos en completarse y quede grabada en el blockchain.</p>
         <p>Puedes consultar la actividad de tu wallet en <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>:</p>

      </div>


     <!-- Pie: se muestra cuando estamos conectados -->

     <span id=#flash v-show="flash"> {{flash}} </span>

    <span v-show="isWalletConnected">
       <p>Conectado a {{ displayEthAddress }} (ver en <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>)</p>

       <div class="saldo">
          Tienes {{ token_saldo }}
          <!--
             Parece que no tiene mucho sentido en un gui
             <button v-on:click="getSaldoTokens">Volver a leer saldo</button>
          -->

       </div>

   <!-- Footer: debug -->
   <pre v-show="debug == 1">
 
   wizardStages -> {{ wizardStages }}
   wizardStage -> {{ wizardStage }}
   isEthereumEnabled -> {{ isEthereumEnabled }}
   isWalletConnected -> {{ isWalletConnected }}
   ethAddress -> {{ displayEthAddress }}
    </pre>

    </span>

  </div>
</template>

<script>
// import func from 'vue-editor-bridge';

import {connectToEthereum, Dapp, setupDapp, formateaToken } from '../domain/helpers'

// Las direcciones de los contratos deberían estar en un fichero aparte
var dapp = new Dapp(
  '0xa745005a2764ccbfeb1a8c6fca178f896af5d777', // Token Address
  '0xd5835954B94a0846A29D23C2402438a64d4b9f20'  // Faucet contract address
)

var contracts = {
   token: undefined,
   faucet: undefined
}

// Para tener todas las fases a la vista
const wizardStages = ['start',            // Inicio
                      'connect-wallet',   // Conectarse a wallet
                      'pre-claim',        // Wallet conectada - texto legal
                         'claim',            // Solicitar tokens
                      'claimed',          // Ya solicitados previamente
                      'post-claim',       // Fin de proceso solicitud
                      'error-wallet'      // Problema al conectar con ethereum
                     ]

var status = {
     debug: false,
     wizardStages: wizardStages,
     wizardStage: wizardStages[0], // 'start'
     isEthereumEnabled: false,
     isWalletConnected: false,
     ethAddress: "None",
     displayEthAddress: "No conectado",
     isClaimed: false,
     eth_saldo: 0,
     token_saldo: "0",
     faucet_canclaim: 0,
     web3: null,
     flash: null, // Mensages etc
     tx: null, // Para comprobar en otro momento el estado
     dapp: dapp
};

export default {
  name: 'AirdropWizard',
  props: {
    msg: String,
    eth_addr: String
  },
  data: function() {
     return status;
  },
  mounted() {
        status.isEthereumEnabled = (window.ethereum != undefined)
  },
  methods: {
     conectarWalletEthereum : async function() {

         status.isWalletConnected = false;
         status.web3 = window.web3;

         console.log("conectarWalletEthereum")

         if (status.isEthereumEnabled) { 
            var new_status = await connectToEthereum()
            for (const [k,v] of Object.entries(new_status)) {
               status[k] = v
            }
            contracts = await setupDapp(status.dapp.token_address, status.dapp.faucet_address) // ToDO error check
            await this.getSaldoTokens()
            this.balance = await status.cweb3.eth.getBalance(status.ethAddress).then(x => { return x } )

            console.log("BALANCE ES: " + this.balance)

            if (this.balance == "0") {
               status.flash = "El balance de tu cartera Ethereum es 0 antes de llamar al contrato"
               status.isWalletConnected == true
               status.wizardStage = 'error-wallet'
               return false;
            } else {
               window.contracts = contracts // para debg
               status.wizardStage = 'pre-claim'
               return true;   
            }
         } 
         status.wizardStage = 'error-wallet'
         return false;
      },

      getSaldoTokens: async function() {

         const token = contracts.token
         
         var saldo = await token.methods.balanceOf(status.ethAddress).call()
                              .then( x => formateaToken(x) )
                              .catch( () => { return "No se puede leer balance" })

         status.token_saldo = saldo
      },

      claimTokens: async function() {
         const myaddr = status.ethAddress
         var claimedAmount = await contracts.faucet.methods.ClaimedAmount(myaddr).call()

         if (claimedAmount == 0) {
            var tx = await contracts.faucet.methods.Claim(status.ethAddress).send({from: myaddr}).then(
               async tx => {
                  status.token_saldo = await contracts.token.methods.balanceOf(myaddr).call()
                  status.tx = tx
                  status.wizardStage = 'post-claim'
               }).catch( function(err) {
                  status.flash = "No se ha podido realizar la operación."
                  return err
               });
            return tx   
         }
      },

      setWizardStage: function(new_stage) {
         // ToDo: comprobar que la fase estaba registrada antes
         status.wizardStage = new_stage
         status.flash = null
      }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wizard {
   background: lightskyblue;
   border-radius: 1em;
}

.wizard a:visited {
   color: #444;
}

.wizard a:after {

}

#alert {
   background: red;
   color: #eee;
}

h3 {
  margin: 40px 0 0;
  clear: none;
}

a {
  color: #42b983;
}
</style>
