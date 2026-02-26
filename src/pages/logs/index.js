import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TablePagination, Backdrop } from "@mui/material";
import { Box, Button, Text, TextInput } from "../../atoms";
import { useAppContext } from "../../context/AppContext";
import { getSystemLogs } from "../../api/logs";

export default function LogsMonitor() {
    const [logsList, setLogsList] = useState([]);
    const [filterData, setFilterData] = useState('');
    const { setLoading, colorPalette, user, theme } = useAppContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();

    const [selectedJson, setSelectedJson] = useState(null);

    useEffect(() => {
        if (!user?.perfil?.includes('administrador')) {
            router.push('/');
        } else {
            fetchLogs();
        }
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getSystemLogs(user?.token);
            const formattedData = data.map(log => {
                const dateObj = new Date(log.dt_criacao);
                return {
                    ...log,
                    data_hora_formatada: dateObj.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                };
            });
            setLogsList(formattedData);
        } catch (error) {
            console.error('Erro ao buscar logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filter = (item) => {
        const normalizeString = (str) => {
            return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const normalizedFilterData = normalizeString(filterData);
        const search = normalizedFilterData?.toLowerCase() || '';

        return (
            normalizeString(item?.acao)?.toLowerCase().includes(search) ||
            normalizeString(item?.entidade)?.toLowerCase().includes(search) ||
            normalizeString(item?.descricao)?.toLowerCase().includes(search) ||
            normalizeString(item?.usuario_nome)?.toLowerCase().includes(search)
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Cards view does not require strictly defined column arrays 
    // but the filter logic remains the same

    const handleRowSelect = (id) => {
        const item = logsList.find(log => log.id === id);
        if (item && item.dados_alterados) {
            try {
                const parsed = JSON.parse(item.dados_alterados);
                setSelectedJson(parsed);
            } catch (e) {
                setSelectedJson({ raw: item.dados_alterados });
            }
        } else {
            setSelectedJson({ message: "Nenhum dado modificado registrado." });
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', paddingTop: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text veryLarge bold>Monitor de Logs do Sistema</Text>
                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput placeholder="Pesquisar logs..." name='filterData' type="search"
                        onChange={(event) => setFilterData(event.target.value)} value={filterData}
                        InputProps={{
                            style: {
                                width: 400,
                                backgroundColor: colorPalette?.secondary,
                                borderRadius: 16,
                                borderColor: 'transparent',
                                borderStyle: 'none'
                            }
                        }} />
                </Box>
            </Box>

            {logsList?.filter(filter)?.length > 0 ? (
                <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, pt: 2, pb: 2 }}>
                        {logsList?.filter(filter).slice(startIndex, endIndex).map(log => (
                            <Box
                                key={log.id}
                                onClick={() => handleRowSelect(log.id)}
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '31%' },
                                    backgroundColor: colorPalette?.secondary,
                                    borderRadius: 2,
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                    boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                                    border: `1px solid ${theme ? '#eaeaea' : '#404040'}`,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: `1px solid ${theme ? '#eee' : '#444'}` }}>
                                    <Text bold large>{log.entidade}</Text>
                                    <Text light small style={{ color: 'gray' }}>{log.data_hora_formatada}</Text>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                                    <Text small><Text small bold>Usuário: </Text>{log.usuario_nome}</Text>
                                    <Text small><Text small bold>Ação: </Text>{log.acao}</Text>
                                </Box>
                                <Box sx={{ mt: 1, backgroundColor: theme ? '#f5f5f5' : '#1e1e1e', p: 1.5, borderRadius: 2 }}>
                                    <Text small light>{log.descricao}</Text>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <TablePagination
                        component="div"
                        count={logsList?.filter(filter)?.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        style={{ color: colorPalette.textColor }}
                    />
                </>
            ) : (
                <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', padding: '80px' }}>
                    <Text bold>Nenhum log encontrado para a busca atual.</Text>
                </Box>
            )}

            <JsonModal
                active={!!selectedJson}
                jsonData={selectedJson}
                close={() => setSelectedJson(null)}
                colorPalette={colorPalette}
                theme={theme}
            />
        </Box>
    );
}

const JsonModal = ({ active, jsonData, close, colorPalette, theme }) => {
    if (!active) return null;

    return (
        <Backdrop open={active} sx={{ zIndex: 9999999 }}>
            <Box sx={{
                zIndex: 999,
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: `12px`,
                padding: `25px`,
                gap: 2,
                maxWidth: 600,
                width: '90%',
                maxHeight: '80vh',
                boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                backgroundColor: colorPalette?.secondary,
                border: `1px solid ${theme ? '#eaeaea' : '#404040'}`,
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text large bold='true'>Dados Alterados</Text>
                    <Box sx={{
                        cursor: 'pointer', opacity: 0.8,
                        "&:hover": { opacity: 1 }
                    }} onClick={close}>
                        <Text bold>X</Text>
                    </Box>
                </Box>

                <Box sx={{
                    overflowY: 'auto',
                    backgroundColor: theme ? '#f5f5f5' : '#1e1e1e',
                    padding: 2,
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: theme ? '#333' : '#ddd',
                    whiteSpace: 'pre-wrap'
                }}>
                    {JSON.stringify(jsonData, null, 2)}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center' }}>
                    <Button small='true' style={{ height: 30, width: 150 }} text='Fechar' onClick={close} />
                </Box>
            </Box>
        </Backdrop>
    );
};
