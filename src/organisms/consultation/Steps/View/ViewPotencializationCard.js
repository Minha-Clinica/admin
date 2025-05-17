import { useState } from "react";
import { Box, Text, } from "../../../../atoms"
import { useAppContext } from "../../../../context/AppContext";
import { CommentModal } from "../../Comments";
import { Colors } from "../../../layout/Colors";
import IconButton from '@mui/material/IconButton';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


export const ViewPotencializationCard = (props) => {
    const { arrayPotencialization, handleRemoveStep } = props
    const { colorPalette } = useAppContext()
    const [activeModal, setActiveModal] = useState({
        active: false,
        tipo_desconforto: '',
        comentario: '',
        key: ''
    })

    return (
        <Box sx={{ position: 'relative', display: 'flex', padding: '15px', backgroundColor: '#fff', opacity: .6, flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Potencialização</Text>
            </Box>

            <Box sx={{ display: 'flex', position: 'absolute', right: '10px', top: '15px' }}>
                <IconButton
                    onClick={() => handleRemoveStep(arrayPotencialization.id_etapa)}
                >
                    <RemoveCircleIcon sx={{ fontSize: '20px', color: 'red' }} />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {arrayPotencialization?.temas?.map((item, index) => {
                        const faixaPotencialization = item?.tema?.potencializacao || [];
                        return (
                            <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Box sx={styles.boxInfo}>
                                        <Text>{item.tema.nome_tema}</Text>
                                    </Box>
                                </Box>


                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                                    <Text bold>P</Text>
                                    {faixaPotencialization.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                            {faixaPotencialization.map((potItems, indexP) => (
                                                <Box key={indexP} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                    <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: potItems.tresP ? 'gray' : colorPalette.inputColor
                                                        }}>
                                                            <Text small style={{ color: potItems.tresP ? '#fff' : 'black' }}>3P</Text>
                                                        </Box>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: potItems.microfase ? 'gray' : colorPalette.inputColor,
                                                        }}>
                                                            <Text small style={{ color: potItems.microfase ? '#fff' : 'black' }}>MF</Text>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={styles.boxInfo}>
                                                        <Text>{potItems.valor_inicial}</Text>
                                                        <IconButton
                                                            onClick={() => setActiveModal({
                                                                tipo_desconforto: 'ide',
                                                                key: potItems.key,
                                                                active: true,
                                                                comentario: potItems.comentario
                                                            })}
                                                            edge="end"
                                                        >
                                                            <ChatOutlinedIcon sx={{ fontSize: '11px', color: potItems.comentario ? 'green' : 'gray' }} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )
                    })}
                </Box>

            </Box>

            <CommentModal setActive={() => setActiveModal((prev) => ({ ...prev, active: !prev.active }))} active={activeModal.active}>
                <Text>{activeModal?.tipo_desconforto}</Text>
            </CommentModal>
        </Box>
    )
}

const styles = {
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 30,
        height: 30,
        backgroundImage: `url('/icons/orange_icon_afectu.png')`,
    },
    containerMarks: {
        display: 'flex',
        width: '100%',
        gap: 1,
        borderRadius: '3px',
        alignItems: 'center',
        padding: '3px',
        transition: '.2s',
        transform: 'scale(.8)',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            opacity: .8
        }
    },
    boxInfo: {
        display: 'flex', padding: '5px 10px', borderRadius: '2px', justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.clearPrimary
    }
}