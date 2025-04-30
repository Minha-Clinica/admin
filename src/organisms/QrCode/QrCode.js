import { CircularProgress } from '@mui/material';
import { Box, Text } from '../../atoms';


export default function QrCodePix({ value, pixKey, loading }) {
  console.log('value: ', value)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '15px 0px', marginBottom: 2 }}>
      <Text bold>Pagamento via Pix</Text>
      <Text>{pixKey}</Text>
      {loading ?
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <CircularProgress />
          <Text light>Gerando QR Code...</Text>
        </Box>
        :
        <img src={value} alt="QR Code Pix" width={150} height={150} />}
    </Box>
  );
}
