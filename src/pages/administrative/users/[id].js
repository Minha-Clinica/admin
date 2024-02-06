import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { Avatar, Backdrop, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, PhoneInputField, FileInput, Divider } from "../../../atoms"
import { CheckBoxComponent, CustomDropzone, RadioItem, SectionHeader, TableOfficeHours, Table_V1 } from "../../../organisms"
import { useAppContext } from "../../../context/AppContext"
import { icons } from "../../../organisms/layout/Colors"
import { createContract, createEnrollment, createUser, deleteFile, deleteUser, editContract, editeEnrollment, editeUser } from "../../../validators/api-requests"
import { emailValidator, formatCEP, formatCPF, formatDate, formatRg, formatTimeStamp } from "../../../helpers"
import { SelectList } from "../../../organisms/select/SelectList"
import Link from "next/link"
import { checkUserPermissions } from "../../../validators/checkPermissionUser"

export default function EditUser() {
    const { setLoading, alert, colorPalette, user, matches, theme, setShowConfirmationDialog, menuItemsList, userPermissions } = useAppContext()
    const usuario_id = user.id;
    const router = useRouter()
    const { id, slug } = router.query;
    const newUser = id === 'new';
    const [perfil, setPerfil] = useState('')
    const [fileCallback, setFileCallback] = useState()
    const [bgPhoto, setBgPhoto] = useState({})
    const [userData, setUserData] = useState({
        autista: null,
        superdotacao: null,
        cpf: null,
        naturalidade: null,
        nacionalidade: null,
        estado_civil: null,
        conjuge: null,
        email_corporativo: null,
        email_pessoal: null,
        nome_pai: null,
        nome_mae: null,
        escolaridade: null,
        genero: null,
        cor_raca: null,
        deficiencia: null,
        doc_estrangeiro: null,
        pais_origem: 'Brasil',
        telefone_emergencia: null,
        telefone: null,
        rua: null,
        cidade: null,
        uf: null,
        bairro: null,
        cep: null,
        complemento: null,
        numero: null,
        ativo: 1,
        admin_sistema: 0,
        login: null,
        nascimento: null,
        tipo_deficiencia: null,
        nome_emergencia: null,
        foto_perfil_id: bgPhoto?.location || fileCallback?.filePreview || null,
        nome_social: null
    })
    const [contract, setContract] = useState({
        funcao: null,
        area: null,
        horario: null,
        admissao: null,
        desligamento: null,
        ctps: null,
        serie: null,
        pis: null,
        conta_id: null,
        banco_1: null,
        conta_1: null,
        agencia_1: null,
        tipo_conta_1: null,
        banco_2: null,
        conta_2: null,
        agencia_2: null,
        tipo_conta_2: null,
        cartao_ponto: null,
    })
    const [countries, setCountries] = useState([])
    const [groupPermissions, setGroupPermissions] = useState([])
    const [permissionPerfil, setPermissionPerfil] = useState()
    const [permissionPerfilBefore, setPermissionPerfilBefore] = useState()
    const [foreigner, setForeigner] = useState(false)
    const [showContract, setShowContract] = useState(false)
    const [selectiveProcessData, setSelectiveProcessData] = useState({
        agendamento_processo: '',
        nota_processo: '',
        status_processo: '',
    })
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    const [showSections, setShowSections] = useState({
        registration: false,
        interest: false,
        historic: false,
        addHistoric: false,
        addInterest: false,
        viewInterest: false,
        permissions: false,
        accessData: false,
        editEnroll: false
    })
    const [showEditFile, setShowEditFiles] = useState({
        photoProfile: false,
        cpf: false,
        rg: false,
        foreigner: false,
        address: false,
        certificate: false,
        schoolRecord: false,
        contractStudent: false,
        cpf_dependente: false,
        titleDoc: false,
        ctps: false,
        enem: false,
        cert_nascimento: false
    })
    const [historicData, setHistoricData] = useState({
        responsavel: user?.nome
    });
    const [arrayHistoric, setArrayHistoric] = useState([])
    const [arrayDependent, setArrayDependent] = useState([])
    const [dependent, setDependent] = useState({})
    const [valueIdHistoric, setValueIdHistoric] = useState()
    const [filesUser, setFilesUser] = useState([])
    const [officeHours, setOfficeHours] = useState([
        { dia_semana: '2ª Feira', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
        { dia_semana: '3ª Feira', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
        { dia_semana: '4ª Feira', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
        { dia_semana: '5ª Feira', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
        { dia_semana: '6ª Feira', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
        { dia_semana: 'Sábado', ent1: null, sai1: null, ent2: null, sai2: null, ent3: null, sai3: null },
    ]);
    const [showEditPhoto, setShowEditPhoto] = useState(false)
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

    useEffect(() => {
        setPerfil()
        findCountries()
        listPermissions()
        fetchPermissions()
    }, [])

    const getUserData = async () => {
        try {
            const response = await api.get(`/user/${id}`)
            const { data } = response
            setUserData(data.response)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getDependent = async () => {
        try {
            const response = await api.get(`/user/dependent/${id}`)
            const { data } = response
            setArrayDependent(data.dependents)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getContract = async () => {
        try {
            const response = await api.get(`/contract/${id}`)
            const { data } = response
            setContract(data)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const getHistoric = async () => {
        try {
            const response = await api.get(`/user/historical/${id}`)
            const { data } = response
            setArrayHistoric(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPhoto = async () => {
        try {
            const response = await api.get(`/photo/${id}`)
            const { data } = response
            setBgPhoto(data)
        } catch (error) {
            console.log(error)
        }
    }


    const getPhotoNewUser = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/photo/${fileCallback?.id_foto_perfil}`)
            const { data } = response
            setBgPhoto(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getFileUser = async () => {
        try {
            const response = await api.get(`/files/${id}`)
            const { data } = response
            setFilesUser(data)
        } catch (error) {
            console.log(error)
        }
    }


    const getContractStudent = async () => {
        try {
            const response = await api.get(`/student/enrollment/contracts/${id}`)
            const { data } = response
            if (data.length > 0) {
                setContractStudent(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getOfficeHours = async () => {
        try {
            const response = await api.get(`/officeHours/${id}`)
            const { data = [] } = response
            if (data.length > 0) {
                setOfficeHours(data)
                return
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const getPermissionUser = async () => {
        try {
            const response = await api.get(`/permissionPerfil/${id}`)
            const { data } = response
            if (response.status === 200) {
                setPermissionPerfil(data)
                setPermissionPerfilBefore(data)
                return
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }



    useEffect(() => {
        (async () => {
            if (newUser) {
                return
            }
            await handleItems();
        })();
    }, [id])

    useEffect(() => {
        if (newUser && fileCallback?.id_foto_perfil) {
            getPhotoNewUser()
        }
    }, [fileCallback])

    async function findCEP(cep) {
        setLoading(true)
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            const { data } = response;

            setUserData((prevValues) => ({
                ...prevValues,
                rua: data.logradouro,
                cidade: data.localidade,
                uf: data.uf,
                bairro: data.bairro,
            }))
        } catch (error) {
        } finally {
            setLoading(false)
        }

    }

    async function findCountries() {
        try {
            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/paises/paises`);
            const { data = [] } = response;
            const abbreviatedNames = data.map(country => country.nome.abreviado);
            const uniqueAbbreviatedNames = [...new Set(abbreviatedNames)];

            uniqueAbbreviatedNames.sort()

            const groupAccount = uniqueAbbreviatedNames.map(name => ({
                label: name,
                value: name
            }));

            setCountries(groupAccount);
        } catch (error) {
        }
    }


    async function listPermissions() {

        try {
            const response = await api.get(`/permissions`)
            const { data } = response
            const groupPermissions = data.map(permission => ({
                label: permission.permissao,
                value: permission?.id_grupo_perm.toString()
            }));

            setGroupPermissions(groupPermissions);
        } catch (error) {
        }
    }


    async function autoEmail(email) {
        try {
            const name = userData?.nome?.split(' ');
            const firstName = name[0];
            const lastName = name.length > 1 ? name[name.length - 1] : '';
            let firstEmail = `${firstName}.${lastName}@gmail.com.br`;

            if (!lastName) {
                firstEmail = `${firstName}01@gmail.com.br`;
            }
        } catch (error) {
        }
    }

    const handleBlurCEP = (event) => {
        const { value } = event.target;
        findCEP(value);
    };

    const handleItems = async () => {
        setLoading(true)
        try {
            await getUserData()
            getContract()
            getHistoric()
            getPhoto()
            getFileUser()
            getContractStudent()
            getOfficeHours()
            getPermissionUser()
            getDependent()
        } catch (error) {
            alert.error('Ocorreu um arro ao carregar Usuarios')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (value) => {

        if (value.target.name == 'cpf') {
            let str = value.target.value;
            value.target.value = formatCPF(str)
        }

        if (value.target.name == 'rg') {
            let str = value.target.value;
            value.target.value = formatRg(str)
        }

        if (value.target.name == 'cep') {
            let str = value.target.value;
            value.target.value = formatCEP(str)
        }

        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeContract = (value) => {
        setContract((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeSelectiveProcess = (event) => {


        setSelectiveProcessData((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }))
    }

    const handleBlurNota = (event) => {

        let nota = event.target.value;

        if (nota >= 51) {
            setSelectiveProcessData({ ...selectiveProcessData, status_processo: 'Aprovado - pré-matricula' })
            return
        }
        if (nota < 50) {
            setSelectiveProcessData({ ...selectiveProcessData, status_processo: 'Reprovado' })
            return
        }
    }

    const handleChangeEnrollment = (value) => {

        setEnrollmentData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeEnrollmentEdit = (value) => {

        setEnrollmentStudentEditData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeHistoric = (value) => {

        setHistoricData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleOfficeHours = (newData) => {
        setOfficeHours(newData);
    };

    const handleChangeDependent = (value) => {

        if (value.target.name?.includes('cpf_dependente')) {
            let str = value.target.value;
            value.target.value = formatCPF(str)
        }


        setDependent((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    };

    const handleChangeDependentArray = (event, fieldName, id_dependente) => {

        if (event.target.name?.includes('cpf_dependente')) {
            let str = event.target.value;
            event.target.value = formatCPF(str)
        }

        const newValue = event.target.value;

        setArrayDependent((prevArray) => {
            const newArray = prevArray.map((item) =>
                item.id_dependente === id_dependente
                    ? { ...item, [fieldName]: newValue }
                    : item
            );
            return newArray;
        });
    };


    const addHistoric = () => {
        if (!historicData?.dt_ocorrencia || !historicData?.responsavel || !historicData?.ocorrencia) {
            alert.error('Por favor, preencha os campos antes de adicionar.')
            return
        }

        setArrayHistoric((prevArray) => [
            ...prevArray,
            {
                dt_ocorrencia: historicData?.dt_ocorrencia,
                responsavel: historicData?.responsavel,
                ocorrencia: historicData?.ocorrencia,
            }
        ]);

        setHistoricData({})
    }

    const deleteHistoric = (index) => {
        if (newUser) {
            setArrayHistoric((prevArray) => {
                const newArray = [...prevArray];
                newArray.splice(index, 1);
                return newArray;
            });
        }
    };

    const handleDeleteHistoric = async (id_historic) => {
        setLoading(true)
        try {
            const response = await api.delete(`/user/historic/delete/${id_historic}`)
            if (response?.status == 201) {
                alert.success('Historico removido.');
                setValueIdHistoric('')
                handleItems()
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao remover o Historico selecionado.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddHistoric = async () => {
        setLoading(true)
        try {
            const response = await api.post(`/user/historic/create/${id}`, { historicData })
            if (response?.status == 201) {
                alert.success('Historico adicionado.');
                setHistoricData({})
                handleItems()
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao adicionar Historico.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditHistoric = async (id_historic) => {
        setLoading(true)
        try {
            const response = await api.post(`/user/historic/update/${id_historic}`, { historicData })
            if (response?.status == 201) {
                alert.success('Historico atualizado.');
                setHistoricData({})
                handleItems()
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao adicionar Historico.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const checkRequiredFields = () => {
        if (!userData?.nome) {
            alert?.error('O campo nome é obrigatório')
            return false
        }
        if (!userData?.email) {
            alert?.error('O campo email é obrigatório')
            return false
        }
        if (!emailValidator(userData?.email)) {
            alert?.error('O e-mail inserido parece estar incorreto.')
            return false
        }

        if (userData?.nova_senha !== userData?.confirmar_senha) {
            alert?.error('As senhas não correspondem. Por favor, verifique novamente.')
            return false
        }

        return true
    }

    const handleCreateUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                const response = await createUser(userData, arrayInterests, arrayHistoric, arrayDisciplinesProfessor, usuario_id)
                const { data } = response
                if (userData?.perfil?.includes('funcionario')) { await createContract(data?.userId, contract) }
                if (fileCallback) { await api.patch(`/file/edit/${fileCallback?.id_foto_perfil}/${data?.userId}`) }
                if (officeHours) { await api.post(`/officeHours/create/${data?.userId}`, { officeHours }) }
                if (newUser && filesUser) { await api.patch(`/file/editFiles/${data?.userId}`, { filesUser }); }
                if (permissionPerfil) {
                    const permissionsToAdd = permissionPerfil.split(',').map(id => parseInt(id));
                    if (permissionsToAdd.length > 0) {
                        await api.post(`/permissionPerfil/create/${data?.userId}`, { permissionsToAdd })
                    }
                }
                if (response?.status === 201) {
                    alert.success('Usuário cadastrado com sucesso.');
                    if (data?.userId) router.push(`/administrative/users/list`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao cadastrar usuário.');
                console.log(error)
            } finally {
                setLoading(false)
            }
            return setLoading(false)
        }
    }

    const handleDeleteUser = async () => {
        setLoading(true)
        try {
            const response = await deleteUser(id)
            if (response?.status == 200) {
                alert.success('Usuário excluído com sucesso.');
                router.push(`/administrative/users/list`)
            }
        } catch (error) {
            alert.error('Tivemos um problema ao excluir usuário.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                const response = await editeUser({ id, userData })
                if (response.status === 422) return alert.error('CPF já cadastrado.')
                if (contract) {
                    const contr = await editContract({ id, contract })
                }
                if (!(officeHours.filter((item) => item?.id_hr_trabalho).length > 0)) {
                    await api.post(`/officeHours/create/${id}`, { officeHours })
                }
                if (officeHours?.map((item) => item.id_hr_trabalho).length > 0) {
                    await api.patch(`/officeHours/update`, { officeHours })
                }
                if (arrayDependent?.length > 0) {
                    await api.patch(`/user/dependent/update`, { arrayDependent })
                }
                if (response?.status === 201) {
                    alert.success('Usuário atualizado com sucesso.');
                    handleItems()
                    return
                }
                alert.error('Tivemos um problema ao atualizar usuário.');
            } catch (error) {
                console.log(error)
                alert.error('Tivemos um problema ao atualizar usuário.');
                return error;
            } finally {
                setLoading(false)
            }
        }

    }

    const handleAddPermission = async () => {
        setLoading(true)
        try {

            const currentPermissions = permissionPerfil.split(',').map(id => parseInt(id));
            const previousPermissions = permissionPerfilBefore.split(',').map(id => parseInt(id));

            const permissionsToAdd = currentPermissions.filter(id => !previousPermissions.includes(id));
            const permissionsToRemove = previousPermissions.filter(id => !currentPermissions.includes(id));

            if (permissionsToAdd.length > 0) {
                const responseData = await api.post(`/permissionPerfil/create/${id}`, { permissionsToAdd })
            }

            if (permissionsToRemove.length > 0) {
                const permissionsToRemoveString = permissionsToRemove.join(','); // Converta o array em uma string
                const responseData = await api.delete(`/permissionPerfil/remove/${id}?permissions=${permissionsToRemoveString}`);
            }
            alert.info('Permissões do usuário atualizadas.');
        } catch (error) {
            console.log(error)
            alert.error('Tivemos um problema ao atualizar as permissões.');
            return error;
        } finally {
            setLoading(false)
        }
    }

    const handleChangeFilesUser = (field, fileId, filePreview) => {
        setFilesUser((prevClassDays) => [
            ...prevClassDays,
            {
                id_doc_usuario: fileId,
                location: filePreview,
                campo: field,
            }
        ]);
    };

    const replicateToDaysWork = () => {
        const firstWorkingHours = officeHours.find(day => day.dia_semana === '2ª Feira')
        if (firstWorkingHours?.ent1 !== '') {
            const updatedOfficeHours = officeHours.map(day => ({
                ...day,
                ent1: firstWorkingHours.ent1,
                sai1: firstWorkingHours.sai1,
                ent2: firstWorkingHours.ent2,
                sai2: firstWorkingHours.sai2,
                ent3: firstWorkingHours.ent3,
                sai3: firstWorkingHours.sai3,
            }))
            setOfficeHours(updatedOfficeHours)
        }
    }

    const addDependent = () => {
        setArrayDependent((prevArray) => [...prevArray, { nome_dependente: dependent.nome_dependente }])
        setDependent({ nome_dependente: '', cpf_dependente: '', dt_nasc_dependente: '' })
    }

    const deleteDependent = (index) => {
        if (newUser) {
            setArrayDependent((prevArray) => {
                const newArray = [...prevArray];
                newArray.splice(index, 1);
                return newArray;
            });
        }
    };

    const handleAddDependent = async () => {
        setLoading(true)
        try {
            const response = await api.post(`/user/dependent/create/${id}`, { dependent })
            if (response?.status === 201) {
                alert.success('Dependente incluido')
                setDependent({})
                getDependent()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteDependent = async (id_dependente) => {
        setLoading(true)
        try {
            const response = await api.delete(`/user/dependent/delete/${id_dependente}`)
            if (response?.status === 200) {
                alert.success('Dependente removido.');
                getDependent()
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao remover a Habilidade selecionada.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const toggleEnrollTable = (index) => {
        setShowEnrollTable(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };




    const handleSendSelectiveProcess = async (type) => {
        try {
            setLoading(true)
            const result = await api.post(`/user/selectProcess/send/${userData?.id}?type=${type}`)
            if (result.status !== 200) {
                alert.error('Houve um erro ao enviar e-mail.')
                return
            } else {
                alert.success('E-mail enviado com sucesso.')
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const groupPerfil = [
        { label: 'Profissional', value: 'profissional' },
        { label: 'Paciente', value: 'paciente' },
        { label: 'Administrador', value: 'administrador' },
    ]

    const groupCivil = [
        { label: 'Solteiro', value: 'Solteiro' },
        { label: 'Casado', value: 'Casado' },
        { label: 'Separado', value: 'Separado' },
        { label: 'Divorciado', value: 'Divorciado' },
        { label: 'Viúvo', value: 'Viúvo' },
        { label: 'União estável', value: 'União estável' }
    ]

    const groupEscolaridade = [
        { label: 'Ensino fundamental (incompleto)', value: 'Ensino fundamental (incompleto)' },
        { label: 'Ensino fundamental', value: 'Ensino fundamental' },
        { label: 'Ensino médio', value: 'Ensino médio' },
        { label: 'Superior (Graduação)', value: 'Superior (Graduação)' },
        { label: 'Pós-graduação', value: 'Pós-graduação' },
        { label: 'Mestrado', value: 'Mestrado' },
        { label: 'Doutorado', value: 'Doutorado' },
    ]

    const groupStatus = [
        { label: 'ativo', value: 1 },
        { label: 'inativo', value: 0 },
    ]

    const groupCertificate = [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
    ]

    const groupAdmin = [
        { label: 'sim', value: 1 },
        { label: 'não', value: 0 },
    ]

    const groupRacaCor = [
        { label: 'Prefiro não declarar', value: 'Prefiro não declarar' },
        { label: 'Branco', value: 'Branco' },
        { label: 'Preto', value: 'Preto' },
        { label: 'Pardo', value: 'Pardo' },
        { label: 'Amarelo', value: 'Amarelo' },
        { label: 'Indígena', value: 'Indígena' },
    ]

    const groupGender = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
        { label: 'Outro', value: 'Outro' },
        { label: 'Prefiro não informar', value: 'Prefiro não informar' },
    ]

    const groupDisability = [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' },
        { label: 'Não dispõe de informação', value: 'Não dispõe de informação' },
    ]

    const groupNationality = [
        { label: 'Brasileira Nata', value: 'Brasileira Nata' },
        { label: 'Brasileira por Naturalização', value: 'Brasileira por Naturalização' },
        { label: 'Estrangeira', value: 'Estrangeira' },
    ]

    const groupAccount = [
        { label: 'Conta Corrente', value: 'Conta Corrente' },
        { label: 'Conta salário', value: 'Conta salário' },
        { label: 'Conta poupança', value: 'Conta poupança' }
    ]


    const groupBank = [
        { label: 'Itaú', value: 'Itau' },
        { label: 'Bradesco', value: 'Bradesco' },
    ]

    const groupArea = [
        { label: 'Financeiro', value: 'Financeiro' },
        { label: 'Biblioteca', value: 'Biblioteca' },
        { label: 'TI - Suporte', value: 'TI - Suporte' },
        { label: 'RH', value: 'RH' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Atendimento/Recepção', value: 'Atendimento/Recepção' },
        { label: 'Secretaria', value: 'Secretaria' },
        { label: 'Administrativo', value: 'Administrativo' },
        { label: 'Diretoria', value: 'Diretoria' },
        { label: 'Acadêmica', value: 'Acadêmica' },

    ]

    const groupStatusProcess = [
        { label: 'Aprovado - pré-matricula', value: 'Aprovado - pré-matricula' },
        { label: 'Reprovado', value: 'Reprovado' },
        { label: 'Pendente de nota', value: 'Pendente de nota' },
    ]

    const grouperiod = [
        { label: 'Manhã', value: 'Manhã' },
        { label: 'Tarde', value: 'Tarde' },
        { label: 'Noite', value: 'Noite' }
    ]

    const groupSituation = [
        { label: 'Aguardando início', value: 'Aguardando início' },
        { label: 'Pendente de assinatura do contrato', value: 'Pendente de assinatura do contrato' },
        { label: 'Em andamento', value: 'Em andamento' },
        { label: 'Concluído', value: 'Concluído' },
        { label: 'Turma cancelada', value: 'Turma cancelada' },
        { label: 'Aprovado', value: 'Aprovado' },
        { label: 'Reprovado', value: 'Reprovado' },
        { label: 'Bloq. Online', value: 'Bloq. Online' },
        { label: 'Matrícula cancelada', value: 'Matrícula cancelada' },
        { label: 'Transferido ', value: 'Transferido ' },
        { label: 'Desistente ', value: 'Desistente ' },
        { label: 'Nenhuma', value: 'Nenhuma' },
    ]

    const groupReasonsDroppingOut = [
        { label: 'Pessoal', value: 'Pessoal' },
        { label: 'Financeiro', value: 'Financeiro' },
        { label: 'Insatisfação', value: 'Insatisfação' },
        { label: 'Turma cancelada', value: 'Turma cancelada' },
        { label: 'Reprovação', value: 'Reprovação' },
        { label: 'Profissional', value: 'Profissional' },
        { label: 'Saúde', value: 'Saúde' },
        { label: 'Dificuldade', value: 'Dificuldade' },
        { label: 'Não quis informar ', value: 'Não quis informar ' },
    ]

    const groupDeficiency = [
        { label: 'Deficiência visual', value: 'Deficiência visual' },
        { label: 'Deficiência intelectual', value: 'Deficiência intelectual' },
        { label: 'Deficiência múltipla ', value: 'Deficiência múltipla ' },
        { label: 'Surdez e deficiência auditiva', value: 'Surdez e deficiência auditiva' },
        { label: 'Deficiência auditiva', value: 'Deficiência auditiva' },
        { label: 'Deficiência fisica e motora', value: 'Deficiência fisica e motora' }
    ]


    const groupOrigemEnsinoMedio = [
        { label: 'Pública', value: 'Pública' },
        { label: 'Privada', value: 'Privada' }
    ]

    const groupAutism = [
        {
            label: 'Transtorno global do desenvolvimento (TGD)',
            value: 'Transtorno global do desenvolvimento (TGD)'
        },
        {
            label: 'Transtorno do espectro autista (TEA)',
            value: 'Transtorno do espectro autista (TEA)'
        },
    ]

    const groupSuperGifted = [
        {
            label: 'Altas habilidades/superdotação',
            value: 'Altas habilidades/superdotação'
        },
    ]

    const groupForeigner = [
        {
            label: 'Estrangeiro sem CPF',
            value: true
        },
    ]

    const columnHistoric = [
        { key: 'id_historico', label: 'ID' },
        { key: 'ocorrencia', label: 'Ocorrência' },
        { key: 'dt_ocorrencia', label: 'Data', date: true },
        { key: 'responsavel', label: 'Responsável' }
    ];

    return (
        <>
            <SectionHeader
                perfil={userData?.perfil}
                title={userData?.nome || `Novo ${userData?.perfil === 'funcionario' && 'Funcionário' || userData?.perfil === 'aluno' && 'Aluno' || userData?.perfil === 'interessado' && 'Interessado' || 'Usuário'}`}
                saveButton={isPermissionEdit}
                saveButtonAction={newUser ? handleCreateUser : handleEditUser}
                deleteButton={!newUser && isPermissionEdit}
                deleteButtonAction={(event) => setShowConfirmationDialog({
                    active: true,
                    event,
                    acceptAction: handleDeleteUser,
                    title: 'Excluir usuário',
                    message: 'Tem certeza que deseja prosseguir com a exclusão do usuário? Todos os dados vinculados a esse usuário serão excluídos, sem opção de recuperação.',
                })}
            />

            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                    <Box>
                        <Text title bold style={{}}>Contato</Text>
                    </Box>

                    <EditFile
                        isPermissionEdit={isPermissionEdit}
                        columnId="id_foto_perfil"
                        open={showEditFile.photoProfile}
                        newUser={newUser}
                        onSet={(set) => {
                            setShowEditFiles({ ...showEditFile, photoProfile: set })
                        }}
                        title='Foto de perfil'
                        text='Para alterar sua foto de perfil, clique ou arraste no local desejado.'
                        textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                        fileData={bgPhoto}
                        usuarioId={id}
                        campo='foto_perfil'
                        tipo='foto'
                        bgImage={bgPhoto?.location || fileCallback?.filePreview}
                        callback={(file) => {
                            if (file.status === 201 || file.status === 200) {
                                setFileCallback({
                                    status: file.status,
                                    id_foto_perfil: file.fileId,
                                    filePreview: file.filePreview
                                })
                                if (!newUser) { handleItems() }
                            }
                        }}
                    />
                </Box>
                <Box sx={{ ...styles.inputSection, whiteSpace: 'nowrap', alignItems: 'end', gap: 4 }}>
                    <Box sx={{ ...styles.inputSection, flexDirection: 'column', }}>
                        <Box sx={{ ...styles.inputSection }}>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nome Completo' name='nome' onChange={handleChange} value={userData?.nome || ''} label='Nome Completo *' onBlur={autoEmail} sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nome Social' name='nome_social' onChange={isPermissionEdit && handleChange} value={userData?.nome_social || ''} label='Nome Social' sx={{ flex: 1, }} />
                        </Box>
                        <Box sx={{ ...styles.inputSection }}>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail *' sx={{ flex: 1, }} />
                            <PhoneInputField
                                disabled={!isPermissionEdit && true}
                                label='Telefone *'
                                name='telefone'
                                onChange={(phone) => setUserData({ ...userData, telefone: phone })}
                                value={userData?.telefone}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ position: 'relative', justifyContent: 'center', alignItems: 'center', '&:hover': { opacity: 0.8, cursor: 'pointer' }, }}
                        onMouseEnter={() => setShowEditPhoto(true)}
                        onMouseLeave={() => setShowEditPhoto(false)}>
                        <Avatar src={bgPhoto?.location || fileCallback?.filePreview} sx={{
                            height: 'auto',
                            borderRadius: '16px',
                            width: { xs: '100%', sm: 150, md: 150, lg: 180 },
                            aspectRatio: '1/1',
                        }} variant="square" onClick={() => setShowEditFiles({ ...showEditFile, photoProfile: true })} />
                        {showEditPhoto &&
                            <Box sx={{ display: 'flex', position: 'absolute', justifyContent: 'center', alignItems: 'center', transition: '.3s', top: 0, bottom: 0, left: 0, right: 0 }}>
                                <Button
                                    disabled={!isPermissionEdit && true} small
                                    style={{ borderRadius: '8px', padding: '5px 10px', transition: '.3s', }}
                                    text='editar'
                                    onClick={() => setShowEditFiles({ ...showEditFile, photoProfile: true })}
                                />
                            </Box>}
                    </Box>
                </Box>
                <Box sx={{ ...styles.inputSection, justifyContent: 'start', alignItems: 'center', gap: 25 }}>
                    <CheckBoxComponent disabled={!isPermissionEdit && true}
                        valueChecked={userData?.perfil}
                        boxGroup={groupPerfil}
                        title="Perfil *"
                        horizontal={mobile ? false : true}
                        onSelect={(value) => setUserData({
                            ...userData,
                            perfil: value,
                            admin_sistema: !value.includes('funcionario') ? 0 : 1,
                            portal_aluno: !value.includes('aluno') ? 0 : 1,
                        })}
                        sx={{ flex: 1, }}
                    />

                </Box>
                <Box sx={{ ...styles.inputSection, justifyContent: 'start', alignItems: 'center', gap: 25, padding: '0px 0px 20px 15px' }}>
                    {!newUser &&
                        <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'center', marginTop: 2 }}>
                            <Text bold small>Observações do {userData?.perfil}:</Text>
                            <Button small text='observação' style={{ padding: '5px 6px 5px 6px', width: 100 }} onClick={() => setShowSections({ ...showSections, historic: true })} />
                        </Box>
                    }

                </Box>
                <RadioItem disabled={!isPermissionEdit && true} valueRadio={userData?.ativo} group={groupStatus} title="Status *" horizontal={mobile ? false : true} onSelect={(value) => setUserData({
                    ...userData,
                    ativo: parseInt(value),
                    admin_sistema: value < 1 ? parseInt(value) : userData?.admin_sistema,
                    portal_aluno: value < 1 ? parseInt(value) : userData?.admin_sistema
                })} />
            </ContentContainer>


            <ContentContainer style={{ ...styles.containerRegister, padding: showSections?.accessData ? '40px' : '25px' }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1, padding: showSections?.accessData ? '0px 0px 20px 0px' : '0px', "&:hover": {
                        opacity: 0.8,
                        cursor: 'pointer'
                    },
                    justifyContent: 'space-between'
                }} onClick={() => setShowSections({ ...showSections, accessData: !showSections?.accessData })}>
                    <Text title bold >Dados de acesso</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.gray_arrow_down})`,
                        transform: showSections?.accessData ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: '.3s',
                    }} />
                </Box>
                {showSections?.accessData &&
                    <>
                        <Box sx={{ ...styles.inputSection, whiteSpace: 'nowrap', alignItems: 'end', gap: 4 }}>
                            <Box sx={{ ...styles.inputSection, flexDirection: 'column', }}>
                                <Box sx={{ ...styles.inputSection }}>
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Login' name='login' onChange={handleChange} value={userData?.login || ''} label='Login *' sx={{ flex: 1, }} />

                                    <FileInput onClick={(value) => setShowEditFiles({ ...showEditFile, cert_nascimento: value })}>
                                        <TextInput disabled={!isPermissionEdit && true} placeholder='Nascimento' name='nascimento' onChange={handleChange} type="date" value={(userData?.nascimento)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                                        <EditFile
                                            isPermissionEdit={isPermissionEdit}
                                            columnId="id_doc_usuario"
                                            open={showEditFile.cert_nascimento}
                                            newUser={newUser}
                                            onSet={(set) => {
                                                setShowEditFiles({ ...showEditFile, cert_nascimento: set })
                                            }}
                                            title='Certidão de Nascimento ou de Certidão de Casamento'
                                            text='Faça o upload da sua certidão frente e verso, depois clique em salvar.'
                                            textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                                            fileData={filesUser?.filter((file) => file.campo === 'nascimento')}
                                            usuarioId={id}
                                            campo='nascimento'
                                            tipo='documento usuario'
                                            callback={(file) => {
                                                if (file.status === 201 || file.status === 200) {
                                                    if (!newUser) { handleItems() }
                                                    else {
                                                        handleChangeFilesUser('nascimento', file.fileId, file.filePreview)
                                                    }
                                                }
                                            }}
                                        />
                                    </FileInput>
                                </Box>
                            </Box>
                        </Box>
                        {!newUser && <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: 1.8 }}>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nova senha' name='nova_senha' onChange={handleChange} value={userData?.nova_senha || ''} type="password" label='Nova senha' sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Confirmar senha' name='confirmar_senha' onChange={handleChange} value={userData?.confirmar_senha || ''} type="password" label='Confirmar senha' sx={{ flex: 1, }} />
                        </Box>}
                        <RadioItem disabled={!isPermissionEdit && true} valueRadio={userData?.admin_sistema} group={groupAdmin} title="Acesso ao Sistema *" horizontal={mobile ? false : true} onSelect={(value) => setUserData({ ...userData, admin_sistema: parseInt(value) })} />
                        <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'start', marginTop: 2, flexDirection: 'column', padding: '0px 0px 20px 12px' }}>
                            <Button small text='permissões' style={{ padding: '5px 6px 5px 6px', width: 100 }} onClick={() => setShowSections({ ...showSections, permissions: true })} />
                        </Box>

                        <Backdrop open={showSections.permissions} sx={{ zIndex: 99999, }}>

                            <ContentContainer style={{ maxWidth: { md: '800px', lg: '1980px' }, maxHeight: { md: '180px', lg: '1280px' }, marginLeft: { md: '180px', lg: '0px' }, overflowY: matches && 'auto', marginLeft: { md: '180px', lg: '280px' } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 999999999 }}>
                                    <Text bold large>Permissões</Text>
                                    <Box sx={{
                                        ...styles.menuIcon,
                                        backgroundImage: `url(${icons.gray_close})`,
                                        transition: '.3s',
                                        zIndex: 999999999,
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer'
                                        }
                                    }} onClick={() => setShowSections({ ...showSections, permissions: false })} />
                                </Box>
                                <Divider padding={0} />
                                <ContentContainer style={{ boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                        <Text bold>Grupo de permissões</Text>
                                        <CheckBoxComponent disabled={!isPermissionEdit && true}
                                            boxGroup={groupPermissions}
                                            valueChecked={permissionPerfil || ''}
                                            horizontal={false}
                                            onSelect={(value) => {
                                                setPermissionPerfil(value)
                                            }}
                                            sx={{ width: 1 }}
                                        />
                                    </Box>
                                </ContentContainer>
                                <Divider padding={0} />
                                <Box style={{ display: 'flex' }}>
                                    <Button disabled={!isPermissionEdit && true} small
                                        style={{ width: '50%', marginRight: 1, height: 30 }}
                                        text='Salvar'
                                        onClick={() => {
                                            !newUser ? handleAddPermission() :
                                                alert.info('Permissões atualizadas')
                                            setShowSections({ ...showSections, permissions: false })
                                        }}
                                    />
                                    <Button disabled={!isPermissionEdit && true} secondary small
                                        style={{ width: '50%', height: 30 }}
                                        text='Cancelar'
                                        onClick={() => setShowSections({ ...showSections, permissions: false })}
                                    />
                                </Box>
                            </ContentContainer>
                        </Backdrop>

                    </>}
            </ContentContainer>

            <ContentContainer style={{ ...styles.containerRegister, padding: showSections.registration ? '40px' : '25px' }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1, padding: showSections.registration ? '0px 0px 20px 0px' : '0px', "&:hover": {
                        opacity: 0.8,
                        cursor: 'pointer'
                    },
                    justifyContent: 'space-between'
                }} onClick={() => setShowSections({ ...showSections, registration: !showSections.registration })}>
                    <Text title bold >Cadastro Completo</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.gray_arrow_down})`,
                        transform: showSections.registration ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: '.3s',
                    }} />
                </Box>
                {showSections.registration &&
                    <>

                        <Box sx={{ padding: '0px 0px 20px 0px' }}>
                            <CheckBoxComponent disabled={!isPermissionEdit && true}
                                boxGroup={groupForeigner}
                                valueChecked={userData?.foreigner || ''}
                                horizontal={mobile ? false : true}
                                onSelect={(value) => {
                                    setForeigner(value)
                                    setUserData({ ...userData, nacionalidade: value === true ? 'Estrangeira' : 'Brasileira Nata' })
                                }}
                                sx={{ width: 1 }} />
                        </Box>
                        <Box sx={styles.inputSection}>
                            {!foreigner &&
                                <FileInput onClick={(value) => setShowEditFiles({ ...showEditFile, cpf: value })}>
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='CPF' name='cpf' onChange={handleChange} value={userData?.cpf || ''} label='CPF' sx={{ flex: 1, }} />
                                </FileInput>
                            }
                            <EditFile
                                isPermissionEdit={isPermissionEdit}
                                columnId="id_doc_usuario"
                                open={showEditFile.cpf}
                                newUser={newUser}
                                onSet={(set) => {
                                    setShowEditFiles({ ...showEditFile, cpf: set })
                                }}
                                title='CPF - Frente e verso'
                                text='Faça o upload do seu documento frente e verso, depois clique em salvar.'
                                textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                                fileData={filesUser?.filter((file) => file.campo === 'cpf')}
                                usuarioId={id}
                                campo='cpf'
                                tipo='documento usuario'
                                callback={(file) => {
                                    if (file.status === 201 || file.status === 200) {
                                        if (!newUser) { handleItems() }
                                        else {
                                            handleChangeFilesUser('cpf', file.fileId, file.filePreview)
                                        }
                                    }
                                }}
                            />
                            {foreigner &&
                                <FileInput onClick={(value) => setShowEditFiles({ ...showEditFile, foreigner: value })}>
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Doc estrangeiro' name='doc_estrangeiro' onChange={handleChange} value={userData?.doc_estrangeiro || ''} label='Doc estrangeiro' sx={{ flex: 1, }} />
                                    <EditFile
                                        isPermissionEdit={isPermissionEdit}
                                        columnId="id_doc_usuario"
                                        open={showEditFile.foreigner}
                                        newUser={newUser}
                                        onSet={(set) => {
                                            setShowEditFiles({ ...showEditFile, foreigner: set })
                                        }}
                                        title='Documento estrangeiro - Frente e verso'
                                        text='Faça o upload do seu documento frente e verso, depois clique em salvar.'
                                        textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                                        fileData={filesUser?.filter((file) => file.campo === 'estrangeiro')}
                                        usuarioId={id}
                                        campo='estrangeiro'
                                        tipo='documento usuario'
                                        callback={(file) => {
                                            if (file.status === 201 || file.status === 200) {
                                                if (!newUser) { handleItems() }
                                                else {
                                                    handleChangeFilesUser('estrangeiro', file.fileId, file.filePreview)
                                                }
                                            }
                                        }}
                                    />
                                </FileInput>
                            }
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Cidade' name='naturalidade' onChange={handleChange} value={userData?.naturalidade || ''} label='Naturalidade *' sx={{ flex: 1, }} />

                            <SelectList disabled={!isPermissionEdit && true} fullWidth data={countries} valueSelection={userData?.pais_origem || ''} onSelect={(value) => setUserData({ ...userData, pais_origem: value })}
                                title="Pais de origem *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />
                            <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupNationality} valueSelection={userData?.nacionalidade || ''} onSelect={(value) => setUserData({ ...userData, nacionalidade: value })}
                                title="Nacionalidade *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />
                        </Box>

                        <Box sx={styles.inputSection}>

                            <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupRacaCor} valueSelection={userData.cor_raca} onSelect={(value) => setUserData({ ...userData, cor_raca: value })}
                                title="Cor/raça *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />

                            <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupGender} valueSelection={userData?.genero} onSelect={(value) => setUserData({ ...userData, genero: value })}
                                title="Gênero *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />

                            <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupDisability} valueSelection={userData?.deficiencia} onSelect={(value) => setUserData({ ...userData, deficiencia: value })}
                                title="Deficiência Física/Necessidade especial educacional*" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />

                        </Box>

                        {userData?.deficiencia?.includes('Sim') &&
                            <>
                                <CheckBoxComponent disabled={!isPermissionEdit && true}
                                    valueChecked={userData?.tipo_deficiencia || ''}
                                    boxGroup={groupDeficiency}
                                    title="Tipo de deficiência"
                                    horizontal={mobile ? false : true}
                                    onSelect={(value) => setUserData({
                                        ...userData,
                                        tipo_deficiencia: value
                                    })}
                                    sx={{ width: 1 }}
                                />

                                <CheckBoxComponent disabled={!isPermissionEdit && true}
                                    valueChecked={userData?.autista || ''}
                                    boxGroup={groupAutism}
                                    title="Transtorno global do desenvolvimento/Transtorno do espectro autista"
                                    horizontal={mobile ? false : true}
                                    onSelect={(value) => setUserData({
                                        ...userData,
                                        autista: value
                                    })}
                                    sx={{ width: 1 }}
                                />

                                <CheckBoxComponent disabled={!isPermissionEdit && true}
                                    valueChecked={userData?.superdotado || ''}
                                    boxGroup={groupSuperGifted}
                                    title="Altas habilidades/superdotação"
                                    horizontal={mobile ? false : true}
                                    onSelect={(value) => setUserData({
                                        ...userData,
                                        superdotado: value
                                    })}
                                    sx={{ width: 1 }}
                                />
                            </>
                        }

                        <RadioItem disabled={!isPermissionEdit && true} valueRadio={userData?.estado_civil} group={groupCivil} title="Estado Cívil *" horizontal={mobile ? false : true} onSelect={(value) => setUserData({ ...userData, estado_civil: value })} />
                        <Box sx={{ ...styles.inputSection, alignItems: 'center' }}>
                            <TextInput fullWidth disabled={!isPermissionEdit && true} placeholder='E-mail Corporativo' name='email_corporativo' onChange={handleChange} value={userData?.email_corporativo || ''} label='E-mail Corporativo' />
                            <TextInput fullWidth disabled={!isPermissionEdit && true} placeholder='E-mail Pessoal' name='email_pessoal' onChange={handleChange} value={userData?.email_pessoal || ''} label='E-mail Pessoal' />
                        </Box>
                        <Box sx={{ maxWidth: '580px', margin: '10px 0px 10px 0px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Text bold style={{ padding: '0px 0px 0px 10px' }}>Dependentes</Text>
                            {arrayDependent.map((dep, index) => (
                                <>

                                    <Box key={index} sx={{ ...styles.inputSection, alignItems: 'center' }}>
                                        <FileInput left onClick={() => setShowEditFiles({ ...showEditFile, cpf_dependente: true })}>
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nome' name={`nome_dependente-${index}`} onChange={(e) => handleChangeDependentArray(e, 'nome_dependente', dep?.id_dependente)} value={dep.nome_dependente} sx={{ flex: 1 }} />
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='CPF' name={`cpf_dependente-${index}`} onChange={(e) => handleChangeDependentArray(e, 'cpf_dependente', dep?.id_dependente)} value={dep.cpf_dependente} sx={{ flex: 1 }} />
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Data de Nascimento' name={`dt_nasc_dependente-${index}`} onChange={(e) => handleChangeDependentArray(e, 'dt_nasc_dependente', dep?.id_dependente)} type="date" value={(dep.dt_nasc_dependente)?.split('T')[0] || ''} sx={{ flex: 1 }} />
                                        </FileInput>
                                        <EditFile
                                            isPermissionEdit={isPermissionEdit}
                                            columnId="id_doc_usuario"
                                            open={showEditFile.cpf_dependente}
                                            newUser={newUser}
                                            onSet={(set) => {
                                                setShowEditFiles({ ...showEditFile, cpf_dependente: set })
                                            }}
                                            title='CPF Dependente - Frente e verso'
                                            text='Faça o upload do documento do Dependente frente e verso, depois clique em salvar.'
                                            textDropzone='Arraste ou clique para selecionar a Foto ou Arquivo que deseja'
                                            fileData={filesUser?.filter((file) => file.campo === 'cpf_dependente')}
                                            usuarioId={id}
                                            campo='cpf_dependente'
                                            tipo='documento usuario'
                                            callback={(file) => {
                                                if (file.status === 201 || file.status === 200) {
                                                    if (!newUser) { handleItems() }
                                                    else {
                                                        handleChangeFilesUser('cpf_dependente', file.fileId, file.filePreview)
                                                    }
                                                }
                                            }}
                                        />

                                        {isPermissionEdit && <Box sx={{
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            width: 25,
                                            height: 25,
                                            backgroundImage: `url(/icons/remove_icon.png)`,
                                            transition: '.3s',
                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                            }
                                        }} onClick={() => {
                                            newUser ? deleteDependent(index) : handleDeleteDependent(dep?.id_dependente)
                                        }} />}

                                    </Box>
                                </>
                            ))}
                            {isPermissionEdit && <Box sx={{ ...styles.inputSection, alignItems: 'center' }}>
                                <TextInput disabled={!isPermissionEdit && true} placeholder='Nome' name={`nome_dependente`} onChange={handleChangeDependent} value={dependent?.nome_dependente} sx={{ flex: 1 }} />
                                <TextInput disabled={!isPermissionEdit && true} placeholder='CPF' name={`cpf_dependente`} onChange={handleChangeDependent} value={dependent?.cpf_dependente} sx={{ flex: 1 }} />
                                <TextInput disabled={!isPermissionEdit && true} placeholder='Data de Nascimento' name={`dt_nasc_dependente`} onChange={handleChangeDependent} type="date" value={(dependent?.dt_nasc_dependente)?.split('T')[0] || ''} sx={{ flex: 1 }} />
                                <Box sx={{
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    width: 25,
                                    height: 25,
                                    borderRadius: '50%',
                                    backgroundImage: `url(/icons/include_icon.png)`,
                                    transition: '.3s',
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer'
                                    }
                                }} onClick={() => {
                                    newUser ? addDependent() : handleAddDependent()
                                }} />
                            </Box>}
                        </Box>


                        <Box sx={styles.inputSection}>
                            {userData?.estado_civil === 'Casado' && <TextInput disabled={!isPermissionEdit && true} placeholder='Conjuge' name='conjuge' onChange={handleChange} value={userData?.conjuge || ''} label='Conjuge' sx={{ flex: 1, }} />}
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nome do Pai' name='nome_pai' onChange={handleChange} value={userData?.nome_pai || ''} label='Nome do Pai' sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nome da Mãe' name='nome_mae' onChange={handleChange} value={userData?.nome_mae || ''} label='Nome da Mãe *' sx={{ flex: 1, }} />

                        </Box>
                        <ContentContainer>
                            <Text large bold >Contato de Emergência</Text>
                            <Box sx={styles.inputSection}>
                                <TextInput disabled={!isPermissionEdit && true} placeholder='Nome' name='nome_emergencia' onChange={handleChange} value={userData?.nome_emergencia || ''} label='Nome' sx={{ flex: 1, }} />
                                <PhoneInputField
                                    disabled={!isPermissionEdit && true}
                                    label='Telefone de emergência'
                                    placeholder='(11) 91234-6789'
                                    name='telefone_emergencia'
                                    onChange={(phone) => setUserData({ ...userData, telefone_emergencia: phone })}
                                    value={userData?.telefone_emergencia}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                        </ContentContainer>
                        <FileInput onClick={(value) => setShowEditFiles({ ...showEditFile, schoolRecord: value })} style={{ alignItems: 'center' }}>
                            <RadioItem disabled={!isPermissionEdit && true} valueRadio={userData?.escolaridade} group={groupEscolaridade} title="Escolaridade *" horizontal={mobile ? false : true} onSelect={(value) => {
                                if (value !== 'Ensino médio') {
                                    setUserData({ ...userData, escolaridade: value, tipo_origem_ensi_med: '' })
                                } else {
                                    setUserData({ ...userData, escolaridade: value })
                                }
                            }
                            } />
                            <EditFile
                                isPermissionEdit={isPermissionEdit}
                                columnId="id_doc_usuario"
                                open={showEditFile.schoolRecord}
                                newUser={newUser}
                                onSet={(set) => {
                                    setShowEditFiles({ ...showEditFile, schoolRecord: set })
                                }}
                                title='Historico Escolar/Diploma/Certificado de conclusão'
                                text='Por favor, faça o upload do seu certificado, diploma ou histórico escolar. Caso você tenha mais de um diploma ou certificado de conclusão,
                                 faça também o upload do mesmo.'
                                textDropzone='Arraste ou clique para selecionar a Foto ou arquivo desejado.'
                                fileData={filesUser?.filter((file) => file.campo === 'historico/diploma')}
                                usuarioId={id}
                                campo='historico/diploma'
                                tipo='documento usuario'
                                callback={(file) => {
                                    if (file.status === 201 || file.status === 200) {
                                        if (!newUser) { handleItems() }
                                        else {
                                            handleChangeFilesUser('historico/diploma', file.fileId, file.filePreview)
                                        }
                                    }
                                }}
                            />
                        </FileInput>
                        {userData?.escolaridade === 'Ensino médio' && <RadioItem disabled={!isPermissionEdit && true}
                            valueRadio={userData?.tipo_origem_ensi_med}
                            group={groupOrigemEnsinoMedio}
                            title="Origem Ensino Médio *"
                            horizontal={mobile ? false : true}
                            onSelect={(value) => setUserData({ ...userData, tipo_origem_ensi_med: value })}
                        />}

                        <Box sx={styles.inputSection}>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='CEP' name='cep' onChange={handleChange} value={userData?.cep || ''} label='CEP *' onBlur={handleBlurCEP} sx={{ flex: 1, }} />
                            <FileInput onClick={(value) => setShowEditFiles({ ...showEditFile, address: value })}>
                                <TextInput disabled={!isPermissionEdit && true} placeholder='Endereço' name='rua' onChange={handleChange} value={userData?.rua || ''} label='Endereço *' sx={{ flex: 1, }} />
                                <EditFile
                                    isPermissionEdit={isPermissionEdit}
                                    columnId="id_doc_usuario"
                                    open={showEditFile.address}
                                    newUser={newUser}
                                    onSet={(set) => {
                                        setShowEditFiles({ ...showEditFile, address: set })
                                    }}
                                    title='Comprovante de residencia'
                                    text='Faça o upload do seu comprovante de residencia, precisa ser uma conta em seu nome ou comprovar que mora com o titular da conta.'
                                    textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                                    fileData={filesUser?.filter((file) => file.campo === 'comprovante residencia')}
                                    usuarioId={id}
                                    campo='comprovante residencia'
                                    tipo='documento usuario'
                                    callback={(file) => {
                                        if (file.status === 201 || file.status === 200) {
                                            if (!newUser) { handleItems() }
                                            else {
                                                handleChangeFilesUser('comprovante residencia', file.fileId, file.filePreview)
                                            }
                                        }
                                    }}
                                />
                            </FileInput>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Nº' name='numero' onChange={handleChange} value={userData?.numero || ''} label='Nº *' sx={{ flex: 1, }} />
                        </Box>
                        <Box sx={styles.inputSection}>
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Cidade' name='cidade' onChange={handleChange} value={userData?.cidade || ''} label='Cidade *' sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='UF' name='uf' onChange={handleChange} value={userData?.uf || ''} label='UF *' sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Bairro' name='bairro' onChange={handleChange} value={userData?.bairro || ''} label='Bairro *' sx={{ flex: 1, }} />
                            <TextInput disabled={!isPermissionEdit && true} placeholder='Complemento' name='complemento' onChange={handleChange} value={userData?.complemento || ''} label='Complemento' sx={{ flex: 1, }} />
                        </Box>

                    </>
                }
            </ContentContainer>

            {/* contrato */}
            {userData.perfil && !userData.perfil.includes('cliente') &&
                <>
                    <ContentContainer style={{ ...styles.containerContract, padding: showContract ? '40px' : '25px' }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', padding: showContract ? '0px 0px 20px 0px' : '0px', gap: 1, "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            },
                            justifyContent: 'space-between'
                        }} onClick={() => setShowContract(!showContract)}>
                            <Text title bold >Contrato</Text>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url(${icons.gray_arrow_down})`,
                                transform: showContract ? 'rotate(0deg)' : 'rotate(-90deg)',
                                transition: '.3s',
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer'
                                }
                            }} />
                        </Box>
                        {showContract &&
                            <>
                                <Box sx={styles.inputSection}>
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Função' name='funcao' onChange={handleChangeContract} value={contract?.funcao || ''} label='Função' sx={{ flex: 1, }} />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Início da contratação' name='admissao' type="date" onChange={handleChangeContract} value={(contract?.admissao)?.split('T')[0] || ''} label='Início da contratação' sx={{ flex: 1, }} />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Encerramento' name='desligamento' type="date" onChange={handleChangeContract} value={contract?.desligamento?.split('T')[0] || ''} label='Encerramento da contratação' sx={{ flex: 1, }} onBlur={() => {
                                        new Date(contract?.desligamento) > new Date(1001, 0, 1) &&
                                            setUserData({ ...userData, ativo: 0, admin_sistema: contract?.desligamento ? 0 : userData?.admin_sistema })
                                    }} />
                                </Box>
                                <Box sx={styles.inputSection}>
                                    <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupBank} valueSelection={contract?.banco_1} onSelect={(value) => setContract({ ...contract, banco_1: value })}
                                        title="Banco" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                                    />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Conta' name='conta_1' onChange={handleChangeContract} value={contract?.conta_1 || ''} label='Conta' sx={{ flex: 1, }} />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Agência' name='agencia_1' onChange={handleChangeContract} value={contract?.agencia_1 || ''} label='Agência' sx={{ flex: 1, }} />
                                    <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupAccount} valueSelection={contract?.tipo_conta_1} onSelect={(value) => setContract({ ...contract, tipo_conta_1: value })}
                                        title="Tipo de conta" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                                    />
                                </Box>
                                <Box sx={styles.inputSection}>
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Banco 2' name='banco_2' onChange={handleChangeContract} value={contract?.banco_2 || ''} label='Banco 2' sx={{ flex: 1, }} />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Conta 2' name='conta_2' onChange={handleChangeContract} value={contract?.conta_2 || ''} label='Conta 2' sx={{ flex: 1, }} />
                                    <TextInput disabled={!isPermissionEdit && true} placeholder='Agência 2' name='agencia_2' onChange={handleChangeContract} value={contract?.agencia_2 || ''} label='Agência 2' sx={{ flex: 1, }} />
                                    <SelectList disabled={!isPermissionEdit && true} fullWidth data={groupAccount} valueSelection={contract?.tipo_conta_2} onSelect={(value) => setContract({ ...contract, tipo_conta_2: value })}
                                        title="Tipo de conta 2" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                                    />
                                </Box>

                                <ContentContainer style={{ boxShadow: 'none' }}>
                                    <Box sx={{ display: 'flex', gap: 5, flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                            <Text bold title>Horários de atendimento Disponíveis</Text>
                                            {officeHours && <Box sx={{ display: 'flex' }}>
                                                <Button disabled={!isPermissionEdit && true} small text='replicar' style={{ padding: '5px 16px 5px 16px' }} onClick={replicateToDaysWork} />
                                            </Box>}
                                        </Box>
                                        <TableOfficeHours data={officeHours} onChange={handleOfficeHours} />
                                    </Box>
                                </ContentContainer>

                            </>
                        }
                    </ContentContainer>

                </>}

            <Backdrop open={showSections.historic} sx={{ zIndex: 99999, }}>
                {showSections.historic &&
                    <ContentContainer style={{ maxWidth: { md: '800px', lg: '1980px' }, maxHeight: { md: '180px', lg: '1280px' }, marginLeft: { md: '180px', lg: '280px' }, overflowY: matches && 'auto', }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 999999999 }}>
                            <Text bold large>Observações</Text>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url(${icons.gray_close})`,
                                transition: '.3s',
                                zIndex: 999999999,
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer'
                                }
                            }} onClick={() => setShowSections({ ...showSections, historic: false })} />
                        </Box>
                        <Divider padding={0} />
                        <ContentContainer style={{ boxShadow: 'none', overflowY: matches && 'auto', }}>
                            <Table_V1 columns={columnHistoric}
                                data={arrayHistoric}
                                columnId="id_historico"
                                columnActive={false}
                                onSelect={(value) => setValueIdHistoric(value)}
                                routerPush={false}
                            />

                            {!showSections.addHistoric && <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'center', marginTop: 2 }}>
                                <Button disabled={!isPermissionEdit && true} small text='adicionar' style={{ padding: '5px 6px 5px 6px', width: 100 }} onClick={() => setShowSections({ ...showSections, addHistoric: true })} />
                            </Box>}

                            {showSections.addHistoric &&
                                <>
                                    <ContentContainer style={{ overflowY: matches && 'auto', }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 999999999 }}>
                                            <Text bold>Nova Observação</Text>
                                            <Box sx={{
                                                ...styles.menuIcon,
                                                width: 15,
                                                height: 15,
                                                backgroundImage: `url(${icons.gray_close})`,
                                                transition: '.3s',
                                                zIndex: 999999999,
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: 'pointer'
                                                }
                                            }} onClick={() => setShowSections({ ...showSections, addHistoric: false })} />
                                        </Box>
                                        <Divider />
                                        <Box sx={{ ...styles.inputSection, alignItems: 'center' }}>
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Data' name='dt_ocorrencia' onChange={handleChangeHistoric} value={(historicData?.dt_ocorrencia)?.split('T')[0] || ''} type="date" sx={{ flex: 1 }} />
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Responsável' name='responsavel' onChange={handleChangeHistoric} value={historicData?.responsavel || ''} label="Responsável" sx={{ flex: 1 }} />
                                        </Box>
                                        <TextInput disabled={!isPermissionEdit && true}
                                            placeholder='Ocorrência'
                                            name='ocorrencia'
                                            onChange={handleChangeHistoric}
                                            value={historicData?.ocorrencia || ''}
                                            label="Ocorrência"
                                            sx={{ flex: 1 }}
                                            multiline
                                            maxRows={5}
                                            rows={3}
                                        />
                                        <Divider />
                                        <Button disabled={!isPermissionEdit && true} small text='incluir' style={{ padding: '5px 6px 5px 6px', width: 100 }} onClick={() => {
                                            newUser ? addHistoric() : handleAddHistoric()
                                            setShowSections({ ...showSections, addHistoric: false })
                                        }} />
                                    </ContentContainer>
                                </>}

                            {valueIdHistoric && arrayHistoric.filter((item) => item.id_historico === valueIdHistoric).map((historic) => (
                                <>
                                    <ContentContainer style={{ overflowY: matches && 'auto', }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 999999999 }}>
                                            <Text bold>Observação</Text>
                                            <Box sx={{
                                                ...styles.menuIcon,
                                                backgroundSize: 'contain',
                                                width: 15,
                                                height: 15,
                                                backgroundImage: `url(${icons.gray_close})`,
                                                transition: '.3s',
                                                zIndex: 999999999,
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: 'pointer'
                                                }
                                            }} onClick={() => setValueIdHistoric('')} />
                                        </Box>
                                        <Divider />
                                        <Box key={historic} sx={{ ...styles.inputSection, alignItems: 'center' }}>
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Data' name='dt_ocorrencia' onChange={handleChangeHistoric} value={(historic?.dt_ocorrencia)?.split('T')[0] || ''} type="date" sx={{ flex: 1 }} />
                                            <TextInput disabled={!isPermissionEdit && true} placeholder='Responsável' name='responsavel' onChange={handleChangeHistoric} value={historic?.responsavel || ''} label="Responsável" sx={{ flex: 1 }} />
                                        </Box>
                                        <TextInput disabled={!isPermissionEdit && true}
                                            placeholder='Ocorrência'
                                            name='ocorrencia'
                                            onChange={handleChangeHistoric}
                                            value={historic?.ocorrencia || ''}
                                            label="Ocorrência"
                                            sx={{ flex: 1 }}
                                            multiline
                                            maxRows={5}
                                            rows={3}
                                        />
                                        <Divider />
                                        <Button disabled={!isPermissionEdit && true} small secondary text='excluir' style={{ padding: '5px 6px 5px 6px', width: 100 }} onClick={() => {
                                            newUser ? deleteHistoric(valueIdHistoric) : handleDeleteHistoric(historic?.id_historico)
                                        }} />
                                    </ContentContainer>
                                </>
                            ))}
                        </ContentContainer>

                    </ContentContainer>
                }
            </Backdrop>
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
    containerContract: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1.8,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    },
    containerFile: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'gray lightgray',
        '&::-webkit-scrollbar': {
            width: '5px',

        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'darkgray',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'gray',

        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray',

        },
    }
}

export const EditFile = (props) => {
    const {
        open = false,
        onSet = () => { },
        callback = () => { },
        title = '',
        text = '',
        textDropzone = '',
        campo = '',
        tipo = '',
        bgImage = '',
        usuarioId,
        newUser,
        fileData = [],
        columnId = '',
        matriculaId,
        isPermissionEdit
    } = props

    const { alert, setLoading, matches } = useAppContext()

    const handleDeleteFile = async (files) => {
        setLoading(true)
        const response = await deleteFile({ fileId: files?.[columnId], usuario_id: usuarioId, campo: files.campo, key: files?.key_file, matriculaId })
        const { status } = response
        let file = {
            status
        }
        if (status === 200) {
            alert.success('Aqruivo removido.');
            callback(file)
        } else {
            alert.error('Ocorreu um erro ao remover arquivo.');
        }
        setLoading(false)
    }

    return (
        <Backdrop open={open} sx={{ zIndex: 99999, }}>
            <ContentContainer style={{ ...styles.containerFile, maxHeight: { md: '180px', lg: '1280px' }, marginLeft: { md: '180px', lg: '0px' }, overflowY: matches && 'scroll', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 999999999, alignItems: 'center', padding: '0px 0px 8px 0px' }}>
                    <Text bold>{title}</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        width: 15,
                        height: 15,
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        zIndex: 999999999,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => {
                        onSet(false)
                    }} />
                </Box>
                <Divider />
                <Box sx={{
                    display: 'flex',
                    whiteSpace: 'wrap',
                    maxWidth: 280,
                    justifyContent: 'center'
                }}>
                    <Text>{text}</Text>
                </Box>
                {isPermissionEdit &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <CustomDropzone
                            txt={textDropzone}
                            bgImage={bgImage}
                            bgImageStyle={{
                                backgroundImage: `url(${bgImage})`,
                                backgroundSize: campo === 'foto_perfil' ? 'cover' : 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                width: { xs: '100%', sm: 150, md: 150, lg: 150 },
                                borderRadius: campo === 'foto_perfil' ? '50%' : '',
                                aspectRatio: '1/1',
                            }}
                            callback={(file) => {
                                if (file.status === 201) {
                                    callback(file)
                                }
                            }}
                            usuario_id={usuarioId}
                            campo={campo}
                            tipo={tipo}
                            matricula_id={matriculaId}
                        />

                    </Box>}

                {bgImage &&
                    <>
                        <Divider padding={0} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'center', marginTop: 2 }}>
                                <Button disabled={!isPermissionEdit && true} secondary small text='Remover' style={{ padding: '5px 10px 5px 10px', width: 120 }} onClick={() => {
                                    newUser ? callback("") : handleDeleteFile()
                                }} />
                            </Box>
                        </Box>
                    </>
                }

                {campo != 'foto_perfil' && fileData?.length > 0 &&
                    <ContentContainer>
                        <Text bold>Arquivos</Text>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            {fileData?.map((file, index) => {
                                const typePdf = file?.name_file
                                    ?.includes('pdf') || null;
                                return (
                                    <Box key={`${file}-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '160px' }}>

                                        <Link style={{ display: 'flex', position: 'relative', border: `1px solid gray`, borderRadius: '8px' }} href={file.location} target="_blank">
                                            <Box
                                                sx={{
                                                    backgroundImage: `url('${typePdf ? '/icons/pdf_icon.png' : file?.location}')`,
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center center',
                                                    width: { xs: '100%', sm: 150, md: 150, lg: 150 },
                                                    aspectRatio: '1/1',
                                                }}>
                                            </Box>
                                            {isPermissionEdit && <Box sx={{
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                width: 22,
                                                height: 22,
                                                backgroundImage: `url(/icons/remove_icon.png)`,
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                transition: ".3s",
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: "pointer",
                                                },
                                                zIndex: 9999999,
                                            }} onClick={(event) => {
                                                event.preventDefault()
                                                handleDeleteFile(file)
                                            }} />}
                                        </Link>
                                        <Text sx={{ fontWeight: 'bold', fontSize: 'small', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {decodeURIComponent(file?.name_file)}
                                        </Text>
                                    </Box>
                                )
                            })}
                        </Box>
                    </ContentContainer>
                }
            </ContentContainer>
        </Backdrop>
    )
}