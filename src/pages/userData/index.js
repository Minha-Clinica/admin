import { useEffect, useState } from "react";
import { Box, ContentContainer, Text, TextInput } from "../../atoms";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import { EditFile } from "../users/[id]";
import { icons } from "../../organisms/layout/Colors";
import { SelectList } from "../../organisms";
import { api } from "../../api/api";

export default function UserData() {

    const { setLoading, alert, colorPalette, user, logout, setTheme, theme } = useAppContext()
    const router = useRouter()
    const [fileCallback, setFileCallback] = useState()
    const [showEditFile, setShowEditFiles] = useState({
        photoProfile: false
    })
    const [showPage, setShowPage] = useState({
        myData: false,
        changePass: false
    })
    const [userData, setUserData] = useState({
        genero: '',
        nome: '',
        email: '',
        nascimento: '',
        telefone: null,
        foto_perfil_id: fileCallback?.location || null,
    })

    const [passwordData, setPasswordData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleChange = (value) => {
        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangePassword = (value) => {
        setPasswordData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }



    const getUserData = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/user/${user?.id}`)
            const { data } = response;
            setUserData(data)
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }


    const getPhoto = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/photo/${user?.id}`)
            const { data } = response
            setFileCallback(data)
            console.log(data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleItems()
    }, [])

    const handleItems = async () => {
        setLoading(true)
        try {
            getUserData()
            getPhoto()
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const checkRequiredFields = () => {
        const { senha, nova_senha, confirmar_senha } = userData
        if (nova_senha) {
            if (!senha) { return alert.error('Obrigatório senha atual') }
            if (!confirmar_senha) { return alert.error('Obrigatório confirmar a senha') }
            if (nova_senha != confirmar_senha) { return alert.error('As senhas não conferem') }
        }
        return true
    }

    const handleChangeUserData = async () => {
        if (checkRequiredFields()) {
            try {
                setLoading(true)
                const response = await api.patch(`/userDetails/update/${user.id}`, { userData })
                if (response.status === 201) {
                    return alert.success('Suas informações foram atualizadas.')
                }
            } catch (error) {
                if (error?.response?.status === 400) {
                    return alert.error('A senha atual não confere.')
                }
                alert.error('Tivemos um problema ao atualizar sua senha.');
                return error
            } finally {
                setLoading(false)
            }
        }
    }

    const handleEditUser = async () => {
        if (checkRequiredFields()) {
            try {
                setLoading(true)
                const response = await api.patch(`/userData/update/${user.id}`, { userData })
                if (response.status === 200) {
                    return alert.success('Suas informações foram atualizadas.')
                }
            } catch (error) {
                if (error?.response?.status === 400) {
                    return alert.error('A senha atual não confere.')
                }
                alert.error('Tivemos um problema ao atualizar sua senha.');
                return error
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Box sx={{
            display: 'flex', gap: 1, flexDirection: 'column', alignItems: { md: 'center', lg: 'center' },
            padding: { xs: `0px 0px`, xm: `25px`, md: `120px 65px`, lg: `50px 50px` }
        }}>

            {(!showPage?.myData && !showPage?.changePass) && <Box sx={{
                display: 'flex', flexDirection: 'column',
                width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
            }}>

                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <Text bold title>Meu Perfil</Text>
                </Box>

                <Box sx={{
                    display: 'flex', height: 300,
                    alignItems: 'center', justifyContent: 'center', width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        justifyContent: 'center', alignItems: 'center',
                        // width: 220,
                        gap: 2
                    }}>
                        <Avatar src={fileCallback?.location || fileCallback?.filePreview} sx={{
                            height: 'auto',
                            borderRadius: '50%',
                            width: { xs: 180, sm: 180, md: 180, lg: 180 },
                            aspectRatio: '1/1',
                        }} variant="square" />
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
                        <EditFile
                            isPermissionEdit={true}
                            columnId="id_foto_perfil"
                            open={showEditFile.photoProfile}
                            newUser={false}
                            onSet={(set) => {
                                setShowEditFiles({ ...showEditFile, photoProfile: set })
                            }}
                            title='Foto de perfil'
                            text='Para alterar sua foto de perfil, clique ou arraste no local desejado.'
                            textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                            fileData={fileCallback}
                            usuarioId={user?.id}
                            campo='foto_perfil'
                            tipo='foto'
                            bgImage={fileCallback?.location || fileCallback?.filePreview}
                            callback={(file) => {
                                if (file.status === 201 || file.status === 200) {
                                    setFileCallback({
                                        status: file.status,
                                        id_foto_perfil: file.fileId,
                                        filePreview: file.filePreview
                                    })
                                    handleItems()
                                }
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: colorPalette.secondary }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray',
                        borderTop: '1px solid lightgray',
                        width: '100%',
                        transition: '.3s',
                        backgroundColor: colorPalette.secondary,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }
                        },
                    }} onClick={() => {
                        setShowPage({ ...showPage, myData: true })
                    }}>
                        <Text>Meus Dados</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        backgroundColor: colorPalette.secondary,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={() => {
                        setShowPage({ ...showPage, changePass: true })
                    }}>
                        <Text>Alterar Senha</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        backgroundColor: colorPalette.secondary,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={() => router.push('/tasks/list')}>
                        <Text>Suporte</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        backgroundColor: colorPalette.secondary,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={logout}>
                        <Text>Sair</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                </Box>
            </Box>}

            {showPage?.myData &&
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-start', gap: 5, alignItems: 'center',
                        marginBottom: 5,
                        padding: '10px 20px'
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                            },
                        }} onClick={() => {
                            setShowPage({ ...showPage, myData: false })
                        }} />
                        <Text title bold style={{}}>Meus Dados</Text>
                    </Box>

                    <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                        <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput fullWidth placeholder='Nome Completo' name='nome' onChange={handleChange} value={userData?.nome || ''} label='Nome Completo: *' sx={{ flex: 1, }} />
                            </Box>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail: *' sx={{ flex: 1, }} />
                                <TextInput placeholder='Telefone' name='telefone' onChange={handleChange} value={userData?.telefone || ''} label='Telefone: *' sx={{ flex: 1, }} />
                            </Box>
                            <TextInput placeholder='Nascimento' name='nascimento' onChange={handleChange} type="date" value={(userData?.nascimento)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                            <SelectList fullWidth data={[
                                { label: 'Masculino', value: 'Masculino' },
                                { label: 'Feminino', value: 'Feminino' }
                            ]} valueSelection={userData?.genero || ''} onSelect={(value) => setUserData({ ...userData, genero: value })}
                                title="Sexo *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />
                        </Box>
                    </ContentContainer>

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 5 }}>
                        <Box sx={{
                            display: 'flex', gap: 1, backgroundColor: colorPalette?.buttonColor, padding: '12px 12px', borderRadius: 2,
                            transition: '.3s',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} onClick={() => handleEditUser()}>
                            <Text bold style={{ color: '#fff' }}>Alterar Dados</Text>
                        </Box>
                    </Box>
                </Box>
            }

            {showPage?.changePass &&
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-start', gap: 5, alignItems: 'center',
                        marginBottom: 5,
                        padding: '10px 20px'
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                            },
                        }} onClick={() => {
                            setShowPage({ ...showPage, changePass: false })
                        }} />
                        <Text title bold style={{}}>Alterar Senha</Text>
                    </Box>

                    <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: 1.8, flexDirection: 'column' }}>
                            <TextInput placeholder='Senha atual' name='password' onChange={handleChangePassword} value={passwordData?.password || ''} type="password" label='Senha atual:' sx={{ flex: 1, }} />

                            <Text bold>Dados da nova senha:</Text>
                            <TextInput placeholder='Nova senha' name='newPassword' onChange={handleChangePassword} value={passwordData?.newPassword || ''} type="password" label='Nova senha:' sx={{ flex: 1, }} />
                            <TextInput placeholder='Confirmar senha' name='confirmPassword' onChange={handleChangePassword} value={passwordData?.confirmPassword || ''} type="password" label='Confirmar senha:' sx={{ flex: 1, }} />
                        </Box>
                    </ContentContainer>

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 5 }}>
                        <Box sx={{
                            display: 'flex', gap: 1, backgroundColor: colorPalette?.buttonColor, padding: '12px 12px', borderRadius: 2,
                            transition: '.3s',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} onClick={() => handleChangeUserData()}>
                            <Text bold style={{ color: '#fff' }}>Alterar Senha</Text>
                        </Box>
                    </Box>
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