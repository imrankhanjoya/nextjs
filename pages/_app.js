import 'tailwindcss/tailwind.css';
import Layout from '../components/Layout';
const layouts = {
  LD: Layout,
};

function MyApp({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((children) => <>{children}</>);
  return ( 
  <Layout>
    <Component {...pageProps} />
  </Layout>)
}

export default MyApp