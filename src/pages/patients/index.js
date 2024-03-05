import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
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
            console.log(response)
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
        <>
            <SectionHeader
                icon={'https://minhaclinicatrindade.s3.amazonaws.com/video_conferencia.png'}
                title={`Meus Pacientes (${patientsList?.filter(filter)?.length})`}
            />
            <ContentContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                    <Text bold large>Filtros</Text>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Text style={{ color: '#d6d6d6' }} light>Mostrando</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{patientsList?.filter(filter)?.length || '0'}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>de</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{patientsList?.length || 0}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>pacientes</Text>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                        <TextInput placeholder="Buscar pelo paciente.." name='filterData' type="search" onChange={(event) => setFilterData(event.target.value)} value={filterData} sx={{ flex: 1 }} />
                    </Box>
                    <TablePagination
                        component="div"
                        count={patientsList?.filter(filter)?.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        style={{ color: colorPalette.textColor }} // Define a cor do texto
                        backIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de voltar
                        nextIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de avançar
                    />
                </Box>
            </ContentContainer>
            <TableConsultion data={patientsList?.filter(filter)?.slice(startIndex, endIndex)} />

        </>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { } }) => {
    const { setLoading, colorPalette, theme, user } = useAppContext()

    const columns = [
        { key: 'paciente', label: 'Paciente ' },
        { key: 'ultima_consulta', label: 'Ultima Consulta' },
        { key: 'proxima_consulta', label: 'Proxima Consulta' },
        { key: 'modalidade', label: 'Atendimento' },
        { key: 'actions', label: 'Ações' },
    ];

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
                        <TableRow sx={{ borderBottom: `2px solid ${colorPalette.buttonColor}` }}>
                            {columns.map((column, index) => (
                                <TableCell key={index} sx={{ padding: '16px', }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
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
                                        <Tooltip title={item?.paciente}>
                                            <TableCell sx={{
                                                padding: '15px 10px', textAlign: 'center',
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                                    <Avatar src={item?.avatar || ''} sx={{
                                                        height: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                        width: { xs: '100%', sm: 30, md: 30, lg: 30 },
                                                    }} variant="circular"
                                                    />
                                                    <Text style={{
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                    }}>{item?.paciente || '-'}</Text>
                                                </Box>
                                            </TableCell>
                                        </Tooltip>
                                        <TableCell sx={{ padding: '8px 10px', textAlign: 'center' }}>
                                            <Text>{formatTimeStamp(item?.ultima_consulta, true) || '-'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px 10px', textAlign: 'center' }}>
                                            <Text>{formatTimeStamp(item?.proxima_consulta, true) || '-'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
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
