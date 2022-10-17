import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Loading from "../components/Loading";
import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'
import { Web3Storage } from 'web3.storage'
import { NFTStorage, File } from 'nft.storage'
//https://ipfs.io/ipfs/bafyreicaaf2p5jscph67bhghwsxfwbm2tga4i3xvweec2lnabb7e2rxomy/metadata.json
//https://ipfs.io/ipfs/Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=1-PUG.json
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//const nft_address = '0x0A36498Fb8E7fdbb0BB04Eb0a659B032963529F8'//process.env.NFT_ADD
//const nft_market_address = '0xba371bAfafc35b6cCFc51B8F9A70d5Ff60E757f2'//process.env.NFT_ADD
//nft_address.storage key below
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFlNWNFN2M5NzdGNTMwNEI1OEFhOGIwQzJhZWQyNzE0NTVmNTFFM0QiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzODc1NTM4MzI0MSwibmFtZSI6Im5mdHByb2ZpbGUifQ.cvkbt7ZsqOcAky88YTOKmmKT6FNjow9dz5K8bPY6kA4
const client = ipfsHttpClient(process.env.IPFS_URL)
const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS
//const web3storageclient = new Web3Storage({ token:NFTSTORAGE })
const nftstoragekey = new NFTStorage({ token:process.env.NFTSTORAGE_TWO})


const Ipfs = () => {
	const [fileObj, setFileObj] = useState()
	const [msg, setMsg] = useState()
	const [fileUrl, setFileUrl] = useState(false)
	const [processing, setProcessing] = useState(false)
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
	const [ipfspath,setIpfspath] = useState('')
	

	async function readfile(){
		console.log("Reading file")
		const data = await fetch("https://ipfs.io/ipfs/bafyreic75iy3dsv6h6cgy2e7rlajubqpcvi4d3czktdquqnw2xacyqol7q/metadata.json")
		const json = await data.json()
		console.log(json)
		//https://gateway.pinata.cloud/ipfs/bafybeiblff5iwq3tbn45mp5k4d3nzkhgvyjq523iyuwqy724javvy5oeoq/nft.jpg
	}



	async function onChange(e) {
		setProcessing(true)
		const file = e.target.files[0]
		setFileObj(file)
		setMsg("File selected")
		// const metadata = await nftstoragekey.store({name:'tmp',description:'this dis',image:file})
		// console.log("NFTstorage",metadata.url)
		// console.log("NFTstorage",metadata.data)
		//console.log(file.name)
		//const rootCid = await web3storageclient.put(e.target.files) // Promise<CIDString>
		//console.log(rootCid)
		//let filepath = "https://"+rootCid+".ipfs.w3s.link/"+file.name
		//setFileUrl(filepath)
		//const res = await web3storageclient.get(rootCid) // Promise<Web3Response | null>
		//const files = await res.files() // Promise<Web3File[]>
		//for (const file of files) {
		// 	filepath = "https://"+rootCid+".ipfs.w3s.link/"+file.name
		// 	console.log(filepath)
		// 	setFileUrl(filepath)
		//}
		setProcessing(false)
	}
	async function createMarket(e) {
		setMsg("Uploading file to IPFs")
		const { name,external_url, description, price } = formInput
		
		if (!name || !description || !price ){
			console.log("Information missing ",name,description,price)
			return
		} 
		/* first, upload to IPFS */
		const data ={
			description,external_url,name, image: fileObj
		}
		console.log(data)
		try {
			const metadata = await nftstoragekey.store(data)			
			console.log(metadata)
			setIpfspath(ipfspath)
			setMsg("Creating NFT....")
			/* after file is uploaded to IPFS, pass the URL to save it on Polygon */
			//createSale(metadata.url)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}



	return (
		<>
			<div className="flex justify-center">
				{/* <button onClick={readfile}>Read data</button> */}
				<div className="w-1/2 flex flex-col pb-12">
					<div>{msg}</div>
					{ipfspath}
				<input
						type="file"
						name="Asset"
						className="my-4"
						onChange={onChange}
					/>
					{processing && <Loading></Loading>}
					{
						fileUrl && (
							<img className="rounded mt-4" width="350" src={fileUrl} />
						)
					}
					<input
						placeholder="Name"
						className="mt-8 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
					/>
					<input
						placeholder="external_url"
						className="mt-8 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, external_url: e.target.value })}
					/>
					<textarea
						placeholder="Subscription Description"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
					/>
					<input
						placeholder="Subscription Price in Eth"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
					/>
					
					{true && <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
						Create Digital Asset
					</button>}
				</div>
			</div>
		</>
	)
}

Ipfs.layout = 'LD'
export default Ipfs