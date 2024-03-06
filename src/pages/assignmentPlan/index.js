import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Text } from "../../atoms"
import { SectionHeader } from "../../organisms"
import { api } from "../../api/api"
import { useAppContext } from "../../context/AppContext"
import { formatTimeStamp } from "../../helpers"


export default function MenuAssignment(props) {
    const [filterData, setFilterData] = useState('')
    const { setLoading, colorPalette, userPermissions, menuItemsList, user, theme } = useAppContext()
    const [filters, setFilters] = useState({
        status: 'Finalizado',
        startDate: '',
        endDate: '',
        avaliation: 'com avaliacao'
    })
    const [filterAtive, setFilterAtive] = useState('todos')
    const [firstRender, setFirstRender] = useState(true)
    const [filtersOrders, setFiltersOrders] = useState({
        filterName: 'nome',
        filterOrder: 'asc'
    })
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    const pathname = router.pathname === '/' ? null : router.asPath.split('/')[2]
    const filterFunctions = {
        status: (item) => filters.status === 'todos' || item.status_chamado === filters.status,
        avaliation: (item) => {
            if (filters.avaliation === 'todos') {
                return true;
            } else if (filters.avaliation === 'com avaliacao') {
                return item.avaliacao_nota > 0;
            } else {
                return item.avaliacao_nota === null;
            }
        },
        date: (item) => (filters?.startDate !== '' && filters?.endDate !== '') ? rangeDate(item.vencimento, filters?.startDate, filters?.endDate) : item,
    };

    const rangeDate = (dateString, startDate, endDate) => {
        const date = new Date(dateString);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return date >= start && date <= end;
    }

    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);
        const normalizedTituloChamado = normalizeString(item.titulo_chamado);
        const normalizedIdChamado = item?.id_chamado?.toString();

        return (
            normalizedTituloChamado?.toLowerCase().includes(normalizedFilterData?.toLowerCase()) ||
            normalizedIdChamado?.includes(filterData.toString())
        ) && Object.values(filterFunctions).every(filterFunction => filterFunction(item));
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;


    const menuAssignmentPlan = [
        {
            id: '01', icon: '/icons/manager_subscription.png', title: 'Gerenciar Planos',
            description: 'Crie, edite e exclua os Planos do usuário.',
            to: '/assignmentPlan', queryId: false
        },
        {
            id: '02', icon: '/icons/subscription-model.png', title: 'Minhas Assinaturas',
            to: `/assignmentPlan/subscriptions`,
            description: 'Vizualize suas assinaturas, altere o plano atual, veja seus extratos e muito mais!',
            queryId: false
        },
        {
            id: '03', icon: '/icons/subscription.png', title: 'Planos de Assinatura',
            to: `/assignmentPlan/plans`, description: 'Veja os planos disponíveis para adquirir.',
            query: true
        },
    ]

    return (
        <>
            <SectionHeader
                title={`Gerenciar Assinaturas`}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                {menuAssignmentPlan?.map((item, index) => {
                    const routePush = item?.queryId ? `${item?.to}/${user?.id}` : item?.to
                    return (
                        <Box key={index} sx={{
                            display: 'flex', padding: '25px',
                            borderRadius: 2,
                            backgroundColor: colorPalette.secondary,
                            boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 2,
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer',
                                transform: 'scale(1.05, 1.05)'
                            }

                        }} onClick={() => router.push(routePush)}>
                            <Box sx={{
                                ...styles.menuIcon,
                                width: 30, height: 30, aspectRatio: '1/1',
                                backgroundImage: `url('${item?.icon}')`,
                                transition: '.3s'

                            }} />
                            <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                                <Text large bold>{item?.title}</Text>
                                <Text small light>{item?.description}</Text>
                            </Box>
                        </Box>
                    )
                })
                }
            </Box>

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
