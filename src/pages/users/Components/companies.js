import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Card, CardContent } from "@mui/material";
import { Box, Button, ContentContainer, Text } from "../../../atoms";
import { SelectList } from "../../../organisms";
import { useAppContext } from "../../../context/AppContext";
import { api } from "../../../api/api";
import DeleteIcon from '@mui/icons-material/Delete';


const UserCompanies = ({ userId, companies }) => {
    const [userCompanies, setUserCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { colorPalette, setLoading, alert } = useAppContext()

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/user/${userId}/companies`);
            setUserCompanies(res.data);
        } catch (error) {
            console.error("Erro ao buscar empresas", error);
        } finally {
            setLoading(false);
        }
    };


    const handleAddEmpresa = async () => {
        if (!selectedCompanies) return;
        try {
            await api.post("/user/companies/create", {
                userId,
                companyId: selectedCompanies
            });
            alert.success("Empresa adicionada com sucesso");
            setSelectedCompanies(null);
            fetchCompanies();
            setModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar empresa", error);
        }
    };

    const handleRemoveEmpresa = async (userCompanyId) => {
        try {
            const response = await api.delete(`/user/${userId}/companies/delete/${userCompanyId}`);
            if (response.status === 200) {
                alert.success("Empresa removida com sucesso");
                fetchCompanies();
            } else {
                alert.error("Erro ao remover empresa");
            }
        } catch (error) {
            console.error("Erro ao remover empresa", error);
            alert.error("Ocorreu um erro interno ao remover empresa");
        }
    };

    return (
        <ContentContainer>
            <Text bold title>Empresas vinculadas</Text>
            {userCompanies.length === 0 ? (
                <Text light>Esta pessoa ainda não foi vinculada a uma empresa.</Text>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {userCompanies.map((empresa) => (
                        <Card key={empresa.id_empresa} sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.01, 1.01)', // Efeito de hover
                            }
                        }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Text large bold>
                                    {empresa.nome_empresa}
                                </Text>
                                {/* Aqui você pode adicionar outras informações da empresa */}
                            </CardContent>
                            <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleRemoveEmpresa(empresa.id_empresa_usuario)}
                                sx={{
                                    marginLeft: 2,
                                    color: colorPalette.errorColor,
                                    '&:hover': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    ))}
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
                <Button
                    text="Adicionar Empresa"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                />
            </Box>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Vincular Empresa</DialogTitle>
                <DialogContent>
                    <SelectList
                        fullWidth
                        data={companies.filter(company => !userCompanies.find(empresa => empresa.id_empresa == company.value))}
                        valueSelection={selectedCompanies}
                        onSelect={(value) => setSelectedCompanies(value)}
                        title="Empresa:"
                        filterOpition="value"
                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button text="Cancelar" cancel onClick={() => setModalOpen(false)} />
                    <Button text="Vincular" onClick={handleAddEmpresa} />
                </DialogActions>
            </Dialog>
        </ContentContainer>
    );
};

export default UserCompanies;
