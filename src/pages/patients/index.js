import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Text, TextInput } from "../../atoms"
import { PaginationTable, SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { TablePagination } from "@mui/material"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Avatar } from "@mui/material";
import { api } from "../../api/api"
import { icons } from "../../organisms/layout/Colors"
import { formatTimeStamp } from "../../helpers"

export default function ListPatients(props) {
    const [patientsList, setPatients] = useState([])
    const [filterData, setFilterData] = useState('')
    const { setLoading, colorPalette, menuItemsList, userPermissions, user } = useAppContext()
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


    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);

        return (
            normalizeString(item?.paciente)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
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
        getPatients();
        fetchPermissions()
        if (window.localStorage.getItem('list-consultion-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-consultion-filters') || null);
            setFilters({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
    }, []);

    const getPatients = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/consultation/patients/profissional/${user?.id}`)
            const { data = [] } = response;
            setPatients(data)
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

        const sortedConsultion = [...patientsList].sort((a, b) => {
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
            <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text veryLarge bold>Meus Pacientes</Text>
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
                        display: 'flex', padding: '12px', borderRadius: 3, backgroundColor: colorPalette?.secondary,
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
                        display: 'flex', padding: '12px', borderRadius: 3, backgroundColor: colorPalette?.secondary,
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
            <TableConsultion data={patientsList?.filter(filter)?.slice(startIndex, endIndex)}
                filter={filter}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage} />

        </Box>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { },
    filter,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage }) => {
    const { setLoading, colorPalette, theme, user } = useAppContext()

    const columns = [
        { key: 'ultima_consulta', label: 'Ultima Sessão' },
        { key: 'proxima_consulta', label: 'Proxima Sessão' },
        { key: 'paciente', label: 'Paciente ' },
        { key: 'modalidade', label: 'Atendimento' },
        { key: 'actions', label: 'Ações' },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const router = useRouter();
    const menu = router.pathname === '/' ? null : router.asPath.split('/')[1]
    const subMenu = router.pathname === '/' ? null : router.asPath.split('/')[2]

    const handleRowClick = (id) => {
        window.open(`/patients/${id}`, '_blank');
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
        <ContentContainer sx={{ display: 'flex', width: '100%', padding: 0, backgroundColor: colorPalette.primary, boxShadow: 'none', borderRadius: 2 }}>

            <TableContainer sx={{ borderRadius: '8px', overflow: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: `1px solid lightgray`, backgroundColor: colorPalette?.secondary }}>
                            {columns.map((column, index) => (
                                <TableCell key={index} sx={{ padding: '16px 20px' }}>
                                    <Box sx={{
                                        display: 'flex', gap: 1, alignItems: 'center', justifyContent: column.key !== "actions" ?
                                            'flex-start' : 'center'
                                    }}>
                                        <Text bold>{column.label}</Text>
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
                                                })} />
                                        }
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ flex: 1, padding: 5, backgroundColor: colorPalette.secondary }}>
                        {
                            data?.map((item, index) => {
                                return (
                                    <TableRow key={`${item}-${index}`} sx={{
                                        transition: '.3s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.primary + '88',
                                        },
                                    }}>
                                        <TableCell sx={{ padding: '8px 25px', justifyContent: 'flex-start' }}>
                                            <Text>{formatTimeStamp(item?.ultima_consulta, true) || '-'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px 25px', justifyContent: 'flex-start' }}>
                                            <Text>{formatTimeStamp(item?.proxima_consulta, true) || '-'}</Text>
                                        </TableCell>
                                        <Tooltip title={item?.paciente}>
                                            <TableCell sx={{
                                                padding: '15px 10px', justifyContent: 'flex-start'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                    <Avatar src={item?.avatar || ''} sx={{
                                                        height: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                        width: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                    }} variant="rounded"
                                                    />
                                                    <Text style={{
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                    }}>{item?.paciente || '-'}</Text>
                                                </Box>
                                            </TableCell>
                                        </Tooltip>
                                        <TableCell sx={{ padding: '15px 10px', justifyContent: 'flex-start' }}>
                                            <Text>{item?.modalidade || '-'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button secondary text="prontuário" small />
                                            </Box>
                                        </TableCell>
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
                        <Text light>sessões</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: '15px 12px', width: '100%', justifyContent: 'space-between' }}>
                        <PaginationTable data={data?.filter(filter)}
                            page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                        />
                    </Box>
                </Box>
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
