import { useEffect, useState } from "react";
import { Box, Text } from "../../atoms";
import Skeleton from '@mui/material/Skeleton';


export function SessionRotator({ sessionData }) {
    const [index, setIndex] = useState(0);

    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const fallbackData = {
        dataAtual: `${today.charAt(0).toUpperCase() + today.slice(1)}`, // capitaliza a primeira letra
        sessões: 0,
        concluidas: [],
        canceladas: [],
        remarcadas: [],
        reagendadas: [],
    };

    const getRotatingViews = (data) => [
        {
            label: `📅 Hoje é ${data?.dataAtual}`,
            items: [`🗓️ Sessões: ${data?.sessões}`, `✅ Concluídas: ${data?.concluidas.length}`, `❌ Canceladas: ${data?.canceladas.length}`]
        },
        {
            label: "✅ Sessões concluídas",
            items: data?.concluidas?.map(s => `${s?.horario} - ${s?.paciente}`) || 0
        },
        {
            label: "🔁 Sessões remarcadas",
            items: data?.remarcadas.map(s => `${s?.horario} - ${s?.paciente} → ${s.novoHorario}`) || 0
        },
        {
            label: "❌ Sessões canceladas",
            items: data?.canceladas.map(s => `${s?.horario} - ${s?.paciente}`) || 0
        },
        {
            label: "📆 Sessões reagendadas",
            items: data?.reagendadas.map(s => `${s?.horario} - ${s?.paciente} → ${s?.novoDia} às ${s?.novoHorario}`) || 0
        }
    ]

    if (!sessionData && !fallbackData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                <Skeleton variant="text" width={250} height={30} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={120} />
                </Box>
            </Box>
        );
    }


    const views = getRotatingViews(sessionData || fallbackData);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % views?.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [views?.length]);

    const current = views[index];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 10, gap: .5, transition: 'opacity 0.5s ease' }}>
            <Text bold>{current?.label}</Text>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {current?.items > 0 ? current?.items.map((item, idx) => (
                    <Text key={idx}>{item}</Text>
                )) : (
                    <Skeleton variant="text" width={120} />
                )}
            </Box>
        </Box>
    );
}
