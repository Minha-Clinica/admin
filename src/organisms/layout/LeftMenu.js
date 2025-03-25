import { Avatar } from "@mui/material"
import Hamburger from "hamburger-react"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { Box, Divider, Text } from "../../atoms"
import { Colors, icons } from "./Colors"
import { useAppContext } from "../../context/AppContext"
import { DialogUserEdit } from "../userEdit/dialogEditUser"
import { Notifications } from "../notification/notifications"

export const LeftMenu = ({ }) => {

   const { menuItems, user, colorPalette, theme, latestVersion, setShowVersion } = useAppContext();
   const name = user?.nome?.split(' ');
   const firstName = name[0];
   const lastName = name[name.length - 1];
   const userName = `${firstName} ${lastName}`;
   let fotoPerfil = user?.getPhoto?.location || '';
   const router = useRouter();
   const pathname = router.pathname === '/' ? null : router.asPath
   const [showMenuMobile, setShowMenuMobile] = useState(false)
   const [showDialogEditUser, setShowDialogEditUser] = useState(false)
   const [showEditUser, setShowEditUser] = useState(false)
   const [showMenuHelp, setShowMenuHelp] = useState(false)
   const [groupStates, setGroupStates] = useState(menuItems.map(() => false));

   const handleGroupMouseEnter = (index) => {
      setGroupStates((prevGroupStates) => {
         if (!prevGroupStates[index]) {
            const newGroupStates = [...prevGroupStates];
            newGroupStates[index] = true;
            return newGroupStates;
         }
         return prevGroupStates;
      });
   };

   const handleGroupMouseLeave = (index) => {
      setGroupStates((prevGroupStates) => {
         if (prevGroupStates[index]) {
            const newGroupStates = [...prevGroupStates];
            newGroupStates[index] = false;
            return newGroupStates;
         }
         return prevGroupStates;
      });
   };

   return (
      <>
         <Box sx={{
            ...styles.leftMenuMainContainer, backgroundColor: colorPalette.secondary, border: `1px solid rgb(255 255 255 / 0.1)`, transition: 'background-color 1s',
            display: showMenuHelp ? 'flex' : { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' },
            width: !showMenuHelp ? 70
               :
               { xs: '214px', sm: '214px', md: '180px', lg: '220px', xl: '220px' }, transition: '.3s'
         }}>

            <Box sx={{
               ...styles.icon,
               display: !showMenuHelp ? 'none' : 'flex',
               transition: 0,
               top: 0,
               left: 0,
               backgroundImage: `url('/icons/afectu_dark.png')`,
               backgroundSize: 'cover',
               position: 'fixed',
               width: '180px',
               height: '65px',
               "&:hover": {
                  cursor: 'pointer', opacity: 0.8
               }
            }} onClick={() => router.push('/')} />
            <Box sx={{
               position: 'fixed', height: '100%',
               width: !showMenuHelp ? 70
                  :
                  { xs: '214px', sm: '214px', md: '180px', lg: '220px', xl: '220px' }, padding: { xs: '10px 15px', sm: '10px 15px', md: '8px 10px', lg: showMenuHelp ? '8px 20px' : '8px 10px', xl: '10px 15px' }
            }}>
               <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' }, position: 'absolute', right: 10, top: -28 }}>
                  <Hamburger
                     toggled={showMenuHelp}
                     toggle={() => {
                        setShowEditUser(false)
                        setShowMenuHelp(!showMenuHelp)
                     }}
                     duration={0.5}
                     size={20}
                  // color={'#fff'}
                  />
               </Box>
               <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>

                  <Box sx={{
                     ...styles.icon,
                     display: showMenuHelp ? 'none' : 'flex',
                     transition: 0,
                     backgroundImage: !showMenuHelp ? `url('/icons/afectu_icon_menu.png')` : `url('/icons/afectu_dark.png')`,
                     backgroundSize: 'cover',
                     width: !showMenuHelp ? '103px' : '140px',
                     height: !showMenuHelp ? '70px' : '90px',
                     marginTop: !showMenuHelp ? 1 : 0,
                     "&:hover": {
                        cursor: 'pointer', opacity: 0.8
                     }
                  }} onClick={() => router.push('/')} />
                  <Box onClick={() => setShowVersion(true)} sx={{ cursor: 'pointer' }}>
                     <Text style={{ bottom: 45, left: 10, position: 'absolute', color: 'gray' }}> v{latestVersion?.version}</Text>
                  </Box>
               </Box>
               <Divider distance={4} color={'rgb(255 255 255 / 0.1)'} />
               <Box sx={{ ...styles.boxMenu, marginTop: 2, ...(showMenuMobile && { overflowY: 'auto', gap: 2 }), ...(!showMenuHelp && { width: 40, marginLeft: 1, gap: 2 }) }}>
                  {showMenuHelp && <Text light large style={{ color: 'gray', padding: '15px 10px' }}>Menu</Text>}
                  {menuItems.map((group, index) => {
                     const userProfiles = user?.perfil?.split(',').map(profile => profile.trim()) || [];
                     const visibleItems = group.permissions?.filter(item =>
                        userProfiles.some(profile => item.includes(profile))
                     );
                     if (visibleItems && visibleItems?.length > 0) {
                        return (
                           <Box key={`${group}-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, color: '#f0f0f0' + '77' }}
                              onMouseEnter={() => (!showMenuMobile && !showMenuHelp) && handleGroupMouseEnter(index)}
                              onMouseLeave={() => (!showMenuMobile && !showMenuHelp) && handleGroupMouseLeave(index)}
                              onClick={() => {
                                 router.push(`/${group.to}`);
                                 setShowMenuHelp(false)

                              }}>
                              {(pathname === group.to) && <Box sx={{ display: 'flex', height: '30px', width: 4, borderRadius: '0px 5px 5px 0px', backgroundColor: colorPalette?.buttonColor, position: 'absolute', left: 0 }} />}

                              {/* {index !== 0 && <Box sx={{ width: '100%', height: `1px`, backgroundColor: '#e4e4e4', margin: `16px 0px`, }} />} */}
                              <Box sx={{
                                 display: showMenuHelp ? 'flex' : 'none',
                                 transition: '.7s',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 gap: 0.5,
                                 padding: `5px 8px`,
                                 width: '100%',
                                 borderRadius: 2,
                                 opacity: 0.8,
                                 "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    backgroundColor: '#f0f0f0' + '22'
                                 }
                              }} >
                                 <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5, position: 'relative', alignItems: 'center', position: 'relative' }}>
                                    <Box sx={{
                                       ...styles.icon, backgroundImage: `url(${group?.icon})`, width: group.text === 'Administrativo' ? 15 : 18,
                                       height: 18,
                                       transition: 'background-color 1s'
                                    }} />
                                    {<Text bold style={{ color: (pathname === group.to) ? colorPalette?.buttonColor : 'gray', transition: 'background-color 1s', }}>
                                       {group?.text}
                                    </Text>}
                                 </Box>
                              </Box>

                              <Box sx={{
                                 display: showMenuHelp ? 'none' : 'flex',
                                 alignItems: 'center',
                                 transition: '.7s',
                                 justifyContent: 'center',
                                 width: 30,
                                 height: '100%',
                                 padding: '5px 0px',
                                 gap: 1.5,
                                 borderRadius: 2,
                                 opacity: 0.8,
                                 "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    backgroundColor: '#f0f0f0' + '22'
                                 }
                              }} >
                                 <Box sx={{
                                    ...styles.icon, backgroundImage: `url(${group?.icon})`, width: group.text === 'Administrativo' ? 15 : 18, height: group.text === 'Administrativo' ? 24 : 18,
                                    transition: 'background-color 1s'
                                 }} />
                              </Box>

                              {!showMenuMobile ?
                                 <Box sx={{
                                    display: 'flex', flexDirection: 'column',
                                    padding: '8px', ...(!showMenuHelp && {
                                       position: 'absolute',
                                       marginLeft: 4, padding: '8px',
                                    }
                                    )
                                 }}>
                                    <Box sx={{
                                       flex: 1, backgroundColor: showMenuHelp ? colorPalette.third : '#fff', display: 'flex', marginLeft: 2, flexDirection: 'column',
                                    }}>
                                       {groupStates[index] && (
                                          <>
                                             {!showMenuHelp &&
                                                <>
                                                   <Box sx={{
                                                      display: 'flex', alignItems: 'start', justifyContent: 'flex-start', padding: '10px 15px',
                                                      flexDirection: 'column'
                                                   }}>
                                                      <Text bold>{group.text}</Text>
                                                   </Box>
                                                </>
                                             }
                                          </>
                                       )}
                                    </Box>
                                 </Box>
                                 : <>
                                 </>
                              }

                           </Box>
                        )
                     }
                  })}
               </Box>

            </Box>
         </Box >

         <Box sx={{ ...styles.menuResponsive, backgroundColor: theme ? '#fff' : colorPalette.primary + '88', gap: 2, }}>

            <Box sx={{ 
               ...styles.icon,
               backgroundImage: `url('/icons/afectu_dark.png')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               width: 70,
               height: 50,
               display: 'flex',
               // flex: 1,
               "&:hover": {
                  cursor: 'pointer', opacity: 0.8
               }
            }} onClick={() => router.push('/')} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>

               <UserBadge />
               <Hamburger
                  toggled={showMenuHelp}
                  toggle={() => {
                     setShowMenuHelp(!showMenuHelp)
                     setShowMenuMobile(!showMenuMobile)
                  }}
                  duration={0.5}
                  size={20}
                  color={colorPalette.textColor}
               />
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


const UserBadge = () => {

   const [showNotification, setShowNotification] = useState(false)
   const [showUserOptions, setShowUserOptions] = useState(false)
   const [showDialogEditUser, setShowDialogEditUser] = useState(false)
   const [showEditUser, setShowEditUser] = useState(false)
   const router = useRouter()
   const containerRef = useRef(null);
   const { notificationUser, colorPalette, user, logout } = useAppContext()
   let fotoPerfil = user?.getPhoto?.location || '';

   return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', }}>
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
         <Notifications showNotification={showNotification} setShowNotification={setShowNotification} />
         <Box sx={{ ...styles.userBadgeContainerMobile }}>
            <div ref={containerRef}>
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  gap: .5,
                  alignItems: 'center',
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
                     sx={{ width: '20px', height: '20px', fontSize: 9, border: `1px solid #fff`, cursor: 'pointer', '&hover': { opacity: 0.5 } }}
                     src={fotoPerfil || `https://mf-planejados.s3.us-east-1.amazonaws.com/melies/perfil-default.jpg`}
                     onClick={() => {
                        setShowUserOptions(!showUserOptions)
                     }} />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', transition: '1s' }}>
                     <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.gray_arrow_down})`,
                        width: 12,
                        transform: !showEditUser ? 'rotate(360deg)' : 'rotate(180deg)',
                        height: 12,
                        transition: '.4s',
                     }} />
                  </Box>
               </Box>
               {showEditUser &&
                  <Box sx={{
                     display: 'flex', gap: 1, alignItems: 'start',
                     top: 40,
                     width: 200,
                     right: { xs: -45, sm: -45, md: -45, lg: 0 },
                     transition: '.5s',
                     justifyContent: 'center', flexDirection: 'column', backgroundColor: colorPalette.secondary,
                     padding: '5px 10px', borderRadius: 2,
                     position: 'absolute',
                     boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,

                  }}>
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
                        <Text light style={{ ...styles.text, textAlign: 'center', padding: `2px 0px`, }}>Sair</Text>
                     </Box>

                  </Box>
               }
            </div>

            {
               showDialogEditUser && (
                  <DialogUserEdit
                     onClick={(value) => setShowDialogEditUser(value)}
                     value={showDialogEditUser}
                  />
               )
            }
         </Box>
      </Box>
   )
}


const styles = {
   leftMenuMainContainer: {
      position: 'relative',
      alignItems: 'center',
      display: { xs: 'flex', sm: 'none', md: 'flex', lg: 'flex' },
      flexDirection: 'column',
      minHeight: '100vh',
      // backgroundColor: '#f9f9f9',
      borderRight: `1px solid #00000010`,
      padding: `40px 5px 40px 5px`,
      gap: 1,
      zIndex: 999999999,
      position: { xs: 'fixed', sm: 'absolute', md: 'relative', lg: 'relative' },
      boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`,

   },
   boxMenu: {
      display: 'flex',
      flexDirection: 'column',
      // gap: 1,
      overflowStyle: 'marquee,panner',
      maxHeight: { xs: '480px', sm: '480px', md: '480px', lg: '480px', xl: '850px' },
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: 'gray lightgray',
      '&::-webkit-scrollbar': {
         width: '5px',

      },
      '&::-webkit-scrollbar-thumb': {
         backgroundColor: 'gray',
         borderRadius: '5px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
         backgroundColor: 'gray',

      },
      '&::-webkit-scrollbar-track': {
         backgroundColor: Colors.primary,

      },

   },
   userBox: {
      backgroundColor: '#00000017',
      position: 'fixed',
      bottom: 0,
      padding: `10px 20px`,
      borderRadius: '10px 10px 0px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      gap: 1,
      width: 150
   },
   userButtonContainer: {
      borderRadius: '5px',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: `5px 0px`,
      "&:hover": {
         backgroundColor: '#ddd',
         cursor: 'pointer'
      }
   },
   icon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '15px',
      height: '15px',
      marginRight: '0px',
      backgroundImage: `url('/favicon.svg')`,
   },
   menuResponsive: {
      position: 'fixed',
      maxHeight: '40px',
      width: '100%',
      backgroundColor: '#f9f9f9',
      borderBottom: `2px solid #00000010`,
      paddingLeft: `15px`,
      paddingTop: 3,
      paddingBottom: 3,
      paddingRight: '15px',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 99999999,
      display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none' },
   },
   menuMobileContainer: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      borderRight: `1px solid #00000010`,
      padding: `40px 20px`,
      gap: 4,
      zIndex: 99999999,
   },
   menuIcon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: 20,
      height: 20,

   },
   containerUserOpitions: {
      backgroundColor: Colors.background,
      boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
      borderRadius: 2,
      padding: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 135,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 9999999

   },
   userBadgeContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 130,
      gap: 1,
      position: 'relative',
      borderRadius: 1.5,
      zIndex: 9999999,
   },
   userBadgeContainerMobile: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      position: 'relative',
      borderRadius: 1.5,
      zIndex: 9999,
   },
   menuIcon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: 20,
      height: 20,

   },
}
