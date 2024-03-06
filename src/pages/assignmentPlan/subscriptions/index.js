import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../../organisms"
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useAppContext } from "../../../context/AppContext"
import { api } from "../../../api/api"
import moment from "moment";
import Cards from 'react-credit-cards'
import "moment/locale/pt-br";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Avatar, Backdrop } from "@mui/material";
import { icons } from "../../../organisms/layout/Colors"
import { redirect } from "react-router-dom";


export default function Subscriptions(props) {
    const { setLoading, colorPalette, alert, user } = useAppContext()
    const [planActually, setPlanActually] = useState('price_1Or4yqKKgBAGSCievTOXkQKg')
    const router = useRouter()
    moment.locale("pt-br");
    // useEffect(() => {
    //     getPlans();
    // }, []);

    // const getPlans = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await api.get(`/users/search/profissional`)
    //         const { data = [] } = response;
    //         setPlanList(data)
    //     } catch (error) {
    //         console.log(error)
    //         return error
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleAssignment = async (planId) => {
        setLoading(true)
        try {

            const handle = await api.post(`/assignments/create`, { profissionalId: user?.id, planId })
            const { url } = handle?.data

            if (url) {
                window.location.href = url;
            } else {
                alert.error('Ocorreu um erro ao fazer checkout. Tente novamente mais tarde')
            }

        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const plansAssignment = [
        {
            id: '01', nome: 'Free', price: 0.00, description: '', key: 'free', icon: '',
            idPlan: 'price_1Or4yqKKgBAGSCievTOXkQKg',
            listPlans: [
                { include: 'Simples acesso a plataforma', access: true },
                { include: 'Gestão de reservas disponíveis', access: true },
                { include: 'Gestão de pagamentos dentro da plataforma', access: false },
                { include: 'Ofertar diversas formas de pagamento para o paciente', access: false },
                { include: 'Prontuário do paciente', access: false },
                { include: 'Controle do acompanhamento do paciente por consulta', access: false },
            ]
        },
    ]

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <>
            <SectionHeader
                icon={'/icons/subscription-model.png'}
                iconTheme={false}
                title={`Minhas Assinatura`}
            />

            <Box sx={{ display: 'flex', gap: 5, width: '100%', justifyContent: 'center' }}>
                {plansAssignment?.map((item, index) => {
                    const listIncludes = item?.listPlans;
                    const isPreferency = item?.preferency;
                    const actuallyPLan = planActually === item?.idPlan;
                    return (
                        <Box key={index} sx={{ position: 'relative', display: 'flex', gap: 1 }}>
                            <ContentContainer sx={{
                                backgroundColor: isPreferency ? colorPalette.third : '#FFF',
                                transition: '.5s',
                                transform: actuallyPLan && 'scale(1.1, 1.1)'
                            }}>
                                {actuallyPLan && <Box sx={{
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
                                    {/* <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start' }}>
                                        {listIncludes?.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                {item?.access ? (
                                                    <CheckCircleIcon style={{ color: 'green', fontSize: 12 }} />
                                                ) : (
                                                    <CancelIcon style={{ color: 'red', fontSize: 12 }} />
                                                )}
                                                <Text style={{ color: 'inherit' }}>{item?.include}</Text>
                                            </Box>
                                        ))}
                                    </Box> */}
                                    <Text indicator bold style={{ color: 'inherit' }}>{formatter.format(item?.price)}/mês</Text>
                                    <Box sx={{
                                        padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginTop: 2,
                                        transition: '.5s',
                                        gap: 2,
                                        border: actuallyPLan && `1px solid ${colorPalette.buttonColor}`,
                                        backgroundColor: actuallyPLan ? 'trasnparent' : isPreferency ? colorPalette.buttonColor : colorPalette.buttonColor,
                                        borderRadius: 2,
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            transform: 'scale(1.1, 1.1)'
                                        }
                                    }} onClick={() => handleAssignment(item?.idPlan)}>
                                        <Text bold style={{ color: !actuallyPLan && '#fff' }}>{
                                            actuallyPLan ? `Gerenciar Plano` :
                                                `Alterar assinatura para ${item?.nome}`}</Text>
                                    </Box>
                                </Box>
                            </ContentContainer>
                        </Box>
                    )
                })}
            </Box>


            <ContentContainer>
                <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                    <Text veryLarge bold>Assinaturas</Text>
                    <TableAssignments />
                </Box>
            </ContentContainer>

        </>
    )
}


const TableAssignments = ({ data = [], filters = [], onPress = () => { } }) => {
    const { setLoading, colorPalette, theme, user } = useAppContext()

    const columns = [
        { key: 'dt_consulta', label: 'Data' },
        { key: 'profissional', label: 'Plano' },
        { key: 'tipo', label: 'Valor' },
        { key: 'situacao', label: 'Status' },
        { key: 'situacao', label: 'Proxima Renovação' },
    ];

    const router = useRouter();
    const menu = router.pathname === '/' ? null : router.asPath.split('/')[1]
    const subMenu = router.pathname === '/' ? null : router.asPath.split('/')[2]

    const handleRowClick = (id) => {
        window.open(`/tasks/${id}`, '_blank');
        return;
    };

    const statusColor = (data) => ((data === 'Paciente faltou' && 'yellow') ||
        (data === 'Cancelada' && 'red') ||
        (data === 'Atendida' && 'green') ||
        (data === 'Remarcada' && 'blue'))

    return (
        <ContentContainer sx={{ display: 'flex', width: '100%', padding: 0, backgroundColor: colorPalette.primary, boxShadow: 'none', borderRadius: 2 }}>

            <TableContainer sx={{ borderRadius: '8px', overflow: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: `2px solid ${colorPalette.buttonColor}` }}>
                            {columns.map((column, index) => (
                                <TableCell key={index} sx={{ padding: '16px', }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text bold style={{ textAlign: 'center' }}>{column.label}</Text>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url(${icons.gray_arrow_down})`,
                                            transform: filters?.filterName === column.key ? filters?.filterOrder === 'asc' ? 'rotate(-0deg)' : 'rotate(-180deg)' : 'rotate(-0deg)',
                                            transition: '.3s',
                                            width: 17,
                                            height: 17,

                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                            },
                                        }}
                                            onClick={() => onPress({
                                                filterName: column.key,
                                                filterOrder: filters?.filterOrder === 'asc' ? 'desc' : 'asc'
                                            })} />
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ flex: 1, padding: 5, backgroundColor: colorPalette.secondary }}>
                        {
                            data?.map((item, index) => {
                                return (
                                    <TableRow key={`${item}-${index}`} onClick={() => handleRowClick(item?.id_consulta)} sx={{
                                        "&:hover": {
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.primary + '88'
                                        },
                                    }}>
                                        <TableCell sx={{ padding: '8px 10px', textAlign: 'center' }}>
                                            <Text>{formatTimeStamp(item?.dt_consulta, true) || '-'}</Text>
                                        </TableCell>
                                        <Tooltip title={item?.profissional}>
                                            <TableCell sx={{
                                                padding: '15px 10px', textAlign: 'center',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                maxWidth: '180px',
                                            }}>
                                                <Text style={{
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                }}>{item?.profissional || '-'}</Text>
                                            </TableCell>
                                        </Tooltip>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item?.tipo || '-'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    backgroundColor: colorPalette.primary,
                                                    height: 30,
                                                    gap: 2,
                                                    alignItems: 'center',
                                                    // width: 100,
                                                    borderRadius: 2,
                                                    justifyContent: 'start',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', backgroundColor: statusColor(item?.status_consulta), padding: '0px 5px', height: '100%', borderRadius: '8px 0px 0px 8px' }} />
                                                <Text small bold>{item?.status_consulta}</Text>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })

                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </ContentContainer >
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
