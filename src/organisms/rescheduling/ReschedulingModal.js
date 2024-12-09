import { Avatar, Backdrop } from "@mui/material";
import { Box, ContentContainer, Divider, Text } from "../../atoms";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/pt-br";
import { icons } from "../layout/Colors";

export const ReschedulingModal = ({ active = false, setActive, consultData = {}, pacientData = {}, setShowData }) => {
    const profissionalId = 125;
    const { colorPalette } = useAppContext()
    const [profissionalData, setProfissionalData] = useState({})
    const [loadingPayment, setLoadingPayment] = useState(false)
    const router = useRouter()
    const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '', consultId: '' })

    const horarios = (obj) => {
        const horaMoment = moment(obj);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
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


    const getProfissionalAgendas = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/users/search/profissional/agendas/${profissionalId}`)
            const { data = [] } = response;

            setProfissionalData(data)

            const currentDate = new Date(consultData.data);
            const options = {
                day: "numeric",
                month: "long",
                year: "numeric",
            };
            const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(currentDate);
            const horaMoment = moment(consultData.data);
            const horaFormatada = horaMoment.format("HH:mm");

            setDateSelected({ ...dateSelected, consultId: consultData.id_consulta })
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }


    const handleRescheduleppointment = async () => {
        setLoadingPayment({ active: true, success: false, error: false, message: 'Reagendando Sessões...' });

        try {
            const response = await api.patch(`/consultation/agenda/reagenda/${dateSelected?.consultId}`, {
                reservaId: dateSelected?.reserva_id,
                userPacientData: {
                    nome: pacientData?.nome,
                    id: pacientData?.id,
                    email: pacientData?.email
                }
            });

            if (response.status === 200) {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: true, error: false,
                        icon: '/icons/remarcar_icon.png',
                        message: `Sessão remarcada com sucesso.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: true, error: false,
                            icon: '/icons/remarcar_icon.png',
                            message: `Sessão remarcada com sucesso.`
                        });
                        await callBack();
                    }, 2000);
                    alert.success('Sessão remarcada.');
                }, 2000);
                setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '', consultId: '' })
                setShowAgendas({ active: false, profissionalId: null, profissionalData: {}, consultionDate: '' })
            } else {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: false, error: true,
                        message: `Ocorreu um erro ao remarcar sessão. Tente novamente mais tarde.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: false, error: true,
                            message: `Ocorreu um erro ao remarcar sessão. Tente novamente mais tarde.`
                        });
                    }, 3500);
                    alert.error(`Ocorreu um erro ao remarcar sessão sessão.`);
                }, 3500);
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setTimeout(() => {
                setLoadingPayment({ active: false, success: false, error: false, message: '' });
            })
        }
    };



    const handleSelectedDate = (value, id) => {
        let date = moment(value).format("YYYY-MM-DD")
        try {
            if (dateSelected?.day === date) {
                setDateSelected({ ...dateSelected, day: '', hour: '', profissionalId: '', reserva_id: '' })
            } else {
                setDateSelected({ ...dateSelected, day: date, hour: '', profissionalId: id, reserva_id: '' })
            }
        } catch (error) {
            return error
        }
    }

    return (
        <Backdrop open={active} sx={{ zIndex: 999 }}>
            <ContentContainer style={{
                maxWidth: { md: '800px', lg: '1980px' },
                maxHeight: { md: '580px', lg: '600px', xl: '960px' },
                overflow: 'auto'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text bold large>Remarcar Consulta</Text>
                    <Box sx={{
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: 15,
                        height: 15,
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        zIndex: 999999999,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => {
                        setActive(false)
                    }} />
                </Box>
                <Divider />
                <Box sx={{
                    display: 'flex', gap: 3, backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, position: 'relative', flexDirection: 'column'
                }}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'start', justifyContent: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex'
                        }}>
                            <Avatar src={profissionalData?.location || ''} sx={{
                                height: { xs: '100%', sm: 45, md: 45, lg: 80 },
                                width: { xs: '100%', sm: 45, md: 45, lg: 80 },
                            }} variant="rounded"
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center',
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start' }}>
                                <Text bold large style={{ color: colorPalette.third }}>{profissionalData?.nome}</Text>
                            </Box>
                            <Box sx={{
                                padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '100%',
                                transition: '.5s',
                                gap: 2,
                                backgroundColor: colorPalette.buttonColor,
                                borderRadius: 2,
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    transform: 'scale(1.1, 1.1)'
                                }
                            }} onClick={() => router.push(`/users/perfil?profissionalId=${profissionalData?.id}`)}>
                                <Text bold small style={{ color: '#fff' }}>VER PERFIL</Text>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', height: '90px', width: '1px', backgroundColor: '#eaeaea' }} />
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
                            <Text bold large>Dados da agenda atual:</Text>
                            <Text light >{consultData.data}</Text>
                        </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                        {
                            profissionalData?.agenda?.length > 0 ?
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Text bold large style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>AGENDA DÍSPONIVEL</Text>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>

                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                            <Box sx={{
                                                display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                                alignItems: 'center'
                                            }}>
                                                <Calendar
                                                    onChange={(date) => handleSelectedDate(date, profissionalData?.id)}
                                                    style={{
                                                        border: 'none'
                                                    }}
                                                    tileDisabled={({ date }) => !getAvailableDays(profissionalData?.agenda)?.includes(moment(date).format("YYYY-MM-DD"))}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                                            {(dateSelected?.day && dateSelected?.profissionalId === profissionalData?.id)
                                                ?
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
                                                            {profissionalData?.agenda?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
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
                                </>
                                :
                                <Text light large style={{ textAlign: 'center' }}>Profissional sem agenda disponível</Text>
                        }
                        <Box sx={{ display: profissionalData?.agenda?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                            <Box sx={{
                                padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 150,
                                marginTop: 3,
                                transition: '.5s',
                                gap: 2,
                                backgroundColor: colorPalette.buttonColor,
                                borderRadius: 2,
                                opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalData?.id) ? 1 : 0.5,
                                "&:hover": {
                                    opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalData?.id) ? 1 : 0.5,
                                    cursor: 'pointer',
                                    transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalData?.id) ? 'scale(1.1, 1.1)' : 'none'
                                }
                            }} onClick={() => {
                                if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalData?.id) {
                                    if (dateSelected?.reserva_id === '') {
                                        alert.info('Selecione um horário antes de continuar.')
                                    } else {
                                        handleRescheduleppointment()
                                    }
                                }
                            }}>
                                <Text bold style={{ color: '#fff' }}>Reagendar</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </ContentContainer>
        </Backdrop>
    )
}