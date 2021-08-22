<template>
  <div class="airdropwizard">

     <!-- stage0 - Botón de quiero mis ayusos -->

     <span v-show="wizardStage == wizardStages[0]" key="wizard">
       <a href="#walletconnect" v-on:click="setWizardStage('connect_wallet')" id="quieromisayusos" class="btn btn-outline btn-outline-lg outline-dark">&nbsp;Quiero MIS A&yen;USOS</a>
     </span>

     <!-- stage1 - conectar el wallet -->

     <!-- El navegador no soporta ethereum (metamask, etc) -->
     <div v-show="wizardStage == 'connect_wallet'" class="wizard" key="wizard">
         <span v-show="!isEthereumEnabled">
            <li class="warning"></li>
            <h3>:-(</h3>
            <p>Este navegador no soporta Ethereum.</p>
            <p>Para conseguir tus A¥USOs tienes que usar un navegador que soporte Ethereum, o instalar en tu navegador un plugin como <a href="https://metamask.io">Metamask</a>para activarlo.</p>
         </span>

        <span v-show="isEthereumEnabled && !isWalletConnected" key="wizard">
           <h2>Hola</h2>
           <p>Antes de conseguir tus A¥USOs, tienes que conectar una <em>Wallet</em> donde vas los vas a guardar.</p>
           <a href="#connectWallet" v-on:click="conectarWalletEthereum" class="btn btn-outline btn-outline-lg outline-dark">Conectar con Wallet Ethereum</a>
        </span>
     </div>

     <!-- stage2 - Texto legal y mucho cuidadín a tener -->

     <div v-show="wizardStage == 'pre-claim'" class="wizard" key="wizard">
        <h3>¡¡¡ Aviso !!!</h3>
        <p>En esta web no se almacena ninguna información. Ni siquiera cookies.</p>

        <p>*Pero* al clicar en al botón de "solicitar mis ayusos", ocurrira esto:</p>
           <ol>
              <li>Ejecutarás una transacción en el <a href="https://es.wikipedia.com/wiki/Ethereum">blockchain de Ethereum</a></li>
              <li>La transacción en el blockchain será pública. Nadia la podrá borrar. Nunca.</li>.
              <li>Cualquiera podrá consultar tus saldos presentes, pasados, y futuros de la criptomoneda Ethereum y cualquier otro token que guardes en la dirección con la que te has conectado {{displayEthAddress}}</li>
          </ol>

       <h3>Si no te sientes cómodo/a con esto, o tienes dudas, cierra esta página y no sigas.</h3>


       <a href="#getToken" v-on:click="setWizardStage('claim')" class="btn btn-outline btn-outline-lg outline-dark">Lo he entendido y estoy conforme</a>
     </div>

     <!-- stage3 - Comprobar si se ha reclamado los ayusos -->


      <div class="faucet wizard" v-show="wizardStage=='claim'" key="wizard">
         <span v-if="isClaimed">
            Ya se han reclamado los Ayusos que correspondían a esta cuenta.
         </span>

         <span v-if="!isClaimed">
            <p>Puedes conseguir tus A¥USOS haciendo clic en el botón de más abajo.</p>
           <a href="#getToken" v-on:click="claimTokens" class="btn btn-outline btn-outline-lg outline-dark">Quiero mis A¥USOS</a>

         </span>
      </div>

      <div class="postclaim wizard" v-show="wizardStage=='post-claim'" key="wizard">

         <h3>:-)</h3>

         <p>Acabas de solicitar tus A¥USOS.</p>
         <p>Puede que la transacción tarde unos minutos en completarse y quede grabada en el blockchain.</p>
         <p>Puedes consultar la actividad de tu wallet en <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>:</p>

      </div>


     <!-- Pie: se muestra cuando estamos conectados -->


    <span v-show="isWalletConnected">
       <p>Conectado a {{ displayEthAddress }} (ver en <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>)</p>

       <div class="saldo">
          Tienes {{ token_saldo }} A¥USOs
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
  '0x0b70A904C77b90eBa8c3619dbE810669c193917d'  // Faucet contract address
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
     token_saldo: "0",
     faucet_canclaim: 0,
     web3: null,
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
         if (status.isEthereumEnabled) { 
            var new_status = await connectToEthereum()
            for (const [k,v] of Object.entries(new_status)) {
               status[k] = v
            }
            contracts = await setupDapp(status.dapp.token_address, status.dapp.faucet_address) // ToDO error check
            await this.getSaldoTokens()
            window.contracts = contracts // para debg
            status.wizardStage = 'pre-claim'
            return true;   
         } 
         status.isWalletConnected = false;
         status.wizardStage = 'error-wallet'
         return false;
      },

      getSaldoTokens: async function() {

         const token = contracts.token

         console.log("getSaldoTokens")
         console.log(contracts)
         
         var saldo = await token.methods.balanceOf(status.ethAddress).call()
                              .then( x => formateaToken(x) )
                              .catch( () => { return "No se puede leer balance" })

         status.token_saldo = saldo
      },

      claimTokens: async function() {
         const myaddr = status.ethAddress
         var claimedAmount = await contracts.faucet.methods.ClaimedAmount(myaddr).call()

         console.log(`Alreadyclaimed => ${claimedAmount} `)

         if (claimedAmount == 0) {
            console.log(`Start claiming..${status.ethAddress}`)
            var tx = await contracts.faucet.methods.Claim(status.ethAddress).send({from: myaddr}).then(
               async tx => {
                  status.token_saldo = await contracts.token.methods.balanceOf(myaddr).call()
                  status.tx = tx
                  status.wizardStage = 'post-claim'
               }).catch( function(err) {
                  window.alert(err)
                  return err
               });
            console.log(`Claim transaction ${tx}`)
         }
      },

      setWizardStage: function(new_stage) {
         // ToDo: comprobar que la fase estaba registrada antes
         status.wizardStage = new_stage
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

h3 {
  margin: 40px 0 0;
  clear: none;
}

a {
  color: #42b983;
}
</style>
