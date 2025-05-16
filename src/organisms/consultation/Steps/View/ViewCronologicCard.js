import { useState } from "react";
import { Box, Text } from "../../../../atoms"
import { useAppContext } from "../../../../context/AppContext";
import { CommentModal } from "../../Comments";
import IconButton from '@mui/material/IconButton';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { Colors } from "../../../layout/Colors";


export const ViewCronologicCard = (props) => {
    const { arrayCronologic } = props
    const { colorPalette } = useAppContext()
    const [activeModal, setActiveModal] = useState({
        active: false,
        tipo_desconforto: '',
        comentario: '',
        key: ''
    })

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', opacity: .6, flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Cronológico</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {arrayCronologic?.faixaIdade?.map((item, index) => {
                        const faixaIde = item?.faixa?.ide || [];
                        const faixaIdf = item?.faixa?.idf || [];
                        return (
                            <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Box sx={styles.boxInfo}>
                                        <Text>{item.faixa.idade_inicial}</Text>
                                    </Box>
                                    <Text>a</Text>
                                    <Box sx={styles.boxInfo}>
                                        <Text>{item.faixa.idade_final}</Text>
                                    </Box>
                                </Box>


                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                                    <Text bold>IDE</Text>
                                    {faixaIde.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                            {faixaIde.map((ideItems, indexIde) => (
                                                <Box key={indexIde} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                    <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: ideItems.tresP ? 'gray' : colorPalette.inputColor
                                                        }}>
                                                            <Text small style={{ color: ideItems.tresP ? '#fff' : 'black' }}>3P</Text>
                                                        </Box>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: ideItems.microfase ? 'gray' : colorPalette.inputColor,
                                                        }} >
                                                            <Text small style={{ color: ideItems.microfase ? '#fff' : 'black' }}>MF</Text>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={styles.boxInfo}>
                                                        <Text>{ideItems.valor_inicial}</Text>
                                                        <IconButton
                                                            onClick={() => setActiveModal({
                                                                tipo_desconforto: 'ide',
                                                                key: ideItems.key,
                                                                active: true,
                                                                comentario: ideItems.comentario
                                                            })}
                                                            edge="end"
                                                        >
                                                            <ChatOutlinedIcon sx={{ fontSize: '11px', color: ideItems.comentario ? 'green' : 'gray' }} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                                    <Text large bold>IDF</Text>

                                    {faixaIdf?.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                            {faixaIdf.map((itemIde, indexIde) => (
                                                <Box key={indexIde} sx={{ display: 'flex', gap: 1, width: '100%', }}>
                                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                        <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                            <Box sx={{
                                                                ...styles.containerMarks,
                                                                backgroundColor: itemIde.tresP ? 'gray' : colorPalette.inputColor
                                                            }}>
                                                                <Text small style={{ color: itemIde.tresP ? '#fff' : 'black' }}>3P</Text>
                                                            </Box>
                                                            <Box sx={{
                                                                ...styles.containerMarks,
                                                                backgroundColor: itemIde.microfase ? 'gray' : colorPalette.inputColor,
                                                            }}>
                                                                <Text small style={{ color: itemIde.microfase ? '#fff' : 'black' }}>MF</Text>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={styles.boxInfo}>
                                                            <Text>{itemIde.valor_inicial}</Text>
                                                            <IconButton
                                                                onClick={() => setActiveModal({
                                                                    tipo_desconforto: 'idf',
                                                                    key: itemIde.key,
                                                                    active: true,
                                                                    comentario: itemIde.comentario
                                                                })}
                                                                edge="end"
                                                            >
                                                                <ChatOutlinedIcon sx={{ fontSize: '11px', color: itemIde.comentario ? 'green' : 'gray' }} />
                                                            </IconButton>
                                                        </Box>
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
                <Text>{activeModal?.comentario}</Text>
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
        backgroundImage: `url('/icons/red_icon_afectu.png')`,
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