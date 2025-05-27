// CustomEvent.tsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Avatar } from '@mui/material';
import { Box, Text } from '../../atoms';
import { formatTimeStamp } from '../../helpers';
import moment from "moment";
import "moment/locale/pt-br";

export const CustomEvent = ({ event }) => {
    const { colorPalette } = useAppContext()
    moment.locale("pt-br");
    const startDate = moment(event.start);
    const endDate = moment(event.end);
    const startHourFormatada = startDate.format("HH:mm");
    const endHourFormatada = endDate.format("HH:mm");


    function formattedName(name) {
        if (!name) return '';

        const partsName = event?.nome_usuario_agendado?.split(' ');
        const firstName = partsName[0];
        const lastName = partsName[partsName.length - 1];
        return `${firstName} ${lastName}`;
    }

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: 1,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', gap: .5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {event.usuario_agendado ? (
                        <Avatar
                            src={`${event.foto_perfil_usuario_agendado}`} // ou uma URL completa se armazenado externamente
                            sx={{
                                height: 25,
                                width: 25,
                                border: `1px solid ${colorPalette.buttonColor}`
                            }} variant="full"
                        />
                    ) : (<></>)}
                    <Text bold>{formattedName(event?.nome_usuario_agendado) || event.title}</Text>
                </Box>
                {event.usuario_agendado ? <Text bold xsmall>{startHourFormatada} - {endHourFormatada}</Text> : <></>}
            </Box>
        </Box>

    );
};
