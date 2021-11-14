//import Footer from "./Footer";
import Navbar from './Navbar';
import Footer from './Footer';
const LayoutBoth = ({children})=>{
   return (
      <div>
      <Navbar/>
      {children}
      <Footer/>
      </div>
   )
}

export default LayoutBoth;