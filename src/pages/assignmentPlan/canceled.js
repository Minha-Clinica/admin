import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Text } from "../../atoms"
import CancelIcon from '@mui/icons-material/Cancel';


export default function CanceledPayment(props) {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/assignmentPlan')
        }, 5000)
    }, [])

    return (
        <>
            <Box sx={styles.containerRegister}>
                <CancelIcon style={{ color: 'red' }} fontSize="35" />
                <Text veryLarge bold>Houve um problema ao realizar sua assinatura do plano escolhido. Tente novamente em alguns minutos.</Text>
            </Box>

        </>
    )
}


const styles = {
    containerRegister: {
        display: 'flex',
        gap: 5,
        marginTop: 8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 15,
        height: 15,
    },
}
