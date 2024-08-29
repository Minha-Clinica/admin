import { useRouter } from "next/router";
import { Box } from "../atoms";
import Login from "../auth/login";
import { useAppContext } from "./AppContext";
import RegisterFromCompany from "../pages/company";
import Register from "../pages/register";

export const ProtectRoute = ({ children }) => {
   const { isAuthenticated, loading, colorPalette } = useAppContext()
   const router = useRouter();
   const { cod_key } = router.query;
   const companyCode = cod_key;
   const currentPath = router.pathname

   if (isAuthenticated) return children;
   if (loading) return <Loading />
   if (companyCode && !isAuthenticated) {
      return (
         <Box sx={{ ...styles.bodyContainer, backgroundColor: colorPalette.third }}>
            <Box sx={{
               ...styles.contentContainer, backgroundColor: colorPalette.third,
            }}>
               <RegisterFromCompany companyCode={companyCode} />;
            </Box>
         </Box>
      )
   }

   if (!isAuthenticated && !loading) {
      if (currentPath === '/register') {
         return (
            <Box sx={{ ...styles.bodyContainer, backgroundColor: colorPalette.third }}>
               <Box sx={{
                  ...styles.contentContainer, backgroundColor: colorPalette.third,
               }}>
                  <Register />
               </Box>
            </Box>
         )
      } else {
         return <Login />
      }
   }
}

const styles = {
   bodyContainer: {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "row",
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
   },
   contentContainer: {
      display: "flex",
      width: '100%',
      flexDirection: 'column',
      flex: 1,
      gap: `35px`,
      overflowY: 'hidden',
      alignItems: 'center',
      justifyContent: 'center'
   },
}

const Loading = () => <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#fff', width: '100%', height: '100%' }} />