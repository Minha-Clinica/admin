import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { SelectList } from "../../organisms/select/SelectList"
import { CircularProgress, TablePagination } from "@mui/material"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Avatar } from "@mui/material";
import { api } from "../../api/api"
import { icons } from "../../organisms/layout/Colors"
import moment from "moment";
import "moment/locale/pt-br";
import { formatDate } from "../../helpers"


export default function ListProfissionals(props) {
    const [profissionalList, setProfissionals] = useState([])
    const [filterData, setFilterData] = useState('')
    const [perfil, setPerfil] = useState('todos')
    const { setLoading, colorPalette, menuItemsList, userPermissions } = useAppContext()
    const [filterAtive, setFilterAtive] = useState('todos')
    const [filterEnrollStatus, setFilterEnrollStatus] = useState('todos')
    const [firstRender, setFirstRender] = useState(true)
    const [dateSelected, setDateSelected] = useState({ day: '', hour: '', profissionalId: '', reserva_id: '' })
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
    const [loadingDate, setLoadingDate] = useState(false)

    moment.locale("pt-br");

    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);

        return (
            normalizeString(item?.nome)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
        );
    };


    const pathname = router.pathname === '/' ? null : router.asPath.split('/')[2]

    useEffect(() => {
        getProfissional();
        if (window.localStorage.getItem('list-consultion-filters')) {
            const admLocalStorage = JSON.parse(window.localStorage.getItem('list-consultion-filters') || null);
            setFilters({
                filterName: admLocalStorage?.filterName,
                filterOrder: admLocalStorage?.filterOrder
            })
        }
    }, []);

    const getProfissional = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/users/search/profissional`)
            const { data = [] } = response;
            setProfissionals(data)
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
                icon={'/icons/localized_icon.png'}
                title={`Buscar por Profissionais (${profissionalList?.filter(filter)?.length})`}

            />
            {/* <Text bold>Buscar por: </Text> */}
            <ContentContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                    <Text bold large>Filtros</Text>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Text style={{ color: '#d6d6d6' }} light>Mostrando</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{profissionalList?.filter(filter)?.length || '0'}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>de</Text>
                        <Text bold style={{ color: '#d6d6d6' }} light>{profissionalList?.length || 0}</Text>
                        <Text style={{ color: '#d6d6d6' }} light>consultas</Text>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                        <TextInput placeholder="Buscar pelo profissional.." name='filterData' type="search" onChange={(event) => setFilterData(event.target.value)} value={filterData} sx={{ flex: 1 }} />
                    </Box>
                    <TablePagination
                        component="div"
                        count={profissionalList?.filter(filter)?.length}
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

            <Text title bold style={{ color: colorPalette.buttonColor }}>Veja algum de Nossos profissionais Disponíveis:</Text>

            <ProfissionalCard
                data={profissionalList?.filter(filter)}
                loadingDate={loadingDate}
                setLoadingDate={setLoadingDate}
                dateSelected={dateSelected}
                setDateSelected={setDateSelected}
            />

        </>
    )
}


const ProfissionalCard = ({ data, loadingDate, setLoadingDate, dateSelected, setDateSelected }) => {

    const { setLoading, colorPalette, menuItemsList, userPermissions, alert } = useAppContext()
    moment.locale("pt-br");
    const router = useRouter()
    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleNext = (item) => {
        const horariosDisponiveis = item?.filter(agend => moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day);
        const newIndex = Math.min(carouselIndex + 2, horariosDisponiveis.length - 1);
        setCarouselIndex(newIndex);
    };

    const handlePrev = () => {
        const newIndex = Math.max(carouselIndex - 2, 0);
        setCarouselIndex(newIndex);
    };

    const horarios = (obj) => {
        const horaMoment = moment(obj);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
    }


    const handleSelectedDate = (value, id) => {
        setLoadingDate(true)
        try {
            if (dateSelected?.day === value) {
                setDateSelected({ day: '', hour: '', profissionalId: '', reserva_id: '' })
            } else {
                setDateSelected({ day: value, hour: '', profissionalId: id, reserva_id: '' })
            }
        } catch (error) {
            return error
        } finally {
            setLoadingDate(false)
        }
    }


    return (
        <>
            {data?.map((item, index) => {
                const name = item?.nome?.split(' ');
                const firstName = name[0];
                const lastName = name[name.length - 1];
                const userName = `${firstName} ${lastName}`;

                const agendasAgrupadas = {};
                item?.agenda?.forEach((agend) => {
                    const data = moment(agend.inicio).format("YYYY-MM-DD"); // Formata a data sem o horário

                    // Se a data já existir no objeto, adicione esta agenda ao array correspondente
                    if (agendasAgrupadas[data]) {
                        agendasAgrupadas[data].push(agend);
                    } else { // Caso contrário, crie um novo array com esta agenda
                        agendasAgrupadas[data] = [agend];
                    }
                });

                return (
                    <Box key={index} sx={{
                        display: 'flex', gap: 6, backgroundColor: colorPalette.secondary, padding: '15px', borderRadius: 2,
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`, position: 'relative', flexDirection: 'row'
                    }}>
                        <Box sx={{
                            display: 'flex',
                        }}>
                            <Avatar src={item?.location || ''} sx={{
                                height: { xs: '100%', sm: 45, md: 45, lg: 120 },
                                width: { xs: '100%', sm: 45, md: 45, lg: 120 },
                            }} variant="circular"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', flex: 1, }}>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start', padding: '10px 0px 0px 10px' }}>
                                <Text indicator bold style={{ color: colorPalette.third }}>{userName}</Text>
                                <Text light large bold>Formado em Terapia - TRG </Text>
                                <Text light large>São Paulo - SP </Text>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', padding: '8px 12px', borderRadius: 2, backgroundColor: colorPalette.primary, width: '200px' }}>
                                <Text bold>Duração de Atendimento</Text>
                                <Text bold title style={{ color: colorPalette.buttonColor }}>1 Hora</Text>
                            </Box>
                            <Box sx={{
                                padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                maxWidth: 200,
                                marginTop: 2,
                                transition: '.5s',
                                gap: 2,
                                backgroundColor: colorPalette.buttonColor,
                                borderRadius: 2,
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    transform: 'scale(1.1, 1.1)'
                                }
                            }}>
                                <Text bold style={{ color: '#fff' }}>VER PERFIL</Text>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', height: '100%', width: '1px', backgroundColor: 'lightgray' }} />

                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
                            {loadingDate ? <CircularProgress /> : <>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <Text bold large style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>AGENDA DÍSPONIVEL</Text>
                                </Box>
                                <Divider />
                                {item?.agenda?.length > 0 ?
                                    <>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                            <Text bold large style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>
                                                Selecione uma Data:</Text>
                                            <Box sx={{
                                                display: 'flex', "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: 'pointer',
                                                }
                                            }}>
                                                <Text light large style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>
                                                    Ver Calendário Completo</Text>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{
                                                ...styles.menuIcon,
                                                padding: '8px',
                                                margin: '0px 5px',
                                                backgroundImage: `url(${icons.gray_arrow_down})`,
                                                transform: 'rotate(90deg)',
                                                transition: '.3s',
                                                width: 18, height: 18,
                                                aspectRatio: '1/1',
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: 'pointer',
                                                    backgroundColor: colorPalette.primary
                                                }
                                            }} />
                                            {Object.entries(agendasAgrupadas).map(([data, agendas]) => {
                                                const selected = dateSelected?.day === data && dateSelected?.profissionalId === item?.id;
                                                const weekName = moment(data).format("ddd");
                                                const dateFormatted = moment(data).format("DD/MM");

                                                return (
                                                    <Box key={agendas} sx={{
                                                        display: 'flex', flexDirection: 'column', gap: .5, padding: '5px 12px', borderRadius: 2,
                                                        backgroundColor: selected ? colorPalette.buttonColor : colorPalette.primary, justifyContent: 'center',
                                                        "&:hover": {
                                                            opacity: 0.8,
                                                            cursor: 'pointer'
                                                        }
                                                    }} onClick={() => {
                                                        handleSelectedDate(data, item?.id);
                                                    }}>
                                                        <Text bold large style={{ color: selected && '#fff' }}>{weekName}</Text>
                                                        <Text large style={{ color: selected && '#fff' }}>{dateFormatted}</Text>
                                                    </Box>
                                                );
                                            })}
                                            <Box sx={{
                                                ...styles.menuIcon,
                                                padding: '8px',
                                                margin: '0px 5px',
                                                backgroundImage: `url(${icons.gray_arrow_down})`,
                                                transform: 'rotate(-90deg)',
                                                transition: '.3s',
                                                width: 18, height: 18,
                                                aspectRatio: '1/1',
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: 'pointer',
                                                    backgroundColor: colorPalette.primary
                                                }
                                            }} />
                                        </Box>
                                        {(dateSelected?.day && dateSelected?.profissionalId === item?.id) ?
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: colorPalette.buttonColor }}>Horários Disponíveis para {formatDate(dateSelected?.day)}</Text>
                                                <Box sx={{
                                                    display: 'flex', gap: 2, width: '100%', justifyContent: 'center', marginTop: 1,
                                                    alignItems: 'center'
                                                }}>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        padding: '8px',
                                                        margin: '0px 5px',
                                                        backgroundImage: `url(${icons.gray_arrow_down})`,
                                                        transform: 'rotate(90deg)',
                                                        transition: '.3s',
                                                        width: 18, height: 18,
                                                        aspectRatio: '1/1',
                                                        opacity: carouselIndex <= 0 ? 0.5 : 1,
                                                        pointerEvents: carouselIndex <= 0 ? 'none' : 'auto',
                                                        "&:hover": {
                                                            opacity: carouselIndex <= 0 ? 0.5 : 0.8,
                                                            cursor: carouselIndex <= 0 ? 'not-allowed' : 'pointer',
                                                            backgroundColor: colorPalette.primary
                                                        }
                                                    }} onClick={() => handlePrev(item?.agenda)} />
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', maxWidth: 350, overflow: 'hidden' }}>
                                                        {item?.agenda?.filter(agend => (moment(agend.inicio).format("YYYY-MM-DD") === dateSelected?.day) &&
                                                            (agend.disponivel === 0))
                                                            .slice(carouselIndex, carouselIndex + 3)?.map((hour, index) => {
                                                                const hourFormatted = horarios(hour.inicio)
                                                                const selected = dateSelected?.hour === hourFormatted;
                                                                return (
                                                                    <Box key={index} sx={{
                                                                        display: 'flex', flexDirection: 'column', gap: .5, padding: '5px 12px', borderRadius: 2,
                                                                        backgroundColor: selected ? colorPalette?.buttonColor : colorPalette.primary, justifyContent: 'center',
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
                                                                        <Text large bold={selected ? true : false} style={{ color: selected && '#fff' }}>{hourFormatted}</Text>
                                                                    </Box>
                                                                )
                                                            })}
                                                    </Box>
                                                    <Box sx={{
                                                        ...styles.menuIcon,
                                                        padding: '8px',
                                                        margin: '0px 5px',
                                                        backgroundImage: `url(${icons.gray_arrow_down})`,
                                                        transform: 'rotate(-90deg)',
                                                        transition: '.3s',
                                                        width: 18, height: 18,
                                                        aspectRatio: '1/1',
                                                        opacity: (carouselIndex * 2) >= item?.agenda?.length ? 0.5 : 1,
                                                        pointerEvents: (carouselIndex * 2) >= item?.agenda?.length ? 'none' : 'auto',
                                                        "&:hover": {
                                                            opacity: (carouselIndex * 2) >= item?.agenda?.length ? 0.5 : 0.8,
                                                            cursor: (carouselIndex * 2) >= item?.agenda?.length ? 'not-allowed' : 'pointer',
                                                            backgroundColor: colorPalette.primary
                                                        }
                                                    }} onClick={() => handleNext(item.agenda)} />
                                                </Box>
                                            </Box>
                                            :
                                            <></>
                                        }
                                    </> :
                                    <Text light large style={{ textAlign: 'center' }}>Profissional sem agenda disponível</Text>}
                            </>
                            }
                            <Box sx={{ display: item?.agenda?.length > 0 ? 'flex' : 'none', width: '100%', justifyContent: 'center' }}>
                                <Box sx={{
                                    padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 150,
                                    marginTop: 3,
                                    transition: '.5s',
                                    gap: 2,
                                    backgroundColor: colorPalette.buttonColor,
                                    borderRadius: 2,
                                    opacity: dateSelected?.reserva_id !== '' ? 1 : 0.5,
                                    "&:hover": {
                                        opacity: dateSelected?.reserva_id !== '' ? 1 : 0.5,
                                        cursor: 'pointer',
                                        transform: dateSelected?.reserva_id !== '' ? 'scale(1.1, 1.1)' : 'none'
                                    }
                                }} onClick={() => {
                                    if (dateSelected?.reserva_id === '') {
                                        alert.info('Selecione um horário antes de continuar.')
                                    } else {
                                        router.push(`/searchProfissional/${dateSelected?.reserva_id}?professionalId=${dateSelected?.profissionalId}`)
                                    }
                                }}>
                                    <Text bold style={{ color: '#fff' }}>Agendar</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )
            })}
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
