import { Backdrop } from "@mui/material"
import { Box, ContentContainer, Divider, Text } from "../../atoms"
import { icons } from "../layout/Colors"

export const ModalContainer = (props) => {
    return (

        <Backdrop open={props.active}  sx={{ zIndex: 999999 }}>
            <ContentContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                    <Text bold large>{props.title}</Text>
                    <Box sx={{
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: 16,
                        height: 16,
                        ascpectRatio: '1/1',
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        zIndex: 999999999,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => {
                        props.setActive(false)
                    }} />
                </Box>
                <Divider />
                {props.children}
            </ContentContainer>

        </Backdrop>
    )
}