import moment from "moment";
import "moment/locale/pt-br";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useAppContext } from "../../context/AppContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Text } from "../../atoms";
import { useEffect, useState } from "react";


export const CalendarReserves = ({ reserves, setDateSelected, dateSelected, handleRescheduleppointment }) => {
    const professionalId = 125;
    const { colorPalette, user } = useAppContext()
    const [agendas, setAgendas] = useState([]);

    const getAvailableDays = async (agendas) => {
        const uniqueDates = new Set(); // Usando um Set para armazenar as datas únicas
        agendas.forEach((agend) => {
            const startDate = agend?.inicio || agend?.start;
            if (agend.disponivel === 0) {
                uniqueDates.add(moment(startDate).format("YYYY-MM-DD"));
            }
        });

        setAgendas(Array.from(uniqueDates));
    };

    useEffect(() => {
        getAvailableDays(reserves)
    }, [reserves]);


    const handleSelectedDate = (value, id) => {
        let date = moment(value).format("YYYY-MM-DD")
        try {
            if (dateSelected?.day === date) {
                setDateSelected({
                    ...dateSelected,
                    day: '',
                    hour: '',
                    profissionalId: '',
                    reserva_id: '',
                })
            } else {
                setDateSelected({
                    ...dateSelected,
                    day: date,
                    hour: '',
                    profissionalId: id,
                    reserva_id: '',
                    userId: '',
                })
            }
        } catch (error) {
            return error
        }
    }

    const handleSelectDay = (data, hourFormatted, selected) => {
        console.log('data: ', data)
        if (selected) {
            setDateSelected({ ...dateSelected, hour: '', reserva_id: '' })
        } else {
            setDateSelected({
                ...dateSelected, hour: hourFormatted, reserva_id: data?.id_evento_calendario, userId: user.id
            })
        }
    }

    const horarios = (obj) => {
        const startDate = obj?.inicio || obj?.start;
        const horaMoment = moment(startDate);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
    }

    return (
        <div>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                <Box sx={{
                    display: 'flex', gap: 2, justifyContent: 'space-between',
                    flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' },
                }}>
                    <Box sx={{
                        display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                        alignItems: 'center'
                    }}>
                        <Calendar
                            defaultActiveStartDate={new Date()}
                            onChange={(date) => handleSelectedDate(date, professionalId)}
                            style={{
                                border: 'none'
                            }}
                            tileDisabled={({ date }) =>
                                !agendas.includes(moment(date).format("YYYY-MM-DD")
                                )
                            }
                        />
                    </Box>
                    <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                    {(dateSelected?.day && dateSelected?.profissionalId === professionalId) ?
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1,
                            justifyContent: 'flex-start', width: '100%', minWidth: 200
                        }}>
                            <Box sx={{ display: 'flex', padding: '12px 10px', backgroundColor: colorPalette?.primary, justifyContent: 'center' }}>
                                <Text bold style={{ color: colorPalette.buttonColor }}>Selecione um horário:</Text>
                            </Box>
                            <Box sx={{
                                display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-start', marginTop: 1,
                            }}>
                                <Box sx={{
                                    display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowY: 'auto',
                                    maxHeight: 200,
                                    width: '100%',
                                    padding: '5px 12px',
                                }}>
                                    {reserves?.filter(agend => (moment(agend?.inicio || agend?.start).format("YYYY-MM-DD") === dateSelected?.day) &&
                                        (agend.disponivel === 0))?.map((hour, index) => {
                                            const hourFormatted = horarios(hour)
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
                                                }} onClick={() => handleSelectDay(hour, hourFormatted, selected)}>
                                                    <Text large bold={selected ? true : false}>{hourFormatted}</Text>
                                                    {selected && <CheckCircleIcon style={{ color: 'green', fontSize: 17 }} />}
                                                </Box>
                                            )
                                        })}
                                </Box>
                            </Box>

                            {dateSelected.hour && <Button text="Confirmar Reagendamento" onClick={handleRescheduleppointment} />}

                        </Box>
                        :
                        <></>
                    }
                </Box>
            </Box>
        </div>
    );
};