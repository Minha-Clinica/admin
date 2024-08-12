import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, TablePagination } from "@mui/material"
import { api } from "../../api/api"
import { SectionHeader, SelectList, Table_V1 } from "../../organisms"
import { ContentContainer, Text, TextInput } from "../../atoms"
import { useAppContext } from "../../context/AppContext"

export default function ListCompany(props) {
    const [companyList, setCompanyList] = useState([])
    const [filters, setFilters] = useState({
        status: 'todos'
    })
    const [filterData, setFilterData] = useState('')
    const { setLoading, colorPalette, userPermissions, menuItemsList } = useAppContext()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterAtive, setFilterAtive] = useState('todos')
    const [firstRender, setFirstRender] = useState(true)
    const [filtersOrders, setFiltersOrders] = useState({
        filterName: 'nome_empresa',
        filterOrder: 'asc'
    })
    const router = useRouter()
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)


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
    const filterFunctions = {
        status: (item) => filters.status === 'todos' || item.ativo === filters.status,
    };

    const filter = (item) => {
        return Object.values(filterFunctions).every(filterFunction => filterFunction(item));
    };

    useEffect(() => {
        fetchPermissions()
        getCompany();
        if (window.localStorage.getItem('list-institution-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-institution-filters') || null);
            setFiltersOrders({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
    }, []);



    useEffect(() => {
        if (firstRender) return setFirstRender(false);
        window.localStorage.setItem('list-institution-filters', JSON.stringify({ filterName: filters.filterName, filterOrder: filters.filterOrder }));
    }, [filters])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;


    const sortCompany = () => {
        const { filterName, filterOrder } = filters;

        const sortedCompanies = [...companyList].sort((a, b) => {
            const valueA = filterName === 'id_empresa' ? Number(a[filterName]) : (a[filterName] || '').toLowerCase();
            const valueB = filterName === 'id_empresa' ? Number(b[filterName]) : (b[filterName] || '').toLowerCase();

            if (filterName === 'id_empresa') {
                return filterOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return filterOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        return sortedCompanies;
    }

    const getCompany = async () => {
        setLoading(true)
        try {
            const response = await api.get('/companies')
            const { data = [] } = response;
            console.log(response)
            setCompanyList(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const column = [
        { key: 'id_empresa', label: 'ID' },
        { key: 'dt_criacao', label: 'Criado em', date: true },
        { key: 'responsavel', label: 'E-mail' },
        { key: 'razao_social', label: 'Empresa' },

    ];

    const listAtivo = [
        { label: 'Todos', value: 'todos' },
        { label: 'Ativo', value: 1 },
        { label: 'Inativo', value: 0 },
    ]

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text veryLarge bold>Empresas</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar por empresa" name='filterData' type="search"
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
                            backgroundImage: `url('/icons/commission.png')`,
                            transition: '.3s',
                        }} />
                        <Text bold style={{ color: '#fff' }}>Nova Empresa</Text>
                    </Box>
                </Box>
            </Box>
            {companyList?.length >= 1 ?
                <Table_V1 data={sortCompany()?.filter(filter)} columns={column} columnId={'id_empresa'} filters={filtersOrders} onPress={(value) => setFiltersOrders(value)} onFilter />
                :
                <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', padding: '80px 40px 0px 0px' }}>
                    <Text bold>Não consegui encontrar empresas cadastradas</Text>
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