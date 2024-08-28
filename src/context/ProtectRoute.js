import { useRouter } from "next/router";
import { Box } from "../atoms";
import Login from "../auth/login";
import { useAppContext } from "./AppContext";
import RegisterFromCompany from "../pages/company";
import Register from "../pages/register";

export const ProtectRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAppContext()
   const router = useRouter();
   const { cod_key } = router.query;
   const companyCode = cod_key;
   const currentPath = router.pathname

   if (isAuthenticated) return children;
   if (loading) return <Loading />
   if (companyCode && !isAuthenticated) {
      return <RegisterFromCompany companyCode={companyCode} />;
   }

   if (!isAuthenticated && !loading) {
      if (currentPath === '/register') {
         return <Register />
      } else {
         return <Login />
      }
   }
}

const Loading = () => <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#fff', width: '100%', height: '100%' }} />