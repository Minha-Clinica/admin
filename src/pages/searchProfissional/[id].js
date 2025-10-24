import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Avatar, Backdrop, CircularProgress, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, Text, Button, Divider } from "../../atoms"
import { CustomDropzone, SectionHeader } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { icons } from "../../organisms/layout/Colors"
import Link from "next/link"
import moment from "moment";
import "moment/locale/pt-br";
import { formatTimeStamp } from "../../helpers"

export default function ReserveConsultation() {
    const { setLoading, alert, colorPalette, user, matches, theme, setShowConfirmationDialog, menuItemsList, userPermissions } = useAppContext()
    const usuario_id = user.id;
    const router = useRouter()
    const { id, professionalId, userId } = router.query;
    const [profissionalData, setProfissionalData] = useState({})
    const [pacientData, setPacientData] = useState({})
    const [reservaData, setReserveData] = useState({})
    const [formattedDate, setFormattedDate] = useState()
    const [loadingReservation, setLoadingReservation] = useState(false)
    const [formPayment, setFormPayment] = useState()
    const [formattedHour, setFormattedHour] = useState()
    const [priceConsultation, setPriceConsultation] = useState(200)
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    moment.locale("pt-br");


    const getProfissionalData = async () => {
        try {
            const response = await api.get(`/user/${professionalId}`)
            const { data } = response
            setProfissionalData(data)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getPacientData = async () => {
        try {
            const response = await api.get(`/user/${userId}`)
            const { data } = response
            setPacientData(data)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getReserva = async () => {
        try {
            const response = await api.get(`/event/calendar/reserva/${id}`)
            const { data } = response
            setReserveData(data)
            if (data) {
                const currentDate = new Date(data?.inicio);
                const options = {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                };

                const formattedDate = currentDate ? new Intl.DateTimeFormat("pt-BR", options).format(currentDate) : 'none';
                setFormattedDate(formattedDate)

                const horaMoment = moment(data?.inicio);
                const horaFormatada = horaMoment.format("HH:mm");
                setFormattedHour(horaFormatada)
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const handleReservation = async () => {
        setLoadingReservation(true)
        try {
            const response = await api.post(`/consultation/create`, {
                reservaData,
                priceConsultation: priceConsultation,
                profissionalData: profissionalData,
                consultionData: {
                    data: formattedDate,
                    hora: formattedHour
                },
                pacientData: {
                    photo: pacientData ? pacientData.location : user?.getPhoto?.location,
                    email: pacientData ? pacientData.email : user?.email,
                    nome: pacientData ? pacientData.nome : user?.nome,
                    id: pacientData ? pacientData.id : user?.id,
                }
            })
            const { status, data } = response

            if (status === 200 && data?.msg) {
                alert.error(data?.msg)
                return
            }

            if (status === 201 && data?.consultation) {
                alert.success('Consulta agendada com o profissional.')
                router.push('/')
            } else {
                alert.error('Ocorreu um erro ao reservar data e criar a consulta.')
            }

        } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro ao reservar data e criar a consulta.')
            return error
        } finally {
            setLoadingReservation(false)
        }
    }


    useEffect(() => {
        handleItems();
    }, [id])


    const handleItems = async () => {
        setLoading(true)
        try {
            await getProfissionalData()
            await getReserva()
            await getPacientData()
        } catch (error) {
            alert.error('Ocorreu um arro ao carregar Usuarios')
        } finally {
            setLoading(false)
        }
    }

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });


    const formsPayment = [
        {
            id: '01', icon: '/icons/pix_icon.png', title: 'Pix', key: 'pix',
            description: 'Faça o pagamento por Pix, direto com o Terapeuta.'
        },
        {
            id: '02', icon: '/icons/creditCard_icon.png', title: 'Cartão de Crédito', key: 'creditCard',
            to: `/assignmentPlan/subscriptions`,
            description: 'Sem dinheiro agora? Sem problemas! Pague pelo cartão de crédito, e não deixe a consulta para depois!'
        }
    ]


    return (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Backdrop open={loadingReservation} sx={{ zIndex: 99999 }}>
                <Box sx={{
                    display: 'flex', gap: 1, alignItems: 'center', padding: '30px', justifyContent: 'center', flexDirection: 'column',
                    backgroundColor: '#fff', borderRadius: 2
                }}>
                    <CircularProgress />
                    <Text bold>Reservando a Data e criando consulta...</Text>
                </Box>

            </Backdrop>
            <SectionHeader
                icon={'/icons/localized_icon.png'}
                title={`Dados do Agendamento`}
            />
            <Box sx={{
                display: 'flex', width: '100%', justifyContent: { xs: 'center', sm: 'center', md: 'flex-start', lg: 'flex-start' },
                padding: { xs: '15px', sm: '15px', md: '15px', lg: '15px' },
            }}>
                <Box sx={{
                    display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '20px 15px', borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, position: 'relative', flexDirection: 'column',
                    width: { xs: '100%', sm: '100%', md: '400px', lg: '500px' },
                }}>
                    <Box sx={{ padding: '0px 20px' }}>
                        <Text title bold style={{ color: colorPalette.buttonColor }}>Terapeuta</Text>
                    </Box>
                    <Box sx={{
                        display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2,
                        flexDirection: 'row', alignItems: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex',
                        }}>
                            <Avatar src={profissionalData?.location || ''} sx={{
                                height: { xs: 45, sm: 45, md: 45, lg: 120 },
                                width: { xs: 45, sm: 45, md: 45, lg: 120 },
                            }} variant="rounded"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', flex: 1, }}>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start', padding: '10px 0px 0px 10px' }}>
                                <Text title bold style={{ color: colorPalette.third }}>{profissionalData?.nome}</Text>
                                <Text light large>São Paulo - SP </Text>
                            </Box>
                        </Box>
                    </Box>
                    <Divider />

                    <Box sx={{ padding: '0px 20px' }}>
                        <Text title bold style={{ color: colorPalette.buttonColor }}>Paciente</Text>
                    </Box>
                    <Box sx={{
                        display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2,
                        flexDirection: 'row', alignItems: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex',
                        }}>
                            <Avatar src={pacientData?.location || ''} sx={{
                                height: { xs: 45, sm: 45, md: 45, lg: 120 },
                                width: { xs: 45, sm: 45, md: 45, lg: 120 },
                            }} variant="rounded"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', flex: 1, }}>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start', padding: '10px 0px 0px 10px' }}>
                                <Text title bold style={{ color: colorPalette.third }}>{pacientData?.nome}</Text>
                                <Text light>{pacientData?.email}</Text>

                            </Box>
                        </Box>
                    </Box>

                    <Divider />


                    <Box sx={{ padding: '0px 20px' }}>
                        <Text title bold style={{ color: colorPalette.buttonColor }}>Informações da Consulta</Text>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 12px' }}>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center',
                                padding: '8px 12px', borderRadius: 2, backgroundColor: colorPalette.primary, flex: 1
                            }}>
                                <Text bold large>Tempo de Atendimento</Text>
                                <Text bold large style={{ color: colorPalette.buttonColor }}>1 Hora</Text>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box sx={{
                                    ...styles.icon,
                                    backgroundImage: `url('/icons/agenda_icon.png')`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    filter: 'brightness(0) invert(0)',
                                    width: 25,
                                    height: 25,
                                    display: 'flex'
                                }} />
                                <Text light>{formattedDate}</Text>
                            </Box>
                            <Box sx={{ display: 'flex', height: '30px', width: '1px', backgroundColor: 'lightgray' }} />
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box sx={{
                                    ...styles.icon,
                                    backgroundImage: `url('/icons/clock.png')`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    filter: 'brightness(0) invert(0)',
                                    width: 25,
                                    height: 25,
                                    display: 'flex'
                                }} />
                                <Text large title>{formattedHour}</Text>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: 2,
                        transition: '.5s',
                        gap: 2,
                        backgroundColor: colorPalette.buttonColor,
                        borderRadius: 2,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer',
                            transform: 'scale(1.03, 1.03)'
                        }
                    }} onClick={() => handleReservation()}>
                        <Text bold large style={{ color: '#fff' }}>CONFIRMAR AGENDAMENTO</Text>
                    </Box>
                </Box>
            </Box>
        </Box >

    )
}

const styles = {
    containerRegister: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        padding: '40px'
    },
    containerContract: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1.8,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    },
    containerFile: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'gray lightgray',
        '&::-webkit-scrollbar': {
            width: '5px',

        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'darkgray',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'gray',

        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray',

        },
    },
    icon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        width: '15px',
        height: '15px',
        marginRight: '0px',
        backgroundImage: `url('/favicon.svg')`,
    },
}
