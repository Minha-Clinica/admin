import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
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

export default function ListConsultions(props) {
    const [consultionList, setConsultion] = useState([])
    const [filterData, setFilterData] = useState('')
    const [perfil, setPerfil] = useState('todos')
    const { setLoading, colorPalette, menuItemsList, userPermissions, user } = useAppContext()
    const [filterAtive, setFilterAtive] = useState('todos')
    const [filterEnrollStatus, setFilterEnrollStatus] = useState('todos')
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
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)
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

        if (user?.perfil?.includes('profissional')) {
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
        setLoading(true)
        try {
            let query;
            if (user?.perfil?.includes('profissional')) {
                query = `/consultation/profissional/${user?.id}`
            }
            if (user?.perfil?.includes('paciente')) {
                query = `/consultation/pacient/${user?.id}`
            }

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
        <>
            <SectionHeader
                icon={'https://minhaclinicatrindade.s3.amazonaws.com/video_conferencia.png'}
                title={`Consultas (${consultionList?.filter(filter)?.length})`}
            />
            <ContentContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                        <TextInput placeholder="Buscar pelo profissional.." name='filterData' type="search" onChange={(event) => setFilterData(event.target.value)} value={filterData} sx={{ flex: 1 }} />
                    </Box>
                </Box>
            </ContentContainer>
            <TableConsultion data={consultionList?.filter(filter)?.slice(startIndex, endIndex)} setConsultion={setConsultion}
                callBack={() => getConsultion()}
                filter={filter}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage} />

        </>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { }, setConsultion, callBack = () => { },
    filter,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage
}) => {
    const { setLoading, colorPalette, theme, user, alert } = useAppContext()
    const isProfissional = user?.perfil?.includes('profissional')
    const [loadingPayment, setLoadingPayment] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleUpdateStatus = async (event, id) => {
        setLoadingPayment({ active: true, success: false, error: false });

        try {
            const { checked } = event.target;
            const valueUpdate = checked === true ? 1 : 0;
            const response = await api.patch(`/consultation/update/payment/${id}`, { valueUpdate });

            if (response.status === 200) {
                setTimeout(() => {
                    setLoadingPayment({ active: true, success: true, error: false });
                    setTimeout(async () => {
                        setLoadingPayment({ active: false, success: true, error: false });
                        await callBack();
                    }, 2000);
                    alert.success('Pagamento atualizado.');
                }, 2000);
            } else {
                setTimeout(() => {
                    setLoadingPayment({ active: true, success: false, error: true });
                    setTimeout(async () => {
                        setLoadingPayment({ active: false, success: false, error: true });
                    }, 3500);
                    alert.error('Ocorreu um erro ao atualizar pagamento.');
                }, 3500);
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setTimeout(() => {
                setLoadingPayment({ active: false, success: false, error: false });
            }, 5000);
        }
    };






    let columns = []

    if (isProfissional) {
        columns = [
            { key: 'data', label: 'Data' },
            { key: isProfissional ? 'paciente' : 'profissional', label: isProfissional ? 'Paciente ' : 'Profissional' },
            { key: 'modalidade', label: 'Tipo' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Ações' },
        ];
    } else {
        columns = [
            { key: 'data', label: 'Data' },
            { key: isProfissional ? 'paciente' : 'profissional', label: isProfissional ? 'Paciente ' : 'Profissional' },
            { key: 'modalidade', label: 'Tipo' },
            { key: 'status', label: 'Status' },
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

    return (
        <>
            <ContentContainer sx={{ display: 'flex', width: '100%', padding: 0, backgroundColor: colorPalette.primary, boxShadow: 'none', borderRadius: 2 }}>

                <TableContainer sx={{ borderRadius: '8px', overflow: 'auto', border: '1px solid lightgray' }}>
                    <Table sx={{ borderCollapse: 'collapse', width: '100%',  }}>
                        <TableHead>
                            <TableRow sx={{ borderBottom: `2px solid ${colorPalette.buttonColor}` }}>
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
                                data?.map((item, index) => {
                                    const pay = parseInt(item?.pago) === 1;

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
                                            <Tooltip title={isProfissional ? item?.paciente : item?.profissional}>
                                                <TableCell sx={{
                                                    padding: '15px 10px', textAlign: 'center',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                        <Avatar src={item?.url_foto_prof || ''} sx={{
                                                            height: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                            width: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                        }} variant="circular"
                                                        />
                                                        <Text style={{
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                        }}>{isProfissional ? item?.paciente : item?.profissional || '-'}</Text>
                                                    </Box>
                                                </TableCell>
                                            </Tooltip>
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
                                            {isProfissional &&
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
                                                </>}
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
                        <TablePagination
                            component="div"
                            count={data?.filter(filter)?.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            style={{ color: colorPalette.textColor }} // Define a cor do texto
                            backIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de voltar
                            nextIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de avançar
                        />
                    </Box>
                </TableContainer>
            </ContentContainer >

            <Backdrop open={loadingPayment?.active}>
                <ContentContainer>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <>
                            {loadingPayment?.success && (
                                <>
                                    <CheckCircleIcon style={{ color: 'green', fontSize: 30 }} />
                                    <Text bold>Status Alterado com Sucesso.</Text>
                                </>
                            )
                            }
                            {loadingPayment?.error && (
                                <>
                                    <CancelIcon style={{ color: 'red', fontSize: 30 }} />
                                    <Text bold>Ocorreu um erro ao alterar o status de pagamento. Tente novamente mais tarde.</Text>
                                </>
                            )}
                            {(!loadingPayment.error && !loadingPayment.success) &&
                                <>
                                    <CircularProgress />
                                    <Text bold>Alterando status de pagamento...</Text>
                                </>
                            }
                        </>
                    </Box>
                </ContentContainer>
            </Backdrop>



        </>
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
