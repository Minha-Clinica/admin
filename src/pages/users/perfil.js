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
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function PerfilProfissional() {
    const { setLoading, alert, colorPalette, user, matches, theme, setShowConfirmationDialog, menuItemsList, userPermissions } = useAppContext()
    const usuario_id = user.id;
    const router = useRouter()
    const { id, profissionalId } = router.query;
    const [userData, setUserData] = useState({})
    const [reservaData, setReserveData] = useState({})
    const [formattedDate, setFormattedDate] = useState()
    const [loadingReservation, setLoadingReservation] = useState(false)
    const [formPayment, setFormPayment] = useState()
    const [formattedHour, setFormattedHour] = useState()
    const [priceConsultation, setPriceConsultation] = useState(200)
    const [agendaList, setAgendaList] = useState([])
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    moment.locale("pt-br");
    const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '' })

    const getUserData = async () => {
        try {
            const response = await api.get(`/user/${profissionalId}`)
            const { data } = response
            setUserData(data)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getReserva = async () => {
        try {
            const response = await api.get(`/event/profissional/agenda/${user?.id}`)
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
            const response = await api.post(`consultation/create`, {
                reservaData,
                pacientId: user?.id,
                priceConsultation: priceConsultation,
                profissionalId: profissionalId,
                userData: userData,
                pacientEmail: user?.email,
                pacientName: user?.nome
            })
            const { status, data } = response
            if (status === 201 && data?.consultation) {
                alert.success('Consulta criada e agendada com o profissional.')
                router.push('/consultation')
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
            await getUserData()
            await getReserva()
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


    const horarios = (obj) => {
        const horaMoment = moment(obj);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
    }


    const handleSelectedDate = (value, id) => {
        setLoading(true)
        let date = moment(value).format("YYYY-MM-DD")
        try {
            if (dateSelected?.day === date) {
                setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '' })
            } else {
                setDateSelected({ day: date, hour: '', profissionalId: id, reserva_id: '' })
            }
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }


    const getAvailableDays = (agendas) => {
        const uniqueDates = new Set(); // Usando um Set para armazenar as datas únicas
        agendas.forEach((agend) => {
            if (agend.disponivel === 0) {
                uniqueDates.add(moment(agend.inicio).format("YYYY-MM-DD"));
            }
        });

        return Array.from(uniqueDates); // Convertendo o Set de datas únicas de volta para um array
    };


    return (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{
                    display: 'flex', gap: 2, backgroundColor: colorPalette.third, padding: '30px', borderRadius: 2,
                    position: 'absolute', top: 0,
                    height: 200,
                    width: '100%',
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, position: 'relative', flexDirection: 'column'
                }}>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', position: 'absolute', top: 70, justifyContent: 'space-between', width: '92%' }}>
                <Box sx={{
                    display: 'flex', gap: 4, padding: '15px', borderRadius: 2,
                    flexDirection: 'row'
                }}>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        <Avatar src={userData?.location || ''} sx={{
                            height: { xs: '100%', sm: 45, md: 45, lg: 250 },
                            width: { xs: '100%', sm: 45, md: 45, lg: 250 },
                        }} variant="rounded"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', flex: 1, }}>
                        <Box sx={{ display: 'flex', gap: 5, flexDirection: 'column', alignItems: 'start', padding: '10px 0px 0px 10px', marginTop: 5 }}>
                            <Text indicator bold style={{ color: '#fff' }}>{userData?.nome}</Text>
                            <Box>
                                <Text light veryLarge bold >Formado em Terapia - TRG </Text>
                                <Text light veryLarge >São Paulo - SP </Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex', height: '100%', width: 400, backgroundColor: colorPalette?.secondary,
                    marginTop: 10,
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, border: `1px solid lightgray`, gap: 2, padding: '20px 20px', flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                        <Text bold title style={{ textAlign: 'center' }}>Agenda:</Text>
                    </Box>
                    <Divider distance={0} />
                    <Box>
                        {agendaList?.length > 0 && agendaList?.map((item, index) => {
                            const availableDays = getAvailableDays(item?.agenda);

                            return (
                                <Box key={index} sx={{
                                    display: 'flex', gap: 6, backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2,
                                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, position: 'relative', flexDirection: 'row'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                    }}>
                                        <Avatar src={item?.location || ''} sx={{
                                            height: { xs: '100%', sm: 45, md: 45, lg: 120 },
                                            width: { xs: '100%', sm: 45, md: 45, lg: 120 },
                                        }} variant="rounded"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                                        <>
                                            {availableDays?.length > 0 ?
                                                <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                                        <Box sx={{
                                                            display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                                            alignItems: 'center'
                                                        }}>
                                                            <Calendar
                                                                onChange={(date) => handleSelectedDate(date, item?.id)}
                                                                style={{
                                                                    border: 'none'
                                                                }}
                                                                tileDisabled={({ date }) => !availableDays.includes(moment(date).format("YYYY-MM-DD"))}
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                                                        {(dateSelected?.day && dateSelected?.profissionalId === item?.id) ?
                                                            <Box sx={{
                                                                display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1,
                                                                justifyContent: 'flex-start', width: '100%',
                                                            }}>
                                                                <Box sx={{ display: 'flex', padding: '12px 10px', backgroundColor: colorPalette?.primary, justifyContent: 'center' }}>
                                                                    <Text bold style={{ color: colorPalette.buttonColor }}>Selecione um horário:</Text>
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-start', marginTop: 1,
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto',
                                                                        maxHeight: 200,
                                                                        width: '100%',
                                                                        padding: '5px 12px',
                                                                        flexDirection: 'column'
                                                                    }}>
                                                                        {item?.agenda?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
                                                                            (agend.disponivel === 0))?.map((hour, index) => {
                                                                                const hourFormatted = horarios(hour.inicio)
                                                                                const selected = dateSelected?.hour === hourFormatted;
                                                                                return (
                                                                                    <Box key={index} sx={{
                                                                                        display: 'flex', gap: .5, padding: '8px 12px', borderRadius: 2,
                                                                                        width: '100%',
                                                                                        backgroundColor: colorPalette.primary,
                                                                                        border: selected && `1px solid ${colorPalette?.buttonColor}`,
                                                                                        justifyContent: 'space-between',
                                                                                        alignItems: 'center',
                                                                                        "&:hover": {
                                                                                            opacity: 0.8,
                                                                                            cursor: 'pointer'
                                                                                        }
                                                                                    }} onClick={() => {
                                                                                        if (selected) {
                                                                                            setDateSelected({ ...dateSelected, hour: '', reserva_id: '' })
                                                                                        } else {
                                                                                            setDateSelected({ ...dateSelected, hour: hourFormatted, reserva_id: hour?.id_evento_calendario })
                                                                                        }
                                                                                    }}>
                                                                                        <Text large bold={selected ? true : false}>{hourFormatted}</Text>
                                                                                        {selected && <CheckCircleIcon style={{ color: 'green', fontSize: 17 }} />}
                                                                                    </Box>
                                                                                )
                                                                            })}
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            :
                                                            <></>
                                                        }
                                                    </Box>
                                                </Box>
                                                :
                                                <Text light large style={{ textAlign: 'center' }}>Profissional sem agenda disponível</Text>
                                            }
                                        </>

                                        <Box sx={{ display: availableDays?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                                            <Box sx={{
                                                padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                width: 150,
                                                marginTop: 3,
                                                transition: '.5s',
                                                gap: 2,
                                                backgroundColor: colorPalette.buttonColor,
                                                borderRadius: 2,
                                                opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === item?.id) ? 1 : 0.5,
                                                "&:hover": {
                                                    opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === item?.id) ? 1 : 0.5,
                                                    cursor: 'pointer',
                                                    transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === item?.id) ? 'scale(1.1, 1.1)' : 'none'
                                                }
                                            }} onClick={() => {
                                                if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === item?.id) {
                                                    if (dateSelected?.reserva_id === '') {
                                                        alert.info('Selecione um horário antes de continuar.')
                                                    } else {
                                                        router.push(`/searchProfissional/${dateSelected?.reserva_id}?profissionalId=${dateSelected?.profissionalId}`)
                                                    }
                                                }
                                            }}>
                                                <Text bold style={{ color: '#fff' }}>Reservar Agenda</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', marginTop: 22, padding: '10px 30px' }}>

                <Box sx={{
                    display: 'flex', height: '100%', width: '100%', backgroundColor: colorPalette?.secondary,
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, border: `1px solid lightgray`, gap: 2, padding: '20px 20px', flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                        <Text bold title style={{ textAlign: 'center' }}>Sobre Mim:</Text>
                    </Box>
                    <Divider distance={0} />
                    <Text large>
                        Olá! Sou {userData?.nome || 'Fulano Silva'}, uma terapeuta especializada em Terapia de Reprocessamento Generativo (TRG), uma abordagem focada e orientada para a resolução de problemas emocionais e psicossomáticos. Meu objetivo é auxiliar você a superar traumas, fobias, compulsões, ansiedade, depressão, crises de pânico e outros desafios emocionais, libertando-o/a dessas questões pela raiz.
                    </Text>
                    <Text large>
                        A TRG é uma técnica terapêutica breve que trabalha diretamente com o cérebro, liberando bloqueios e limitações que foram criados por experiências passadas. Através de um processo cuidadoso e empático, ajudamos a reprocessar essas memórias de forma a promover a cura e o bem-estar emocional.
                    </Text>

                    <Text large>
                        Meu compromisso é oferecer um ambiente acolhedor e seguro para que você possa explorar suas emoções, compreender suas dificuldades e encontrar caminhos para uma vida mais equilibrada e gratificante. Com dedicação e experiência na TRG, estou aqui para apoiá-lo/a em sua jornada de autodescoberta e transformação pessoal.
                    </Text>
                    <Text large>
                        Se você está enfrentando desafios emocionais ou psicossomáticos e deseja uma abordagem terapêutica eficaz e transformadora, entre em contato para agendar uma consulta. Juntos, podemos trabalhar na superação dos obstáculos que estão impedindo seu bem-estar e sua qualidade de vida.
                    </Text>
                    <Text large>
                        Agradeço pela confiança em meu trabalho e espero poder ajudá-lo/a a alcançar uma vida mais plena e feliz.
                    </Text>
                    <Text large bold style={{ color: colorPalette?.buttonColor }}>
                        {userData?.nome || 'Fulano Silva'}.
                        <br />
                        Terapeuta de Reprocessamento Generativo (TRG)
                    </Text>

                </Box>

            </Box >
        </Box>

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

PerfilProfissional.noPadding = true;

export default PerfilProfissional;
