import { useEffect, useState } from "react";
import { Box, Divider, Text } from "../../atoms"
import { useAppContext } from "../../context/AppContext";
import { Avatar, CircularProgress } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { api } from "../../api/api";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from "next/router";

export const ProfessionalAndCalendarMobile = ({
    setDateSelected, dateSelected, loadingDate, setLoadingDate
}) => {

    const router = useRouter()
    const { colorPalette, user } = useAppContext()
    const [data, setData] = useState([])
    const [availableDays, setAvailableDays] = useState([]);
    const [agendasSelected, setAgendasSelected] = useState([])


    const getProfissional = async () => {
        setLoadingDate(true)
        try {
            const response = await api.get(`/users/search/profissional/${user.empresa_id}`)
            const { data = [] } = response;
            setData(data)
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoadingDate(false)
        }
    }

    useEffect(() => {
        getProfissional()
    }, [])

    const getAvailableDays = (agendas) => {
        const uniqueDates = new Set(); // Usando um Set para armazenar as datas únicas
        agendas.forEach((agend) => {
            if (agend.disponivel === 0) {
                uniqueDates.add(moment(agend.inicio).format("YYYY-MM-DD"));
            }
        });
        
        console.log('agendas: ', agendas)
        console.log('Array.from(uniqueDates): ', Array.from(uniqueDates))

        // Convertendo o Set de datas únicas de volta para um array
        setAgendasSelected(agendas)
        setAvailableDays(Array.from(uniqueDates))
    };


    const horarios = (obj) => {
        const horaMoment = moment(obj);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
    }


    const handleSelectedDate = (value, id) => {
        setLoadingDate(true)
        let date = moment(value).format("YYYY-MM-DD")
        try {

            if (dateSelected?.day === date) {
                setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '' })
            } else {
                setDateSelected({ day: date, hour: '', profissionalId: id, reserva_id: '' })
            }
        } catch (error) {
            console.log('error: ',error)
            return error
        } finally {
            setLoadingDate(false)
        }
    }

    console.log('dateSelected: ', dateSelected)
    console.log('availableDays: ', availableDays)
    

    return (
        <Box>
            <Box sx={{
                display: 'flex', gap: 3, padding: '15px', borderRadius: 2,
                flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
            }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                        {data?.map((item, index) => {
                            const name = item?.nome?.split(' ');
                            const firstName = name[0];
                            const lastName = name[name.length - 1];
                            const userName = `${firstName} ${lastName}`;
                            const isSelected = dateSelected.profissionalId === item.id;

                            return (
                                <Box key={index} sx={{
                                    display: 'flex', gap: .5, alignItems: 'center',
                                    justifyContent: 'center', flexDirection: 'column', padding: '15px'
                                }} onClick={() => {
                                    setDateSelected({ ...dateSelected, profissionalId: item.id })
                                    getAvailableDays(item?.agenda)

                                }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {isSelected && <CheckCircleIcon style={{ zIndex: 1, backgroundColor: '#fff',
                                         color: 'green', fontSize: 17, position: 'absolute', top: -4, right: -4,
                                         width: 16, height: 16, borderRadius: '50%' }} />}
                                        <Avatar src={item?.location || ''} sx={{
                                            height: 44,
                                            width: 44,
                                            border: isSelected && `1px solid ${colorPalette.buttonColor}`
                                        }} variant="full"
                                        />
                                    </Box>
                                    <Text bold={isSelected} style={{ color: isSelected ? colorPalette.third : colorPalette.textColor }}>{userName}</Text>
                                </Box>
                            )
                        })}
                    </Box>

                    <Divider />
                    {loadingDate ? <CircularProgress /> : availableDays?.length > 0 ?
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>

                            <Box sx={{
                                display: 'flex', gap: 2, justifyContent: 'space-between',
                                flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
                            }}>
                                <Box sx={{
                                    display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                    alignItems: 'center'
                                }}>
                                    <Calendar
                                        defaultActiveStartDate={new Date()}
                                        onChange={(date) => handleSelectedDate(date, dateSelected.profissionalId)}
                                        style={{
                                            border: 'none'
                                        }}
                                        tileDisabled={({ date }) => !availableDays.includes(moment(date).format("YYYY-MM-DD"))}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                                {(dateSelected.profissionalId && dateSelected.day) ?
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
                                                flexDirection: { xs: 'row', sm: 'row', md: 'column', lg: 'column' }
                                            }}>
                                                {agendasSelected?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
                                                    (agend.disponivel === 0))?.map((hour, index) => {
                                                        const hourFormatted = horarios(hour.inicio)
                                                        const selected = dateSelected?.hour === hourFormatted;

                                                        console.log('hourFormatted: ', hourFormatted)

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

                    <Box sx={{ display: availableDays?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                        <Box sx={{
                            padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 150,
                            marginTop: 3,
                            transition: '.5s',
                            gap: 2,
                            backgroundColor: colorPalette.buttonColor,
                            borderRadius: 2,
                            opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === dateSelected.profissionalId) ? 1 : 0.5,
                            "&:hover": {
                                opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === dateSelected.profissionalId) ? 1 : 0.5,
                                cursor: 'pointer',
                                transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === dateSelected.profissionalId) ? 'scale(1.1, 1.1)' : 'none'
                            }
                        }} onClick={() => {
                            if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === dateSelected.profissionalId) {
                                if (dateSelected?.reserva_id === '') {
                                    alert.info('Selecione um horário antes de continuar.')
                                } else {
                                    router.push(`/searchProfissional/${dateSelected?.reserva_id}?professionalId=${dateSelected?.profissionalId}&userId=${user.id}`)
                                }
                            }
                        }}>
                            <Text bold style={{ color: '#fff' }}>Agendar</Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}