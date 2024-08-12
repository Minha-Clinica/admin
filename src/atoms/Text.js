import { Typography } from "@mui/material";
import { Colors } from "../organisms";
import { useAppContext } from "../context/AppContext";

export const Text = (props) => {

   const {
      children,
      light = false,
      bold = false,
      xsmall = false,
      small = false,
      large = false,
      veryLarge = false,
      indicator = false,
      title = false,
      center = false,
      secundary = false,
      style = {},
      sx = {}
   } = props;

   const { colorPalette } = useAppContext()

   return (
      <Typography
      {...props}
      sx={{
         color: colorPalette.textColor,
         transition: 'background-color 1s',
         fontFamily: "'Metropolis Regular', Helvetica, Arial, Lucida, sans-serif, 'Metropolis Bold'",
         fontSize: { xs: `13px`, xm: `13px`, md: `13px`, lg: `13px`, xl: '13px' },
         ...(light && { fontFamily: 'MetropolisLight', }),
         ...(bold && { fontFamily: 'MetropolisBold' }),
         ...(xsmall && { fontSize: { xs: `10px`, sm: `10px`, md: `10px`, lg: `10px`, xl: '10px' } }),
         ...(small && { fontSize: { xs: `11px`, sm: `11px`, md: `10px`, lg: `11px`, xl: `11px` } }),
         ...(large && { fontSize: { xs: `15px`, sm: `15px`, md: `15px`, lg: `15px`, xl: `17px` } }),
         ...(veryLarge && { fontSize: { xs: `22px`, sm: `18px`, md: `18px`, lg: `20px`, xl: `23px` } }),
         ...(indicator && { fontSize: { xs: `22px`, sm: `25px`, md: `25px`, lg: `28px`, xl: `28px` } }),
         ...(title && { fontSize: { xs: `18px`, sm: `18px`, md: `18px`, lg: `18px`, xl: `18px` } }),
         ...(center && { textAlign: 'center' }),
         ...(secundary && { color: Colors.textColor + '77' }),
         ...style,
         ...sx
      }}
   >
      {children}
   </Typography>
   )
}