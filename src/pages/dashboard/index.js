import { useEffect, useState } from "react";
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms";
import { useAppContext } from "../../context/AppContext";
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { api } from "../../api/api";
import moment from "moment";
import Link from "next/link";


export default function Dashboard() {
    const [consultions, setConsultion] = useState('')
    const [consultionsDetails, setConsultionsDetails] = useState({
        total: 0
    })
    const [companiesDetails, setCompaniesDetails] = useState([])
    const [sessionsDetailsStatus, setSessionsDetailsStatus] = useState({})
    const { colorPalette, user, setLoading } = useAppContext()


    const getConsultion = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/consultation/profissional/next-sessions/${125}`);
            const { data, consultionDetails, sessionsCompany, detailsStatusSessions } = response?.data;

            setConsultionsDetails(consultionDetails)
            setCompaniesDetails(sessionsCompany)
            setSessionsDetailsStatus(detailsStatusSessions)

            if (Array.isArray(data) && data.length > 0) {
                const sortData = data?.sort((a, b) => new Date(b.data) - new Date(a.data))
                setConsultion(sortData);
            } else {
                setConsultion([]);
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getConsultion()
    }, [])

    const consultion = {
        consultas: 120,
        pacientes: 20,
        empresas: 2
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Box sx={{
                display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 3,
                flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }
            }}>
                <Text veryLarge bold>Dashboard</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>

                    <Box sx={{
                        display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }, padding: '12px', borderRadius: 3, backgroundColor: colorPalette?.secondary,
                        boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            width: 20,
                            height: 20,
                            backgroundImage: `url('/icons/row.png')`,
                        }} />
                    </Box>

                    <Box sx={{
                        display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }, padding: '12px', borderRadius: 3, backgroundColor: colorPalette?.secondary,
                        transition: '.3s', boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            width: 20,
                            height: 20,
                            backgroundImage: `url('/icons/menu-3.png')`,
                            transition: '.3s',
                        }} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <ContentContainer fullWidth row>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text light title>Sessões</Text>
                        <Text bold indicator>{consultionsDetails?.totalSessions}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{
                            display: 'flex', gap: 2, padding: '10px', borderRadius: 50, border: `1px solid ${colorPalette.buttonColor}`,
                            width: 50, height: 50, alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                width: 20,
                                height: 20,
                                backgroundImage: `url('/icons/consults.png')`,
                            }} />
                        </Box>
                    </Box>
                </ContentContainer>

                <ContentContainer fullWidth row>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text light title>Pacientes</Text>
                        <Text bold indicator>{consultionsDetails?.totalPacient}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{
                            display: 'flex', gap: 2, padding: '10px', borderRadius: 50, border: `1px solid ${colorPalette.buttonColor}`,
                            width: 50, height: 50, alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                width: 20,
                                height: 20,
                                backgroundImage: `url('/icons/pacients.png')`,
                            }} />
                        </Box>
                    </Box>
                </ContentContainer>

                <ContentContainer fullWidth row>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text light title>Empresas/Clientes</Text>
                        <Text bold indicator>{consultionsDetails?.totalClients}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{
                            display: 'flex', gap: 2, padding: '10px', borderRadius: 50, border: `1px solid ${colorPalette.buttonColor}`,
                            width: 50, height: 50, alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                width: 20,
                                height: 20,
                                backgroundImage: `url('/icons/clients.png')`,
                            }} />
                        </Box>
                    </Box>
                </ContentContainer>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <ContentContainer>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text title>Detalhes das Sessões</Text>
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Text bold>Concluídas</Text>
                            <Text bold>{sessionsDetailsStatus?.concluidas || 0}</Text>
                        </Box>
                        <Box sx={{ width: '100%', backgroundColor: colorPalette.primary, height: 8, width: '100%', borderRadius: 2 }}>
                            <Box sx={{
                                display: 'flex', height: '100%', backgroundColor: 'green',
                                width: `${Math.min(
                                    (sessionsDetailsStatus?.concluidas / (consultionsDetails?.totalSessions || 1)) * 100,
                                    100
                                )}%`,
                                transition: 'width 0.5s ease-in-out',
                            }}></Box>
                        </Box>
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Text>Agendadas</Text>
                            <Text>{sessionsDetailsStatus?.agendadas || 0}</Text>
                        </Box>
                        <Box sx={{ width: '100%', backgroundColor: colorPalette.primary, height: 8, width: '100%', borderRadius: 2 }}>
                            <Box sx={{
                                display: 'flex', height: '100%', backgroundColor: 'orange',
                                width: `${Math.min(
                                    (sessionsDetailsStatus?.agendadas / (consultionsDetails?.totalSessions || 1)) * 100,
                                    100
                                )}%`,
                                transition: 'width 0.5s ease-in-out',
                            }}></Box>
                        </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Text>Remarcadas</Text>
                            <Text>{sessionsDetailsStatus?.remarcadas || 0}</Text>
                        </Box>
                        <Box sx={{ width: '100%', backgroundColor: colorPalette.primary, height: 8, width: '100%', borderRadius: 2 }}>
                            <Box sx={{
                                display: 'flex', height: '100%', backgroundColor: 'blue',
                                width: `${Math.min(
                                    (sessionsDetailsStatus?.remarcadas / (consultionsDetails?.totalSessions || 1)) * 100,
                                    100
                                )}%`,
                                transition: 'width 0.5s ease-in-out',
                            }}></Box>
                        </Box>
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Text>Canceladas</Text>
                            <Text>{sessionsDetailsStatus?.canceladas || 0}</Text>
                        </Box>
                        <Box sx={{ width: '100%', backgroundColor: colorPalette.primary, height: 8, width: '100%', borderRadius: 2 }}>
                            <Box sx={{
                                display: 'flex', height: '100%', backgroundColor: 'red',
                                width: `${Math.min(
                                    (sessionsDetailsStatus?.canceladas / (consultionsDetails?.totalSessions || 1)) * 100,
                                    100
                                )}%`,
                                transition: 'width 0.5s ease-in-out',
                            }}></Box>
                        </Box>
                    </Box>
                </ContentContainer>

                <ContentContainer>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text title>Próximas Sessões</Text>
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>

                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '2px',
                                height: '100%',
                                borderLeft: `2px dashed lightgray`
                            }}
                        >
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {consultions?.length > 0 ?
                                consultions?.map((item, index) => {

                                    let formattedDate = item?.data;
                                    let formattedHour = item?.data;

                                    const currentDate = new Date(item?.data);
                                    const options = {
                                        day: "numeric",
                                        month: "short"
                                    };

                                    formattedDate = currentDate ? new Intl.DateTimeFormat("pt-BR", options).format(currentDate) : 'none';
                                    const horaMoment = moment(item?.data);
                                    formattedHour = horaMoment.format("HH:mm");

                                    return (
                                        <Box key={index} sx={{
                                            display: 'flex', gap: 3, alignItems: 'center',
                                            padding: '5px 5px 10px 20px',
                                            position: 'relative',
                                        }}>

                                            <Box sx={{
                                                ...styles.menuIcon,
                                                position: 'absolute',
                                                left: -6,
                                                width: 12,
                                                height: 12,
                                                backgroundImage: `url('/icons/next.png')`,
                                            }} />

                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Text bold large>{formattedDate}</Text>
                                                <Text light small>{formattedHour}</Text>
                                            </Box>
                                            <Box sx={{
                                                ...styles.menuIcon,
                                                width: 13,
                                                height: 13,
                                                backgroundImage: `url('/icons/right-arrow.png')`,
                                            }} />

                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Avatar src={item?.url_foto_pac || ''} sx={{
                                                    height: { xs: 60, sm: 30, md: 30, lg: 30 },
                                                    width: { xs: 60, sm: 30, md: 30, lg: 30 },
                                                }} variant="rounded"
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Text bold large>{item.paciente}</Text>
                                                    <Text light small>{item?.email_paciente}</Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                }) : <Text light>Você não possúi sessões agendadas.</Text>}

                        </Box>
                    </Box>
                    {consultions?.length > 0 && <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
                        <Link href={'/consultation'} target="_blank">
                            <Button text="Ver mais.." style={{ width: 120 }} />
                        </Link>
                    </Box>}
                </ContentContainer>

                <ContentContainer fullWidth>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                        <Text title>Por Cliente</Text>
                    </Box>
                    <Divider />

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Text bold>Empresa</Text></TableCell>
                                    <TableCell><Text bold>Sessões</Text></TableCell>
                                    <TableCell><Text bold>Pessoas</Text></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companiesDetails?.map((item, index) => {
                                    return (
                                        <TableRow key={index}>

                                            <TableCell><Text light>{item?.empresa || 'Sessão Particular'}</Text></TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        width: 12,
                                                        height: 12,
                                                        backgroundImage: `url('/icons/consults.png')`,
                                                    }} />
                                                    <Text light>{item?.consultas || 0}</Text>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        width: 12,
                                                        height: 12,
                                                        backgroundImage: `url('/icons/pacients.png')`,
                                                    }} />
                                                    <Text light>{item?.totalPacientes || 0}</Text>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ContentContainer>
            </Box>

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
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 15,
        height: 15,
    },
}