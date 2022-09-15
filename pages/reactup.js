import { useEffect, useState } from "react";
import { Web3Storage } from 'web3.storage'


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmOWY1MDM1QTI1ZkVmNTlCMjcxQzNhMzU3OTc3MzliYWM4MjQ1MjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwOTk1NDg0NTYsIm5hbWUiOiJORlRNQVJLRVQifQ.DT0eVMyXxGPnaPh2lx0FZIHLQVq4EtiDK40lH34UjCE

const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmOWY1MDM1QTI1ZkVmNTlCMjcxQzNhMzU3OTc3MzliYWM4MjQ1MjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwOTk1NDg0NTYsIm5hbWUiOiJORlRNQVJLRVQifQ.DT0eVMyXxGPnaPh2lx0FZIHLQVq4EtiDK40lH34UjCE' })

const Reactup = () => {
	const [fileUrl, setFileUrl] = useState('')
	
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

	return (
		<>
		<div>
		<input
						type="file"
						name="Asset"
						className="my-4"
						onChange={onChange}
					/>
        </div>
		</>
	)
}

Reactup.layout = 'LD'
export default Reactup