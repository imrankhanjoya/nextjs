import { useEffect, useState } from "react";
import { Web3Storage } from 'web3.storage'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
const Web3 = require("web3");


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmOWY1MDM1QTI1ZkVmNTlCMjcxQzNhMzU3OTc3MzliYWM4MjQ1MjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwOTk1NDg0NTYsIm5hbWUiOiJORlRNQVJLRVQifQ.DT0eVMyXxGPnaPh2lx0FZIHLQVq4EtiDK40lH34UjCE



const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmOWY1MDM1QTI1ZkVmNTlCMjcxQzNhMzU3OTc3MzliYWM4MjQ1MjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwOTk1NDg0NTYsIm5hbWUiOiJORlRNQVJLRVQifQ.DT0eVMyXxGPnaPh2lx0FZIHLQVq4EtiDK40lH34UjCE' })
const nft_contract_address = "0x92B381515bd4851Faf3d33A161f7967FD87B1227" 
const NFT_MARKET = {
    name: "mintToken",
    type: "function",
    inputs: [{
      type: 'string',
      name: 'tokenURI'
      }]
  }
const Opensea = () => {
	const [fileUrl, setFileUrl] = useState('')
	const [txt,setTxt] = useState('')
	async function onChange(e) {
		//setProcessing(true)
		const file = e.target.files[0]
		console.log(file.name)
		const rootCid = await client.put(e.target.files) // Promise<CIDString>
		console.log(rootCid)
		const res = await client.get(rootCid) // Promise<Web3Response | null>
		const files = await res.files() // Promise<Web3File[]>
		let filepath = ''
		for (const file of files) {
			filepath = "https://"+rootCid+".ipfs.w3s.link/"+file.name
			console.log(filepath)
		}
		
	}

	const ethEnabled = async () => {
		if (window.ethereum) {
		  await window.ethereum.request({method: 'eth_requestAccounts'});
		  window.web3 = new Web3(window.ethereum);
		  return true;
		}
		return false;
	}
	
	const creatnft = async ()=>{
		//const _uri = "https://ipfs.io/ipfs/bafyreichale42uyskmtcdju7j7pcckx6k4fedk7xp4wctlpvrghgpxozny/metadata.json"
		//const _uri = "https://ipfs.io/ipfs/Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=1-PUG.json"
		//const _uri = "ipfs://bafyreicaaf2p5jscph67bhghwsxfwbm2tga4i3xvweec2lnabb7e2rxomy/metadata.json"
		//const _uri = "ipfs://bafyreicaaf2p5jscph67bhghwsxfwbm2tga4i3xvweec2lnabb7e2rxomy/metadata.json"
		//const _uri = "ipfs://bafyreidzoljbg47bsup4xkopp2z7k3h3ilj2bbgu6nq3sxzqwwn4alsiiy"
		//const _uri = "ipfs://bafyreiha5uw665e7xf67ys5qjkw6btmnmyodzfexpwvlxsrtj75krqrk3i"
		const _uri = "https://ipfs.io/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu"
		const ifeth = await ethEnabled()
		console.log(ifeth)
		window.web3 = new Web3(window.ethereum);
		const web3 = new Web3(window.ethereum);
		const encodedFunction = web3.eth.abi.encodeFunctionCall({
			name: "mintToken",
			type: "function",
			inputs: [{
			  type: 'string',
			  name: 'tokenURI'
			  }]
		  }, [_uri]);

		console.log(encodedFunction)
		  
		const transactionParameters = {
		to: nft_contract_address,
		from: ethereum.selectedAddress,
		gas: "0x76c0", // 30400
		gasPrice: "0x9184e72a000", // 10000000000000
		value: "0x9184e72a", // 2441406250
		data: encodedFunction
		};  
		const txt = await ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters]
		  });
		console.log(txt)  
		setTxt(txt)
		// const web3Modal = new Web3Modal()
		// const connection = await web3Modal.connect()
		// const provider = new ethers.providers.Web3Provider(connection)
		// const signer = provider.getSigner()
		// let contract = new ethers.Contract(nft_contract_address, NFT_MARKET, signer)

	} 

	return (
		<>
		<div className="container w-1/2 mx-auto ">
			{txt}
		<input type="file" name="Asset" className="m-1" onChange={onChange} />

		<button onClick={creatnft} className="px-2 bg-green-300 border-md">Creat Nft</button>
        </div>
		</>
	)
}

Opensea.layout = 'LD'
export default Opensea