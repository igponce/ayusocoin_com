<template>
  <div class="airdropwizard">

     <!-- stage0 - Botón de quiero mis ayusos -->

     <span v-show="wizardStage == wizardStages[0]">
       <a href="#walletconnect" v-on:click="setWizardStage('connect_wallet')" id="quieromisayusos" class="btn btn-outline btn-outline-lg outline-dark">&nbsp;Quiero MIS A&yen;USOS</a>
     </span>

     <!-- stage1 - conectar el wallet -->

     <!-- El navegador no soporta ethereum (metamask, etc) -->
     <div v-show="wizardStage == 'connect_wallet'" class="wizard">
         <span v-show="!isEthereumEnabled">
            <li class="warning"></li>
            <p>Este navegador no soporta Ethereum.</p>
            <p>Utiliza un nagegador que lo soporte, o instala un plugin como <a href="https://metamask.io">Metamask</a>para activarlo.</p>
         </span>

        <span v-show="!isWalletConnected">
           <h2>Hola</h2>
           <p>Antes de conseguir tus A¥USOs, tienes que conectar una <em>Wallet</em> donde vas los vas a guardar.</p>
           <a href="#connectWallet" v-on:click="conectarWalletEthereum" class="btn btn-outline btn-outline-lg outline-dark">Conectar con Wallet Ethereum</a>
        </span>
     </div>

     <!-- stage2 - Texto legal y mucho cuidadín a tener -->

     <div v-show="wizardStage == 'pre-claim'" class="wizard">
        <h3>¡¡¡ Aviso !!!</h3>
        <p>Al dar al botón de "solicitar mis ayusos", ocurrira esto:</p>
           <ol>
              <li>Ejecutarás una transacción en el <a href="https://es.wikipedia.com/wiki/Ethereum">blockchain de Ethereum</a></li>
              <li>La transacción en el blockchain será pública. No se podrá borrar. Nunca.</li>.
              <li>Cualquiera podrá consultar tus saldos presentes, pasados, y futuros de la criptomoneda Ethereum y cualquier otro token que guardes en la dirección con la que te has conectado {{displayEthAddress}}</li>
          </ol>

       <h3>Si no te sientes cómodo/a con esto cierra esta página.</h3>


       <a href="#getToken" v-on:click="setWizardStage('claim')" class="btn btn-outline btn-outline-lg outline-dark">Lo he entendido y estoy conforme</a>
     </div>

     <!-- stage3 - Comprobar si se ha reclamado los ayusos -->


      <div class="faucet wizard" v-show="wizardStage=='claim'">
         <span v-if="isClaimed">
            Ya se han reclamado los Ayusos que correspondían a esta cuenta.
         </span>

         <span v-if="!isClaimed">
            <p>Puedes conseguir tus A¥USOS haciendo clic en el botón de más abajo.</p>
           <a href="#getToken" v-on:click="claimTokens" class="btn btn-outline btn-outline-lg outline-dark">Quiero mis A¥USOS</a>

         </span>

      </div>


     <!-- Pie: se muestra cuando estamos conectados -->


    <span v-show="isWalletConnected">
       <p>Conectado</p>
       <h3>Conectado:</h3>
       <p> {{ displayEthAddress }} (see in <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>)</p>

       <div class="saldo">
          SALDO:  {{ token_saldo }} A¥USOs
          <button v-on:click="getSaldoTokens">Leer saldo</button> <!-- tiene que ser automatico sin clic -->
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
  '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87', // Token Address
  '0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6'  // Faucet contract address
)

var contracts = {
   token: undefined,
   faucet: undefined
}

const wizardStages = ['start',            // Inicio
                      'connect-wallet',   // Conectarse a wallet
                      'pre-claim',        // Wallet conectada - texto legal
                      'claim',            // Solicitar tokens
                      'claimed'           // Ya solicitados
                     ]

var status = {
     debug: true,
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
            contracts = await setupDapp() // ToDO error check
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
         console.log("ClaimTokens")
         const myaddr = status.ethAddress
         var claimedAmount = await contracts.faucet.methods.ClaimedAmount(myaddr).call()

         console.log(`Alreadyclaimed => ${claimedAmount} `)

         if (claimedAmount == 0) {
            console.log(`Start claiming..${status.ethAddress}`)
            var tx = await contracts.faucet.methods.Claim(status.ethAddress).send({from: myaddr}).then(
               async tx => {

                  status.token_saldo = await contracts.token.methods.balanceOf(myaddr).call()
                  window.alert(tx)
                  return tx
               }).catch( function(err) {

                  window.alert(err)
                  return err
               });
            console.log(`Claim returns -> ${tx}`)
         }
      },

      setWizardStage: function(new_stage) {
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
