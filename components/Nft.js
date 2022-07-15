const Nft = ({ item }) => {
	return (
		<>
			<div className="rounded-lg  overflow-hidden">
				<img alt="content" className="object-cover object-center h-full w-full" src={item.image} />
			</div>
			<h2 className="text-xl font-medium title-font text-gray-900 mt-5">{item.name}</h2>
			<p className="text-base leading-relaxed mt-2">{item.description}</p>
			<a className="text-indigo-500 inline-flex items-center mt-3">Learn More
				<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
					<path d="M5 12h14M12 5l7 7-7 7"></path>
				</svg>
			</a>
		</>
	)
}

export default Nft