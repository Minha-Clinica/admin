import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Avatar, Backdrop, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, Divider } from "../../atoms"
import { CheckBoxComponent, CustomDropzone, RadioItem, SectionHeader } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { icons } from "../../organisms/layout/Colors"
import { createUser, deleteFile, deleteUser, editeUser } from "../../validators/api-requests"
import { emailValidator, formatCPF, formatterHours, horarios, statusColor } from "../../helpers"
import { SelectList } from "../../organisms/select/SelectList"
import Link from "next/link"
import { checkUserPermissions } from "../../validators/checkPermissionUser"
import AnamneseUser from "./Components/anamnese"

export default function EditUser() {
    const { setLoading, alert, colorPalette, user, matches, theme, setShowConfirmationDialog, menuItemsList, userPermissions } = useAppContext()
    const usuario_id = user.id;
    const router = useRouter()
    const { id, menuScreen, company } = router.query;
    const menu = menuScreen ? menuScreen : `userData`;
    const newUser = id === 'new';
    const [fileCallback, setFileCallback] = useState()
    const [companies, setCompanyList] = useState([])
    const [consultions, setConsultions] = useState([])
    const [bgPhoto, setBgPhoto] = useState({})
    const [userData, setUserData] = useState({
        cpf: null,
        genero: '',
        telefone: null,
        ativo: 1,
        admin_sistema: 1,
        login: null,
        nascimento: null,
        foto_perfil_id: bgPhoto?.location || fileCallback?.filePreview || null,
        nome_social: null
    })
    const [contract, setContract] = useState({
        funcao: null,
        area: null,
        horario: null,
        admissao: null,
        desligamento: null,
        conta_id: null,
        banco_1: null,
        conta_1: null,
        agencia_1: null,
        tipo_conta_1: null,
        banco_2: null,
        conta_2: null,
        agencia_2: null,
        tipo_conta_2: null
    })

    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    const [showSections, setShowSections] = useState({
        registration: false,
        permissions: false,
        accessData: false,
    })
    const [showEditFile, setShowEditFiles] = useState({
        photoProfile: false,
        cpf: false
    })
    const [filesUser, setFilesUser] = useState([])
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)
    const [menuSelected, setMenuSelected] = useState('userdata')
    const isAdministrador = user?.perfil?.includes('administrador');
    const isPartner = user?.perfil?.includes(`parceiro`)

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
        getCompany()
        fetchPermissions()
    }, [])

    const getUserData = async () => {
        try {
            const response = await api.get(`/user/${id}`)
            const { data } = response

            setUserData(data)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const getCompany = async () => {
        setLoading(true)
        try {
            const response = await api.get('/companies')
            const { data = [] } = response;
            let companiesData = data.map((item) => ({
                label: item.razao_social,
                value: item.id_empresa
            }))

            if (company) {
                userData.empresa_id = company
                if (!isAdministrador) {
                    companiesData = companiesData?.filter(item => item.value === company)
                }
            }

            setCompanyList(companiesData)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
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

    const getConsultion = async () => {
        try {
            let query = `/consultation/pacient/${id}`

            const response = await api.get(query, {
                params: {
                    date: {
                        startDate: null,
                        endDate: null
                    },
                    status_pagamento: null,
                    status: null,
                    paciente_id: null
                }
            });
            const { data = [] } = response;

            console.log(data)
            if (Array.isArray(data) && data.length > 0) {
                setConsultions(data);
            } else {
                setConsultions([]); // Certifique-se de definir um array vazio se os dados não forem um array ou estiverem vazios
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    };



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


    const handleItems = async () => {
        setLoading(true)
        try {
            await getUserData()
            await getPhoto()
            await getFileUser()
            await getConsultion()
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

        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
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

        if (userData?.nova_senha !== '' && (userData?.nova_senha !== userData?.confirmar_senha)) {
            alert?.error('As senhas não correspondem. Por favor, verifique novamente.')
            return false
        }

        return true
    }

    const handleCreateUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                if (company) {
                    userData.empresa_id = company
                    userData.perfil = 'paciente'
                }

                const response = await createUser({ userData, usuario_id })
                const { data } = response
                if (fileCallback) {
                    const file = await api.patch(`/file/edit/${fileCallback?.id_foto_perfil}/${data?.userId}`)
                }
                if (newUser && filesUser) {
                    const files = await api.patch(`/file/editFiles/${data?.userId}`, { filesUser });
                }
                if (response?.status === 201) {
                    alert.success('Usuário cadastrado com sucesso.');
                    if (data?.userId) {
                        if (company) {
                            router.push(`/organization/${user.empresa_id}`)
                        } else {
                            router.push(`/users/list`)
                        }
                    }
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
                router.push(`/users/list`)
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

    const groupPerfil = [
        { label: 'Parceiro', value: 'parceiro' },
        { label: 'Paciente', value: 'paciente' },
        { label: 'Administrador', value: 'administrador' },
    ]

    const groupStatus = [
        { label: 'ativo', value: 1 },
        { label: 'inativo', value: 0 },
    ]

    const groupAdmin = [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },

    ]

    const groupGender = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' }
    ]

    const showMenu = [
        {
            label: 'Dados do Usuário', value: 'userdata', showPerfil: ['administrador', 'paciente', 'parceiro'],
            icon: 'personal-data.png'
        },
        {
            label: 'Anamnese', value: 'anamnese', showPerfil: ['paciente'],
            icon: 'patient.png'
        },
        {
            label: 'Sessões', value: 'sessoes', showPerfil: ['paciente'],
            icon: 'chat.png'
        },
    ]

    return (
        <>
            <SectionHeader
                perfil={userData?.perfil}
                title={userData?.nome || `Novo ${userData?.perfil === 'parceiro' && 'Parceiro' || userData?.perfil === 'administrador' && 'Administrador' || userData?.perfil === 'paciente' && 'Paciente' || 'Usuário'}`}
                saveButton={isPermissionEdit && menuSelected === 'userdata'}
                saveButtonAction={newUser ? handleCreateUser : handleEditUser}
                deleteButton={!newUser && isAdministrador && menuSelected === 'userdata'}
                deleteButtonAction={(event) => setShowConfirmationDialog({
                    active: true,
                    event,
                    acceptAction: handleDeleteUser,
                    title: 'Excluir usuário',
                    message: 'Tem certeza que deseja prosseguir com a exclusão do usuário? Todos os dados vinculados a esse usuário serão excluídos, sem opção de recuperação.',
                })}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                {showMenu?.map((item, index) => {
                    const isSelected = menuSelected === item.value
                    const isPerfil = item?.showPerfil?.some(role => userData?.perfil?.includes(role))
                    if (userData?.perfil && isPerfil) {

                        return (
                            <Box key={index} sx={{
                                display: 'flex', padding: '15px 20px', backgroundColor: colorPalette.secondary,
                                gap: 2, alignItems: 'center', '&:hover': {
                                    opacity: .7, cursor: 'pointer'
                                }
                            }} onClick={() => setMenuSelected(item.value)}>
                                <Box sx={{
                                    ...styles.menuIcon,
                                    width: 18,
                                    height: 18,
                                    backgroundImage: `url('/icons/${item.icon}')`,
                                }} />
                                <Text large={isSelected} bold={isSelected} light={!isSelected} style={{ color: isSelected ? colorPalette.buttonColor : colorPalette.textColor }}>{item.label}</Text>
                            </Box>
                        )
                    } else {
                        return <></>
                    }
                })}
            </Box>
            {menuSelected === 'userdata' && <>
                <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>

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
                    <Box sx={{ ...styles.inputSection, whiteSpace: 'nowrap', alignItems: 'start', gap: 4 }}>
                        <Box sx={{
                            justifyContent: 'center', alignItems: 'center',
                            width: 300,
                            gap: 2
                        }}>
                            <Avatar src={bgPhoto?.location || fileCallback?.filePreview} sx={{
                                height: 'auto',
                                borderRadius: '16px',
                                width: { xs: 250, sm: 300, md: 300, lg: 300 },
                                aspectRatio: '1/1',
                            }} variant="rounded" />
                            <Box sx={{
                                display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colorPalette.inputColor,
                                borderRadius: '12px',
                                padding: '12px 0px 12px 12px',
                                marginTop: 2, border: '1px solid lightgray',
                                position: 'relative',
                                '&:hover': { opacity: 0.8, cursor: 'pointer' },
                            }} onClick={() => setShowEditFiles({ ...showEditFile, photoProfile: true })}>
                                <Text bold small>Selecionar Foto...</Text>
                                <Box sx={{
                                    display: 'flex', padding: '10px', zIndex: 99, backgroundColor: colorPalette.buttonColor, borderRadius: '0px 11px 11px 0px', border: `1px solid ${colorPalette.buttonColor}`,
                                    position: 'absolute', right: 0, top: 0, bottom: 0
                                }}>
                                    <Box sx={{
                                        ...styles.menuIcon,
                                        backgroundImage: `url(/icons/upload.png)`,
                                        transition: '.3s',
                                    }} />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput placeholder='Nome Completo' name='nome' onChange={handleChange} value={userData?.nome || ''} label='Nome Completo: *' sx={{ flex: 1, }} />
                                {isAdministrador && <SelectList
                                    fullWidth
                                    data={companies}
                                    valueSelection={userData.empresa_id}
                                    onSelect={(value) => setUserData({ ...userData, empresa_id: value })}
                                    title="Empresa:"
                                    filterOpition="value"
                                    inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                                    clean={false}
                                />}
                                {(isAdministrador || isPartner) && <TextInput
                                    placeholder='Escolha o número máximo de sesões permitidas por mês:'
                                    name='n_max_sessoes'
                                    type="number"
                                    onChange={handleChange}
                                    value={userData?.n_max_sessoes || ''}
                                    label='Nº Máx Sessões/mês: *'
                                    sx={{ flex: 1, }}
                                />}
                            </Box>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail: *' sx={{ flex: 1, }} />
                                <TextInput placeholder='Telefone' name='telefone' onChange={handleChange} value={userData?.telefone || ''} label='Telefone: *' sx={{ flex: 1, }} />
                            </Box>
                            <TextInput placeholder='Nascimento' name='nascimento' onChange={handleChange} type="date" value={(userData?.nascimento)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                            <SelectList fullWidth data={groupGender} valueSelection={userData?.genero || ''} onSelect={(value) => setUserData({ ...userData, genero: value })}
                                title="Gênero *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />
                            <TextInput placeholder='CPF' name='cpf' onChange={handleChange} value={userData?.cpf || ''} label='CPF' sx={{ flex: 1, }} />

                            <Box sx={{ ...styles.inputSection, whiteSpace: 'nowrap', alignItems: 'end', gap: 4 }}>
                                <Box sx={{ ...styles.inputSection, flexDirection: 'column', }}>
                                    <Box sx={{ ...styles.inputSection }}>
                                        <TextInput placeholder='Login' name='login' onChange={handleChange} value={userData?.login || ''} label='Login *' sx={{ flex: 1, }} />
                                    </Box>
                                </Box>
                            </Box>
                            {!newUser && <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: 1.8 }}>
                                <TextInput placeholder='Nova senha' name='nova_senha' onChange={handleChange} value={userData?.nova_senha || ''} type="password" label='Nova senha' sx={{ flex: 1, }} />
                                <TextInput placeholder='Confirmar senha' name='confirmar_senha' onChange={handleChange} value={userData?.confirmar_senha || ''} type="password" label='Confirmar senha' sx={{ flex: 1, }} />
                            </Box>}
                            <Box sx={{ ...styles.inputSection, justifyContent: 'flex-start', gap: 4 }}>
                                <RadioItem valueRadio={userData?.admin_sistema} group={groupAdmin} title="Acesso ao Sistema *" horizontal={mobile ? false : true} onSelect={(value) => setUserData({ ...userData, admin_sistema: parseInt(value) })} />
                                <RadioItem valueRadio={userData?.ativo} group={groupStatus} title="Status *" horizontal={mobile ? false : true} onSelect={(value) => setUserData({
                                    ...userData,
                                    ativo: parseInt(value)
                                })} />

                                {(isAdministrador && !company) &&
                                    <> <Box sx={{ ...styles.inputSection, justifyContent: 'start', alignItems: 'center', gap: 25 }}>

                                        <CheckBoxComponent
                                            valueChecked={userData?.perfil}
                                            boxGroup={groupPerfil}
                                            title="Permissão *"
                                            horizontal={mobile ? false : true}
                                            onSelect={(value) => setUserData({
                                                ...userData,
                                                perfil: value,
                                            })}
                                            sx={{ flex: 1, }}
                                        />

                                    </Box>
                                    </>
                                }
                            </Box>
                        </Box>
                    </Box>
                </ContentContainer>
            </>}

            {menuSelected === 'anamnese' &&
                <>
                    <ContentContainer>
                        <AnamneseUser id={userData?.id} />
                    </ContentContainer>
                </>
            }

            {menuSelected === 'sessoes' &&
                <>
                    <ContentContainer>
                        <SessionsPacient data={consultions} />
                    </ContentContainer>
                </>
            }
        </>
    )
}


const SessionsPacient = ({ data }) => {
    const { colorPalette } = useAppContext()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5, width: '100%', alignItems: 'start' }}>

            <Box sx={{ paddingBottom: 5 }}>
                <Text bold title>Minhas Sessões</Text>
            </Box>
            {data?.map((item, index) => {
                return (
                    <Box sx={{
                        display: 'flex', gap: 1, flexDirection: 'row',
                        transition: '.2s', borderRadius: 2, height: 90, backgroundColor: colorPalette?.secondary,
                        boxShadow: `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                        justifyContent: 'space-between', alignItems: 'center',
                        width: '100%', padding: '10px 20px',
                    }} key={index}>
                        <Box sx={{ display: 'flex', gap: .2, flexDirection: 'column' }}>
                            <Text bold large>{formatterHours(item?.data)}</Text>
                            <Text large>{horarios(item?.data)}</Text>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', alignItems: 'center', padding: '0px 8px' }}>

                            <Avatar src={item?.url_foto_prof || ''} sx={{
                                height: { xs: 50, sm: 50, md: 50, lg: 50 },
                                width: { xs: 50, sm: 50, md: 50, lg: 50 },
                            }} variant="rounded"
                            />
                            <Box sx={{ display: 'flex', gap: .3, flexDirection: 'column', padding: '0px 8px' }}>
                                <Text small bold>Consulta agendada com - {item?.profissional}</Text>
                                <Text small light>{item?.paciente}</Text>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                backgroundColor: colorPalette.primary,
                                height: 30,
                                gap: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                                justifyContent: 'flex-start', paddingRight: 5
                            }}
                        >
                            <Box sx={{ display: 'flex', backgroundColor: statusColor(item?.status), padding: '0px 5px', height: '100%', borderRadius: '8px 0px 0px 8px' }} />
                            <Text small bold style={{ textAlign: 'center' }}>{item?.status}</Text>
                        </Box>
                    </Box>
                )
            })}
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
        <Backdrop open={open} sx={{ zIndex: 9999, }}>
            <ContentContainer style={{ ...styles.containerFile, maxHeight: { md: '400px', lg: '1280px' }, marginLeft: { md: '80px', lg: '0px' }, overflowY: matches && 'scroll', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 9999, alignItems: 'center', padding: '0px 0px 8px 0px' }}>
                    <Text bold>{title}</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        width: 15,
                        height: 15,
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        zIndex: 9999,
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
                                <Button secondary small text='Remover' style={{ padding: '5px 10px 5px 10px', width: 120 }} onClick={() => {
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
                                                zIndex: 9999,
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