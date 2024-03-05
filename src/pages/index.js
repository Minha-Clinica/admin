import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Box, Button, ContentContainer, Divider, Text, TextInput } from '../atoms'
import { Carousel } from '../organisms'
import { useAppContext } from '../context/AppContext'
import { icons } from '../organisms/layout/Colors'
import { useEffect, useState } from 'react'
import { menuItems } from '../permissions'
import { useRouter } from 'next/router'
import { getImageByScreen } from '../validators/api-requests'
import { api } from '../api/api'
import { Avatar, Backdrop } from '@mui/material'
import { formatDate, formatTimeAgo, formatTimeStamp } from '../helpers'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Estilo para o recurso de arrastar e soltar (se estiver usando)
import "react-big-calendar/lib/addons/dragAndDrop"; // Recurso de arrastar e soltar (se estiver usando)
import Hamburger from 'hamburger-react'

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
      id: '01', icon: '/icons/agenda_icon.png',
      route: '/calendar',
      title: 'Minha Agenda',
      permissions: ['profissional', 'administrador'],
      filter: true,
      text: 'Vizualize suas agendas confirmadas ou crie sua lista de reservas.'
   },
   {
      id: '02', icon: 'https://minhaclinicatrindade.s3.amazonaws.com/video_conferencia.png',
      route: '/consultation',
      title: 'Minhas Consultas',
      permissions: ['profissional', 'paciente', 'administrador'],
      filter: true,
      text: 'Vizualize os prontuários de seus pacientes de consultas agendadas.'
   },
   {
      id: '03', icon: '/icons/search_input_icon.png',
      route: '/searchProfissional',
      title: 'Buscar Terapeura',
      permissions: ['paciente', 'administrador'],
      filter: true,
      text: 'Buscar profissionais e marque sua consulta agora mesmo!'
   },
   {
      id: '04', icon: 'https://mf-planejados.s3.amazonaws.com/Icon_financeiro.svg',
      route: '',
      title: 'Pagamentos',
      permissions: ['paciente', 'administrador'],
      filter: true,
      text: 'Veja o extrato dos pagamentos de suas consultas realizadas!'
   },
   {
      id: '05', icon: '/icons/plan_payment.png',
      filter: true,
      route: '/assignmentPlan',
      permissions: ['profissional', 'administrador'],
      title: 'Meus Planos',
      text: 'Usufrua o melhor da plataforma contratando os melhores planos! E aproveite!'
   }
]

