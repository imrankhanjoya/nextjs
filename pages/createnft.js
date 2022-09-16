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


const Createnft = () => {
	const [fileObj, setFileObj] = useState()
	const [msg, setMsg] = useState()
	const [fileUrl, setFileUrl] = useState(false)
	const [processing, setProcessing] = useState(false)
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

	

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
		const { name, description, price } = formInput
		if (!name || !description || !price ){
			console.log("Information missing ",name,description,price)
			return
		} 
		/* first, upload to IPFS */
		const data ={
			name, description, image: fileObj
		}
		console.log(data)
		try {
			const metadata = await nftstoragekey.store(data)			
			console.log(metadata.url)
			setMsg("Creating NFT....")
			/* after file is uploaded to IPFS, pass the URL to save it on Polygon */
			createSale(metadata.url)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}

	async function testSell() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const price = ethers.utils.parseUnits('0.0025', 'ether')

		let contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()
		transaction = await contract.createMarketItem(nft_address, 3, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		console.log(myNFTs)
	}

	async function createSale(url) {
		setProcessing(true)

		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		/* next, create the item */
		let contract = new ethers.Contract(nft_address, NFT, signer)
		let transaction = await contract.createToken(url)
		let tx = await transaction.wait()
		let event = tx.events[0]
		let value = event.args[2]
		let tokenId = value.toNumber()


		const price = ethers.utils.parseUnits(formInput.price, 'ether')
		/* then list the item for sale on the marketplace */
		contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()

		transaction = await contract.createMarketItem(nft_address, tokenId, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		setMsg("Lising  NFT....")
		console.log(myNFTs)
		setProcessing(false)

	}


	return (
		<>
			<div className="flex justify-center">
				{/* <button onClick={readfile}>Read data</button> */}
				<div className="w-1/2 flex flex-col pb-12">
					<div>{msg}</div>
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
						placeholder="Subscription Name"
						className="mt-8 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
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

Createnft.layout = 'LD'
export default Createnft