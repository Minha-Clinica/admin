import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { getConsultionPerfil } from "../../validators/api-requests"
import { useAppContext } from "../../context/AppContext"
import { SelectList } from "../../organisms/select/SelectList"
import { TablePagination } from "@mui/material"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Avatar } from "@mui/material";
import { api } from "../../api/api"
import { icons } from "../../organisms/layout/Colors"

export default function ListConsultions(props) {
    const [consultionList, setConsultion] = useState([])
    const [filterData, setFilterData] = useState('')
    const [perfil, setPerfil] = useState('todos')
    const { setLoading, colorPalette, menuItemsList, userPermissions } = useAppContext()
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

        const normalizedFilterData = normalizeString(filterData);

        return (
            Object.values(userFilterFunctions).every(userFilterFunction => userFilterFunction(item)) &&
            (
                normalizeString(item?.profissional)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
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
            const response = await api.get(`/consultions`)
            console.log(response)
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
                newButton={isPermissionEdit}
                newButtonAction={() => router.push(`/${pathname}/new`)}
            />
            {/* <Text bold>Buscar por: </Text> */}
            <ContentContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                    <Text bold large>Filtros</Text>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Text style={{ color: '#d6d6d6' }} light>Mostrando</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{consultionList?.filter(filter)?.length || '0'}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>de</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{consultionList?.length || 0}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>consultas</Text>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                        <TextInput placeholder="Buscar pelo profissional.." name='filterData' type="search" onChange={(event) => setFilterData(event.target.value)} value={filterData} sx={{ flex: 1 }} />
                    </Box>
                    <TablePagination
                        component="div"
                        count={sortConsultion()?.filter(filter)?.length}
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
            {/* {
                consultionList?.filter(filter)?.length > 0 ?
                    <Table data={sortConsultion()?.filter(filter).slice(startIndex, endIndex)} columns={column} columnId={'id'} enrollmentsCount={true} filters={filters} onPress={(value) => setFilters(value)} onFilter />
                    :
                    <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', padding: '80px 40px 0px 0px' }}>
                        <Text bold>Não foi encontrado consultas</Text>
                    </Box>
            } */}
            <TableConsultion data={sortConsultion()?.filter(filter).slice(startIndex, endIndex)} columns={column} columnId={'id'} enrollmentsCount={true} filters={filters} onPress={(value) => setFilters(value)} onFilter />

        </>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { } }) => {
    const { setLoading, colorPalette, theme, user } = useAppContext()

    const columns = [
        { key: 'dt_consulta', label: 'Data' },
        { key: 'profissional', label: 'Profissional' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'situacao', label: 'Status' }
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
