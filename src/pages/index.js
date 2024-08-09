import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Box, Button, ContentContainer, Divider, Text, TextInput } from '../atoms'
import { Carousel, Holidays } from '../organisms'
import { useAppContext } from '../context/AppContext'
import { icons } from '../organisms/layout/Colors'
import { useEffect, useState } from 'react'
import { menuItems } from '../permissions'
import { useRouter } from 'next/router'
import { getImageByScreen } from '../validators/api-requests'
import { api } from '../api/api'
import { Avatar, Backdrop, CircularProgress } from '@mui/material'
import moment from "moment";
import "moment/locale/pt-br";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatterHours } from '../helpers'

const inter = Inter({ subsets: ['latin'] })

const backgroundHome = [
   { name: 'slide-1', location: 'https://adm-melies.s3.amazonaws.com/slide-3.jpg' },
   { name: 'slide-2', location: 'https://adm-melies.s3.amazonaws.com/slide-5.jpg' },
]

const equipeProf = [
   {
      id: '01', icon: '/icons/jean.jpeg', nome: 'Jean Santos', titulo: 'Pastor em São Paulo - SP',
      text: 'Pastor em São Paulo, Marido de Lívia, Pai de Caio, Mari e Levi. Formado em xpto, etc etc.'
   },
   {
      id: '02', icon: 'https://mf-planejados.s3.us-east-1.amazonaws.com/62b7737f31b966b061e340b5d150340d-perfil.jpg',
      nome: 'Marcus Silva', titulo: 'Desenvolvedor',
      text: 'Desenvolvedor do Sistema, marido de Dallila e pai de Vicente, rico de saude, só que não.'
   },
   {
      id: '03', icon: '/icons/doutor_icon.jpeg', nome: 'Fulano Silva', titulo: 'Psicoterapeuta',
      text: 'Fulano de Cicrano, formado em Psicologia em SP, etc...'
   },
]

const birthDate = [
   { id: '01', name: 'Marcus Silva', day: 1, function: 'Desenvolvedor' },
   { id: '02', name: 'Felipe Bomfim', day: 13, function: 'Suporte' },
   { id: '03', name: 'Fulano Silva', day: 15, function: 'Suporte' },
   { id: '04', name: 'Renato Miranda', day: 5, function: 'Gerente Suporte' }
]


