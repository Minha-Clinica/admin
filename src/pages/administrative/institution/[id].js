import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../../api/api"
import { Box, ContentContainer, TextInput, Text } from "../../../atoms"
import { RadioItem, SectionHeader } from "../../../organisms"
import { useAppContext } from "../../../context/AppContext"
import { formatCEP, formatCNPJ } from "../../../helpers"
import { checkUserPermissions } from "../../../validators/checkPermissionUser"
import axios from "axios"

export default function EditInstitution(props) {
    const { setLoading, alert, colorPalette, user, setShowConfirmationDialog, userPermissions, menuItemsList } = useAppContext()
    let userId = user?.id;
    const router = useRouter()
    const { id } = router.query;
    const newInstitution = id === 'new';
    const [arrayRecognitionP, setArrayRecognitionP] = useState([])
    const [arrayRecognitionEad, setArrayRecognitionEad] = useState([])
    const [recognitionP, setRecognitionP] = useState({})
    const [recognitionEad, setRecognitionEad] = useState({})
    const [institutionData, setInstitutionData] = useState({
        nome_instituicao: '',
        cnpj: '',
        mantenedora: '',
        mantida: '',
        pt_cred_ead: '',
        dt_cred_ead: '',
        pt_rec_ead: '',
        dt_rec_ead: '',
        pt_rec_pres: '',
        dt_rec_pres: '',
        pt_cred_pres: '',
        dt_cred_pres: '',
        ativo: 1,
        endereco_pres: '',
        endereco_ead: '',
    })
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

    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))

    const getInstitution = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/institution/${id}`)
            const { data } = response
            setInstitutionData(data)
        } catch (error) {
            console.log(error)
            return error
        } finally { }
        setLoading(false)
    }

    const getRecognition = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/recognitions/${id}`)
            const { recognitionEad, recognitionP } = response?.data
            if (recognitionEad) setArrayRecognitionEad(recognitionEad)
            if (recognitionP) setArrayRecognitionP(recognitionP)
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            if (newInstitution) {
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
            await getInstitution()
            getRecognition()
        } catch (error) {
            alert.error('Ocorreu um arro ao carregar A instituição')
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

        setInstitutionData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const checkRequiredFields = () => {
        // if (!institutionData.nome) {
        //     alert.error('Usuário precisa de nome')
        //     return false
        // }
        return true
    }

    const handleCreateInstitution = async () => {
        setLoading(true)
        if (checkRequiredFields()) {
            try {
                const response = await api.post(`/institution/create/${userId}`, { institutionData, arrayRecognitionP, arrayRecognitionEad });
                const { data } = response

                if (response?.status === 201) {
                    alert.success('Instituição cadastrada com sucesso.');
                    router.push(`/administrative/institution/list`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao cadastrar Instituição.');
            } finally {
                setLoading(false)
            }
        }
    }

    const handleDeleteInstitution = async () => {
        setLoading(true)
        try {
            const response = await api.delete(`/institution/delete/${id}`)
            if (response?.status == 201) {
                alert.success('Instituição excluída com sucesso.');
                router.push(`/administrative/institution/list`)
            }

        } catch (error) {
            alert.error('Tivemos um problema ao excluir Instituição.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditInstitution = async () => {
        setLoading(true)
        try {
            const response = await api.patch(`/institution/update/${id}`, { institutionData })
            if (response?.status === 201) {
                alert.success('Instituição atualizada com sucesso.');
                handleItems()
                return
            }
            alert.error('Tivemos um problema ao atualizar Instituição.');
        } catch (error) {
            alert.error('Tivemos um problema ao atualizar Instituição.');
        } finally {
            setLoading(false)
        }
    }

    const handleChangeRecognitionP = (value) => {
        setRecognitionP((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    };

    const addRecognitionP = () => {
        setArrayRecognitionP((prevArray) => [...prevArray, { ren_reconhecimento_p: recognitionP.ren_reconhecimento_p, dt_renovacao_rec_p: recognitionP.dt_renovacao_rec_p }])
        setRecognitionP({ ren_reconhecimento_p: '', dt_renovacao_rec_p: '' })
    }

    const deleteRecognitionP = (index) => {

        if (newInstitution) {
            setArrayRecognitionP((prevArray) => {
                const newArray = [...prevArray];
                newArray.splice(index, 1);
                return newArray;
            });
        }
    };


    //EAD
    const handleChangeRecognitionEad = (value) => {
        setRecognitionEad((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    };

    const addRecognitionEad = () => {
        setArrayRecognitionEad((prevArray) => [...prevArray, { ren_reconhecimento_ead: recognitionEad.ren_reconhecimento_ead, dt_renovacao_rec_ead: recognitionEad.dt_renovacao_rec_ead }])
        setRecognitionEad({ ren_reconhecimento_ead: '', dt_renovacao_rec_ead: '' })
    }

    const deleteRecognitionEad = (index) => {

        if (newInstitution) {
            setArrayRecognitionEad((prevArray) => {
                const newArray = [...prevArray];
                newArray.splice(index, 1);
                return newArray;
            });
        }
    };

    const handleAddRecognition = async () => {
        setLoading(true)
        let recognitionData = {};

        try {
            if (Object.keys(recognitionEad).length > 0) {
                recognitionData = recognitionEad;
                const response = await api.post(`/institution/recognition/create/${id}/${userId}?modality=ead`, { recognitionData })
                if (response?.status === 201) {
                    alert.success('Renovação adicionada')
                    setRecognitionEad({ ren_reconhecimento_ead: '', dt_renovacao_rec_ead: '' })
                    handleItems()
                }
            };
            if (Object.keys(recognitionP).length > 0) {
                recognitionData = recognitionP;
                const response = await api.post(`/institution/recognition/create/${id}/${userId}?modality=presencial`, { recognitionData })
                if (response?.status === 201) {
                    alert.success('Renovação adicionada')
                    setRecognitionP({ ren_reconhecimento_p: '', dt_renovacao_rec_p: '' })
                    handleItems()
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRecognition = async (id_renovacao_rec) => {
        setLoading(true)
        try {
            if (recognitionEad) {
                const response = await api.delete(`/institution/recognition/delete/${id_renovacao_rec}?modality=ead`)
                if (response?.status === 200) {
                    alert.success('Renovação excluida.');
                    handleItems()
                }
            }
            if (recognitionP) {
                const response = await api.delete(`/institution/recognition/delete/${id_renovacao_rec}?modality=presencial`)
                if (response?.status === 200) {
                    alert.success('Renovação excluida.');
                    handleItems()
                }
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao remover a Habilidade selecionada.');
            console.log(error)
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

            let fields = {}

            if (name === 'cep_pres') {
                fields = {
                    rua_pres: data.logradouro,
                    cidade_pres: data.localidade,
                    uf_pres: data.uf,
                    bairro_pres: data.bairro
                }
            } else {
                fields = {
                    rua_ead: data.logradouro,
                    cidade_ead: data.localidade,
                    uf_ead: data.uf,
                    bairro_ead: data.bairro
                }
            }
            setInstitutionData((prevValues) => ({
                ...prevValues,
                ...fields
            }))
        } catch (error) {
        } finally {
            setLoading(false)
        }

    }

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
                perfil={institutionData?.modalidade_curso}
                title={institutionData?.nome_curso || `Empresas`}
                saveButton={isPermissionEdit}
                saveButtonAction={newInstitution ? handleCreateInstitution : handleEditInstitution}
                deleteButton={!newInstitution && isPermissionEdit}
                deleteButtonAction={(event) => setShowConfirmationDialog({ active: true, event, acceptAction: handleDeleteInstitution })}
            />

            {/* usuario */}
            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Box>
                    <Text title bold style={{ padding: '0px 0px 20px 0px' }}>Dados da Instituição</Text>
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Mantenedora' name='mantenedora' onChange={handleChange} value={institutionData?.mantenedora || ''} label='Mantenedora' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Mantida' name='mantida' onChange={handleChange} value={institutionData?.mantida || ''} label='Mantida' sx={{ flex: 1, }} />
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='CNPJ' name='cnpj' onChange={handleChange} value={institutionData?.cnpj || ''} label='CNPJ' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Código' name='cod_inep' onChange={handleChange} value={institutionData?.cod_inep || ''} label='Código' sx={{ flex: 1, }} />
                </Box>
                <RadioItem disabled={!isPermissionEdit && true} valueRadio={institutionData?.ativo} group={groupStatus} title="Status" horizontal={mobile ? false : true} onSelect={(value) => setInstitutionData({ ...institutionData, ativo: parseInt(value) })} />

            </ContentContainer>

            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Text bold >Endereço</Text>

                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='CEP' name='cep_pres' onChange={handleChange} value={institutionData?.cep_pres || ''} label='CEP *' onBlur={handleBlurCEP} sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Endereço' name='rua_pres' onChange={handleChange} value={institutionData?.rua_pres || ''} label='Endereço *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Nº' name='numero_pres' onChange={handleChange} value={institutionData?.numero_pres || ''} label='Nº *' sx={{ flex: 1, }} />
                </Box>
                <Box sx={styles.inputSection}>
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Cidade' name='cidade_pres' onChange={handleChange} value={institutionData?.cidade_pres || ''} label='Cidade *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='UF' name='uf_pres' onChange={handleChange} value={institutionData?.uf_pres || ''} label='UF *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Bairro' name='bairro_pres' onChange={handleChange} value={institutionData?.bairro_pres || ''} label='Bairro *' sx={{ flex: 1, }} />
                    <TextInput disabled={!isPermissionEdit && true} placeholder='Complemento' name='complemento_pres' onChange={handleChange} value={institutionData?.complemento_pres || ''} label='Complemento' sx={{ flex: 1, }} />
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