import { Box, Divider, Text } from "../../../../atoms"
import { useAppContext } from "../../../../context/AppContext"

export const ModalHeader = ({ title }) => {
    return (
        <Box sx={{
            display: 'flex', padding: '10px 12px', flexDirection: 'column'
        }}>
            <Text bold>{title}</Text>
            <Divider />
        </Box>
    )
}