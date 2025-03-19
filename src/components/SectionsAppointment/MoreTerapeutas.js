import { useRouter } from "next/router"
import { Box, Text } from "../../atoms"
import { useAppContext } from "../../context/AppContext"

export const MoreTerapeutas = () => {
    const { colorPalette } = useAppContext()
    const router = useRouter()

    return (

        <Box sx={{
            display: { xs: 'none', xm: 'none', md: 'flex', lg: 'flex' }, padding: '15px', gap: 2, alignItems: 'center', flexDirection: 'column', borderRadius: 2, backgroundColor: colorPalette.secondary,
        }}>
            <Text large light>Deseja marcar uma sessão com um de nossos terapeutas? Verifique a dísponibilidade, e reserve agora mesmo!</Text>
            <Box sx={styles.appoitmentImage} />
            <Box sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 12px',
                borderRadius: 2,
                backgroundColor: colorPalette.buttonColor,
                "&:hover": {
                    opacity: 0.8,
                    cursor: 'pointer'
                }
            }} onClick={() => router.push('/searchProfissional')}>
                <Text light large style={{ color: '#fff' }}>Verificar Disponíbilidades</Text>
                <Box sx={{
                    ...styles.menuIcon,
                    marginTop: '2px',
                    width: 17, height: 18,
                    aspectRatio: '1/1',
                    backgroundImage: `url('/icons/next_arrow.png')`,
                    transition: '.3s',
                }} />
            </Box>

        </Box>
    )
}

const styles = {
    appoitmentImage: {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: { xs: '100%', xm: 200, md: 350, lg: 350 },
        height: 250,
        backgroundImage: `url('/background/encaixe.jpeg')`,
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,

    }
}