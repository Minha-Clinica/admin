import { useRouter } from "next/router"
import { Box, Text } from "../../atoms"
import { useAppContext } from "../../context/AppContext"

export const TabNavigator = () => {
    const { colorPalette, user } = useAppContext()
    const isAdministrador = user?.perfil?.includes('administrador')
    const router = useRouter()
    const currentPage = router.pathname === '/' ? '' : router.asPath
    console.log(currentPage)
    return (
        <Box sx={{
            display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none', xl: 'none' }, width: '100%', gap: 2, alignItems: 'center',
            padding: '20px 20px', position: 'fixed', bottom: 0, backgroundColor: colorPalette.secondary, zIndex: 99999,
            justifyContent: 'space-around',
            boxShadow: `rgba(35, 32, 51, 0.27) 0px 6px 24px`, borderTopLeftRadius: 2
        }}>
            <Box sx={styles.navButton} onClick={() => router.push(`/`)}>
                <Box sx={{
                    ...styles.icon,
                    backgroundImage: `url('/icons/dashboard_icon.png')`,
                }} />
                <Text small
                    style={{ color: !currentPage && colorPalette?.buttonColor }}
                    bold={!currentPage}>
                    Home
                </Text>
            </Box>

            <Box sx={styles.navButton} onClick={() => router.push(`/consultation`)}>
                <Box sx={{
                    ...styles.icon,
                    backgroundImage: `url('/icons/email.png')`,
                }} />
                <Text small
                    style={{ color: currentPage.includes('consultation') && colorPalette?.buttonColor }}
                    bold={currentPage.includes('consultation')}>
                    Sessões
                </Text>
            </Box>

            {isAdministrador ?

                <Box sx={styles.navButton} onClick={() => router.push(`/calendar`)}>
                    <Box sx={{
                        ...styles.icon,
                        backgroundImage: `url('/icons/agenda.png')`,
                    }} />
                    <Text small
                        style={{ color: currentPage.includes('calendar') && colorPalette?.buttonColor }}
                        bold={currentPage.includes('calendar')}>
                        Agenda
                    </Text>
                </Box>
                :
                <Box sx={styles.navButton} onClick={() => router.push(`/anamnese/${user?.id}`)}>
                    <Box sx={{
                        ...styles.icon,
                        backgroundImage: `url('/icons/google-forms.png')`,
                    }} />
                    <Text small
                        style={{ color: currentPage.includes('anamnese') && colorPalette?.buttonColor }}
                        bold={currentPage.includes('anamnese')}>
                        Anamnêse
                    </Text>
                </Box>
            }

            <Box sx={styles.navButton} onClick={() => router.push('/userData')}>
                <Box sx={{
                    ...styles.icon,
                    backgroundImage: `url('/icons/perfil_nav.png')`,
                }} />
                <Text small
                    style={{ color: currentPage.includes('userData') && colorPalette?.buttonColor }}
                    bold={currentPage.includes('userData')}>
                    Perfil
                </Text>
            </Box>
        </Box>
    )
}

const styles = {
    icon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        width: 12,
        aspectRatio: `1/1`,
        height: 12,
        marginRight: '0px',
        backgroundImage: `url('/favicon.svg')`,
    },
    navButton: {
        display: 'flex',
        gap: .5,
        alignItems: 'center',
        flexDirection: 'column',
    }
}