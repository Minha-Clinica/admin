import { Box, Divider, Text } from "../../atoms"
import { useAppContext } from "../../context/AppContext"
import { icons } from "../../organisms/layout/Colors"
import { ProfessionalAndCalendarMobile } from "../Professionals/ProfessionalsAndCalendar"

export const CalendarSessions = (props) => {
    const {
        setDateSelected, dateSelected, loadingDate, setLoadingDate, setShowReserveSession,
        showReserveSession, profissionalId
    } = props

    const { colorPalette } = useAppContext()

    return (
        <Box sx={{
            display: 'flex', gap: 2, transition: '.3s', backgroundColor: colorPalette.secondary, flexDirection: 'column',
            borderTopLeftRadius: 20, // Bordas arredondadas
            borderTopRightRadius: 20,
            padding: '0px 15px',
            width: '100%',
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%',}}>

                <ProfessionalAndCalendarMobile setDateSelected={setDateSelected} dateSelected={dateSelected} profissionalId={profissionalId}
                    setLoadingDate={setLoadingDate}
                    loadingDate={loadingDate} />

            </Box>
        </Box>
    )
}

const styles = {
    icon: {
       backgroundSize: 'cover',
       backgroundRepeat: 'no-repeat',
       backgroundPosition: 'center center',
       width: '15px',
       height: '15px',
       marginRight: '0px',
       backgroundImage: `url('/favicon.svg')`,
    },
    menuIcon: {
       backgroundSize: 'cover',
       backgroundRepeat: 'no-repeat',
       backgroundPosition: 'center',
       width: 20,
       height: 20,
 
    },
    noResultsImage: {
       backgroundSize: "cover",
       backgroundRepeat: "no-repeat",
       backgroundPosition: "center",
       width: { xs: '100%', xm: 200, md: 350, lg: 350 },
       height: 250,
       backgroundImage: `url('/background/encaixe.jpeg')`,
    },
 }