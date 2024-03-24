import { Pagination } from "@mui/material"
import { Box, Text } from "../../atoms"
import { SelectList } from "../select/SelectList"
import { useAppContext } from "../../context/AppContext"

export const PaginationTable = (props) => {
    const {
        data = [], page, setPage, rowsPerPage, setRowsPerPage
    } = props
    const { colorPalette, theme } = useAppContext()
    const filteredAndSorted = data?.length;
    const totalPages = Math.ceil((filteredAndSorted - 1) / rowsPerPage);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const rows = [
        { label: 10, value: 10 },
        { label: 15, value: 15 },
        { label: 20, value: 20 },
        { label: 25, value: 25 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
    ]

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: '15px 12px', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Text bold>Página:</Text>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', padding: '2px', backgroundColor: colorPalette?.buttonColor }}>
                    <Text bold style={{ color: '#fff', marginTop: '1px' }}>{page}</Text>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Text light>Mostrando:</Text>
                    <SelectList
                        minWidth={80}
                        data={rows}
                        valueSelection={rowsPerPage}
                        onSelect={(value) => setRowsPerPage(value)}
                        filterOpition="value"
                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', width: 80, height: 40 }}
                        clean={false}
                        sx={{ backgroundColor: colorPalette.secondary, width: 80, height: 40 }}
                    />
                    <Text>de <strong>{filteredAndSorted}</strong> Items.</Text>
                </Box>
                <Pagination
                    variant="outlined"
                    count={totalPages - 1}
                    page={page}
                    onChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    sx={{ color: colorPalette?.textColor }}
                />
            </Box>
        </Box>
    )
}