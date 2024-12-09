import { Box, Divider, Text } from "../../../../atoms"
import { useAppContext } from "../../../../context/AppContext"

export const ModalOpitions = ({ children }) => {
    const { colorPalette } = useAppContext()
    return (
        <Box sx={{
            display: 'flex', padding: '10px 12px', boxShadow: 'rgba(35, 32, 51, 0.27) 0px 6px 24px', borderRadius: 2, flexDirection: 'column', position: 'absolute',
            backgroundColor: colorPalette.secondary }}>
            {children}
        </Box>
    )
}