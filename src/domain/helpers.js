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
    var enteros
    var decimales
    if(str_x.length > 7) {
       enteros = str_x.slice(0,-7)
       decimales = str_x.slice(enteros.length)
    } else {
       enteros = "0"
       decimales = str_x.padStart(7,"0")
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
        var acc = await window.ethereum.request(
            {method:'eth_requestAccounts'}).then(
                result => {
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

    return retval   ;
}

async function setupDapp(token_addr, faucet_addr) {
    
    if (window.ethereum) {
        window.erc20 = ERC20ABI
        const token = new window.web3.eth.Contract(ERC20ABI, token_addr)
        const faucet = new window.web3.eth.Contract(FaucetABI, faucet_addr)
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
            return undefined; //
        }
        
        this.token_contract = await web3.eth.Contract(this.token_abi, this.token_address);
        this.faucet_contract = await web3.eth.Contract(this.faucet_abi, this.faucet_address);
        
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