function Home() {

   const { user, colorPalette, theme, setLoading, alert, notificationUser } = useAppContext()
   const [menu, setMenu] = useState(menuItems)
   const [imagesList, setImagesList] = useState([])
   const [events, setEvents] = useState([])
   const [consultionList, setConsultion] = useState([])
   const [planActually, setPlanActually] = useState('free')
   const isPacient = user?.perfil?.includes('paciente')
   const router = useRouter();
   moment.locale("pt-br");
   const localizer = momentLocalizer(moment);
   const [carouselIndex, setCarouselIndex] = useState(0);



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
         const response = await api.get(`/events`)
         const { data } = response
         if (data) {
            const eventsMap = data?.map((event) => ({
               id_evento_calendario: event.id_evento_calendario,
               start: event.inicio, // Adicione o início e o fim do evento como propriedades start e end
               end: event.fim,
               title: event.titulo,
               description: event.descricao,
               location: event.local,
               color: event.color,
               perfil_evento: event?.perfil_evento,
               allDay: false, // Ajuste isso com base no seu caso de uso

            }));
            setEvents([...eventsMap]);
            return
         }
      } catch (error) {
         return error
      } finally {
         setLoading(false)
      }
   }


   useEffect(() => {
      handleImages(imagesList)
      handleEvents()
      getConsultion()
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

   const listEvents = [
      {
         id: '01',
         title: "Feriado",
         description: "Escola fechada para todos, não tem aula nem funciona o adm",
         location: "",
         color: "#FF0000",
      },
      {
         id: '02',
         title: "Emenda de feriado",
         description: "Não tem aula, adm funciona normalmente",
         location: "",
         color: "#FF8C00",
      },
      {
         id: '03',
         title: "Férias/recesso de professores e alunos",
         description: "Adm funciona das 9h ás 18h",
         location: "",
         color: "#FFD700",
      },
      {
         id: '04',
         title: "Inicio das aulas do semestre",
         description: "",
         location: "",
         color: "#008000",
      },
      {
         id: '05',
         title: "Evento",
         description: "",
         location: "",
         color: "#FFC0CB",
      },
      {
         id: '06',
         title: "Avaliação",
         description: "",
         location: "",
         color: "#87CEFA",
      },
      {
         id: '07',
         title: "Semana de substitutiva",
         description: "",
         location: "",
         color: "#86b8f5",
      },
      {
         id: '08',
         title: "Semana de exame",
         description: "",
         location: "",
         color: "#5b969b",
      },
      {
         id: '09',
         title: "Divulgação de resultados final",
         description: "",
         location: "",
         color: "#1e5a8c",
      },
   ]
   const sortedEvents = events.slice().sort((a, b) => new Date(b.start) - new Date(a.start));

   const lengthNotifications = notificationUser?.filter(item => item?.vizualizado === 0)?.length;

   const plansAssignment = [
      {
         id: '01', nome: 'Free', price: 0.00, description: '', key: 'free', icon: ''
      },
      {
         id: '02', nome: 'Standart', price: 49.90, description: '', key: 'standart', icon: '', preferency: true,
      }
   ]

   const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
   });

   const handleNext = (item) => {
      const newIndex = Math.min(carouselIndex + 3, item.length - 1);
      setCarouselIndex(newIndex);
   };

   const handlePrev = () => {
      const newIndex = Math.max(carouselIndex - 3, 0);
      setCarouselIndex(newIndex);
   };


   const statusColor = (data) => ((data === 'Agendado' && 'yellow') ||
      (data === 'Cancelada' && 'red') ||
      (data === 'Atendida' && 'green') ||
      (data === 'Remarcada' && 'blue'))

   return (
      <>
         <Head>
            <title>Clínica Trindade</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charset="utf-8" />
            <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/logo-clinica-light.png" />
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

                     <Text light large>Conheça parte de nossa equipe de Profissionais..</Text>
                     <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>

                        {equipeProf?.map((item, index) => {
                           return (
                              <Box key={index} sx={{
                                 display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '15px', maxWidth: 400, borderRadius: 2,
                                 boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                              }}>
                                 <Box sx={{
                                    display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center', width: 120, justifyContent: 'center',
                                 }}>
                                    <Avatar src={item?.icon || ''} sx={{
                                       height: { xs: '100%', sm: 45, md: 45, lg: 60 },
                                       width: { xs: '100%', sm: 45, md: 45, lg: 60 },
                                    }} variant="circular"
                                    />
                                    <Text bold xsmall style={{ marginLeft: 2, minWidth: 80, display: 'flex', textAlign: 'center' }}>{item?.nome}</Text>
                                 </Box>
                                 <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start' }}>
                                    <Text bold small>{item?.titulo}</Text>
                                    <Text light small>{item?.text}</Text>
                                 </Box>
                              </Box>
                           )
                        })}
                     </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, marginTop: 5, flexDirection: 'column' }}>
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
                                 width: 400, height: 'auto',
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
                                       }} onClick={() => router.push(item?.route)}>
                                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                             <Box sx={{
                                                ...styles.menuIcon,
                                                backgroundImage: `url(${item?.icon})`,
                                                transition: '.3s',
                                                filter: item?.filter && 'brightness(0) invert(0)',
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

                  <Box sx={{ display: isPacient ? 'none' : 'flex', gap: 5, flexDirection: 'column', marginTop: 5, alignItems: 'center' }}>
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

                  </Box>

                  <Box sx={{ display: 'flex', padding: '10px 0px', marginTop: 5 }}>
                     <Text bold>Veja o que está rolando..</Text>
                  </Box>
                  <Carousel
                     data={imagesList || backgroundHome}
                     style={{
                        backgroundColor: colorPalette.secondary,
                        borderRadius: '8px',
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                     }}
                     heigth={{ xs: 200, xm: 480, md: 200, lg: 450, xl: 400 }}
                     width={'auto'}
                  />
               </Box>
            </Box>
         </Box>
      </>
   )


}


