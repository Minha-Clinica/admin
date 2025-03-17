import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";
import { Box, Button, ContentContainer, Text } from "../../../atoms";
import { SelectList } from "../../../organisms";
import { useAppContext } from "../../../context/AppContext";
import { api } from "../../../api/api";


const UserCompanies = ({ userId, companies }) => {
    const [userCompanies, setUserCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { colorPalette } = useAppContext()

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get(`/user/${userId}/companies`);
            setUserCompanies(res.data);
        } catch (error) {
            console.error("Erro ao buscar empresas", error);
        }
    };

    const handleAddEmpresa = async () => {
        if (!selectedCompanies) return;
        try {
            await api.post("/user/companies/create", {
                userId,
                companyId: selectedCompanies
            });
            setSelectedCompanies(null);
            fetchCompanies();
            setModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar empresa", error);
        }
    };

    return (
        <ContentContainer>
            <Text bold title>Empresas vinculadas</Text>
            {userCompanies.length === 0 ? <Text light>Esta pessoa ainda não foi vinculada a uma empresa.</Text> :
                <List>
                    {userCompanies.map((empresa) => (
                        <ListItem key={empresa.id_empresa}>
                            <ListItemText primary={empresa.nome_empresa} />
                        </ListItem>
                    ))}
                </List>
            }

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
