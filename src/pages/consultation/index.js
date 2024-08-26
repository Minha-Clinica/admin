import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms"
import { PaginationTable, SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { getConsultionPerfil } from "../../validators/api-requests"
import { useAppContext } from "../../context/AppContext"
import { SelectList } from "../../organisms/select/SelectList"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Backdrop, CircularProgress, FormControlLabel, Switch, TablePagination } from "@mui/material"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Avatar } from "@mui/material";
import { api } from "../../api/api"
import { icons } from "../../organisms/layout/Colors"
import { formatTimeStamp } from "../../helpers"
import moment from "moment";
import "moment/locale/pt-br";
import { formatDate } from "../../helpers"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';

export default function ListConsultions(props) {
    const [consultionList, setConsultion] = useState([])
    const [filterData, setFilterData] = useState('')
    const [perfil, setPerfil] = useState('todos')
    const { setLoading, colorPalette, menuItemsList, userPermissions, user } = useAppContext()
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [firstRender, setFirstRender] = useState(true)
    const [filters, setFilters] = useState({
        filterName: 'nome',
        filterOrder: 'asc'
    })
    const [filtersField, setFiltersField] = useState({
        enrollmentSituation: 'todos',
        status: 'todos',
        userPerfil: 'todos',
    })
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    const isPartner = user?.perfil?.includes('parceiro')
    const userFilterFunctions = {
        ativo: (item) => filtersField?.status === 'todos' || item.ativo === filtersField?.status,
        enrollmentSituation: (item) => filtersField?.enrollmentSituation === 'todos' || item?.total_matriculas_em_andamento === filtersField?.enrollmentSituation,
        perfilUser: (item) => filtersField?.userPerfil === 'todos' || item?.perfil?.includes(filtersField?.userPerfil),
    };


    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        let perfil;

        if (user?.perfil?.includes('administrador')) {
            perfil = item?.paciente;
        }

        if (user?.perfil?.includes('paciente')) {
            perfil = item?.profissional;
        }

        const normalizedFilterData = normalizeString(filterData);

        return (
            // Object.values(userFilterFunctions).every(userFilterFunction => userFilterFunction(item)) &&
            (
                normalizeString(perfil)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
            )
        );
    };



    const fetchPermissions = async () => {
        try {
            const actions = await checkUserPermissions(router, userPermissions, menuItemsList)
            setIsPermissionEdit(actions)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const pathname = router.pathname === '/' ? null : router.asPath.split('/')[2]

    useEffect(() => {
        getConsultion();
        fetchPermissions()
        if (window.localStorage.getItem('list-consultion-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-consultion-filters') || null);
            setFilters({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
    }, []);

    const getConsultion = async () => {
        setLoading(true);
        try {
            let query;
            if (user?.perfil?.includes('administrador')) {
                query = `/consultation/profissional/${user?.id}`;
            } else if (user?.perfil?.includes('paciente')) {
                query = `/consultation/pacient/${user?.id}`;
            } else if (isPartner) {
                query = `/consultation/company/pacient/${user?.empresa_id}`;
            } else {
                throw new Error("Perfil de usuário não reconhecido");
            }

            const response = await api.get(query);
            const { data = [] } = response;

            if (Array.isArray(data) && data.length > 0) {
                setConsultion(data);
            } else {
                setConsultion([]); // Certifique-se de definir um array vazio se os dados não forem um array ou estiverem vazios
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setLoading(false);
        }
    };

    console.log('consultionList: ', consultionList)


    useEffect(() => {
        if (firstRender) return setFirstRender(false);
        window.localStorage.setItem('list-consultion-filters', JSON.stringify({ filterName: filters.filterName, filterOrder: filters.filterOrder }));
    }, [filters])


    const sortConsultion = () => {
        const { filterName, filterOrder } = filters;

        const sortedConsultion = [...consultionList].sort((a, b) => {
            const valueA = filterName === 'id_consulta' ? Number(a[filterName]) : (a[filterName] || '').toLowerCase();
            const valueB = filterName === 'id_consulta' ? Number(b[filterName]) : (b[filterName] || '').toLowerCase();

            if (filterName === 'id_consulta') {
                return filterOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return filterOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        return sortedConsultion;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const column = [
        { key: 'id', label: 'ID' },
        { key: 'nome', avatar: true, label: 'Nome', avatarUrl: 'location', matricula: true },
        { key: 'email', label: 'E-mail' },
        { key: 'perfil', label: 'Perfil' },
    ];

    const listAtivo = [
        { label: 'Todos', value: 'todos' },
        { label: 'Ativo', value: 1 },
        { label: 'Inativo', value: 0 },
    ]

    const listEnrollStatus = [
        { label: 'Todos', value: 'todos' },
        // { label: 'Pendente de nota', value: 'Pendente de nota' },
        // { label: 'Reprovado', value: 'Reprovado' },
        // { label: 'Aprovado - Pendente de pré-matrícula', value: 'Aprovado - Pendente de pré-matrícula' },
        // { label: 'Aprovado - Em análise', value: 'Aprovado - Em análise' },
        { label: 'Matriculado', value: 1 },
    ]

    const listUser = [
        { label: 'Todos', value: 'todos' },
        { label: 'Aluno', value: 'aluno' },
        { label: 'Funcionário', value: 'funcionario' },
        { label: 'Interessado', value: 'interessado' },
    ]

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4 }}>
            <Box sx={{
                display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }
            }}>
                <Text veryLarge bold>Sessões</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar por paciente" name='filterData' type="search"
                        onChange={(event) => setFilterData(event.target.value)} value={filterData}
                        InputProps={{
                            style: {
                                width: 400,
                                backgroundColor: colorPalette?.secondary,
                                borderRadius: 16,
                                borderColor: 'transparent', // Define a cor da borda como transparente
                                borderStyle: 'none'
                            }
                        }} />

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
            {(consultionList?.length > 0 && consultionList) ?
                <TableConsultion data={consultionList?.length > 0 ? consultionList?.slice(startIndex, endIndex) : []} setConsultion={setConsultion}
                    callBack={() => {
                        getConsultion()
                        setLoadingPayment({ active: false, success: false, error: false, message: '' });
                    }}
                    setLoadingPayment={setLoadingPayment}
                    loadingPayment={loadingPayment}
                    filter={filter}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage} />
                :
                <Text>Não exitem consultas agendadas.</Text>}

        </Box>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { }, setConsultion, callBack = () => { },
    filter,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
    setLoadingPayment,
    loadingPayment
}) => {
    const { setLoading, colorPalette, mobile, user, alert } = useAppContext()
    const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '', consultId: '' })
    const isProfissional = user?.perfil?.includes('profissional')
    const isPartner = user?.perfil?.includes('parceiro')
    const [showAgendas, setShowAgendas] = useState({ active: false, profissionalId: null, profissionalData: {}, consultionDate: '' })

    const getProfissionalAgendas = async ({ profissionalId, dateConsult, consultId = null }) => {
        setLoading(true)
        try {
            const response = await api.get(`/users/search/profissional/agendas/${profissionalId}`)
            const { data = [] } = response;
            const currentDate = new Date(dateConsult);
            const options = {
                day: "numeric",
                month: "long",
                year: "numeric",
            };
            const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(currentDate);
            const horaMoment = moment(dateConsult);
            const horaFormatada = horaMoment.format("HH:mm");

            setShowAgendas({
                active: true, profissionalId, profissionalData: data,
                consultionDate: `${formattedDate} ás ${horaFormatada}`
            })

            setDateSelected({ ...dateSelected, consultId: consultId })
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }


    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleUpdateStatus = async (event, id) => {
        setLoadingPayment({ active: true, success: false, error: false, message: 'Alterando status de pagamento...' });

        try {
            const { checked } = event.target;
            const valueUpdate = checked === true ? 1 : 0;
            const response = await api.patch(`/consultation/update/payment/${id}`, { valueUpdate });

            if (response.status === 200) {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: true, error: false,
                        message: 'Status alterado com Sucesso.'
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: true, error: false,
                            message: 'Status alterado com Sucesso.'
                        });
                        await callBack();
                    }, 2000);
                    alert.success('Pagamento atualizado.');
                }, 2000);
            } else {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: false, error: true,
                        message: 'Ocorreu um erro ao alterar o status de pagamento. Tente novamente mais tarde.'
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: false, error: true,
                            message: 'Ocorreu um erro ao alterar o status de pagamento. Tente novamente mais tarde.'
                        });
                    }, 3500);
                    alert.error('Ocorreu um erro ao atualizar pagamento.');
                }, 3500);
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setTimeout(() => {
                setLoadingPayment({ active: false, success: false, error: false, message: '' });
            }, 5000);
        }
    };


    const currentDate = new Date();

    const isWithin24Hours = (consultationDate) => {
        const consultationDateObj = new Date(consultationDate);
        const timeDifference = consultationDateObj - currentDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Converte milissegundos em horas
        return hoursDifference < 24;
    };

    const handleCancelAppointment = async ({ consultId = null }) => {
        setLoadingPayment({ active: true, success: false, error: false, message: 'Cancelando Consulta...' });

        try {
            const response = await api.patch(`/consultation/update/cancel/agenda/${consultId}`);

            if (response.status === 200) {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: true, error: false,
                        message: `Consulta cancelada com sucesso.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: true, error: false,
                            message: `Consulta cancelada com sucesso.`
                        });
                        await callBack();
                    }, 2000);
                    alert.success('Consulta cancelada.');
                }, 2000);
            } else {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: false, error: true,
                        message: `Ocorreu um erro ao cancelar. Tente novamente mais tarde.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: false, error: true,
                            message: `Ocorreu um erro ao cancelar. Tente novamente mais tarde.`
                        });
                    }, 3500);
                    alert.error(`Ocorreu um erro ao cancelar consulta.`);
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


    const handleRescheduleppointment = async () => {
        setLoadingPayment({ active: true, success: false, error: false, message: 'Reagendando Consulta...' });

        try {
            const response = await api.patch(`/consultation/agenda/reagenda/${dateSelected?.consultId}`, {
                reservaId: dateSelected?.reserva_id,
                userPacientData: {
                    nome: user?.nome,
                    id: user?.id,
                    email: user?.email
                }
            });

            if (response.status === 200) {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: true, error: false,
                        icon: '/icons/remarcar_icon.png',
                        message: `Consulta remarcada com sucesso.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: true, error: false,
                            icon: '/icons/remarcar_icon.png',
                            message: `Consulta remarcada com sucesso.`
                        });
                        await callBack();
                    }, 2000);
                    alert.success('Consulta remarcada.');
                }, 2000);
                setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '', consultId: '' })
                setShowAgendas({ active: false, profissionalId: null, profissionalData: {}, consultionDate: '' })
            } else {
                setTimeout(() => {
                    setLoadingPayment({
                        active: true, success: false, error: true,
                        message: `Ocorreu um erro ao remarcar consulta. Tente novamente mais tarde.`
                    });
                    setTimeout(async () => {
                        setLoadingPayment({
                            active: false, success: false, error: true,
                            message: `Ocorreu um erro ao remarcar consulta. Tente novamente mais tarde.`
                        });
                    }, 3500);
                    alert.error(`Ocorreu um erro ao remarcar consulta consulta.`);
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

    let columns = []

    if (isProfissional) {
        columns = [
            { key: 'data', label: 'Data' },
            { key: isProfissional ? 'paciente' : 'profissional', label: isProfissional ? 'Paciente ' : 'Profissional' },
            { key: 'modalidade', label: 'Tipo' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Ações' },
        ];
    } else if (isPartner) {
        columns = [
            { key: 'data', label: 'Data' },
            { key: 'paciente', label: 'Colaborador' },
            { key: 'profissional', label: 'Terapeuta' },
            { key: 'modalidade', label: 'Tipo' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Ações' },
        ];
    }
    else {
        columns = [
            { key: 'data', label: 'Data' },
            { key: isProfissional ? 'paciente' : 'profissional', label: isProfissional ? 'Paciente ' : 'Profissional' },
            { key: 'modalidade', label: 'Tipo' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Ações' },
        ];
    }

    const router = useRouter();
    const menu = router.pathname === '/' ? null : router.asPath.split('/')[1]
    const subMenu = router.pathname === '/' ? null : router.asPath.split('/')[2]

    const handleRowClick = (id) => {
        window.open(`/consultation/${id}`, '_blank');
        return;
    };

    const statusColor = (data) => ((data === 'Agendado' && 'yellow') ||
        (data === 'Cancelada' && 'red') ||
        (data === 'Atendida' && 'green') ||
        (data === 'Remarcada' && 'blue'))


    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

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

    return (
        <>
            {mobile ?
                <CardConsultion data={data} isProfissional={isProfissional} isPartner={isPartner} handleRowClick={handleRowClick} handleUpdateStatus={handleUpdateStatus} />
                :
                <ContentContainer sx={{ display: 'flex', width: '100%', padding: 0, backgroundColor: colorPalette.primary, boxShadow: 'none', borderRadius: 2 }}>
                    <TableContainer sx={{ borderRadius: '8px', overflow: 'auto', }}>
                        <Table sx={{ borderCollapse: 'collapse', width: '100%', }}>
                            <TableHead>
                                <TableRow sx={{ borderBottom: `1px solid lightgray`, backgroundColor: colorPalette?.secondary }}>
                                    {columns.map((column, index) => (
                                        <TableCell key={index} sx={{ padding: '16px 20px', }}>
                                            <Box sx={{
                                                display: 'flex', gap: 1, alignItems: 'center', justifyContent: column.key !== "actions" ?
                                                    'flex-start' : 'center'
                                            }}>
                                                <Text bold style={{ textAlign: 'center' }}>{column.label}</Text>
                                                {column.key !== "actions" &&
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
                                                        })} />}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ flex: 1, padding: 5, backgroundColor: colorPalette.secondary }}>
                                {
                                    data?.sort((a, b) => new Date(b.data) - new Date(a.data))?.map((item, index) => {
                                        const pay = parseInt(item?.pago) === 1;
                                        const currentDate = new Date()
                                        const canUncheck = (item?.status !== 'Cancelada') && (new Date(item?.data) > currentDate);

                                        return (
                                            <TableRow key={`${item}-${index}`} sx={{
                                                transition: '.3s',
                                                "&:hover": {
                                                    backgroundColor: colorPalette.primary + '88',
                                                },
                                            }}>
                                                <TableCell sx={{ padding: '8px 25px', justifyContent: 'flex-start' }}>
                                                    <Text>{formatTimeStamp(item?.data, true) || '-'}</Text>
                                                </TableCell>
                                                <Tooltip title={isPartner ? item?.paciente : isProfissional ? item?.paciente : item?.profissional}>
                                                    <TableCell sx={{
                                                        padding: '15px 10px', textAlign: 'center',
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                            <Avatar src={isPartner ? item?.url_foto_pac : item?.url_foto_prof || ''} sx={{
                                                                height: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                                width: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                            }} variant="rounded"
                                                            />
                                                            <Text style={{
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                            }}>{isPartner ? item?.paciente : isProfissional ? item?.paciente : item?.profissional || '-'}</Text>
                                                        </Box>
                                                    </TableCell>
                                                </Tooltip>
                                                {isPartner &&
                                                    <Tooltip title={item?.profissional}>
                                                        <TableCell sx={{
                                                            padding: '15px 10px', textAlign: 'center',
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                                <Avatar src={item?.url_foto_prof || ''} sx={{
                                                                    height: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                                    width: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                                }} variant="rounded"
                                                                />
                                                                <Text style={{
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                }}>{item?.profissional || '-'}</Text>
                                                            </Box>
                                                        </TableCell>
                                                    </Tooltip>}
                                                <TableCell sx={{ padding: '15px 10px', justifyContent: 'flex-start' }}>
                                                    <Text>{item?.modalidade || '-'}</Text>
                                                </TableCell>
                                                <TableCell sx={{ padding: '15px 10px', justifyContent: 'flex-start' }}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            backgroundColor: colorPalette.primary,
                                                            height: 30,
                                                            gap: 2,
                                                            alignItems: 'center',
                                                            // width: 100,
                                                            borderRadius: 2,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', backgroundColor: statusColor(item?.status), padding: '0px 5px', height: '100%', borderRadius: '8px 0px 0px 8px' }} />
                                                        <Text small bold>{item?.status}</Text>
                                                    </Box>
                                                </TableCell>
                                                {isProfissional ?
                                                    <>
                                                        <TableCell sx={{ padding: '15px 0px', textAlign: 'center' }}>
                                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                                <Button secondary text="prontuário" small
                                                                    onClick={() => handleRowClick(item?.id_consulta)}
                                                                />
                                                                <Box sx={{ display: 'flex', height: '30px', width: '2px', backgroundColor: colorPalette?.primary }} />
                                                                <FormControlLabel small
                                                                    control={
                                                                        <Switch checked={pay} name="pago" size="small" onChange={(e) => handleUpdateStatus(e, item?.id_consulta)} />
                                                                    }
                                                                    label="pago"
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                    </>
                                                    :
                                                    <>
                                                        <TableCell sx={{ padding: '15px 0px', textAlign: 'center' }}>
                                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                                {/* <Button text="remarcar" small disabled={!canUncheck}
                                                                onClick={() => {
                                                                    getProfissionalAgendas(item?.profissional_id, item?.data)
                                                                    setDateSelected({ ...dateSelected, consultId: item?.id_consulta })
                                                                }}
                                                            /> */}

                                                                <Box sx={{
                                                                    display: 'flex', gap: 1, padding: '5px 12px', alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: '.3s',
                                                                    opacity: !canUncheck && .6,
                                                                    backgroundColor: canUncheck && colorPalette?.buttonColor,
                                                                    border: !canUncheck && `1px solid ${colorPalette?.buttonColor}`, borderRadius: 2,
                                                                    "&:hover": {
                                                                        opacity: canUncheck && 0.8,
                                                                        cursor: canUncheck && 'pointer'
                                                                    }
                                                                }}
                                                                    onClick={() => {
                                                                        if (canUncheck) {
                                                                            getProfissionalAgendas({ profissionalId: item?.profissional_id, dateConsult: item?.data, consultId: item?.id_consulta })
                                                                            setDateSelected({ ...dateSelected, consultId: item?.id_consulta })
                                                                        }
                                                                    }}>
                                                                    <Box sx={{
                                                                        ...styles.menuIcon,
                                                                        width: 14,
                                                                        height: 14,
                                                                        backgroundImage: `url('/icons/remarcar_icon.png')`,
                                                                        transition: '.3s',
                                                                    }} />
                                                                    <Text bold style={{ color: !canUncheck ? colorPalette?.buttonColor : '#fff' }}>Remarcar</Text>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', height: '30px', width: '2px', backgroundColor: colorPalette?.primary }} />
                                                                {/* <Button cancel secondary text="cancelar" small disabled={!canUncheck}
                                                                onClick={() => handleCancelAppointment({ consultId: item?.id_consulta })}
                                                            /> */}
                                                                <Box sx={{
                                                                    display: 'flex', gap: 1, padding: '5px 12px', alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: '.3s',
                                                                    opacity: !canUncheck && .6,
                                                                    backgroundColor: canUncheck && 'red',
                                                                    border: !canUncheck && '1px solid red', borderRadius: 2,
                                                                    "&:hover": {
                                                                        opacity: canUncheck && 0.8,
                                                                        cursor: canUncheck && 'pointer'
                                                                    }
                                                                }} onClick={() => {
                                                                    if (canUncheck) {
                                                                        if (!isWithin24Hours(item?.data)) {
                                                                            handleCancelAppointment({ consultId: item?.id_consulta })
                                                                        } else {
                                                                            alert.info('Não é possível cancelar a consulta com menos de 24hrs de antecedência.')
                                                                        }
                                                                    }
                                                                }}>
                                                                    <Box sx={{
                                                                        ...styles.menuIcon,
                                                                        width: 14,
                                                                        height: 14,
                                                                        backgroundImage: `url('/icons/cancelar_icon.png')`,
                                                                        transition: '.3s',
                                                                    }} />
                                                                    <Text bold style={{ color: !canUncheck ? 'red' : '#fff' }}>Cancelar</Text>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                    </>
                                                }
                                            </TableRow>
                                        );
                                    })

                                }
                            </TableBody>

                        </Table>
                        <Box sx={{
                            width: '100%', display: 'flex', gap: 2, backgroundColor: colorPalette?.secondary,
                            padding: '5px 12px', justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <Text light>Mostrando</Text>
                                <Text bold light>{data?.filter(filter)?.length || '0'}</Text>
                                <Text light>de</Text>
                                <Text bold light>{data?.length || 0}</Text>
                                <Text light>consultas</Text>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: '15px 12px', width: '100%', justifyContent: 'space-between' }}>
                                <PaginationTable data={data?.filter(filter)}
                                    page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                                />
                            </Box>
                        </Box>
                    </TableContainer>
                </ContentContainer >
            }

            <Backdrop open={loadingPayment?.active} sx={{ zIndex: 99999999999999 }}>
                <ContentContainer>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <>
                            {loadingPayment?.success && (
                                <>
                                    <CheckCircleIcon style={{ color: 'green', fontSize: 30 }} />
                                    <Text bold>{loadingPayment?.message}</Text>
                                    {loadingPayment.icon && <Box sx={{
                                        ...styles.menuIcon,
                                        width: 32,
                                        height: 32,
                                        backgroundImage: `url(${loadingPayment.icon})`,
                                        transition: '.3s',
                                    }} />}
                                </>
                            )
                            }
                            {loadingPayment?.error && (
                                <>
                                    <CancelIcon style={{ color: 'red', fontSize: 30 }} />
                                    <Text bold>{loadingPayment?.message}</Text>
                                </>
                            )}
                            {(!loadingPayment.error && !loadingPayment.success) &&
                                <>
                                    <CircularProgress />
                                    <Text bold>{loadingPayment?.message}</Text>
                                </>
                            }
                        </>
                    </Box>
                </ContentContainer>
            </Backdrop>

            <Backdrop open={showAgendas?.active} sx={{ zIndex: 999 }}>
                <ContentContainer style={{
                    maxWidth: { md: '800px', lg: '1980px' },
                    maxHeight: { md: '580px', lg: '600px', xl: '960px' },
                    overflow: 'auto'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text bold large>Remarcar Consulta</Text>
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
                            setShowAgendas({ active: false, profissionalId: null, profissionalData: {}, consultionDate: '' })
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
                                <Avatar src={showAgendas?.profissionalData?.location || ''} sx={{
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
                                    <Text bold large style={{ color: colorPalette.third }}>{showAgendas?.profissionalData?.nome}</Text>
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
                                }} onClick={() => router.push(`/users/perfil?profissionalId=${showAgendas?.profissionalData?.id}`)}>
                                    <Text bold small style={{ color: '#fff' }}>VER PERFIL</Text>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', height: '90px', width: '1px', backgroundColor: '#eaeaea' }} />
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
                                <Text bold large>Dados da agenda atual:</Text>
                                <Text light >{showAgendas?.consultionDate}</Text>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                            {
                                showAgendas?.profissionalData?.agenda?.length > 0 ?
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
                                                        onChange={(date) => handleSelectedDate(date, showAgendas?.profissionalData?.id)}
                                                        style={{
                                                            border: 'none'
                                                        }}
                                                        tileDisabled={({ date }) => !getAvailableDays(showAgendas?.profissionalData?.agenda)?.includes(moment(date).format("YYYY-MM-DD"))}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', height: `100%`, width: '2px', backgroundColor: '#eaeaea' }} />
                                                {(dateSelected?.day && dateSelected?.profissionalId === showAgendas?.profissionalData?.id)
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
                                                                {showAgendas?.profissionalData?.agenda?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
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
                            <Box sx={{ display: showAgendas?.profissionalData?.agenda?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                                <Box sx={{
                                    padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 150,
                                    marginTop: 3,
                                    transition: '.5s',
                                    gap: 2,
                                    backgroundColor: colorPalette.buttonColor,
                                    borderRadius: 2,
                                    opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === showAgendas?.profissionalData?.id) ? 1 : 0.5,
                                    "&:hover": {
                                        opacity: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === showAgendas?.profissionalData?.id) ? 1 : 0.5,
                                        cursor: 'pointer',
                                        transform: (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === showAgendas?.profissionalData?.id) ? 'scale(1.1, 1.1)' : 'none'
                                    }
                                }} onClick={() => {
                                    if (dateSelected?.reserva_id !== '' && dateSelected?.profissionalId === showAgendas?.profissionalData?.id) {
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

        </>
    )
}

const CardConsultion = ({ data, isProfissional, isPartner, handleRowClick, handleUpdateStatus }) => {
    const { colorPalette } = useAppContext()

    const statusColor = (data) => ((data === 'Agendado' && 'yellow') ||
        (data === 'Cancelada' && 'red') ||
        (data === 'Atendida' && 'green') ||
        (data === 'Remarcada' && 'blue'))

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{
                gap: 2, display: 'flex', padding: 5,
                flexDirection: 'column', width: '100%'
            }}>
                {
                    data?.sort((a, b) => new Date(b.data) - new Date(a.data))?.map((item, index) => {
                        const pay = parseInt(item?.pago) === 1;
                        const currentDate = new Date()
                        const canUncheck = (item?.status !== 'Cancelada') && (new Date(item?.data) > currentDate);

                        return (
                            <Box key={`${item}-${index}`} sx={{
                                transition: '.3s',
                                backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2
                            }}>
                                <Box sx={{ padding: '8px 25px', justifyContent: 'flex-start' }}>
                                    <Text bold>Data: </Text>
                                    <Text>{formatTimeStamp(item?.data, true) || '-'}</Text>
                                </Box>
                                <Tooltip title={isPartner ? item?.paciente : isProfissional ? item?.paciente : item?.profissional}>
                                    <Box sx={{
                                        padding: '15px 10px', textAlign: 'center', justifyContent: 'flex-start', display: 'flex',
                                        alignItems: 'start', gap: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                                            <Avatar src={isPartner ? item?.url_foto_pac : item?.url_foto_prof || ''} sx={{
                                                height: { xs: 60, sm: 30, md: 30, lg: 30 },
                                                width: { xs: 60, sm: 30, md: 30, lg: 30 },
                                            }} variant="rounded"
                                            />
                                            <Box sx={{
                                                display: 'flex', alignItems: 'start', gap: 1, justifyContent: 'flex-start',
                                                flexDirection: 'column',
                                            }}>
                                                {isProfissional ? <Text bold>Paciente: </Text> : <Text bold>Profissional: </Text>}

                                                <Text style={{
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                }}>{isPartner ? item?.paciente : isProfissional ? item?.paciente : item?.profissional || '-'}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Tooltip>
                                {isPartner &&
                                    <Tooltip title={item?.profissional}>
                                        <Box sx={{
                                            padding: '15px 10px', textAlign: 'center',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                <Avatar src={item?.url_foto_prof || ''} sx={{
                                                    height: { xs: 60, sm: 30, md: 30, lg: 30 },
                                                    width: { xs: 60, sm: 30, md: 30, lg: 30 },
                                                }} variant="rounded"
                                                />
                                                <Text style={{
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                }}>{item?.profissional || '-'}</Text>
                                            </Box>
                                        </Box>
                                    </Tooltip>}
                                <Box sx={{ padding: '15px 10px', justifyContent: 'flex-start' }}>
                                    <Text bold>Encontro: </Text>
                                    <Text>{item?.modalidade || '-'}</Text>
                                </Box>
                                <Box sx={{ padding: '15px 10px', justifyContent: 'flex-start' }}>
                                    <Text bold>Status: </Text>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            backgroundColor: colorPalette.primary,
                                            height: 30,
                                            gap: 2,
                                            alignItems: 'center',
                                            // width: 100,
                                            borderRadius: 2,
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', backgroundColor: statusColor(item?.status), padding: '0px 5px', height: '100%', borderRadius: '8px 0px 0px 8px' }} />
                                        <Text small bold>{item?.status}</Text>
                                    </Box>
                                </Box>
                                {isProfissional ?
                                    <>
                                        <Box sx={{ padding: '15px 0px', textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                <Button secondary text="prontuário" small
                                                    onClick={() => handleRowClick(item?.id_consulta)}
                                                />
                                                <Box sx={{ display: 'flex', height: '30px', width: '2px', backgroundColor: colorPalette?.primary }} />
                                                <FormControlLabel small
                                                    control={
                                                        <Switch checked={pay} name="pago" size="small" onChange={(e) => handleUpdateStatus(e, item?.id_consulta)} />
                                                    }
                                                    label="pago"
                                                />
                                            </Box>
                                        </Box>
                                    </>
                                    :
                                    <>
                                        <Box sx={{ padding: '15px 0px', textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>

                                                <Box sx={{
                                                    display: 'flex', gap: 1, padding: '5px 12px', alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: '.3s',
                                                    opacity: !canUncheck && .6,
                                                    backgroundColor: canUncheck && colorPalette?.buttonColor,
                                                    border: !canUncheck && `1px solid ${colorPalette?.buttonColor}`, borderRadius: 2,
                                                    "&:hover": {
                                                        opacity: canUncheck && 0.8,
                                                        cursor: canUncheck && 'pointer'
                                                    }
                                                }}
                                                    onClick={() => {
                                                        if (canUncheck) {
                                                            getProfissionalAgendas({ profissionalId: item?.profissional_id, dateConsult: item?.data, consultId: item?.id_consulta })
                                                            setDateSelected({ ...dateSelected, consultId: item?.id_consulta })
                                                        }
                                                    }}>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        width: 14,
                                                        height: 14,
                                                        backgroundImage: `url('/icons/remarcar_icon.png')`,
                                                        transition: '.3s',
                                                    }} />
                                                    <Text bold style={{ color: !canUncheck ? colorPalette?.buttonColor : '#fff' }}>Remarcar</Text>
                                                </Box>

                                                <Box sx={{ display: 'flex', height: '30px', width: '2px', backgroundColor: colorPalette?.primary }} />
                                                {/* <Button cancel secondary text="cancelar" small disabled={!canUncheck}
                                                    onClick={() => handleCancelAppointment({ consultId: item?.id_consulta })}
                                                /> */}
                                                <Box sx={{
                                                    display: 'flex', gap: 1, padding: '5px 12px', alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: '.3s',
                                                    opacity: !canUncheck && .6,
                                                    backgroundColor: canUncheck && 'red',
                                                    border: !canUncheck && '1px solid red', borderRadius: 2,
                                                    "&:hover": {
                                                        opacity: canUncheck && 0.8,
                                                        cursor: canUncheck && 'pointer'
                                                    }
                                                }} onClick={() => {
                                                    if (canUncheck) {
                                                        if (!isWithin24Hours(item?.data)) {
                                                            handleCancelAppointment({ consultId: item?.id_consulta })
                                                        } else {
                                                            alert.info('Não é possível cancelar a consulta com menos de 24hrs de antecedência.')
                                                        }
                                                    }
                                                }}>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        width: 14,
                                                        height: 14,
                                                        backgroundImage: `url('/icons/cancelar_icon.png')`,
                                                        transition: '.3s',
                                                    }} />
                                                    <Text bold style={{ color: !canUncheck ? 'red' : '#fff' }}>Cancelar</Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                }
                            </Box>
                        );
                    })

                }
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