const BirthDateDiaog = ({ idSelected, setShowMessageBirthDay, userBirthDay }) => {

   const { user, colorPalette, theme, setLoading, alert } = useAppContext()

   const [message, setMessage] = useState('')
   const nameBirthDay = userBirthDay?.filter(item => item.id === idSelected).map(item => item.nome)

   const handlePushNotification = async (id) => {
      setLoading(true)
      try {
         const notificationData = {
            titulo: `Parabéns!!`,
            menssagem: message,
            vizualizado: 0,
            usuario_env: user?.id
         }
         const response = await api.post(`/notification/create/${id}`, { notificationData })
         if (response.status === 201) {
            alert.success('Mensagem de parabéns enviada!')
            setShowMessageBirthDay(false)
         }
      } catch (error) {
         console.log(error)
         return error
      } finally {
         setLoading(false)
      }
   }

   return (

      <ContentContainer style={{ position: 'relative', width: 415, maxHeight: 600, overflowY: 'auto', padding: 4, display: 'flex', flexDirection: 'column' }}>

         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start', width: '100%', position: 'relative' }}>
            <Text bold>Escreva uma mensagem de aniversário</Text>
            <Box sx={{
               ...styles.menuIcon,
               backgroundImage: `url(${icons.gray_close})`,
               transition: '.3s',
               zIndex: 999999999,
               position: 'absolute',
               right: 5,
               top: 2,
               "&:hover": {
                  opacity: 0.8,
                  cursor: 'pointer'
               }
            }} onClick={() => setShowMessageBirthDay(false)} />
         </Box>

         <Box sx={{ width: '100%', height: '1px', backgroundColor: '#eaeaea', margin: '0px 0px 20px 0px' }} />

         <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start', flex: 1 }}>
            <Text style={{ whiteSpace: 'nowrap' }}>Escreva sua mensagem de aniversário para</Text>
            <Text style={{ whiteSpace: 'nowrap' }} bold>{nameBirthDay},</Text>
            <Text style={{ whiteSpace: 'nowrap' }}>ou envie mensagens pré-montadas!</Text>
         </Box>
         <Box sx={{ display: 'flex', gap: 1.75, }}>
            <TextInput
               placeholder='Feliz aniversário!'
               name='message'
               onChange={(e) => setMessage(e.target.value)}
               value={message || ''}
               multiline
               maxRows={6}
               rows={3}
               sx={{ flex: 1, }}
            />
         </Box>

         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Text bold xsmall>Mensagens pré-montadas:</Text>
            <Box sx={{
               display: 'flex', padding: '5px 15px', backgroundColor: colorPalette?.buttonColor, alignItems: 'center', justifyContent: 'center', borderRadius: 8,
               "&:hover": {
                  opacity: 0.8,
                  cursor: 'pointer'
               }
            }}
               onClick={() => setMessage(`${user?.nome} te desejou muitas felicidades no seu dia!`)}>
               <Text xsmall style={{ color: '#fff', }}>{user?.nome} te desejou muitas felicidades no seu dia!</Text>
            </Box>
         </Box>
         <Divider distance={0} />
         <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
               <Button small text="Enviar" style={{ height: 30, width: 80 }} onClick={() => handlePushNotification(idSelected)} />
               <Button secondary small text="Apagar" style={{ height: 30, width: 80 }} onClick={() => setMessage('')} />
            </Box>
         </Box>

      </ContentContainer>
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