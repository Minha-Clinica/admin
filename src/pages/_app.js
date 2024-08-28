import { Box } from '../atoms'
import { AppProvider, useAppContext } from '../context/AppContext'
import '../styles/globals.css'
import 'react-credit-cards/es/styles-compiled.css';
import PagesRoute from './pagesRoute'


function App({ Component, pageProps }) {

   return (
      <AppProvider>
         <PagesRoute Component={Component} pageProps={pageProps} />
      </AppProvider>
   )
}

export default App;

const styles = {
   bodyContainer: {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "row",
      width: '100%',
   },
   contentContainer: {
      display: "flex",
      width: '100%',
      flexDirection: 'column',
      flex: 1,
      gap: `35px`,
      paddingBottom: `60px`,
      overflowY: 'hidden',
      marginTop: { xs: `60px`, xm: `0px`, md: `0px`, lg: `0px` }
   },
}