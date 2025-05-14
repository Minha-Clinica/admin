import { useState } from "react";
import { Box, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";


export const CronologicCard = (props) => {
    const { selectedConditions } = props
    const [ageGroup, setAgeGroup] = useState({
        idade_inicial: 0,
        idade_final: 5
    });
    const { colorPalette } = useAppContext()

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Cronológico</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextInput
                        placeholder='0'
                        value={ageGroup.idade_inicial}
                        onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_inicial: target.value }))}
                        InputProps={{ style: { width: 50, height: 30 } }}
                    />
                    <Text>a</Text>
                    <TextInput
                        placeholder='0'
                        value={ageGroup.idade_final}
                        onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_final: target.value }))}
                        InputProps={{ style: { width: 50, height: 30 } }}
                    />

                    <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />

                </Box>


                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text bold>IDE</Text>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={ageGroup.idade_inicial}
                            onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_inicial: target.value }))}
                            InputProps={{ style: { width: 50, height: 30 } }}
                        />
                        <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />

                    </Box>
                </Box>

                {selectedConditions.includes('somatico') && <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text large bold>IDF</Text>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={ageGroup.idade_inicial}
                            onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_inicial: target.value }))}
                            InputProps={{ style: { width: 50, height: 30 } }}
                        />
                        <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />
                    </Box>
                </Box>}
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
        backgroundImage: `url('/icons/red_icon_afectu.png')`,
    },
}