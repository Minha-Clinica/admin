import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { emailValidator } from "../helpers"
import { Colors, IconTheme } from "../organisms"
import { Box, ContentContainer, TextInput, Text, Divider } from "../atoms"
import Button from '@mui/material/Button';
import Head from "next/head"
import { getImageByScreen } from "../validators/api-requests"
import { icons } from "../organisms/layout/Colors"
import Link from "next/link"
import { api } from "../api/api"
import { Backdrop } from "@mui/material"
import { useRouter } from "next/router"
import { Register } from "./register"

export default function Login() {

    const { login, alert, theme, colorPalette, setLoading, setShowConfirmationDialog } = useAppContext()
    const [userData, setUserData] = useState([])
    const router = useRouter()
    const [themeName, setThemeName] = useState('')
    const [imagesList, setImagesList] = useState([])
    const [showMenu, setShowMenu] = useState(false)
    const [typeSelected, setTypeSelected] = useState({ value: '', active: false })
    const [showRedefinitionPass, setShowRedefinitionPass] = useState(false)
    const [newPass, setNewPass] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)
    const [showRegisterType, setShowRegisterType] = useState(false)
    const smallWidthDevice = windowWidth < 1000
    const notebookWidth = windowWidth > 1100 && windowWidth < 1500
    const windowWidthScreen = window.innerWidth;
    const windowHeigthScreen = window.innerHeight;

    // const handleImages = async () => {
    //     try {
    //         const response = await getImageByScreen('Login')
    //         if (response.status === 200) {
    //             setImagesList(response.data)
    //         }
    //     } catch (error) {
    //         return error
    //     }
    // }

    // useEffect(() => {
    //     handleImages()
    // }, [])

    const handleRegister = (value) => {
        setTypeSelected({ value, active: true })
    }

    useEffect(() => {
        const themeAltern = theme ? setThemeName('dark') : setThemeName('clear')
        return themeAltern
    }, [theme])

    const handleLogin = async () => {
        setLoading(true)
        try {
            const { email, senha } = userData

            if (!email) {

                return alert.error("O email está inválido!")
            }

            if (email.includes('@')) {
                if (!emailValidator(email)) {
                    return alert.error("O email está inválido!")
                }
            }

            if (!senha || senha.length < 4) { return alert.error('A senha deve conter no mínimo 4 digitos.') }


            const data = await login({ email, senha })

            if (data === 0) {
                return alert.error('Desculpe. Você não tem acesso ao painel administrativo. Consulte o Suporte.')
            }

            if (!data) {
                return alert.error('Usuário não encontrado ou senha incorreta. Verifique os dados e tente novamente!')
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao fazer login.')
            return error
        } finally {
            setLoading(false)
        }
    }

    const checkedReset = (email) => {

        if (!email) {
            alert.error("Preencha o e-mail que será enviada a nova senha")
            return false
        }
        if (email.includes('@')) {
            if (!emailValidator(email)) {
                alert.error("O email está inválido!")
                return false
            }
        }
        return true
    }

    const resetPassword = async () => {
        const { email } = userData
        if (checkedReset(email)) {
            try {
                const { email } = userData
                const response = await api.patch(`/users/reset/password`, { email })

                if (response.status === 422) {
                    alert.error("Não encontrei usuário com o e-mail informado.")
                    return false
                }

                if (response.status === 200) {
                    alert.success("Nova senha enviada por e-mail.")
                    setNewPass(true)
                }

            } catch (error) {
                alert.error("Houve um erro ao resetar senha.")
                console.log(error)
                return error
            }
        }

    }

    const handleChange = (value) => {
        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }


    useEffect(() => {
        setWindowWidth(window.innerWidth)
        window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
        document.title = `Admin Meliés`
        return () => window.removeEventListener('resize', () => { });
    }, [])

    return (
        <>
            <Head>
                <title>Clínica Trindade - Login</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charset="utf-8" />
                <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/logo-clinica-light.png" />
            </Head>
            <Box sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                transition: 'background-color 1s',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', height: '100%'
            }}>
                <Box sx={{
                    display: 'flex', gap: 1, backgroundColor: colorPalette.third, flex: 1, height: '100%', position: 'relative',
                    justifyContent: 'flex-end',
                    padding: '30px 50px'
                }}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', maxWidth: 480, marginTop: 8, padding: '20px' }}>
                        <Text bold veryLarge style={{ color: '#fff' }}>Seja bem-vindo a plataforma de TRG Reprocessamento Terapêutico!</Text>
                        <Text large light style={{ color: '#fff' }}>É um prazer acompanha-lo nessa jornada. Nossa plataforma está aqui para te auxiliar desde sua consulta, até facilitando seu pagamento.</Text>
                        <Text large light style={{ color: '#fff' }}>Aproveite!</Text>
                    </Box>

                    <Box sx={{
                        ...styles.icon,
                        position: 'absolute',
                        bottom: 40,
                        left: 80,
                        backgroundImage: `url('/background/terapia.png')`,
                        // backgroundImage: `url('/icons/logo-clinica.png')`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        width: { xs: 200, xm: 200, md: 200, lg: 300, xl: 450 },
                        height: { xs: 200, xm: 200, md: 200, lg: 200, xl: 300 },
                        display: 'flex',
                    }} />

                </Box>
                <Box sx={{ display: 'flex', gap: 1, width: 450, height: '100%', backgroundColor: '#fff', flexDirection: showRegisterType && 'column' }}>
                    {showRegisterType &&
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 5, marginLeft: 5,
                            gap: 0.5,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} onClick={() => {
                            setShowRegisterType(false)
                        }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url(${icons.goback})`,
                                width: 25, height: 25,
                                // filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                                transition: '.3s',
                                aspectRatio: '1/1'
                            }} />
                            <Text sx={{}}>Voltar</Text>
                        </Box>
                    }
                    {showRegisterType ?

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'start',
                            width: '100%',
                            padding: '30px 30px',
                            gap: 3,
                            marginTop: 10,
                            position: 'relative'
                        }}>
                            <Text bold indicator style={{ color: !theme ? '#fff' : Colors.backgroundPrimary, transition: 'background-color 1s', textAlign: 'center' }}>Para seguir com o cadastro,
                                informe se você é:</Text>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', alignItems: 'center' }}>

                                <Box sx={{
                                    padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: 2,
                                    width: '100%',
                                    transition: '.5s',
                                    gap: 2,
                                    backgroundColor: colorPalette.third,
                                    borderRadius: 2,
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer',
                                        transform: 'scale(1.1, 1.1)'
                                    }
                                }} onClick={() => handleRegister('parceiro')}>
                                    <Text bold style={{ color: colorPalette?.primary }}>PARCEIRO</Text>
                                </Box>

                                <Box sx={{
                                    padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: 2,
                                    width: '100%',
                                    transition: '.5s',
                                    gap: 2,
                                    backgroundColor: colorPalette.buttonColor,
                                    borderRadius: 2,
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer',
                                        transform: 'scale(1.1, 1.1)'
                                    }
                                }} onClick={() => handleRegister('profissional')}>
                                    <Text bold style={{ color: '#fff' }}>TERAPEUTA</Text>
                                </Box>
                                <Box sx={{
                                    padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: 2,
                                    width: '100%',
                                    transition: '.5s',
                                    gap: 2,
                                    border: `1px solid ${colorPalette.buttonColor}`,
                                    backgroundColor: 'transparent',
                                    borderRadius: 2,
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer',
                                        transform: 'scale(1.1, 1.1)'
                                    }
                                }} onClick={() => handleRegister('paciente')}>
                                    <Text bold style={{ color: colorPalette?.buttonColor }}>PACIENTE</Text>
                                </Box>
                            </Box>


                        </Box>
                        :
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'start',
                            width: '100%',
                            padding: '30px 15px',
                            gap: 3,
                            marginTop: 10,
                            position: 'relative'
                        }}>

                            <Box sx={{
                                ...styles.icon,
                                position: 'absolute',
                                bottom: 40,
                                right: 80,
                                backgroundImage: `url('/icons/logo-clinica.png')`,
                                // backgroundImage: `url('/icons/logo-clinica.png')`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                width: 130,
                                height: 90,
                                display: 'flex',

                            }} />

                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '90%', }}>
                                        <Text bold indicator style={{ color: !theme ? '#fff' : Colors.backgroundPrimary, transition: 'background-color 1s', textAlign: 'center' }}>Faça Login</Text>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex', flexDirection: 'column', gap: 2, width: { xs: `80%`, xm: `80%`, md: '62.5%', lg: '80%' }, justifyContent: 'center',
                                    }}>
                                        <TextInput
                                            label='E-mail:'
                                            placeholder='email@outlook.com.br'
                                            value={userData?.email || ''}
                                            onChange={handleChange}
                                            name='email'
                                            margin='none'
                                            type="email"
                                            InputProps={{
                                                style: {
                                                    backgroundColor: !theme ? '#1B1829' : Colors.background,
                                                    transition: 'background-color 1s',
                                                    border: "none",
                                                    color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                    outline: 'none',
                                                    // // width: '280px',
                                                }
                                            }}
                                            InputLabelProps={{
                                                style: {
                                                    color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                    transition: 'background-color 1s',
                                                    // width: '280px',
                                                }
                                            }}
                                        />
                                        <TextInput
                                            placeholder='******'
                                            label='Senha:'
                                            colorLabel={'#fff'}
                                            value={userData.senha || ''}
                                            onChange={handleChange}
                                            name='senha'
                                            type="password"
                                            margin='none'
                                            InputProps={{
                                                style: {
                                                    backgroundColor: !theme ? '#1B1829' : Colors.background,
                                                    transition: 'background-color 1s',
                                                    color: !theme ? '#ffffffbb' : Colors.backgroundPrimary,
                                                    outline: 'none',
                                                    // width: '280px',
                                                }
                                            }}
                                            InputLabelProps={{
                                                style: {
                                                    color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                    transition: 'background-color 1s',
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        style={{
                                            width: { xs: `80%`, xm: `80%`, md: '60%', lg: '60%' },
                                            padding: '12px 80px',
                                            marginBottom: 5,
                                            borderRadius: '12px',
                                            backgroundColor: colorPalette.buttonColor,
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                backgroundColor: colorPalette.buttonColor + 'dd',
                                                cursor: 'pointer'
                                            },
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#f0f0f0',
                                            // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                            borderRadius: '12px',
                                        }}
                                        text='Entrar'
                                        onClick={handleLogin}
                                        type="submit"
                                    >
                                        <Text small bold style={{ color: 'inherit' }}>Entrar</Text>
                                    </Button>
                                </Box>
                                <Text light small style={{ marginTop: 5 }}>Esqueceu sua senha?</Text>
                                <Button
                                    style={{
                                        width: '205px',
                                        padding: '10px 30px',
                                        marginBottom: 5,
                                        borderRadius: '100px',
                                        border: `1px solid ${colorPalette.buttonColor}`,
                                        transition: 'background-color 1s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.buttonColor + '22',
                                            cursor: 'pointer'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#f0f0f0',
                                        // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                        borderRadius: '12px',
                                    }}
                                    text='Entrar'
                                    onClick={() => {
                                        setShowRedefinitionPass(true)
                                    }}
                                >
                                    <Text small bold style={{ color: colorPalette.buttonColor }}>Redefinir</Text>
                                </Button>
                            </form>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, justifyContent: 'center', width: '100%' }}>
                                <Text light>Ainda não possuí cadastro?</Text>
                                <Box sx={{
                                    display: 'flex', "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer'
                                    }
                                }} onClick={() => setShowRegisterType(true)}>
                                    <Text style={{ color: colorPalette.buttonColor }}>Criar conta.</Text>
                                </Box>
                            </Box>
                        </Box>}

                </Box>
                <Box sx={{
                    display: 'none',
                    ...(smallWidthDevice ? { height: '70%', width: '90%' } : { height: { md: '480px', lg: '480px', xl: '603px' }, width: { md: '700px', lg: '700px', xl: '895px' } })
                }}>
                    <ContentContainer row fullWidth style={{ borderRadius: '16px', padding: 0, zIndex: 999, transition: 'background-color 1s', backgroundColor: !theme ? Colors.backgroundSecundary : '#FFFFFF', boxShadow: !theme ? 'none' : `rgba(149, 157, 165, 0.17) 0px 6px 24px` }} gap={0}>

                        {smallWidthDevice ? <></> : <CompanyLogo colorPalette={colorPalette} theme={theme} size={14} />}
                    </ContentContainer>
                </Box>
            </Box>

            <Backdrop open={showRedefinitionPass} sx={{ zIndex: 99999, }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <ContentContainer sx={{ maxWidth: 400 }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Text large bold>Redefinição de Senha</Text>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url(${icons.gray_close})`,
                                transition: '.3s',
                                zIndex: 999999999,
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer'
                                }
                            }} onClick={() => {
                                setNewPass(false)
                                setShowRedefinitionPass(false)
                            }} />
                        </Box>
                        <Box sx={{ flex: 1, display: `flex`, justifyContent: 'center', padding: '20px' }}>

                            <Box sx={{
                                backgroundSize: 'cover',
                                display: 'flex',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                width: '140px',
                                height: '100px',
                                // backgroundColor: 'pink'
                                backgroundImage: `url('/icons/logo-clinica.png')`,
                            }} />
                        </Box>
                        <Box>
                            <Text>Informe seu e-mail e enviaremos uma nova senha por e-mail. Assim que receber, insira no campo abaixo a nova senha e faça Login.</Text>
                        </Box>
                        <Divider padding={0} />
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', gap: 2, width: { xs: `80%`, xm: `80%`, md: '62.5%', lg: '90%' }, justifyContent: 'center',
                                    // alignItems: 'center',
                                }}>
                                    <TextInput
                                        label='e-mail'
                                        placeholder='email@outlook.com.br'
                                        value={userData?.email || ''}
                                        onChange={handleChange}
                                        name='email'
                                        margin='none'
                                        type="email"
                                        InputProps={{
                                            style: {
                                                backgroundColor: !theme ? '#1B1829' : Colors.background,
                                                transition: 'background-color 1s',
                                                border: "none",
                                                color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                outline: 'none',
                                                // // width: '280px',
                                            }
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                transition: 'background-color 1s',
                                                // width: '280px',
                                            }
                                        }}
                                    />
                                    {newPass && <TextInput
                                        placeholder='******'
                                        label='senha'
                                        colorLabel={'#fff'}
                                        value={userData.senha || ''}
                                        onChange={handleChange}
                                        name='senha'
                                        type="password"
                                        margin='none'
                                        InputProps={{
                                            style: {
                                                backgroundColor: !theme ? '#1B1829' : Colors.background,
                                                transition: 'background-color 1s',
                                                color: !theme ? '#ffffffbb' : Colors.backgroundPrimary,
                                                outline: 'none',
                                                // width: '280px',
                                            }
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: !theme ? '#fff' : Colors.backgroundPrimary,
                                                transition: 'background-color 1s',
                                            }
                                        }}
                                    />}
                                </Box>
                                {newPass && <Button
                                    style={{
                                        width: '90%',
                                        padding: '12px 80px',
                                        marginBottom: 5,
                                        borderRadius: '12px',
                                        backgroundColor: colorPalette.buttonColor,
                                        transition: 'background-color 1s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.buttonColor + 'dd',
                                            cursor: 'pointer'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#f0f0f0',
                                        // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                    }}
                                    text='Entrar'
                                    onClick={handleLogin}
                                    type="submit"
                                >
                                    <Text small bold style={{ color: 'inherit' }}>Entrar</Text>
                                </Button>}
                            </Box>
                            {!newPass && <Button
                                style={{
                                    width: '90%',
                                    padding: '10px 30px',
                                    marginBottom: 5,
                                    marginTop: 15,
                                    borderRadius: '12px',
                                    border: `1px solid ${colorPalette.buttonColor}`,
                                    transition: 'background-color 1s',
                                    "&:hover": {
                                        backgroundColor: colorPalette.buttonColor + '22',
                                        cursor: 'pointer'
                                    },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#f0f0f0',
                                    // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                }}
                                onClick={(event) => {
                                    if (checkedReset(userData?.email)) {
                                        setShowConfirmationDialog({
                                            active: true,
                                            event,
                                            acceptAction: resetPassword,
                                            title: 'Resetar Senha',
                                            message: 'Uma nova senha será enviada para seu e-mail.',
                                        })
                                    }
                                }}
                            >
                                <Text small bold style={{ color: colorPalette.buttonColor }}>Enviar nova senha</Text>
                            </Button>
                            }
                        </form>
                    </ContentContainer>
                </Box>
            </Backdrop>

            {typeSelected?.active &&
                <Register
                    type={typeSelected?.value}
                    setTypeSelected={setTypeSelected}
                    typeSelected={typeSelected}
                    setShowRegisterType={setShowRegisterType} />}
        </>
    )
}

const CompanyLogo = ({ size = 14, style = {}, theme = {}, images = [], colorPalette }) => {

    // const imageUrl = images.filter(item => item?.tipo === (theme ? 'tema-claro' : 'tema-escuro')).map(image => image?.location)

    return (
        < Box sx={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center',
            // height: '603px', width: '428px',
            transition: 'background-color 1s',
            justifyContent: 'center',
            backgroundColor: colorPalette?.third,
            flex: 1,
            gap: 1,
            ...style
        }}>
            {/* <img src={imageUrl} alt="Admin" style={{ height: '100%', width: '100%' }} /> */}
            <img src="/icons/logo-clinica-light.png" alt="Admin" style={{ height: '100px', width: '170' }} />
        </Box >
    )
};

const styles = {
    favicon: {
        backgroundSize: 'cover',
        display: 'flex',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        width: '140px',
        height: '67px',
        marginLeft: 12,
        // backgroundColor: 'pink'
    },
    icon: {
        width: '30px',
        height: '30px'
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,

    },
}