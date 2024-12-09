import { Box, Text } from "../../atoms"
import { useAppContext } from "../../context/AppContext"

export const ModalItem = ({ text = '', icon = null, onClick = () => { } }) => {
    const { colorPalette } = useAppContext()
    return (
        <Box sx={{
            display: 'flex', padding: '5px 8px', borderRadius: 2, gap: 2,
            transition: .3,
            '&:hover': {
                opacity: .7,
                backgroundColor: colorPalette.primary + '99'
            }
        }} onClick={onClick}>
            <Text light>{text}</Text>
            {icon && <Box sx={{
                ...styles.menuIcon,
                width: 14,
                height: 14,
                backgroundImage: `url('/icons/remarcar_icon.png')`,
                transition: '.3s',
            }} />}
        </Box>
    )
}

const styles = {
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 15,
        height: 15,
    },
}
