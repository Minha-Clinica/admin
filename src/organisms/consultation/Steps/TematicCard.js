import { useState } from "react";
import { Box, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";


export const TematicCard = () => {
    const [initialTeme, setInitialTeme] = useState("Rejeição");
    const { colorPalette } = useAppContext()

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Temático</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextInput
                        placeholder='0'
                        value={initialTeme}
                        onChange={({ target }) => setInitialTeme(target.value)}
                        InputProps={{ style: { height: 30 } }}
                    />

                    <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />

                </Box>


                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text bold>IDE</Text>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={initialTeme}
                            InputProps={{ style: { width: 50, height: 30 } }}
                        />
                        <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }} />

                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text large bold>IDF</Text>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='0'
                            value={initialTeme}
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
        backgroundImage: `url('/icons/blue_icon_afectu.png')`,
    },
}