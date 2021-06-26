// helpers.js
// -------------------------------------------------
// Funciones que ayudan a la app a cargar información
// de los contratos token y faucet, y ayudan a interoperar
// con el blockchain de Ethereum

import Web3  from "web3"
import { abi as ERC20ABI } from './ERC20.json'
import { abi as FaucetABI } from './Faucet.json'

export { Dapp, connectToEthereum, setupDapp, formateaToken }

function formateaToken (x) {
    const str_x = String(x)
    console.log(x, str_x)
    var enteros
    var decimales
    if(str_x.length > 6) {
       console.log("aki")
       enteros = str_x.slice(0,-6)
       decimales = str_x.slice(enteros.length)
       console.log(enteros, decimales)
    } else {
       enteros = "0"
       decimales = str_x.padStart(6,"0")
    }

    const token_symbol = Number(enteros) == 1 ? "A¥USO" : "A¥USOS"
   
    return `${enteros}.${decimales} ${token_symbol}`
}

async function connectToEthereum() {

    var retval = {
        isEthereumEnabled: false,
        isWalletConnected: false
    }

    if (window.ethereum != undefined) {   
        console.log("PRE RESULT " + retval)
        var acc = await window.ethereum.request(
            {method:'eth_requestAccounts'}).then(
                result => {
                    console.log("Conectada dirección Ethereum: " + acc)
                    retval.isEthereumEnabled = true
                    retval.isWalletConnected = true
                    retval.dis
                    const www3 = new Web3(window.ethereum)
                    window.web3 = www3
                    return result[0]
                    })
        retval.ethAddress = acc
        retval.displayEthAddress = acc.slice(0,6) + ".." + acc.slice    (-4)

    }

    console.log("POST_RESULT")
    console.log(retval)

    return retval   ;
}

async function setupDapp() {
    
    if (window.ethereum) {
        console.log("setupDapp() - entrando")
        console.log(window.web3)
        window.erc20 = ERC20ABI
        const token = new window.web3.eth.Contract(ERC20ABI, '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87')
        const faucet = new window.web3.eth.Contract(FaucetABI,'0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6')
        console.log("TOKEN: ", token)
        console.log("FAUCET: ",faucet)
        return {
            token: token,
            faucet: faucet
        }

    } else {
        return false
    }
}

// ------------------------------------------
//   Dapp class
// ------------------------------------------

class Dapp {

    token_address = null
    token_abi = ERC20ABI
    token_contract = null
    faucet_address = null
    faucet_abi = FaucetABI
    faucet_contract = null

    constructor(tokenaddr, faucetaddr) {
        this.token_address = tokenaddr
        this.faucet_address = faucetaddr
        
    }

    LoadContracts = async function(web3) {
        if (!web3) {
            console.log("WEB3 undefined")
            return undefined; //
        }
        
        console.log("LOAD CONTRACTS")
        this.token_contract = await web3.eth.Contract(this.token_abi, this.token_address);
        console.log(this.token_contract);
        this.faucet_contract = await web3.eth.Contract(this.faucet_abi, this.faucet_address);
        console.log(this.faucet_contract);
        
    }

    GetTokenAddress = function() {
        return this.token_address;
    }

    GetFaucetAddress = function() {
        return this.faucet_address
    }

    GetTokenBalance = async function() 
    {
        return this.token_contract.getTokenBalance()
    }

    FaucetClaim = async function() 
    {
        return this.faucet_contract.Claim()
    }

}

