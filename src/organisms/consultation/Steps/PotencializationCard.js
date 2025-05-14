import { useState } from "react";
import { Box, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";
import { Marks } from "../Marks";


export const PotencializationCard = ({ arrayPotencialization, setArrayPotencialization, selectedTemes }) => {
    const [currentTemeName, setCurrentTemeName] = useState("Rejeição");
    const [potencializationData, setPotencializationData] = useState({
        valor_inicial: 0,
        comentario: '',
        microfase: false,
        threeP: false
    });
    const [opitionsMark, setOpitionsMark] = useState({
        threeP: false,
        microfase: false
    });
    const { colorPalette } = useAppContext()

    const handleAddTeme = () => {
        setArrayPotencialization({
            ...arrayPotencialization,
            tema: currentTemeName
        })
        setCurrentTemeName('')
    }

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Potencialização</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                {selectedTemes.length > 0 ? (
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{
                            display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
                            backgroundColor: colorPalette?.primary, padding: '12px 15px', height: '35px', borderRadius: 2
                        }}>
                            <Text bold>{selectedTemes[0]}</Text>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={currentTemeName}
                            onChange={({ target }) => setCurrentTemeName(target.value)}
                            InputProps={{ style: { height: 30 } }}
                        />
                        <AddCircleIcon onClick={() => handleAddTeme()} sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />
                    </Box>
                )}
                <Marks setOpitionsMark={setOpitionsMark} opitionsMark={opitionsMark} />

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text large bold>P</Text>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={potencializationData.valor_inicial}
                            InputProps={{ style: { width: 50, height: 30 } }}
                        />
                        <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />
                    </Box>
                </Box>
            </Box>
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
}