const subMenu = [
   {
      id: '01', icon: '/icons/calendar.png',
      route: '/calendar',
      title: 'Minha Agenda',
      permissions: ['profissional', 'administrador'],
      filter: true,
      text: 'Vizualize suas agendas confirmadas ou crie sua lista de reservas.'
   },
   {
      id: '02', icon: '/icons/discussion.png',
      route: '/consultation',
      title: 'Minhas Sessões',
      permissions: ['profissional', 'paciente', 'administrador'],
      filter: true,
      text: 'Vizualize os prontuários de seus pacientes de consultas agendadas.'
   },
   {
      id: '03', icon: '/icons/creditCard_icon.png',
      route: '/users',
      title: 'Definir Preferências de Pagamento',
      permissions: ['profissional', 'administrador'],
      queryId: true,
      queryValue: '?menuScreen=paymentConfig',
      filter: true,
      text: 'Defina o seu valor da consulta, o gerenciamento de pagamentos da consulta pela plataforma.'
   },
   // {
   //    id: '04', icon: '/icons/search_input_icon.png',
   //    route: '/searchProfissional',
   //    title: 'Buscar Terapeura',
   //    permissions: ['administrador'],
   //    filter: true,
   //    text: 'Buscar profissionais e marque sua consulta agora mesmo!'
   // },
   {
      id: '05', icon: '/icons/gateway.png',
      route: '',
      title: 'Pagamentos',
      permissions: ['administrador'],
      filter: true,
      text: 'Veja o extrato dos pagamentos de suas consultas realizadas!'
   },
   {
      id: '06', icon: '/icons/gateway.png',
      route: '',
      title: 'Continuar a preencher minha Anamnêse',
      permissions: ['paciente'],
      filter: true,
      text: 'Não esqueça de preencher seu formulário.'
   },
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

function Home() {

   const { user, colorPalette, theme, setLoading, alert, notificationUser } = useAppContext()
   const [menu, setMenu] = useState(menuItems)
   const [imagesList, setImagesList] = useState([])
   const [myEvents, setMyEvents] = useState([])
   const [consultionList, setConsultion] = useState([])
   const isPacient = user?.perfil?.includes('paciente')
   const router = useRouter();
   moment.locale("pt-br");
   const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '' })
   const [calendarSessions, setCalendarSessions] = useState([])
   const [calendarHours, setCalendarHours] = useState([])
   const [loadingDate, setLoadingDate] = useState(false)
   const profissionalId = 1;
   const handleImages = async () => {
      setLoading(true)
      try {
         const response = await getImageByScreen('Inicio - Banner rotativo')
         if (response.status === 200) {
            setImagesList(response?.data)
         }
      } catch (error) {
         return error
      } finally {
         setLoading(false)
      }
   }

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

   const handleEvents = async () => {
      try {
         setLoading(true)
         console.log(user?.perfil)
         const perfil = user?.perfil?.includes('profissional') ? 'profissional' : 'paciente'
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
      handleImages(imagesList)
      handleEvents()
      getConsultion()
      getSessionsCalendar()
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
   const plansAssignment = [
      {
         id: '01', nome: 'Free', price: 0.00, description: '', key: 'free', icon: ''
      },
      {
         id: '02', nome: 'Standart', price: 49.90, description: '', key: 'standart', icon: '', preferency: true,
      }
   ]

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
         return error
      } finally {
         setLoadingDate(false)
      }
   }

   console.log(dateSelected)

   const statusColor = (data) => ((data === 'Agendado' && 'yellow') ||
      (data === 'Cancelada' && 'red') ||
      (data === 'Atendida' && 'green') ||
      (data === 'Remarcada' && 'blue'))

   return (
      <>
         <Head>
            <title>Afectu</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charset="utf-8" />
            <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/Afectu+-+PNG+-+Fundo+Tranparente-8%402x.png" />
         </Head>
         <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', xm: '100%', md: '100%', lg: '100%' }, transition: '0.5s', marginTop: 10, padding: '10px 50px' }}>

               <Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xm: 'row', md: 'row', lg: 'row' }, alignItems: 'center', gap: 2 }}>
                     <Text
                        bold
                        veryLarge
                        style={{ padding: { xs: '0', xm: '10px 0px 10px 0px', md: '10px 0px 10px 0px', lg: '10px 0px 10px 0px' }, display: 'flex', gap: 8 }}>
                        Bem-vindo,
                        <Text bold veryLarge style={{ color: colorPalette.buttonColor }}>
                           {user?.nome}!
                        </Text>
                     </Text>
                  </Box>


                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', marginTop: 2 }}>

                     <Text light large>Minhas próximas Sessões.</Text>
                     <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', }}>

                        {myEvents?.filter(item => item.disponivel === 1 && (new Date(item?.start) >= new Date()))?.length > 0 ?
                           <Box sx={{ display: 'flex', flexDirection: 'row',   gap: .5, width: '100%', }}>
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


                  {isPacient &&
                     <Box sx={{
                        display: 'flex', gap: 2, padding: '10px',
                        marginTop: 5,
                        backgroundColor: colorPalette?.secondary,
                        boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                        borderRadius: 2
                     }}>
                        <Box sx={{
                           display: 'flex', gap: 2, width: '100%'
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
                                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
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
                                       opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId) ? 1 : 0.5,
                                       "&:hover": {
                                          opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId) ? 1 : 0.5,
                                          cursor: 'pointer',
                                          transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId) ? 'scale(1.1, 1.1)' : 'none'
                                       }
                                    }} onClick={() => {
                                       if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === profissionalId) {
                                          if (dateSelected?.reserva_id === '') {
                                             alert.info('Selecione um horário antes de continuar.')
                                          } else {
                                             router.push(`/searchProfissional/${dateSelected?.reserva_id}?professionalId=${dateSelected?.profissionalId}`)
                                          }
                                       }
                                    }}>
                                       <Text bold style={{ color: '#fff' }}>Agendar</Text>
                                    </Box>
                                 </Box>
                              </Box>
                           </Box>
                           <Box sx={{ display: 'flex', marginLeft: 2, height: '100%', width: '1px', backgroundColor: 'lightgray' }} />
                           <Box sx={{ display: 'block', width: '100%' }}>
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
                                                      width: 30, height: 30,
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
                     </Box>}

                  <Box sx={{ display: isPacient ? 'none' : 'flex', gap: 2, marginTop: 5, flexDirection: 'column' }}>
                     <Text large bold>{isPacient ? 'Atendimento' : 'Consultas'}</Text>
                     <Box sx={{
                        display: 'flex', gap: 2, padding: '10px',
                        // boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        borderRadius: 2
                     }}>
                        <Box sx={{
                           display: 'flex', gap: 2,
                        }}>
                           <Box sx={{
                              display: 'flex', gap: 2,
                              backgroundColor: '#fff',
                              // boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                              borderRadius: 2
                           }}>
                              <Box sx={{
                                 ...styles.menuIcon,
                                 backgroundImage: `url('/icons/agendamento_icon.png')`,
                                 transition: '.3s',
                                 minWidth: 400, height: 'auto', minHeight: 400
                              }} />
                           </Box>
                           <Box sx={{ display: 'flex', marginLeft: 2, height: '100%', width: '1px', backgroundColor: 'lightgray' }} />
                        </Box>
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
                                                width: 30, height: 30,
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