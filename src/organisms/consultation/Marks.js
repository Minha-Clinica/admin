import { useAppContext } from "../../context/AppContext"
import { Box, Text } from "../../atoms"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const Marks = ({ setOpitionsMark, opitionsMark }) => {

    const { colorPalette } = useAppContext()

    return (
        <Box sx={{
            display: 'flex', gap: 1.5,
            flexDirection: 'row'
        }}>
            <Text bold>Marcadores:</Text>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{
                    display: 'flex', gap: 1.8, alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        '&:hover': {
                            opacity: .7,
                            cursor: 'pointer',
                            backgroundColor: 'green' + '77'
                        }
                    }} onClick={() => setOpitionsMark({ ...opitionsMark, microfase: !opitionsMark?.microfase })}>
                        {opitionsMark?.microfase ?
                            <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                            :
                            <Box sx={{
                                display: 'flex', border: `1px solid black`,
                                width: 17, height: 17, borderRadius: 17,
                                transition: '.3s',
                            }} />
                        }
                    </Box>
                    <Text light>MicroFase (MF)</Text>
                </Box>
                <Box sx={{
                    display: 'flex', gap: 1.8, alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        '&:hover': {
                            opacity: .7,
                            cursor: 'pointer',
                            backgroundColor: 'green' + '77'
                        }
                    }} onClick={() => setOpitionsMark({ ...opitionsMark, threeP: !opitionsMark?.threeP })}>
                        {opitionsMark?.threeP ?
                            <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                            :
                            <Box sx={{
                                display: 'flex', border: `1px solid black`,
                                width: 17, height: 17, borderRadius: 17,
                                transition: '.3s'
                            }} />
                        }
                    </Box>
                    <Text light>3P</Text>
                </Box>
            </Box>
        </Box>
    )
}