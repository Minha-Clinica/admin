import { useEffect, useState } from "react";
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms";
import { Colors, icons } from "../layout/Colors";
import { Avatar, CircularProgress } from "@mui/material";
import { IconTheme } from "../iconTheme/IconTheme";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import { formatTimeAgo, formatTimeStamp } from "../../helpers";
import { api } from "../../api/api";
import { useRef } from "react";
import { Notifications } from "../notification/notifications";
import Link from "next/link";
import { keyframes } from '@emotion/react';
import { DialogUserEdit } from "../userEdit/dialogEditUser";

const blinkingText = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const UserHeader = (props) => {
    const {
        title = '',
    } = props;

    const { colorPalette, theme, logout, notificationUser, setNotificationUser, user } = useAppContext()
    let fotoPerfil = user?.getPhoto?.location || '';
    const name = user?.nome?.split(' ');
    const firstName = name[0];
    const lastName = name[name.length - 1];
    const userName = `${firstName} ${lastName}`;
    const router = useRouter()
    const routeParts = router.asPath.split('/');
    const lastPage = routeParts[routeParts.length - 1];
    const [showNotification, setShowNotification] = useState(false)
    const [showUserOptions, setShowUserOptions] = useState(false)
    const [showDialogEditUser, setShowDialogEditUser] = useState(false)
    const [showEditUser, setShowEditUser] = useState(false)
    const containerRef = useRef(null);


    const handleGoBack = () => {
        router.back();

        // if (lastPage > 0) {
        //     routeParts[routeParts.length - 1] = 'list';
        //     const newRoute = routeParts.join('/');
        //     router.push(newRoute);
        // } else {
        //     router.back();
        // }
    };


    useEffect(() => {
        if (!showEditUser) {

            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setShowEditUser(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    return (
        <>
            <Box sx={{ ...styles.header, backgroundColor: colorPalette.secondary, gap: 2 }}>
                <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', marginLeft: 15 }}>
                    <Box sx={{ width: 400, display: 'flex', marginLeft: 10 }}>
                        <TextInput placeholder="Buscar pelo paciente" type="search"
                            InputProps={{
                                style: {
                                    height: 45,
                                    fontSize: '13px',
                                    width: 400,
                                    borderRadius: 32,
                                    borderColor: 'transparent', // Define a cor da borda como transparente
                                    borderWidth: 1, // Ajusta a largura da borda se necessário
                                    borderStyle: 'solid'
                                }
                            }} />
                    </Box>
                </Box>
                {/* <IconTheme flex /> */}

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', position: 'relative', }}>
                    <Box sx={{
                        position: 'relative', "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => setShowNotification(true)}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'space-around', padding: '5px 8px', borderRadius: 2, cursor: 'pointer', "&:hover": { opacity: 0.6 } }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url('/icons/bell.png')`,
                                width: 18,
                                height: 18,
                                transition: 'background-color 1s',
                            }} />
                        </Box>
                        {notificationUser?.filter(item => item.vizualizado === 0)?.length > 0 &&
                            <Box sx={{
                                position: 'absolute',
                                width: 11,
                                height: 11,
                                borderRadius: 5,
                                backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: 3,
                                left: 5
                            }}>
                                <Text bold style={{ color: '#fff', fontSize: '8px', textAlign: 'center' }}>{notificationUser?.filter(item => item.vizualizado === 0)?.length}</Text>
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', height: '30px', width: '1px', backgroundColor: '#F0F0F0' }} />

                    <Notifications showNotification={showNotification} setShowNotification={setShowNotification} />

                    <Box sx={{ ...styles.userBadgeContainer }}>
                        <div ref={containerRef}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: 1.5,
                                boxSizing: 'border-box',
                                flexDirection: 'row',
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    backgroundColor: colorPalette.third + '11'
                                }
                            }} onClick={() => setShowEditUser(!showEditUser)}>
                                <Avatar variant="rounded"
                                    sx={{ width: '35px', height: '35px', fontSize: 14, border: `1px solid #fff`, cursor: 'pointer', '&hover': { opacity: 0.5 } }}
                                    src={fotoPerfil || `https://mf-planejados.s3.us-east-1.amazonaws.com/melies/perfil-default.jpg`}
                                    onClick={() => {
                                        // router.push(`/users/${user?.id}`)
                                        setShowUserOptions(!showUserOptions)
                                    }} />
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', transition: '1s' }}>
                                    <Text style={{ color: colorPalette.textColor, transition: 'background-color 1s', fontFamily: 'MetropolisSemiBold', }}>{firstName}</Text>
                                    <Box sx={{
                                        ...styles.menuIcon,
                                        backgroundImage: `url(${icons.gray_arrow_down})`,
                                        width: 20,
                                        transform: !showEditUser ? 'rotate(360deg)' : 'rotate(180deg)',
                                        height: 17,
                                        transition: '.4s',
                                    }} />
                                </Box>
                            </Box>
                            {showEditUser &&
                                <Box sx={{
                                    border: `1px solid lightgray`,
                                    display: 'flex', gap: 1, alignItems: 'start',
                                    top: 40,
                                    width: 300,
                                    right: 0,
                                    transition: '.5s',
                                    justifyContent: 'center', flexDirection: 'column', backgroundColor: colorPalette.secondary,
                                    padding: '5px 10px', borderRadius: 2,
                                    position: 'absolute',
                                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,

                                }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{ width: '55px', height: '55px', fontSize: 14, border: `1px solid #fff`, cursor: 'pointer', '&hover': { opacity: 0.5 } }}
                                            src={fotoPerfil || `https://mf-planejados.s3.us-east-1.amazonaws.com/melies/perfil-default.jpg`}
                                            onClick={() => {
                                                // router.push(`/users/${user?.id}`)
                                                setShowUserOptions(!showUserOptions)
                                                setShowDialogEditUser(true)
                                            }} />
                                        <Box sx={{ display: 'flex', gap: .2, alignItems: 'start', flexDirection: 'column' }}>
                                            <Text large bold>{userName}</Text>
                                            <Text style={{ color: 'gray' }}>Código Usuário: {user?.id}</Text>
                                        </Box>
                                    </Box>
                                    <Divider distance={0} />
                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '5px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        },
                                        alignItems: 'center'
                                    }} onClick={() => {
                                        setShowEditUser(false)
                                        router.push(`/userData`)
                                    }}>
                                        <Text light style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Meus dados</Text>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '5px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={() => {
                                        setShowUserOptions(!showUserOptions)
                                        setShowDialogEditUser(true)
                                        setShowEditUser(false)
                                    }}>
                                        <Text light style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Alterar senha</Text>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '5px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={logout}>
                                        <Text light style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Sair</Text>
                                    </Box>

                                </Box>
                            }
                        </div>
                    </Box>
                </Box>
            </Box>


            {
                showDialogEditUser && (
                    <DialogUserEdit
                        onClick={(value) => setShowDialogEditUser(value)}
                        value={showDialogEditUser}
                    />
                )
            }
        </>
    )
}

const styles = {
    header: {
        display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' },
        width: '100%',
        padding: `20px 32px 20px 32px`,
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        gap: 1,
        position: 'fixed',
        zIndex: 999999,
        borderBottom: `1px solid ${Colors.backgroundPrimary + '11'}`,
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,

    },
    containerUserOpitions: {
        backgroundColor: '#fff',
        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
        borderRadius: 2,
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 48,
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 9999999

    },
    userBadgeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // minWidth: 130,
        gap: 1,
        position: 'relative',
        borderRadius: 1.5,
        zIndex: 9999999
    },
    '@keyframes blinkingText': {
        '0%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0,
        },
        '100%': {
            opacity: 1,
        },
    },
}
