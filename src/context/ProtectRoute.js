import { useRouter } from "next/router";
import { Box } from "../atoms";
import Login from "../auth/login";
import { useAppContext } from "./AppContext";
import RegisterFromCompany from "../pages/company";

export const ProtectRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAppContext()
   const router = useRouter();
   const { cod_key } = router.query;
   console.log(cod_key)
   // Extrair o código da empresa da URL
   const companyCode = cod_key;

   if (isAuthenticated) return children;
   if (loading) return <Loading />
   if (companyCode && !isAuthenticated) {
      return <RegisterFromCompany companyCode={companyCode} />;
   }
   if (!isAuthenticated && !loading) return <Login />;
}

const Loading = () => <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#fff', width: '100%', height: '100%' }} />