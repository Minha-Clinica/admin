import { Box, Text, Divider } from "../../atoms"

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