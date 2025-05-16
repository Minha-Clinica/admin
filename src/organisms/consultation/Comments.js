import { useAppContext } from "../../context/AppContext"
import { Box, Text } from "../../atoms"
import { IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const CommentModal = ({ setActive, active, children }) => {

    const { colorPalette } = useAppContext()

    return (
        <Modal
            open={active}
            onClose={setActive}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: colorPalette.secondary,
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    minWidth: 300,
                    maxWidth: 600,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ paddingBottom: 2 }}>
                    <Text title bold>
                        Comentários
                    </Text>
                    <IconButton onClick={setActive}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box id="modal-description" >{children}</Box>
            </Box>
        </Modal>
    )
}