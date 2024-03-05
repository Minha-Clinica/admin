import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Text } from "../../atoms"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


export default function SuccessPayment(props) {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/assignmentPlan')
        }, 5000)
    }, [])

    return (
        <>
            <Box sx={styles.containerRegister}>
                <CheckCircleIcon style={{ color: 'green', fontSize: 40 }} />
                <Text title bold>Sua assinatura foi realizada com sucesso!</Text>
                <Text large light>Suas permissões serão liberadas em até 36 horas,</Text>
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
