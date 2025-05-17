import { useEffect, useState } from "react";
import { Box, Text } from "../../atoms";
import Skeleton from '@mui/material/Skeleton';
import { useAppContext } from "../../context/AppContext";


const profileMessages = {
    paciente: [
        "🧘‍♂️ Não esqueça de marcar sua próxima sessão.",
        "💬 Fale com seu terapeuta se precisar reagendar.",
    ],
    profissional: [
        "📋 Verifique suas sessões agendadas para hoje.",
        "⏰ Agora temos a ferramenta para emissão de recibos dos atedimentos. Acesse > Relatório de Sessões.",
    ],
    parceiro: [
        "📊 Acompanhe os atendimentos realizados nesta semana.",
        "📅 Confira o agendamento dos seus colaboradores.",
    ],
    administrador: [
        "⚙️ Verifique as métricas da plataforma pelo > Dashboard.",
        "🔒 Lembre-se de revisar os acessos dos usuários.",
        "📊 Acompanhe os atendimentos realizados nesta semana.",
        "⚙️ Caso precise de ajuda, entre em contato com o suporte.",
    ]
};

export function SessionRotator() {
    const [index, setIndex] = useState(0);
    const { user } = useAppContext();
    const userProfile = user?.perfil;

    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const capitalizedDate = today.charAt(0).toUpperCase() + today.slice(1);
    // Divide perfis e junta mensagens únicas
    const userProfiles = userProfile?.split(',').map(p => p.trim().toLowerCase()) || [];
    const messages = userProfiles.flatMap(p => profileMessages[p] || []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 20, gap: 0.5 }}>
            <Text bold>{`📅 Hoje é ${capitalizedDate}`}</Text>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {messages.length > 0 ? (
                    <Text>{messages[index]}</Text>
                ) : (
                    <Skeleton variant="text" width={250} />
                )}
            </Box>
        </Box>
    );
}
