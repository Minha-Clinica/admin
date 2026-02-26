import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Avatar, Backdrop, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, Divider } from "../../atoms"
import { PaginationTable, RadioItem, SectionHeader, Sectioner, SelectList, Table_V1 } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { formatCEP, formatCNPJ, formatTimeStamp } from "../../helpers"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import axios from "axios"
import { CopyAll } from '@mui/icons-material';
import { icons } from "../../organisms/layout/Colors"

export default function EditCompany(props) {
    const { setLoading, alert, colorPalette, user, setShowConfirmationDialog, userPermissions, menuItemsList } = useAppContext()
    let userId = user?.id;
    const isPartner = user?.perfil?.includes('parceiro');
    const isAdministrator = user?.perfil?.includes('administrador');
    const isTerapeuta = user?.perfil?.includes('terapeuta');
    const router = useRouter()
    const { id } = router.query;
    const newCompany = id === 'new';
    const [companyData, setCompanyData] = useState({
        razao_social: '',
        cnpj: '',
        responsavel: '',
        ativo: 1,
        endereco: '',
        complemento: '',
        limite_sessoes_mensal: null
    })
    const [stats, setStats] = useState({ sessoes_realizadas_mes: 0, valor_total_mes: 0 })
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)
    const [linkRegisterUser, setLinkRegisterUser] = useState('')
    const [employees, setEmployees] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterData, setFilterData] = useState('')
    const [consultionList, setConsultionList] = useState([])
    const [filtersField, setFiltersField] = useState({
        startDate: '',
        endDate: '',
        status_pagamento: '',
        status: '',
        paciente_id: '',
    })
    const [showFilters, setShowFilters] = useState(false)



    const fetchPermissions = async () => {
        try {
            const actions = await checkUserPermissions(router, userPermissions, menuItemsList)
            setIsPermissionEdit(actions)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))

    const getCompany = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/company/${id}`)
            const { data } = response
            let linkAcessRegister = `https://app.afectu.com/company?cod_key=${data?.cod_key}`
            setLinkRegisterUser(linkAcessRegister)
            setCompanyData(data)

            if (!newCompany) {
                const statsResp = await api.get(`/company/${id}/dashboard-stats`)
                setStats(statsResp?.data || { sessoes_realizadas_mes: 0, valor_total_mes: 0 })
            }
        } catch (error) {
            console.log(error)
            return error
        } finally { }
        setLoading(false)
    }

    const getEmployees = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/users/employee/${id}`)
            const { data = [] } = response;
            setEmployees(data)
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            if (newCompany) {
                return
            }
            await handleItems();
        })();
    }, [id])

    useEffect(() => {
        fetchPermissions()
    }, [])

    const getConsultion = async (filtersData) => {
        setLoading(true);
        try {
            const response = await api.get(`/consultation/company/pacient/${id}`, {
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

            if (Array.isArray(data) && data.length > 0) {
                setConsultionList(data);
            } else {
                setConsultionList([]);
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            setLoading(false);
        }
    };


    const handleItems = async () => {
        setLoading(true)
        try {
            await getCompany()
            await getEmployees()
            await getConsultion()

        } catch (error) {
            alert.error('Ocorreu um arro ao carregar A Empresa')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (value) => {

        if (value.target.name == 'cnpj') {
            let str = value.target.value;
            value.target.value = formatCNPJ(str)
        }

        if (value.target.name?.includes('cep')) {
            let str = value.target.value;
            value.target.value = formatCEP(str)
        }

        setCompanyData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const checkRequiredFields = () => {
        // if (!companyData.nome) {
        //     alert.error('Usuário precisa de nome')
        //     return false
        // }
        return true
    }

    const handleCreateCompany = async () => {
        setLoading(true)
        if (checkRequiredFields()) {
            try {
                const response = await api.post(`/company/create/${userId}`, { companyData });
                const { data } = response

                if (response?.status === 201) {
                    alert.success('Empresa cadastrada com sucesso.');
                    router.push(`/organization/list`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao cadastrar Empresa.');
            } finally {
                setLoading(false)
            }
        }
    }

    const handleDeleteCompany = async () => {
        setLoading(true)
        try {
            const response = await api.delete(`/company/delete/${id}`)
            if (response?.status == 201) {
                alert.success('Empresa excluída com sucesso.');
                router.push(`/organization/list`)
            }

        } catch (error) {
            alert.error('Tivemos um problema ao excluir Empresa.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditCompany = async () => {
        setLoading(true)
        try {
            const response = await api.patch(`/company/update/${id}`, { companyData })
            if (response?.status === 200) {
                alert.success('Empresa atualizada com sucesso.');
                handleItems()
                return
            }
            alert.error('Tivemos um problema ao atualizar Empresa.');
        } catch (error) {
            alert.error('Tivemos um problema ao atualizar Empresa.');
        } finally {
            setLoading(false)
        }
    }

    const generateKey = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters[randomIndex];
        }
        setCompanyData({ ...companyData, cod_key: result })
        let linkAcessRegister;
        if (companyData?.razao_social) {
            linkAcessRegister = `https://app.afectu.com/company??cod_key=${result}`
        }
        setLinkRegisterUser(linkAcessRegister)
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(linkRegisterUser)
            .then(() => {
                alert.info('Link copiado para a área de transferência!');
            })
            .catch(err => {
                console.error('Erro ao copiar o link: ', err);
            });
    };

    const groupStatus = [
        { label: 'ativo', value: 1 },
        { label: 'inativo', value: 0 },
    ]

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

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
        { key: 'nome', avatar: true, label: 'Nome', avatarUrl: 'location' },
        { key: 'email', label: 'E-mail' },
        { key: 'telefone', label: 'Telefone' },
    ];


    const sessoesValidas = Number(stats?.agendadas || 0) + Number(stats?.concluidas || 0);
    const excedentes = (companyData?.limite_sessoes_mensal && sessoesValidas > companyData.limite_sessoes_mensal) ? sessoesValidas - companyData.limite_sessoes_mensal : 0;

    return (
        <>
            <SectionHeader
                title={companyData?.razao_social || `Empresas`}
                saveButton={isPermissionEdit}
                saveButtonAction={(newCompany) ? handleCreateCompany : handleEditCompany}
                deleteButton={!newCompany && isPermissionEdit && !isPartner}
                deleteButtonAction={(event) => setShowConfirmationDialog({ active: true, event, acceptAction: handleDeleteCompany })}
            />
            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Box>
                    <Text title bold style={{ padding: '0px 0px 20px 0px' }}>Dados da Empresa</Text>
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Nome da Empresa' name='razao_social' onChange={handleChange} value={companyData?.razao_social || ''} label='Nome da Empresa' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Responsável' name='responsavel' onChange={handleChange} value={companyData?.responsavel || ''} label='Responsável' sx={{ flex: 1, }} />
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='CNPJ' name='cnpj' onChange={handleChange} value={companyData?.cnpj || ''} label='CNPJ' sx={{ flex: 1, }} />
                    {isAdministrator && (
                        <TextInput disabled={!isPermissionEdit && true} type="number" placeholder='Limite de Sessões no Mês' name='limite_sessoes_mensal' onChange={handleChange} value={companyData?.limite_sessoes_mensal || ''} label='Limite de Sessões Mensais (Vazio = Ilimitado)' sx={{ flex: 'none', width: { xs: '100%', md: '50%' } }} />
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                        <TextInput disabled={!isPermissionEdit && true} placeholder='Código de Acesso' name='cod_key' onChange={handleChange} value={companyData?.cod_key || ''} label='Código de Acesso' sx={{ flex: 1, }} />
                        <Button text="Gerar chave" onClick={() => generateKey(12)} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{
                        display: 'flex', padding: '10px', borderRadius: 2, backgroundColor: '#f0f0f0', alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text light>Link para cadastro de funcionário: <strong>{linkRegisterUser}</strong></Text>
                    </Box>
                    <Box sx={{
                        ...styles.icon,
                        transition: '.2s',
                        backgroundImage: `url('/icons/copy.png')`,
                        backgroundSize: 'cover',
                        width: 22,
                        height: 22,
                        "&:hover": {
                            cursor: 'pointer', opacity: 0.8
                        }
                    }} onClick={() => copyToClipboard()} />
                </Box>
                <RadioItem disabled={!isPermissionEdit && true} valueRadio={companyData?.ativo} group={groupStatus} title="Status" horizontal={mobile ? false : true} onSelect={(value) => setCompanyData({ ...companyData, ativo: parseInt(value) })} />
            </ContentContainer>

            {!newCompany && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4, mb: 4 }}>
                    <Text title bold>Métricas de Sessões</Text>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${colorPalette?.primary}` }}>
                            <Text light small>Sessões Agendadas/Contratadas</Text>
                            <Text bold large>{sessoesValidas} {companyData?.limite_sessoes_mensal ? `/ ${companyData?.limite_sessoes_mensal}` : ''}</Text>
                        </Box>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: excedentes > 0 ? '#fdecea' : colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${excedentes > 0 ? 'red' : colorPalette?.primary}` }}>
                            <Text light small style={{ color: excedentes > 0 ? 'red' : 'inherit' }}>Sessões Excedentes</Text>
                            <Text bold large style={{ color: excedentes > 0 ? 'red' : 'inherit' }}>{excedentes}</Text>
                        </Box>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${colorPalette?.primary}` }}>
                            <Text light small>Sessões Agendadas</Text>
                            <Text bold large>{stats?.agendadas || 0}</Text>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${colorPalette?.primary}` }}>
                            <Text light small>Sessões Concluídas</Text>
                            <Text bold large>{stats?.concluidas || 0}</Text>
                        </Box>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${colorPalette?.primary}` }}>
                            <Text light small>Sessões Remarcadas</Text>
                            <Text bold large>{stats?.remarcadas || 0}</Text>
                        </Box>
                        <Box sx={{ flex: '1 1 200px', backgroundColor: colorPalette?.secondary, padding: 3, borderRadius: 2, border: `1px solid ${colorPalette?.primary}` }}>
                            <Text light small>Sessões Canceladas</Text>
                            <Text bold large>{stats?.canceladas || 0}</Text>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box sx={{ display: !newCompany ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' } }}>
                    <Text veryLarge bold>Usuários Vínculados ({employees?.length})</Text>
                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' } }}>
                        <TextInput placeholder="Pesquisar por colaborador" name='filterData' type="search"
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
                            display: 'flex', padding: '12px', borderRadius: 3, gap: 2, backgroundColor: colorPalette?.buttonColor,
                            transition: '.3s', boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} onClick={() => router.push(`/users/new?company=${id}`)}>
                            <Box sx={{
                                ...styles.menuIcon,
                                width: 20,
                                height: 20,
                                backgroundImage: `url('/icons/add-friend.png')`,
                                transition: '.3s',
                            }} />
                            <Text bold style={{ color: '#fff' }}>Novo Colaborador</Text>
                        </Box>
                    </Box>
                </Box>

                {
                    employees?.length > 0 ?
                        <>
                            <Table_V1 targetBlank={true} route="users" data={employees.slice(startIndex, endIndex)} columns={column} columnId={'id'} columnActive={false} />
                            <TablePagination
                                component="div"
                                count={employees?.length}
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
                            <Text light>Não existem colaboradores vínculados á essa empresa.</Text>
                        </Box>
                }

                <ConsultionsTable consultionList={consultionList}
                    showFilters={showFilters} setShowFilters={setShowFilters} getConsultion={getConsultion} />
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

                        {(isAdministrator || isTerapeuta) && <SelectList
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


                        {(isAdministrator || isPartner || isTerapeuta) && <SelectList
                            fullWidth
                            autoComplete
                            data={employees}
                            valueSelection={filtersField.paciente_id}
                            onSelect={(value) => {
                                setFiltersField({
                                    ...filtersField, paciente_id: value,
                                })
                            }}
                            title="Selecione um paciente:"
                            filterOpition="value"
                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                        />}

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
                            getConsultion({
                                startDate: '',
                                endDate: '',
                                status_pagamento: '',
                                status: '',
                                paciente_id: '',
                            })
                            setShowFilters(false)
                        }} />
                        <Button text="Filtrar" style={{ width: `100%` }} onClick={() => {
                            getConsultion()
                            setShowFilters(false)
                        }} />
                    </Box>
                </Box>
            </Backdrop>
        </>
    )
}

const ConsultionsTable = ({ consultionList, showFilters, setShowFilters, getConsultion }) => {

    const [filterConsultion, setFilterConsultion] = useState('')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { colorPalette } = useAppContext()
    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterConsultion);

        return (
            // Object.values(userFilterFunctions).every(userFilterFunction => userFilterFunction(item)) &&
            (
                normalizeString(item?.paciente)?.toLowerCase().includes(normalizedFilterData?.toLowerCase())
            )
        );
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

    const statusColor = (data) => ((data === 'Agendado' && 'yellow') ||
        (data === 'Cancelada' && 'red') ||
        (data === 'Concluído' && 'green') ||
        (data === 'Remarcada' && 'blue'))

    const columns = [
        { key: 'data', label: 'Data' },
        { key: 'paciente', label: 'Colaborador' },
        { key: 'profissional', label: 'Terapeuta' },
        { key: 'status', label: 'Status' }
    ];
    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4, }}>
            <Box sx={{
                display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }
            }}>
                <Text veryLarge bold>Sessões ({consultionList?.filter(filter)?.length})</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar por paciente" name='filterData' type="search"
                        onChange={(event) => setFilterConsultion(event.target.value)} value={filterConsultion}
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

            {consultionList?.filter(filter).length > 0 ?
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
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ flex: 1, padding: 5, backgroundColor: colorPalette.secondary }}>
                                {
                                    consultionList?.filter(filter)?.sort((a, b) => new Date(b.data) - new Date(a.data))
                                        .slice(startIndex, endIndex)?.map((item, index) => {
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
                                                    <Tooltip title={item?.paciente}>
                                                        <TableCell sx={{
                                                            padding: '15px 10px', textAlign: 'center',
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                                                                <Avatar src={item?.url_foto_pac || ''} sx={{
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
                                                    </Tooltip>
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
                                <Text bold light>{consultionList?.filter(filter)?.length || '0'}</Text>
                                <Text light>de</Text>
                                <Text bold light>{consultionList?.length || 0}</Text>
                                <Text light>sessões</Text>
                            </Box>

                            <TablePagination
                                component="div"
                                count={consultionList?.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                style={{ color: colorPalette.textColor }} // Define a cor do texto
                                backIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de voltar
                                nextIconButtonProps={{ style: { color: colorPalette.textColor } }} // Define a cor do ícone de avançar
                            />
                            {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: '15px 12px', width: '100%', justifyContent: 'space-between' }}>
                                <PaginationTable data={consultionList?.filter(filter)}
                                    page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                                />
                            </Box> */}
                        </Box>
                    </TableContainer>
                </ContentContainer >
                :
                <Text>Não exitem sessões agendadas.</Text>}

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
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    }
}
