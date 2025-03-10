import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms"
import { useAppContext } from "../../context/AppContext"
import { SelectList } from "../../organisms/select/SelectList"
import { Avatar, Backdrop, CircularProgress, TablePagination, useMediaQuery, useTheme } from "@mui/material"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { api } from "../../api/api"
import 'react-calendar/dist/Calendar.css';
import { icons } from "../../organisms/layout/Colors";
import { formatTimeStamp } from "../../helpers"

export default function ListConsultions(props) {
    const [reportData, setReportData] = useState([])
    const [filterData, setFilterData] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    const { setLoading, colorPalette, menuItemsList, userPermissions, user } = useAppContext()
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [firstRender, setFirstRender] = useState(true)
    const [loadingData, setLoadingData] = useState(true)
    const [filters, setFilters] = useState({
        filterName: 'nome',
        filterOrder: 'asc'
    })
    const [filtersField, setFiltersField] = useState({
        startDate: '',
        endDate: '',
        status_pagamento: '',
        status: '',
        paciente_id: '',
    })
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    const isAdministrator = user?.perfil?.includes('profissional') || user?.perfil?.includes('administrador')
    const profissionalId = 125;

    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);
        const normalizedName = normalizeString(item.paciente);

        if (!filterData || filterData.trim() === '') {
            return true
        }

        // Caso contrário, aplique o filtro normalmente
        return normalizedName?.toLowerCase().includes(normalizedFilterData?.toLowerCase());
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

    const getEmployees = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/users`)
            const { data = [] } = response;
            if (data?.length > 0) {
                const employeeMap = data.map((item) => ({
                    label: item.nome,
                    value: item.id,
                    email: item.email
                })).sort((a, b) => a.label.localeCompare(b.label))
                setUsers(employeeMap)
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        setLoading(true)
        fetchReport();
        fetchPermissions()
        getEmployees()
        if (window.localStorage.getItem('list-consultion-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-consultion-filters') || null);
            setFilters({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
        setLoading(false)

    }, []);

    const fetchReport = async (filtersData) => {
        setLoadingData(true);
        try {

            const response = await api.get(`/report/sessions/${profissionalId}`, {
                params: {
                    date: {
                        startDate: filtersData ? filtersData.startDate : filtersField.startDate,
                        endDate: filtersData ? filtersData.endDate : filtersField.endDate
                    },
                    status_pagamento: filtersData ? filtersData.status_pagamento : filtersField.status_pagamento,
                    status: filtersData ? filtersData.status : filtersField.status,
                    paciente_id: filtersData ? filtersData.paciente_id : filtersField.paciente_id
                }
            });
            const { data = [] } = response;

            console.log(data)
            if (Array.isArray(data) && data.length > 0) {
                setReportData(data);
            } else {
                setReportData([]); // Certifique-se de definir um array vazio se os dados não forem um array ou estiverem vazios
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setLoadingData(false);
        }
    };



    useEffect(() => {
        if (firstRender) return setFirstRender(false);
        window.localStorage.setItem('list-consultion-filters', JSON.stringify({ filterName: filters.filterName, filterOrder: filters.filterOrder }));
    }, [filters])


    const sortReport = () => {
        const { filterName, filterOrder } = filters;

        const sortedReport = [...reportData].sort((a, b) => {
            const valueA = (a[filterName] || '').toLowerCase();
            const valueB = (b[filterName] || '').toLowerCase();

            return filterOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        return sortedReport;
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

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4, }}>
            <Box sx={{
                display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }
            }}>
                <Text veryLarge bold>Relatórios de Sessões ({reportData?.filter(filter)?.length})</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar por paciente" name='filterData' type="search"
                        onChange={(event) => setFilterData(event.target.value)} value={filterData}
                        InputProps={{
                            style: {
                                width: mobile ? 'auto' : 400,
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
                    }} onClick={() => setShowFilters(!showFilters)}>
                        <Box sx={{
                            ...styles.menuIcon,
                            width: 20,
                            height: 20,
                            backgroundImage: `url('/icons/row.png')`,
                        }} />
                    </Box>
                </Box>
            </Box>

            <Backdrop open={showFilters} sx={{ display: 'flex', justifyContent: 'flex-end', zIndex: 999 }}>
                <Box sx={{ position: 'relative', display: 'flex', gap: 2, width: '400px', marginTop: 20, height: '100%', flexDirection: 'column', padding: '20px 25px', backgroundColor: colorPalette.secondary }}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', width: '100%', justifyContent: 'space-between',
                        paddingTop: 2
                    }}>
                        <Text bold={true} large={true}>Filtros</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            width: 17,
                            height: 17,
                            aspectRatio: '1/1',
                            backgroundImage: `url(${icons.gray_close})`,
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} onClick={() => setShowFilters(false)} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column', marginTop: 5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextInput label="De:" name='startDate' onChange={(e) => setFiltersField({ ...filtersField, startDate: e.target.value })} type="date" value={(filtersField?.startDate)?.split('T')[0] || ''} sx={{ flex: 1, }} />
                            <TextInput label="Até:" name='endDate' onChange={(e) => setFiltersField({ ...filtersField, endDate: e.target.value })} type="date" value={(filtersField?.endDate)?.split('T')[0] || ''} sx={{ flex: 1, }} />
                        </Box>

                        <SelectList
                            data={[
                                { label: 'Agendado', value: 'Agendado' },
                                { label: 'Concluído', value: 'Concluído' },
                                { label: 'Remarcado', value: 'Remarcado' },
                                { label: 'Cancelado', value: 'Cancelada' }
                            ]}
                            valueSelection={filtersField?.status}
                            onSelect={(value) => setFiltersField({ ...filtersField, status: value })}
                            title="Status: "
                            filterOpition="value"
                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                        />

                        {isAdministrator && <SelectList
                            data={[
                                { label: 'Pago', value: 'Pago' },
                                { label: 'Não Pago', value: 'Não Pago' }
                            ]}
                            valueSelection={filtersField?.status_pagamento}
                            onSelect={(value) => setFiltersField({ ...filtersField, status_pagamento: value })}
                            title="Status de Pagamento: "
                            filterOpition="value"
                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                        />}


                        <SelectList
                            fullWidth
                            autoComplete
                            data={users}
                            valueSelection={filtersField.paciente_id}
                            onSelect={(value) => {
                                setFiltersField({
                                    ...filtersField, paciente_id: value,
                                })
                            }}
                            title="Selecione um paciente:"
                            filterOpition="value"
                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                        />

                    </Box>

                    <Divider />
                    <Box sx={{ display: 'flex', width: '350px', borderTop: `1px solid ${colorPalette.primary}`, position: 'fixed', bottom: 0, padding: '15px', gap: 2, justifyContent: 'space-between' }}>
                        <Button secondary text="Limpar" style={{ width: `100%` }} onClick={() => {
                            setFiltersField({
                                startDate: '',
                                endDate: '',
                                status_pagamento: '',
                                status: '',
                                paciente_id: '',
                            })
                            fetchReport({
                                startDate: '',
                                endDate: '',
                                status_pagamento: '',
                                status: '',
                                paciente_id: '',
                            })
                            setShowFilters(false)
                        }} />
                        <Button text="Filtrar" style={{ width: `100%` }} onClick={() => {
                            fetchReport()
                            setShowFilters(false)
                        }} />
                    </Box>
                </Box>
            </Backdrop>


            {loadingData &&
                <Box sx={styles.loadingContainer}>
                    <CircularProgress />
                </Box>}

            {(reportData?.length > 0 && reportData) ?

                <Box sx={{ opacity: loadingData ? 0.6 : 1 }}>

                    <Box sx={{
                        width: '100%', display: 'flex', gap: 2,
                        marginBottom: 2
                    }}>
                        {(filtersField.startDate && filtersField.endDate) &&
                            <Box sx={{
                                display: 'flex', gap: 0.5, alignItems: 'center', backgroundColor: colorPalette?.secondary,
                                padding: '12px 12px',
                                borderRadius: 2
                            }}>
                                <Text bold>Período Filtrado: </Text>
                                <Text light>{formatTimeStamp(filtersField.startDate)} até {formatTimeStamp(filtersField.endDate)}</Text>
                            </Box>
                        }

                        {filtersField.status &&
                            <Box sx={{
                                display: 'flex', gap: 0.5, alignItems: 'center', backgroundColor: colorPalette?.secondary,
                                padding: '12px 12px',
                                borderRadius: 2
                            }}>
                                <Text bold>Status Filtrado: </Text>
                                <Text light>{filtersField.status}</Text>
                            </Box>
                        }

                        {filtersField.paciente_id &&
                            <Box sx={{
                                display: 'flex', gap: 0.5, alignItems: 'center', backgroundColor: colorPalette?.secondary,
                                padding: '12px 12px',
                                borderRadius: 2
                            }}>
                                <Text bold>Paciente Filtrado: </Text>
                                <Text light>{users?.find(user => user.id === filtersField.paciente_id)?.label}</Text>
                            </Box>
                        }
                    </Box>

                    <TableConsultion data={sortReport()?.filter(filter).slice(startIndex, endIndex)} setReportData={setReportData}
                        callBack={() => {
                            fetchReport()
                        }}
                        setLoadingPayment={setLoadingPayment}
                        loadingPayment={loadingPayment}
                        filter={filter}
                        setPage={setPage}
                        setRowsPerPage={setRowsPerPage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        filters={filters} onPress={(value) => setFilters(value)} />

                    <Box sx={{
                        width: '100%', display: 'flex', gap: 2, backgroundColor: colorPalette?.secondary,
                        padding: '5px 12px', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
                    }}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Text light>Mostrando</Text>
                            <Text bold light>{reportData?.filter(filter)?.length || '0'}</Text>
                            <Text light>de</Text>
                            <Text bold light>{reportData?.filter(filter)?.length || 0}</Text>
                            <Text light>sessões</Text>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: '15px 12px' }}>
                            <TablePagination
                                component="div"
                                count={sortReport()?.filter(filter)?.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                style={{ color: colorPalette.textColor }} // Define a cor do texto
                                backIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de voltar
                                nextIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de avançar
                            />
                        </Box>
                    </Box>
                </Box>
                :
                <Text>Não exitem dados.</Text>}

        </Box>
    )
}

const TableConsultion = ({ data = [], filters = [], onPress = () => { } }) => {
    const { setLoading, colorPalette, mobile, user, alert, setShowConfirmationDialog } = useAppContext()
    const isProfissional = user?.perfil?.includes('profissional')
    const isAdministrator = user?.perfil?.includes('administrador')

    let columns = [
        { key: 'paciente', label: 'Paciente' },
        { key: 'email_paciente', label: 'E-mail', avatar: 'url_foto_pac' },
        { key: 'agendadas', label: 'Agendadas' },
        { key: 'remarcadas', label: 'Remarcadas' },
        { key: 'concluidas', label: 'Concluidas' },
        { key: 'canceladas', label: 'Canceladas' },
        { key: 'total_sessoes', label: 'Qnt Sessões (Período)' },
        { key: 'actions', label: 'Ações' }
    ];


    return (
        <ContentContainer sx={{ display: 'flex', width: '100%', padding: 0, backgroundColor: colorPalette.primary, boxShadow: 'none', borderRadius: 2 }}>
            <TableContainer sx={{ borderRadius: '8px', overflow: 'auto', }}>
                <Table sx={{ borderCollapse: 'collapse', width: '100%', }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: `1px solid lightgray`, backgroundColor: colorPalette?.secondary }}>
                            {columns.map((column, index) => (
                                <TableCell key={index} sx={{ padding: '16px 10px', }}>
                                    <Box sx={{
                                        display: 'flex', gap: 1, alignItems: 'center', justifyContent: column.key !== "actions" ?
                                            'flex-start' : 'center', justifyContent: 'center'
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
                                return (
                                    <TableRow key={`${item}-${index}`} sx={{
                                        transition: '.3s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.primary + '88',
                                        },
                                    }}>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column', alignItems: 'center' }}>
                                                <Avatar
                                                    isBordered
                                                    radius="full"
                                                    size="md"
                                                    src={item?.url_foto_pac || ''}
                                                />
                                                <Text>{item.paciente}</Text>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.email_paciente || 'Sem informação'}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.agendadas}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.remarcadas}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.concluidas}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.canceladas}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Text>{item.total_sessoes}</Text>
                                        </TableCell>
                                        <TableCell sx={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <Button small text="Emitir Cobrança" style={{ width: `100%` }} onClick={() => {
                                                console.log('emitindo..')
                                            }} />
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
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        heigth: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
}
