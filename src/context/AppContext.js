import { Backdrop, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Box, Button, ContentContainer, Divider, Text } from "../atoms";
import { getDialogPosition } from "../helpers";
import { Alert, CheckBoxComponent, Colors } from "../organisms";
import { api } from "../api/api";
import { LoadingIcon } from "../organisms/loading/Loading";
import { versions } from "../config/config";
import { icons } from "../organisms/layout/Colors";

const MAX_CONFIRMATION_DIALOG_WITH = 360;

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    let directoryIcons = 'https://mf-planejados.s3.us-east-1.amazonaws.com/melies/'

    const reducer = (prev, next) => {
        let dialogPosition = null
        if (next.event) dialogPosition = getDialogPosition(next.event, MAX_CONFIRMATION_DIALOG_WITH);
        return { ...prev, ...next, ...(dialogPosition && { position: dialogPosition }) }
    };

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notificationUser, setNotificationUser] = useState([])
    const [menuItemsList, setMenuItemsList] = useState([])
    const [dataBox, setDataBox] = useState(false)
    const [userPermissions, setUserPermissions] = useState()
    const matches = useMediaQuery('(min-width: 1080px) and (max-width: 1320px)');
    const [colorPalette, setColorPalette] = useState({
        primary: '',
        secondary: '',
        third: '',
        buttonColor: '',
        inputColor: '',
        textColor: ''
    })
    const [theme, setTheme] = useState(true)
    const [showConfirmationDialog, setShowConfirmationDialog] = useReducer(reducer, { active: false, position: { left: 0, top: 0 }, acceptAction: () => { }, propsData: null })
    const [alertData, setAlertData] = useState({
        active: false,
        type: '',
        title: '',
        message: ''
    })
    const [showTerm, setShowTerm] = useState(false)
    const router = useRouter()
    const alert = new ShowAlert(setAlertData)
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    const calculateExpiration = (hours) => {
        const now = new Date();
        return now.getTime() + hours * 60 * 60 * 1000;
    };

    const filterVersions = versions?.filter(item => item.status === 'lançada');
    const latestVersion = filterVersions[filterVersions.length - 1];
    const latestVersionNumber = latestVersion?.version;

    useEffect(() => {
        async function loadUserFromCookies() {
            setLoading(true)
            const token = localStorage.getItem('token')
            try {
                if (token != null) {
                    api.defaults.headers.Authorization = `Bearer ${token}`
                    const response = await api.post('/user/loginToken')
                    const { data } = response;
                    const { userData, getPhoto, notificationsData } = data;
                    if (userData?.termUse && Object.keys(userData.termUse).length > 0) {
                        setShowTerm(true)
                    }
                    if (userData) {
                        setUser({ ...userData, getPhoto })
                        setUserPermissions(userData?.permissoes)
                        setNotificationUser(notificationsData)
                    }
                    else logout();
                }
            } catch (error) {
                console.log(error)
                return error
            } finally {
                setLoading(false)
            }
        }
        loadUserFromCookies()
    }, [])

    const login = async ({ email, senha }) => {
        try {
            setLoading(true)
            const response = await api.post('/user/login', { email, senha })
            const { userData } = response.data
            setUserPermissions(userData?.permissoes)
            if (userData.admin_melies < 1) {
                return 0
            }
            if (userData.token) {
                const { data } = response;
                const { userData, getPhoto, notificationsData } = data;

                if (userData?.termUse && Object.keys(userData.termUse).length > 0) {
                    setShowTerm(true)
                }

                localStorage.setItem('token', userData?.token);
                api.defaults.headers.Authorization = `Bearer ${userData?.token}`
                setUser({ ...userData, getPhoto });
                setNotificationUser(notificationsData)
                return response
            }
            return response
        } catch (error) {
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        try {
            localStorage.removeItem('token')
            setUser(null)
            delete api.defaults.headers.Authorization
        } catch (error) {
            return error
        }
    }

    const colorsThem = () => {
        setColorPalette({
            primary: theme ? Colors.clearPrimary : Colors.darkPrimary,
            secondary: theme ? Colors.clearSecondary : Colors.darkSecondary,
            third: theme ? Colors.clearThird : Colors.darkThird,
            buttonColor: theme ? Colors.clearButton : Colors.darkButton,
            inputColor: theme ? Colors.clearInput : Colors.darkInput,
            textColor: theme ? Colors.clearText : Colors.darkText,
        })
    }


    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');

        if (token != null) {
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = tokenPayload.exp * 1000; // em milissegundos
                const currentTime = new Date().getTime();
                const timeUntilExpiration = expirationTime - currentTime;
                const notificationThreshold = 5 * 60 * 1000;

                if (timeUntilExpiration < 0) {
                    logout();
                    alert.info('Sua sessão expirou. Faça login novamente.');
                } else if (timeUntilExpiration < notificationThreshold) {
                    alert.info('Seu token está prestes a expirar. Faça login novamente.');
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                return error
            }
        }
    };
    useEffect(() => {
        checkTokenExpiration();

        // Adicione um listener para mudanças de rota
        const handleRouteChange = () => {
            checkTokenExpiration();
        };

        // Adicione o listener
        router.events.on('routeChangeStart', handleRouteChange);

        // Remova o listener quando o componente for desmontado
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, []);



    useEffect(() => {
        colorsThem();
    }, [theme])


    useEffect(() => {
        const handleMenuItems = async () => {
            try {
                const response = await api.get(`/menuItems`)
                const { data } = response
                if (response.status === 200) {
                    setMenuItemsList(data)
                }
            } catch (error) {
                console.log(error)
                return error
            }
        }
        handleMenuItems()
    }, [])


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get(`/notification/${user?.id}`);
                setNotificationUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar notificações:', error);
                return error;
            }
        };

        if (user) {
            const intervalId = setInterval(() => {
                fetchNotifications();
            }, 8000);
            return () => clearInterval(intervalId);
        }
    }, [user]);


    const menuItems = [
        {
            text: 'Usuários',
            icon: '/icons/user_mult.png',
            to: '/users/list',
            permissions: ['administrador'],
        },
        {
            text: 'Dashboard',
            icon: '/icons/dashboard_icon.png',
            to: '/dashboard',
            permissions: ['administrador'],
        },
        {
            text: 'Meus Dados',
            icon: '/icons/settings.png',
            to: `/users/${user?.id}`,
            permissions: ['parceiro, paciente, adminstrador'],
        },
        {
            text: 'Minha Empresa',
            icon: '/icons/user_mult.png',
            to: `/organization/${user?.empresa_id}`,
            permissions: ['parceiro'],
        },
        {
            text: 'Empresas',
            icon: '/icons/settings.png',
            to: '/organization/list',
            permissions: ['administrador'],
        },
        {
            text: 'Agenda',
            icon: '/icons/agenda.png',
            to: '/calendar',
            permissions: ['administrador'],
        },
        {
            text: 'Sessões',
            icon: '/icons/email.png',
            to: '/consultation',
            permissions: ['parceiro', 'administrador', 'paciente'],
        },
        {
            text: 'Meus Pacientes',
            icon: '/icons/app.png',
            to: '/patients',
            permissions: ['administrador'],
        },
        {
            text: 'Ajuda',
            icon: '/icons/help.png',
            to: '/tasks/list',
            permissions: ['parceiro', 'administrador', 'paciente'],
        },
    ];


    return (
        <AppContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                setUser,
                permissions: user?.permissions,
                login,
                logout,
                loading,
                setLoading,
                setDataBox,
                alert,
                setShowConfirmationDialog,
                colorPalette,
                setColorPalette,
                theme,
                setTheme,
                directoryIcons,
                matches,
                userPermissions,
                notificationUser, setNotificationUser,
                latestVersionNumber,
                latestVersion,
                menuItemsList,
                menuItems,
                mobile
            }}
        >
            {children}
            <Alert active={alertData.active} type={alertData.type} title={alertData.title} message={alertData.message}
                handleClose={() => setAlertData({ active: false, type: '', title: '', message: '' })} />
            <Backdrop sx={{ color: '#fff', zIndex: 99999999, backgroundColor: '#0E0D15' }} open={loading}>
                <LoadingIcon />
            </Backdrop>
            <ConfirmationModal
                active={showConfirmationDialog.active}
                position={showConfirmationDialog.position}
                title={showConfirmationDialog.title}
                message={showConfirmationDialog.message}
                acceptAction={showConfirmationDialog.acceptAction}
                propsData={showConfirmationDialog.propsData}
                closeDialog={() => setShowConfirmationDialog({ active: false })}
                colorPalette={colorPalette}
                theme={theme}
            />
            <UpdateTerm
                user={user}
                showTerm={showTerm}
                setShowTerm={setShowTerm}
                setUser={setUser}
                alert={alert}
            />
        </AppContext.Provider>
    )
}

