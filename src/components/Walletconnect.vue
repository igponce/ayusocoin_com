<template>
  <div class="walletconnect">

    <span v-show="isWalletConnected">
       <p>Conectado</p>
       <h3>Conectado:</h3>
       <p> {{ displayEthAddress }} (see in <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>)</p>
    </span>

   <div class="saldo">
      SALDO:  {{ token_saldo }} 
      <button v-on:click="getSaldoTokens">Leer saldo</button>
   </div>

     <span v-show="wizardStage== 'start'">
       <a href="#walletconnect" v-on:click="setWizardStage('connect_wallet')" id="quieromisayusos" class="btn btn-outline btn-outline-lg outline-dark">&nbsp;Quiero MIS A&yen;USOS</a>
     </span>

     <!-- stage2 - conectar el wallet -->

     <!-- El navegador no soporta ethereum (metamask, etc) -->
     <span v-show="wizardStage == 'connect_wallet'">
         <span v-show="!isEthereumEnabled">
            <li class="warning"></li>
            <p>Este navegador no soporta Ethereum.</p>
            <p>Utiliza un nagegador que lo soporte, o instala un plugin como <a href="https://metamask.io">Metamask</a>para activarlo.</p>
         </span>
     </span>

     <!-- stage3 - Comprobar si se ha -->


      <div class="faucet">
         <span v-if="isClaimed">
         Ya se han reclamado los Ayusos que correspondían a esta cuenta.
         </span>

         <span v-if="!isClaimed">
         <button v-on:click="claimTokens">Reclamar</button> 
         </span>
      </div>

     <span v-show="!isWalletConnected">
        <button v-on:click="conectarWalletEthereum">Conectar con Wallet Ethereum</button>
     </span>

     <pre>
   isEthereumEnabled -> {{ isEthereumEnabled }}
   isWalletConnected -> {{ isWalletConnected }}
   ethAddress -> {{ displayEthAddress }}
    </pre>

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

var status = {
     wizardStage: 'start', 
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
  name: 'Walletconnect',
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
            return true;   
         } 
         status.isWalletConnected = false;
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
.walletconnect {
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
