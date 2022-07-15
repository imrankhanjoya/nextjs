export default function Homebanner() {
      return (
            <section className="text-gray-600 body-font">
                  <div className="container px-5 py-24 mx-auto flex flex-col">
                        <div className="lg:w-4/6 mx-auto">
                              <div className="rounded-lg bg-yellow-300 h-64 overflow-hidden text-center">
                                    <h1 className="text-[40px]  text-black ">NFT Market</h1>
                                    <img src="/nft.svg" className="w-full h-1/2" />
                              </div>
                              <div className="flex flex-col sm:flex-row mt-10">
                                    <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                                          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                                          <img src="/nft.svg" className="w-full h-1/2" />

                                          </div>
                                          <div className="flex flex-col items-center text-center justify-center">
                                                <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">NFT Market demo</h2>
                                                <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                                                
                                          </div>
                                    </div>
                                    <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                          <p className="leading-relaxed text-lg mb-4">
                                                NFT Market demo on testnet. All NFT media is pushed to IPFS and referance is stored in nft contract with token and referance uri for nft media.
                                                In this demo user can create NFT and list in market for sell with price.
                                          </p>
                                          <a className="text-indigo-500 inline-flex items-center">Learn More
                                                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                                                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                                                </svg>
                                          </a>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      )
}