export const UpdateTerm = ({ user, showTerm, setUser, setShowTerm, alert }) => {

    const [accepted, setAccepted] = useState()
    const [loader, setLoader] = useState(false)
    const handleAcceptedTerm = async () => {
        setLoader(true)
        try {
            const response = await api.patch(`/term-of-use/update/${user?.id}`)
            const { success } = response.data
            if (success) {
                setUser({ ...user, termUse: {} })
                setShowTerm(false)
                alert.succes('Termos atualizados.')
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoader(false)
        }
    }

    return (
        <Backdrop open={showTerm} sx={{ zIndex: 999 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                <ContentContainer>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Text large bold>Termo de Privacidade para Sessões Terapêuticas da Afectu</Text>
                    </Box>
                    <Divider distance={0} />
                    {loader ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, marginTop: 2, alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    id="subscribeNews"
                                    name="subscribe"
                                    value={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)} />
                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                    <Text light>Li e estou de acordo com a
                                        <a
                                            href="https://minhaclinicatrindade.s3.amazonaws.com/PF+-+Termo+de+Privacidade+para+Sesso%CC%83es+Terape%CC%82uticas+da+Afectu.pdf"
                                            target="_blank"
                                            style={{ color: '#1976d2', fontWeight: 'bold', paddingLeft: 5 }}>
                                            Política de Privacidade
                                        </a></Text>
                                </Box>
                            </Box>
                            <Button text="Confirmar" disabled={!accepted} onClick={() => handleAcceptedTerm()} />
                        </Box>}
                </ContentContainer>
            </Box>

        </Backdrop>
    )
}

export const ConfirmationModal = (props) => {

    const {
        active,
        title = 'Deseja prosseguir?',
        message,
        acceptAction,
        closeDialog,
        colorPalette,
        theme,
        propsData
    } = props;

    const [position, setPosition] = useState({});

    useEffect(() => {
        const calculatePosition = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const modalWidth = 300;
            const modalHeight = 150;
            const left = (screenWidth - modalWidth) / 2;
            const top = (screenHeight - modalHeight) / 2;

            setPosition({ left, top });
        };

        if (active) {
            calculatePosition();
        }
    }, [active]);


    return (
        <Backdrop open={active} sx={{ zIndex: 9999999 }}>
            <Box sx={{
                ...styles.confirmationContainer,
                boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                backgroundColor: colorPalette?.secondary, border: `1px solid ${theme ? '#eaeaea' : '#404040'}`, ...position, zIndex: 999999
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text large bold='true'>{title}</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={closeDialog} />
                </Box>
                <Divider distance={0} />
                {message && (
                    <Box>
                        <Text>{message}</Text>
                    </Box>
                )}
                <Divider distance={0} />
                <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center' }}>
                    <Button small='true' text='Prosseguir' style={{ height: 30, width: '100%' }} onClick={() => {
                        closeDialog();
                        if (propsData) {
                            acceptAction(propsData);
                        } else {
                            acceptAction();
                        }
                    }} />
                    <Button small='true' secondary='true' style={{ height: 30, width: '100%' }} text='Cancelar' onClick={closeDialog} />
                </Box>
            </Box>
        </Backdrop>
    );
}


class ShowAlert {
    constructor(setAlertData) {
        this.setAlertData = setAlertData
    }

    success(message = '',) {
        this.setAlertData({
            active: true,
            type: 'success',
            title: 'Tudo certo',
            message
        })
    }

    error(message = '') {
        this.setAlertData({
            active: true,
            type: 'error',
            title: 'Houve um problema',
            message
        })
    }

    info(title = '', message = '') {
        this.setAlertData({
            active: true,
            type: 'info',
            title,
            message
        })
    }
}

const styles = {
    confirmationContainer: {
        zIndex: 999,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: `12px`,
        padding: `25px`,
        gap: 2,
        maxWidth: MAX_CONFIRMATION_DIALOG_WITH,
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 14,
        height: 14,
    },
}

export const useAppContext = () => useContext(AppContext)