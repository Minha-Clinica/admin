import Head from 'next/head'
import { Box, Button, ContentContainer, Divider, Text } from '../atoms'
import { Holidays, SelectList } from '../organisms'
import { useAppContext } from '../context/AppContext'
import { icons } from '../organisms/layout/Colors'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '../api/api'
import { Backdrop, CircularProgress, useMediaQuery, useTheme } from '@mui/material'
import moment from "moment";
import "moment/locale/pt-br";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatterHours } from '../helpers'
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Estilo para o recurso de arrastar e soltar (se estiver usando)
import "react-big-calendar/lib/addons/dragAndDrop"; // Recurso de arrastar e soltar (se estiver usando)
import "react-big-calendar/lib/css/react-big-calendar.css"
import Link from 'next/link'


function Home() {

   const { user, colorPalette, theme, setLoading, alert, notificationUser } = useAppContext()
   const [myEvents, setMyEvents] = useState([])
   const [consultionList, setConsultion] = useState([])
   const [employees, setEmployees] = useState([])
   const isPacient = user?.perfil?.includes('paciente')
   const isPartner = user?.perfil?.includes('parceiro')
   const router = useRouter();
   const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '', userId: '' })
   const [calendarSessions, setCalendarSessions] = useState([])
   const [calendarHours, setCalendarHours] = useState([])
   const [loadingDate, setLoadingDate] = useState(false)
   const [showEmployeeList, setShowEmployeeList] = useState(false)
   const [showContactWpp, setShowContactWpp] = useState(false)
   const [selectedEvent, setSelectedEvent] = useState(null);
   const [showEventForm, setShowEventForm] = useState(false);
   const [eventData, setEventData] = useState({
      title: "",
      description: "",
      location: "",
      color: "#007BFF",
      start: '',
      end: '',
      title: '',
      description: '',
      location: '',
      usuario_agendado: '',
      nome_usuario_agendado: '',
      email_agendado: '',
      nome_agendado: '',
      disponivel: 0,
      usuario_id: '',
      allDay: false
   });
   const profissionalId = 125;
   moment.locale("pt-br");
   const localizer = momentLocalizer(moment);
   const themeApp = useTheme()
   const isMobile = useMediaQuery(themeApp.breakpoints.down('sm'))

   const subMenu = [
      {
         id: '01', icon: '/icons/calendar-2.png',
         route: '/calendar',
         title: 'Minha Agenda',
         permissions: ['administrador'],
         filter: true,
         text: 'Vizualize suas agendas confirmadas ou crie sua lista de reservas.'
      },
      {
         id: '02', icon: '/icons/team.png',
         route: `/organization/${user.empresa_id}`,
         title: 'Minha Empresa',
         permissions: ['parceiro',],
         filter: true,
         text: 'Visualizar os dados de sua empresa. Cadastre e veja os colaboradores vínculados a sua sua empresa.'
      },
      {
         id: '02', icon: '/icons/technology.png',
         route: '/consultation',
         title: 'Sessões dos Colaboradores',
         permissions: ['parceiro',],
         filter: true,
         text: 'Vizualize os detalhes das sessões agendadas para seus colaboradores.'
      },
      {
         id: '06', icon: '/icons/medical.png',
         route: `/anamnese/${user.id}`,
         title: 'Continuar a preencher minha Anamnêse',
         permissions: ['paciente'],
         filter: true,
         text: 'Não esqueça de preencher seu formulário.'
      },
      {
         id: '02', icon: '/icons/technology.png',
         route: '/consultation',
         title: 'Minhas Sessões',
         permissions: ['paciente', 'administrador'],
         filter: true,
         text: 'Visualize os prontuários de seus pacientes de sessões agendadas.'
      },
      {
         id: '03', icon: '/icons/userdata.png',
         route: `/userData`,
         title: 'Meus Dados',
         permissions: ['parceiro', 'paciente', 'administrador'],
         filter: true,
         text: 'Editar e atualizar seus dados.'
      },
      // {
      //    id: '05', icon: '/icons/message.png',
      //    route: '',
      //    title: 'Ajuda',
      //    permissions: ['administrador', 'parceiro', 'paciente'],
      //    filter: true,
      //    text: 'Está com alguma dificuldade com o Painel? Peça ajuda ao suporte.'
      // },
      //Primeira fase
      // {
      //    id: '06', icon: '/icons/subscription.png',
      //    filter: true,
      //    route: '/assignmentPlan',
      //    permissions: ['profissional', 'administrador'],
      //    title: 'Meus Planos',
      //    text: 'Usufrua o melhor da plataforma contratando os melhores planos! E aproveite!'
      // }
   ]

   const getConsultion = async () => {
      setLoading(true)
      try {
         let query = `/consultation/profissional/${user?.id}`
         const response = await api.get(query)
         const { data = [] } = response;
         setConsultion(data)
      } catch (error) {
         console.log(error)
         return error
      } finally {
         setLoading(false)
      }
   }

   const getEmployees = async () => {
      setLoading(true)
      try {
         const response = await api.get(`/users/employee/${user.empresa_id}`)
         const { data = [] } = response;
         if (data?.length > 0) {
            const employeeMap = data.map((item) => ({
               label: item.nome,
               value: item.id
            }))
            setEmployees(employeeMap)
         }
      } catch (error) {
         console.log(error)
         return error
      } finally {
         setLoading(false)
      }
   }

   const handleEvents = async () => {
      try {
         setLoading(true)
         const perfil = (user?.perfil?.includes('profissional') || user?.perfil?.includes('administrador')) ? 'profissional' : 'paciente'
         const response = await api.get(`/event/${perfil}/agenda/${user?.id}`)
         const { data } = response
         if (data) {
            const eventsMap = data?.map((event) => ({
               id_evento_calendario: event.id_evento_calendario,
               start: new Date(event.inicio), // Adicione o início e o fim do evento como propriedades start e end
               end: new Date(event.fim),
               title: event.titulo,
               description: event.descricao,
               location: event.local,
               color: event.color,
               usuario_agendado: event?.usuario_agendado,
               email_agendado: event?.email_agendado,
               nome_agendado: event?.nome_agendado,
               nome_usuario_agendado: event?.nome_usuario_agendado,
               usuario_agendado: event?.usuario_agendado,
               disponivel: event?.disponivel,
               usuario_id: event?.usuario_id,
               allDay: false, // Ajuste isso com base no seu caso de uso
               consulta_id: event?.id_consulta
            }));
            setMyEvents([...eventsMap, ...Holidays]);
            return
         }
      } catch (error) {
         console.log(error)
         return error
      } finally {
         setLoading(false)
      }
   }

   const horarios = (obj) => {
      const horaMoment = moment(obj);
      const horaFormatada = horaMoment.format("HH:mm");
      return horaFormatada
   }

   const getAvailableDays = async (agendas) => {
      const uniqueDates = new Set(); // Usando um Set para armazenar as datas únicas
      agendas.forEach((agend) => {
         if (agend.disponivel === 0) {
            uniqueDates.add(moment(agend.inicio).format("YYYY-MM-DD"));
         }
      });

      return Array.from(uniqueDates); // Convertendo o Set de datas únicas de volta para um array
   };

   const getSessionsCalendar = async () => {
      setLoading(true)
      try {
         const response = await api.get(`/users/search/agendas`)
         const { data = [] } = response;
         const agendas = await getAvailableDays(data)
         setCalendarSessions(data)
         setCalendarHours(agendas)
      } catch (error) {
         console.log(error)
         return error
      } finally {
         setLoading(false)
      }
   }


   useEffect(() => {
      handleEvents()
      getConsultion()
      getSessionsCalendar()
      getEmployees()
   }, [])

   const nowMonth = new Date().toLocaleString('pt-BR', { month: 'long' });
   const formattedMonth = nowMonth[0].toString().toLocaleUpperCase() + nowMonth.slice(1);
   const dataAtual = new Date();
   let anoAtual = dataAtual.getFullYear();
   const mesAtual = dataAtual.getMonth();
   const defaultYear = {
      start: new Date(anoAtual, mesAtual, 1),
      end: new Date(anoAtual, mesAtual, 31),
   }

   const eventStyleGetter = (event, start, end, isSelected) => {
      const style = {
         backgroundColor: event.color,
         borderRadius: "5px",
         display: "block",
         padding: "10px",
         opacity: !isSelected && 0.6,
         fontSize: '12px'
      };
      return {
         style,
      };
   };

   const messages = {
      today: "Hoje",
      previous: "Anterior",
      next: "Próximo",
      month: "Mês",
      week: "Semana",
      day: "Dia",
      agenda: "Agenda",
      date: "Data",
      time: "Hora",
      event: "Evento",
   };

   const handleSelectEvent = (event) => {
      setSelectedEvent(event);
      setEventData(event);
      setShowEventForm(true)
   };

   const handleSelectedDate = (value, id) => {
      setLoadingDate(true)
      let date = moment(value).format("YYYY-MM-DD")
      try {
         if (dateSelected?.day === date) {
            setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '', userId: '' })
         } else {
            setDateSelected({ day: date, hour: '', profissionalId: id, reserva_id: '', userId: '' })
         }
      } catch (error) {
         return error
      } finally {
         setLoadingDate(false)
      }
   }

   const verifyNumberMaxSession = async () => {
      try {
         const verifyMaxSessions = await api.get(`/consultation/patients/verify-qnt-curr-month/${dateSelected?.userId || user?.id}`)
         const { qntSessions } = verifyMaxSessions.data

         if (user?.n_max_sessoes && user?.n_max_sessoes > 0 && qntSessions >= user?.n_max_sessoes) {
            alert.info('Você já possúi já ultrapassou o limite de sessões por mês. Consulta o RH de sua empresa, ou entre em contato com o Suporte.')
            return false
         }

         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }


   const verifyNumberSessionToday = async () => {
      try {
         const verifyToday = await api.get(`/consultation/patients/verify-qnt-curr-today/${dateSelected?.userId || user?.id}`)
         const { qntSessions } = verifyToday.data
         const currentDate = new Date();
         const currentDay = currentDate.getDate() + 1;
         const daySelected = new Date(dateSelected.day).getDate();

         if ((daySelected === currentDay) && qntSessions >= 1) {
            alert.info('Você já possúi uma sessão agendada para hoje. Para agendar mais uma sessão para hoje, entre em contato pelo WhatsApp com o atendimento, para verificar um encaixe.')
            setShowContactWpp(true)
            return false
         }

         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }

   const handleReservationSession = async () => {

      if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId && dateSelected?.userId !== '') {
         if (dateSelected?.reserva_id === '') {
            alert.info('Selecione um horário antes de continuar.')
            return
         }

         try {
            const veryfySessionsUser = await verifyNumberMaxSession()
            const verifySessionsCurrentToday = await verifyNumberSessionToday()

            if (veryfySessionsUser && verifySessionsCurrentToday) {
               router.push(`/searchProfissional/${dateSelected?.reserva_id}?professionalId=${dateSelected?.profissionalId}&userId=${dateSelected?.userId}`)
            }
         } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro ao agendar a sessão. Tente novamente mais tarde.')
         }
      }
   }

   return (
      <>
         <Head>
            <title>Afectu</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charset="utf-8" />
            <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/Afectu+-+PNG+-+Fundo+Tranparente-8%402x.png" />
         </Head>

         <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' } }}>

            <Box sx={{
               display: 'flex', flexDirection: 'column', width: { xs: '100%', xm: '100%', md: '100%', lg: '100%' },
               transition: '0.5s', marginTop: { xs: 0, xm: 0, md: 10, lg: 10 },
               padding: { xs: '10px 20px', xm: '10px 20px', md: '10px 50px', lg: '10px 50px' }
            }}>

               {(isPacient || isPartner) &&
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                     <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', marginTop: 2 }}>

                        <Text light large>Minhas próximas Sessões.</Text>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' } }}>

                           {myEvents?.filter(item => item.disponivel === 1 && (new Date(item?.start) >= new Date()))?.length > 0 ?
                              <Box sx={{ display: 'flex', flexDirection: 'row', gap: .5, width: '100%', }}>
                                 {myEvents?.filter(item => item.disponivel === 1 && (new Date(item?.start) >= new Date()))?.map((item, index) => {
                                    return (
                                       <Box sx={{
                                          display: 'flex', gap: 1, flexDirection: 'row',
                                          transition: '.2s',
                                          border: '1px solid lightgray', borderRadius: 2, height: 90, backgroundColor: colorPalette?.secondary,
                                          width: '350px'
                                       }} key={index}>
                                          <Box sx={{
                                             height: '100%', width: '4px', backgroundColor: colorPalette?.buttonColor,
                                             borderRadius: '8px 0px 0px 8px'
                                          }} />
                                          <Box sx={{ display: 'flex', gap: 2, padding: '8px 8px', alignItems: 'center' }}>
                                             <Box sx={{ display: 'flex', gap: .2, flexDirection: 'column' }}>
                                                <Text large>{horarios(item?.start)}</Text>
                                                <Text small style={{ color: 'gray' }}>1 hora</Text>
                                             </Box>
                                             <Box sx={{ display: 'flex', gap: .3, flexDirection: 'column', padding: '0px 8px' }}>
                                                <Text small bold>{item?.title}</Text>
                                                <Text small light>{item?.nome_agendado}</Text>
                                             </Box>
                                             <Text bold large>{formatterHours(item?.start)}</Text>
                                          </Box>
                                       </Box>
                                    )
                                 })}
                              </Box>
                              :
                              <Text>Você não possúi agendamentos futuros.</Text>
                           }
                        </Box>
                     </Box>

                     <Box sx={{
                        display: 'flex', gap: 2, padding: '10px',
                        marginTop: 5,
                        backgroundColor: colorPalette?.secondary,

                        boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                        borderRadius: 2
                     }}>
                        <Box sx={{
                           display: 'flex', gap: 2, width: '100%',
                           flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' }
                        }}>
                           <Box sx={{
                              display: 'flex', gap: 2,
                              backgroundColor: '#fff',
                              // boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                              borderRadius: 2
                           }}>
                              <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                                 {loadingDate ? <CircularProgress /> : <>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                       <Text bold large style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>AGENDA DÍSPONIVEL</Text>
                                    </Box>
                                    <Divider />
                                    {calendarSessions?.length > 0 ?
                                       <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                                          <Box sx={{
                                             display: 'flex', gap: 2, justifyContent: 'space-between',
                                             flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' }
                                          }}>
                                             <Box sx={{
                                                display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                                alignItems: 'center'
                                             }}>
                                                <Calendar
                                                   defaultActiveStartDate={new Date()}
                                                   onChange={(date) => handleSelectedDate(date, profissionalId)}
                                                   style={{
                                                      border: 'none'
                                                   }}
                                                   tileDisabled={({ date }) =>
                                                      !calendarHours.includes(moment(date).format("YYYY-MM-DD")
                                                      )
                                                   }
                                                />
                                             </Box>
                                             <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                                             {(dateSelected?.day && dateSelected?.profissionalId === profissionalId) ?
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
                                                         display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto',
                                                         maxHeight: 200,
                                                         width: '100%',
                                                         padding: '5px 12px',
                                                         flexDirection: 'column'
                                                      }}>
                                                         {calendarSessions?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
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
                                                                        if (isPartner) {
                                                                           setShowEmployeeList(true)
                                                                        }
                                                                        setDateSelected({ ...dateSelected, hour: hourFormatted, reserva_id: hour?.id_evento_calendario, userId: !isPartner && user.id })
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
                                 }
                                 <Box sx={{ display: calendarSessions?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                                    <Box sx={{
                                       padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                       width: 150,
                                       marginTop: 3,
                                       transition: '.5s',
                                       gap: 2,
                                       backgroundColor: colorPalette.buttonColor,
                                       borderRadius: 2,
                                       opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId && dateSelected?.userId !== '') ? 1 : 0.5,
                                       "&:hover": {
                                          opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId && dateSelected?.userId !== '') ? 1 : 0.5,
                                          cursor: 'pointer',
                                          transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId && dateSelected?.userId !== '') ? 'scale(1.1, 1.1)' : 'none'
                                       }
                                    }} onClick={() => handleReservationSession()}>
                                       <Text bold style={{ color: '#fff' }}>Agendar</Text>
                                    </Box>
                                 </Box>
                              </Box>
                           </Box>

                           <Backdrop open={showEmployeeList}>
                              <ContentContainer>
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, alignItems: 'center' }}>
                                    <Text bold large>Selecione o Colaborador</Text>
                                    <Box sx={{
                                       ...styles.menuIcon,
                                       width: 15, height: 15,
                                       backgroundImage: `url(${icons.gray_close})`,
                                       transition: '.3s',
                                       zIndex: 999999999,
                                       "&:hover": {
                                          opacity: 0.8,
                                          cursor: 'pointer'
                                       }
                                    }} onClick={() => setShowEmployeeList(false)} />
                                 </Box>
                                 <Box>
                                    <SelectList
                                       fullWidth
                                       data={employees}
                                       valueSelection={dateSelected.userId}
                                       onSelect={(value) => setDateSelected({ ...dateSelected, userId: value })}
                                       title="Selecione um colaborador:"
                                       filterOpition="value"
                                       inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                                       clean={false}
                                    />
                                 </Box>
                                 <Button text="Confirmar" onClick={() => setShowEmployeeList(false)} />
                              </ContentContainer>
                           </Backdrop>

                           <Backdrop open={showContactWpp}>
                              <ContentContainer>
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, alignItems: 'center' }}>
                                    <Text bold large>Entre em contato conosco pelo WhatsApp</Text>
                                    <Box sx={{
                                       ...styles.menuIcon,
                                       width: 15, height: 15,
                                       backgroundImage: `url(${icons.gray_close})`,
                                       transition: '.3s',
                                       zIndex: 999999999,
                                       "&:hover": {
                                          opacity: 0.8,
                                          cursor: 'pointer'
                                       }
                                    }} onClick={() => setShowContactWpp(false)} />
                                 </Box>
                                 <Box>
                                    <Text>Deseja marcar mais uma agenda para hoje? Entre em contato conosco no link abaixo, e tente um encaixe!</Text>
                                    <Link href={'https://wa.me/5511916544375'} target='_blank'>+55 (11)91654-4375</Link>
                                    <Box sx={styles.noResultsImage} />
                                 </Box>
                              </ContentContainer>
                           </Backdrop>

                           <Box sx={{ display: 'flex', marginLeft: 2, height: '100%', width: '1px', backgroundColor: 'lightgray' }} />
                           <Box sx={{ display: { xs: 'none', xm: 'none', md: 'block', lg: 'block' }, width: '100%' }}>
                              <Box sx={{
                                 display: 'flex', flexDirection: 'column', gap: 5, padding: '0px 20px',
                                 width: '100%'
                              }}>
                                 <Box sx={{
                                    display: 'flex', gap: 2, flexDirection: 'column',
                                    width: '100%'
                                 }}>
                                    {subMenu?.map((item, index) => {
                                       const isPermission = item?.permissions?.some(role => user?.perfil?.includes(role))
                                       let routeTo = item?.queryId ? `${item?.route}/${user?.id}` : item?.route;
                                       if (item?.queryValue) {
                                          routeTo = routeTo += item?.queryValue
                                       }

                                       return (
                                          <Box key={index} sx={{
                                             display: isPermission ? 'flex' : 'none', gap: 2, flexDirection: 'column',
                                             width: '100%'
                                          }}>
                                             <Box sx={{
                                                display: 'flex', backgroundColor: colorPalette.secondary, padding: '20px',
                                                borderRadius: 2,
                                                alignItems: 'center', gap: 2,
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                transition: '.3s',
                                                boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                                                "&:hover": {
                                                   opacity: 0.8,
                                                   cursor: 'pointer',
                                                   transform: 'scale(1.03, 1.03)'
                                                }
                                             }} onClick={() => router.push(routeTo)}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                   <Box sx={{
                                                      ...styles.menuIcon,
                                                      backgroundImage: `url(${item?.icon})`,
                                                      transition: '.3s',
                                                      aspectRatio: '1/1',
                                                      width: 45, height: 45,
                                                      "&:hover": {
                                                         opacity: 0.8,
                                                         cursor: 'pointer'
                                                      }
                                                   }} />
                                                   <Box sx={{ display: 'flex', gap: .5, alignItems: 'start', flexDirection: 'column' }}>
                                                      <Text large bold>{item?.title}</Text>
                                                      <Text small light>{item?.text}</Text>
                                                   </Box>
                                                </Box>

                                                <Box sx={{
                                                   ...styles.menuIcon,
                                                   backgroundImage: `url(${icons.gray_arrow_down})`,
                                                   transform: 'rotate(-90deg)',
                                                   transition: '.3s',
                                                   width: 17,
                                                   height: 17,
                                                   "&:hover": {
                                                      opacity: 0.8,
                                                      cursor: 'pointer'
                                                   },
                                                }} />
                                             </Box>
                                          </Box>
                                       )
                                    })}
                                 </Box>
                              </Box>
                           </Box>
                        </Box>
                     </Box>

                     <Box sx={{ display: { xs: 'block', xm: 'block', md: 'none', lg: 'none' }, width: '100%' }}>
                        <Box sx={{
                           display: 'flex', flexDirection: 'column', gap: 5,
                           width: '100%'
                        }}>
                           <Box sx={{
                              display: 'flex', gap: 2, flexDirection: 'column',
                              width: '100%'
                           }}>
                              {subMenu?.map((item, index) => {
                                 const isPermission = item?.permissions?.some(role => user?.perfil?.includes(role))
                                 let routeTo = item?.queryId ? `${item?.route}/${user?.id}` : item?.route;
                                 if (item?.queryValue) {
                                    routeTo = routeTo += item?.queryValue
                                 }

                                 return (
                                    <Box key={index} sx={{
                                       display: isPermission ? 'flex' : 'none', gap: 2, flexDirection: 'column',
                                       width: '100%'
                                    }}>
                                       <Box sx={{
                                          display: 'flex', backgroundColor: colorPalette.secondary, padding: '15px',
                                          borderRadius: 2,
                                          alignItems: 'center', gap: 2,
                                          justifyContent: 'space-between',
                                          width: '100%',
                                          transition: '.3s',
                                          boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                                          "&:hover": {
                                             opacity: 0.8,
                                             cursor: 'pointer',
                                             transform: 'scale(1.03, 1.03)'
                                          }
                                       }} onClick={() => router.push(routeTo)}>
                                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                             <Box sx={{
                                                ...styles.menuIcon,
                                                backgroundImage: `url(${item?.icon})`,
                                                transition: '.3s',
                                                aspectRatio: '1/1',
                                                width: 45, height: 45,
                                                "&:hover": {
                                                   opacity: 0.8,
                                                   cursor: 'pointer'
                                                }
                                             }} />
                                             <Box sx={{ display: 'flex', gap: .5, alignItems: 'start', flexDirection: 'column' }}>
                                                <Text large bold>{item?.title}</Text>
                                                <Text small light>{item?.text}</Text>
                                             </Box>
                                          </Box>

                                          <Box sx={{
                                             ...styles.menuIcon,
                                             backgroundImage: `url(${icons.gray_arrow_down})`,
                                             transform: 'rotate(-90deg)',
                                             transition: '.3s',
                                             width: 17,
                                             height: 17,
                                             "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                             },
                                          }} />
                                       </Box>
                                    </Box>
                                 )
                              })}
                           </Box>
                        </Box>
                     </Box>
                  </Box>}

               <Box sx={{ display: (isPacient || isPartner) ? 'none' : 'flex', gap: 2, marginTop: 5, flexDirection: 'column' }}>
                  <Box sx={{
                     display: 'flex', gap: 2, padding: '10px 0px',
                     width: '100%',
                     flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' },
                     borderRadius: 2
                  }}>
                     <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: 5, padding: '0px 20px 0px 0px',
                        width: { xs: '100%', xm: '100%', md: '40%', lg: '40%' }, alignItems: 'start'
                     }}>
                        <Text large bold>{(isPacient || isPartner) ? 'Atendimento' : 'Próximas Sessões'}</Text>
                        <Box sx={{
                           display: 'flex', gap: 2, flexDirection: 'column',
                           width: '100%'
                        }}>
                           {subMenu?.map((item, index) => {
                              const isPermission = item?.permissions?.some(role => user?.perfil?.includes(role))
                              let routeTo = item?.queryId ? `${item?.route}/${user?.id}` : item?.route;
                              if (item?.queryValue) {
                                 routeTo = routeTo += item?.queryValue
                              }

                              return (
                                 <Box key={index} sx={{
                                    display: isPermission ? 'flex' : 'none', gap: 2, flexDirection: 'column',
                                    width: '100%'
                                 }}>
                                    <Box sx={{
                                       display: 'flex', backgroundColor: colorPalette.secondary, padding: '20px',
                                       borderRadius: 2,
                                       alignItems: 'center', gap: 2,
                                       justifyContent: 'space-between',
                                       width: '100%',
                                       transition: '.3s',
                                       boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                                       "&:hover": {
                                          opacity: 0.8,
                                          cursor: 'pointer',
                                          transform: 'scale(1.03, 1.03)'
                                       }
                                    }} onClick={() => router.push(routeTo)}>
                                       <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                          <Box sx={{
                                             ...styles.menuIcon,
                                             backgroundImage: `url(${item?.icon})`,
                                             transition: '.3s',
                                             width: 30, height: 30,
                                             aspectRatio: '1/1',
                                             "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                             }
                                          }} />
                                          <Box sx={{ display: 'flex', gap: .5, alignItems: 'start', flexDirection: 'column' }}>
                                             <Text large bold>{item?.title}</Text>
                                             <Text small light>{item?.text}</Text>
                                          </Box>
                                       </Box>

                                       <Box sx={{
                                          ...styles.menuIcon,
                                          backgroundImage: `url(${icons.gray_arrow_down})`,
                                          transform: 'rotate(-90deg)',
                                          transition: '.3s',
                                          width: 17,
                                          height: 17,
                                          "&:hover": {
                                             opacity: 0.8,
                                             cursor: 'pointer'
                                          },
                                       }} />
                                    </Box>
                                 </Box>
                              )
                           })}
                        </Box>
                     </Box>

                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 5, width: '100%' }}>
                        <Text large bold>Calendário</Text>

                        <BigCalendar
                           localizer={localizer}
                           // defaultDate={month?.start}
                           culture="pt-br"
                           events={myEvents?.filter(item => item.disponivel === 1)}
                           startAccessor="start"
                           endAccessor="end"
                           selectable
                           onSelectSlot={(slotInfo) => {
                              setEventData({
                                 ...eventData,
                                 start: slotInfo.start,
                                 end: slotInfo.end,
                              });
                              setSelectedEvent(null);
                              setShowEventForm(true);
                           }}
                           onSelectEvent={handleSelectEvent}
                           eventPropGetter={eventStyleGetter}
                           // messages={messages}
                           style={{
                              fontFamily: 'MetropolisBold',
                              color: colorPalette.textColor,
                              backgroundColor: colorPalette.secondary,
                              borderRadius: '12px',
                              boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                              padding: 10,
                              height: isMobile ? 400 : 600,
                              width: '100%'
                           }}
                        />
                     </Box>
                  </Box>
               </Box>

               {
                  showEventForm && (
                     <Backdrop open={showEventForm} sx={{ zIndex: 999 }}>
                        <ContentContainer style={{ maxWidth: { md: '1200px', lg: 900, xl: 1500 }, maxHeight: { md: '180px', lg: '600px', xl: '1200px' }, overflowY: 'auto', width: 400 }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text bold large>{eventData?.title}</Text>
                              <Box sx={{
                                 ...styles.menuIcon,
                                 backgroundImage: `url(${icons.gray_close})`,
                                 transition: '.3s',
                                 zIndex: 999999999,
                                 "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer'
                                 }
                              }} onClick={() => {
                                 setShowEventForm(false)
                                 setEventData({
                                    title: "",
                                    description: "",
                                    location: "",
                                    color: "#007BFF",
                                    start: '',
                                    end: '',
                                    title: '',
                                    description: '',
                                    location: '',
                                    usuario_agendado: '',
                                    email_agendado: '',
                                    nome_agendado: '',
                                    nome_usuario_agendado: '',
                                    disponivel: 0,
                                    usuario_id: '',
                                    allDay: false
                                 });
                              }} />
                           </Box>
                           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Box sx={{ display: "flex", flexDirection: "row", gap: .5 }}>
                                 <Text bold>Inicio:</Text>
                                 <Text>{horarios(eventData?.start)}</Text>
                              </Box>
                              <Box sx={{ display: "flex", flexDirection: "row", gap: .5 }}>
                                 <Text bold>Fim:</Text>
                                 <Text>{horarios(eventData?.end)}</Text>
                              </Box>
                           </Box>
                           <Divider />
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 600, paddingTop: 3 }}>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>Titulo: </Text>
                                 <Text>{eventData?.title || ''}</Text>
                              </Box>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>Descrição do evento: </Text>
                                 <Text>{eventData.description || ''}</Text>
                              </Box>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>Localização do evento: </Text>
                                 <Text>{eventData.location || ''}</Text>
                              </Box>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>E-mail agendado: </Text>
                                 <Text>{eventData?.email_agendado || ''}</Text>
                              </Box>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>Nome agendado: </Text>
                                 <Text>{eventData?.nome_agendado || ''}</Text>
                              </Box>
                              <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                 <Text bold>Paciente: </Text>
                                 <Text>{eventData?.nome_usuario_agendado || ''}</Text>
                              </Box>

                              <Divider />

                              {eventData?.consulta_id &&
                                 <Link href={`/consultation/${eventData?.consulta_id}`} target="_blank">
                                    <Button
                                       secondary
                                       small
                                       text="Prontuário"
                                       style={{ height: 30, width: 120 }}
                                    />
                                 </Link>
                              }
                           </Box>
                        </ContentContainer>
                     </Backdrop >
                  )
               }

               {/* Primeira fase */}
               {/* <Box sx={{ display: isPacient ? 'none' : 'flex', gap: 5, flexDirection: 'column', marginTop: 5, alignItems: 'center' }}>
                     <Text bold title style={{ textAlign: 'center' }}>Assine agora o plano e aprovaite o melhor da plataforma!</Text>

                     <Box sx={{ display: 'flex', gap: 5, width: '100%', justifyContent: 'center' }}>
                        {plansAssignment?.map((item, index) => {
                           const isPreferency = item?.preferency;
                           const isPlan = planActually === item?.key;
                           return (
                              <Box key={index} sx={{ position: 'relative', display: 'flex', gap: 1 }}>
                                 <ContentContainer sx={{
                                    backgroundColor: isPreferency ? colorPalette.third : '#fff',
                                    transition: '.5s',
                                    borderRadius: 4,
                                    "&:hover": {
                                       // opacity: 0.8,
                                       transform: 'scale(1.1, 1.1)'
                                    },
                                 }}>
                                    {isPlan && <Box sx={{
                                       transition: '.5s',
                                       padding: '8px 12px', alignItems: 'center', display: 'flex', backgroundColor: 'red', borderRadius: 2,
                                       position: 'absolute', top: 5, left: 5
                                    }}>
                                       <Text bold style={{ color: '#fff' }}>Plano atual</Text>
                                    </Box>}

                                    <Box sx={{
                                       display: 'flex', gap: 3, flexDirection: 'column', width: 300, alignItems: 'center',
                                       color: isPreferency && '#fff'
                                    }}>
                                       <Text veryLarge bold style={{ color: 'inherit' }}>{item?.nome}</Text>
                                       <Text indicator bold style={{ color: 'inherit' }}>{formatter.format(item?.price)}/mês</Text>
                                       <Box sx={{
                                          padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          marginTop: 2,
                                          transition: '.5s',
                                          gap: 2,
                                          backgroundColor: isPreferency ? colorPalette.buttonColor : colorPalette.buttonColor,
                                          borderRadius: 2,
                                          "&:hover": {
                                             opacity: 0.8,
                                             cursor: 'pointer',
                                             transform: 'scale(1.1, 1.1)'
                                          }
                                       }} onClick={() => router.push('/assignmentPlan')}>
                                          <Text bold style={{ color: '#fff' }}>Assinar plano {item?.nome}</Text>
                                       </Box>
                                    </Box>
                                 </ContentContainer>
                              </Box>
                           )
                        })}
                     </Box>
                  </Box> */}
            </Box>
         </Box>
      </>
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

