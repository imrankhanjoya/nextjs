const Loadpage = ({ status }) => {
    return (
        <div className="w-full text-center  h-full bg-black flex flex-row" ><img src="/4Mg9.gif" className="w-1/2 opacity-25" /><span className="text-[30px] align-text-middle mt-[10%] h-full">processing....{status}</span></div>
    )
}

export default Loadpage