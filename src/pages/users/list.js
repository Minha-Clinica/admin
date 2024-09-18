import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { getUsersPerfil } from "../../validators/api-requests"
import { useAppContext } from "../../context/AppContext"
import { SelectList } from "../../organisms/select/SelectList"
import { TablePagination } from "@mui/material"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import { api } from "../../api/api"

export default function ListUsers(props) {
    const [usersList, setUsers] = useState([])
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

    useEffect(() => {
        if (!user?.perfil?.includes('administrador')) {
            router.push('/')
        }
    }, [])


    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);

        return (
            Object.values(userFilterFunctions).every(userFilterFunction => userFilterFunction(item)) &&
            (
                normalizeString(item?.nome)?.toLowerCase().includes(normalizedFilterData?.toLowerCase()) ||
                normalizeString(item?.cpf)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
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

    const pathname = router.pathname === '/' ? null : router.asPath.split('/')[1]

    useEffect(() => {
        getUsers();
        fetchPermissions()
        if (window.localStorage.getItem('list-users-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-users-filters') || null);
            setFilters({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
    }, []);

    const getUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/users`)
            const { data = [] } = response;
            setUsers(data)
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }




    useEffect(() => {
        if (firstRender) return setFirstRender(false);
        window.localStorage.setItem('list-users-filters', JSON.stringify({ filterName: filters.filterName, filterOrder: filters.filterOrder }));
    }, [filters])


    const sortUsers = () => {
        const { filterName, filterOrder } = filters;

        const sortedUsers = [...usersList].sort((a, b) => {
            const valueA = filterName === 'id' ? Number(a[filterName]) : (a[filterName] || '').toLowerCase();
            const valueB = filterName === 'id' ? Number(b[filterName]) : (b[filterName] || '').toLowerCase();

            if (filterName === 'id') {
                return filterOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return filterOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        return sortedUsers;
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
        { key: 'perfil', label: 'Permissão' },
        { key: 'razao_social', label: 'Empresa' },
    ];


    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text veryLarge bold>Clientes ({usersList?.length})</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar por cliente" name='filterData' type="search"
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

                    <Box sx={{
                        display: 'flex', padding: '12px', borderRadius: 3, gap: 2, backgroundColor: colorPalette?.buttonColor,
                        transition: '.3s', boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => router.push(`/${pathname}/new`)}>
                        <Box sx={{
                            ...styles.menuIcon,
                            width: 20,
                            height: 20,
                            backgroundImage: `url('/icons/add-friend.png')`,
                            transition: '.3s',
                        }} />
                        <Text bold style={{ color: '#fff' }}>Novo Cliente</Text>
                    </Box>
                </Box>
            </Box>
            {
                usersList?.filter(filter)?.length > 0 ?
                    <>
                        <Table_V1 data={sortUsers()?.filter(filter).slice(startIndex, endIndex)} columns={column} columnId={'id'} enrollmentsCount={true} filters={filters} onPress={(value) => setFilters(value)} onFilter />
                        <TablePagination
                            component="div"
                            count={sortUsers()?.filter(filter)?.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            style={{ color: colorPalette.textColor }} // Define a cor do texto
                            backIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de voltar
                            nextIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de avançar
                        />
                    </>
                    :
                    <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', padding: '80px 40px 0px 0px' }}>
                        <Text bold>Não foi encontrado usuarios {perfil}</Text>
                    </Box>
            }
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