const styleCalendar = (colorPalette) => `
        .rbc-btn-group > button {
            color: white; /* Defina a cor do texto dos botões do calendário para pink */
            background-color: ${colorPalette.buttonColor}
          }
          .rbc-btn-group > button:focus {
            background-color: ${colorPalette.buttonColor + '66'}; /* Defina a cor de fundo do botão quando estiver com foco (ativo) */
            outline: none; /* Remova a borda de foco padrão */
          }

         //  .rbc-toolbar {
         //    padding: 10px;
         //    display: flex;
         //    justify-content: space-between;
         //    align-items: center;
         //    color: ${colorPalette.textColor};
         //    background-color: ${colorPalette.primary};
         //    font-size: 18px;
         //    // display: none;

         //  }

          /* Estilos para os dias da semana */
          .rbc-header {
            background-color: ${colorPalette.primary};
            color: ${colorPalette.textColor};
            font-size: 14px;
            padding: 5px;
          }

          .rbc-off-range {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para dias fora do intervalo */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }

          .rbc-off-range-bg {
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }

          .rbc-off {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para dias fora do intervalo */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }
        
          /* Adicione estilos para o dia atual */
          .rbc-today {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para o dia atual */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para o dia atual */
          }
      `

Home.noPadding = true;

export default Home;