<template>
  <div class="walletconnect">
   <pre>
   isEthereumEnabled -> {{ isEthereumEnabled }}
   isWalletConnected -> {{ isWalletConnected }}
   ethAddress -> {{ displayEthAddress }}
    </pre>
     <!-- si no estamos conectados a ningun wallet -->

     <span v-show="isWalletConnected"> <p>Conectado</p>
        <h3>Conectado:</h3> {{ displayEthAddress }} (see in <a v-bind:href="'https://etherscan.io/address/' + ethAddress" target=_blank>Etherscan</a>)
     </span>

     <span> <!-- v-show="!isWalletConnected" -->
        <button v-on:click="conectarWalletEthereum">Conectar con Wallet Ethereum</button>
     </span>

  <!--- Mostramos saldo --->
      <div class="saldo" v-show="isWalletConnected">
         SALDO:  {{ token_saldo }} 
         <button v-on:click="getSaldoTokens">Leer saldo</button>
      </div>

      <div class="faucet" v-show="isWalletConnected">
         SALDO:  {{ "Token.name" }}
      </div>

  </div>
</template>

<script>

import {connectToEthereum, Dapp, setupDapp } from '../domain/helpers'

var dapp = new Dapp(
  '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87', // Token Address
  '0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6'  // Faucet contract address
)

var contracts = {
   token: undefined,
   faucet: undefined
}

var status = {
     isEthereumEnabled: 0,
     isWalletConnected: 0,
     ethAddress: "None",
     displayEthAddress: "No conectado",
     token_saldo: 0,
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
     console.log("DATA()")
     console.log(status)
     console.log("END_DATA(")
     return status;
  },
  mounted() {
        status.isEthereumEnabled = (window.ethereum != undefined)
  },
  methods: {
     conectarWalletEthereum : async function() {
         // Se llama desde el click handler
         if (status.isEthereumEnabled) { // was (window.ethereum) {
            console.log("STATUS_PRE = " + status)
            var new_status = await connectToEthereum()
            for (const [k,v] of Object.entries(new_status)) {
               status[k] = v
            }
            contracts = await setupDapp() // ToDO error check
            console.log("SETUPDAPP:")
            console.log(contracts)
            window.alert("setupdapp")
            return true;
         } 
         console.log("Window_ethereum :-(");
         status.isWalletConnected = false;
         return false;
      },

      getSaldoTokens: async function() {
         console.log("getSaldoTokens")
         console.log(contracts)

         var saldo = await contracts.token.methods.balanceOf(status.ethAddress).call().then(x=>x+1234)
         console.log("getSaldoTokens")
         console.log(saldo)
         status.token_saldo = saldo
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
