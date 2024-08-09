import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button } from "../../atoms"
import { RadioItem, SectionHeader, Sectioner } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { formatCEP, formatCNPJ } from "../../helpers"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import axios from "axios"
import { CopyAll } from '@mui/icons-material';

export default function EditCompany(props) {
    const { setLoading, alert, colorPalette, user, setShowConfirmationDialog, userPermissions, menuItemsList } = useAppContext()
    let userId = user?.id;
    const router = useRouter()
    const { id } = router.query;
    const newCompany = id === 'new';
    const [companyData, setCompanyData] = useState({
        razao_social: '',
        cnpj: '',
        responsavel: '',
        ativo: 1,
        endereco: '',
        complemento: ''
    })
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)
    const [linkRegisterUser, setLinkRegisterUser] = useState('')

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
            let linkAcessRegister = `https://www.afectu.com/company?cod_key=${data?.cod_key}`
            setLinkRegisterUser(linkAcessRegister)
            setCompanyData(data)
        } catch (error) {
            console.log(error)
            return error
        } finally { }
        setLoading(false)
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


    const handleItems = async () => {
        setLoading(true)
        try {
            await getCompany()

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

    const handleBlurCEP = (event) => {
        const { value, name } = event.target;
        findCEP(value, name);
    };

    async function findCEP(cep, name) {
        setLoading(true)
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            const { data } = response;

            let fields = {
                rua: data.logradouro,
                cidade: data.localidade,
                uf: data.uf,
                bairro: data.bairro
            }
            setCompanyData((prevValues) => ({
                ...prevValues,
                ...fields
            }))
        } catch (error) {
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
            linkAcessRegister = `https://www.afectu.com/company??cod_key=${result}`
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


    return (
        <>
            <SectionHeader
                title={companyData?.razao_social || `Empresas`}
                saveButton={isPermissionEdit}
                saveButtonAction={newCompany ? handleCreateCompany : handleEditCompany}
                deleteButton={!newCompany && isPermissionEdit}
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
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

            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Text bold >Endereço</Text>

                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='CEP' name='cep' onChange={handleChange} value={companyData?.cep || ''} label='CEP *' onBlur={handleBlurCEP} sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Endereço' name='rua' onChange={handleChange} value={companyData?.rua || ''} label='Endereço *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Nº' name='numero' onChange={handleChange} value={companyData?.numero || ''} label='Nº *' sx={{ flex: 1, }} />
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Cidade' name='cidade' onChange={handleChange} value={companyData?.cidade || ''} label='Cidade *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='UF' name='uf' onChange={handleChange} value={companyData?.uf || ''} label='UF *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Bairro' name='bairro' onChange={handleChange} value={companyData?.bairro || ''} label='Bairro *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Complemento' name='complemento' onChange={handleChange} value={companyData?.complemento || ''} label='Complemento' sx={{ flex: 1, }} />
                </Box>
            </ContentContainer>
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