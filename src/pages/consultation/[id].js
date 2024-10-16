import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Avatar, Backdrop, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, Divider } from "../../atoms"
import { SectionHeader } from "../../organisms"
import moment from "moment";
import { useAppContext } from "../../context/AppContext"
import { calculationAgeUser, formatTimeStamp, getRandomInt } from "../../helpers"
import { icons } from "../../organisms/layout/Colors"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Dropzone from "react-dropzone"
import Link from "next/link"

export default function ConsultationRecord(props) {
    const { setLoading, alert, colorPalette, user, setShowConfirmationDialog, userPermissions, menuItemsList } = useAppContext()
    let userId = user?.id;
    const router = useRouter()
    const { id } = router.query;
    const newConsultRecord = id === 'new';
    const [cronologicData, setCronologicData] = useState([]);
    const [somaticData, setSomaticData] = useState([]);
    const [discomfortLevel, setDiscomfortLevel] = useState([]);
    const [patientNotes, setPatientNotes] = useState('')
    const [arrayTematic, setArrayTematic] = useState([])
    const [tematicName, setTematicName] = useState({ tema: '' })
    const [showTematic, setShowTematic] = useState(false)
    const [currentSessionNumber, setCurrentSessionNumber] = useState(1)
    const [filesDrop, setFilesDrop] = useState([])
    const [opitionsMark, setOpitionsMark] = useState({
        microfase: false,
        threeP: false
    })
    const [consultRecordData, setConsultRecordData] = useState({
        anotacoes: ''
    })
    const [sessions, setSessions] = useState([])
    const [selectedConditions, setSelectedConditions] = useState([])
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))

    const getConsult = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/consultation/${id}`)
            const { data } = response
            setConsultRecordData(data)
            return data
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const getSessions = async (pacientId, sessionId) => {
        try {
            let query = `/consultation/pacient/${pacientId}`

            const response = await api.get(query, {
                params: {
                    date: {
                        startDate: null,
                        endDate: null
                    },
                    status_pagamento: null,
                    status: null,
                    paciente_id: null
                }
            });
            const { data = [] } = response;

            if (Array.isArray(data) && data.length > 0) {
                setSessions(data);
                let count = 1
                const sortedData = data.sort((a, b) => new Date(a.data) - new Date(b.data))
                for (let session of sortedData) {
                    if (session.id_consulta == sessionId) {
                        setCurrentSessionNumber(count)
                        break
                    } else {
                        count++
                    }
                }
            } else {
                setSessions([]); // Certifique-se de definir um array vazio se os dados não forem um array ou estiverem vazios
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    };



    const handleGetFiles = async () => {
        try {
            const response = await api.get(`/consultion/files/${id}`)
            const { data } = response
            if (data.length > 0) {
                setFilesDrop(data)
            } else {
                setFilesDrop([])
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const getThemes = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/session/theme/${id}`)
            const { data } = response
            if (data.length > 0) {
                setArrayTematic(data)
            } else {
                setArrayTematic([])
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateNotes = async () => {
        setLoading(true)
        try {
            await api.patch(`/session/theme/notes/update/${id}`, { notes: consultRecordData?.anotacoes })
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            if (newConsultRecord) {
                return
            }
            await handleItems();
        })();
    }, [id])

    const handleItems = async () => {
        setLoading(true)
        try {
            const consult = await getConsult()
            if (consult) {
                await getThemes()
                await getSessions(consult.paciente_id, id)
                await handleGetFiles()
            }
        } catch (error) {
            alert.error('Ocorreu um arro ao carregar A instituição')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (value) => {

        setConsultRecordData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const checkRequiredFields = () => {
        // if (!consultRecordData.nome) {
        //     alert.error('Usuário precisa de nome')
        //     return false
        // }
        return true
    }

    const handleCreateInstitution = async () => {
        setLoading(true)
        if (checkRequiredFields()) {
            try {
                const response = await api.post(`/institution/create/${userId}`, { consultRecordData, arrayRecognitionP, arrayRecognitionEad });
                const { data } = response

                if (response?.status === 201) {
                    alert.success('Instituição cadastrada com sucesso.');
                    router.push(`/administrative/institution/list`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao cadastrar Instituição.');
            } finally {
                setLoading(false)
            }
        }
    }

    const handleDeleteInstitution = async () => {
        setLoading(true)
        try {
            const response = await api.delete(`/institution/delete/${id}`)
            if (response?.status == 201) {
                alert.success('Instituição excluída com sucesso.');
                router.push(`/administrative/institution/list`)
            }

        } catch (error) {
            alert.error('Tivemos um problema ao excluir Instituição.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditInstitution = async () => {
        setLoading(true)
        try {
            const response = await api.patch(`/institution/update/${id}`, { consultRecordData })
            if (response?.status === 201) {
                alert.success('Instituição atualizada com sucesso.');
                handleItems()
                return
            }
            alert.error('Tivemos um problema ao atualizar Instituição.');
        } catch (error) {
            alert.error('Tivemos um problema ao atualizar Instituição.');
        } finally {
            setLoading(false)
        }
    }

    // const handleChangeTematicName = (value) => {
    //     setTematicName((prevValues) => ({
    //         ...prevValues,
    //         [value.target.name]: value.target.value,
    //     }))
    // };

    const handleAddTheme = async () => {
        try {
            const response = await api.post(`/session/theme/create`, {
                themeData: {
                    consultId: id,
                    profissionalId: consultRecordData?.profissional_id,
                    pacientId: consultRecordData?.paciente_id,
                    nameTheme: tematicName.tema
                }
            })

            if (response.status === 201) {
                alert.success('Thema adicionado.')
                await getThemes()
                setTematicName({ tema: '' })
                setShowTematic(false)
            } else {
                alert.error('Ocorreu um erro ao adicionar tema.')
            }
        } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro ao adicionar tema.')
            return error
        }
    }


    const handleDeleteTheme = async (themeId) => {
        try {
            const response = await api.delete(`/session/theme/delete/${themeId}`)

            if (response.status === 200) {
                alert.success('Thema excluído.')
                await getThemes()
            } else {
                alert.error('Ocorreu um erro ao deletar tema.')
            }
        } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro ao deletar tema.')
            return error
        }
    }

    const addTematic = () => {
        setArrayTematic((prevArray) => [...prevArray, { tema: tematicName.tema }])
        setTematicName({ tema: '' })
        setShowTematic(false)
    }

    const deleteTematicName = (index) => {
        setArrayTematic((prevArray) => {
            const newArray = [...prevArray];
            newArray.splice(index, 1);
            return newArray;
        });
    };

    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const toggleCondition = (value) => {
        if (selectedConditions.includes(value)) {
            setSelectedConditions(selectedConditions.filter((condition) => condition !== value));
        } else {
            setSelectedConditions([...selectedConditions, value]);
        }
    };

    const handleInputDiscomfortChange = (discomfortIndex, key, value) => {
        const newData = [...discomfortLevel];
        newData[discomfortIndex][key] = value;
        setDiscomfortLevel(newData);
    };

    const removeDiscomfortData = (index) => {
        const newData = [...discomfortLevel];
        newData.splice(index, 1);
        setDiscomfortLevel(newData);
    };

    // const handleInputSomaticChange = (cronoIndex, somaticIndex, key, value, type) => {
    //     const newData = [...somaticData];
    //     newData[somaticIndex][key] = value;
    //     setSomaticData(newData);
    // };

    const addNewCronologicData = () => {
        let cronologicKeyId = generateUniqueId()
        const newCronoData = { idade_inicial: 0, idade_final: 5, id: cronologicKeyId }; // Adiciona um ID único
        setCronologicData([...cronologicData, newCronoData]);
        setDiscomfortLevel([...discomfortLevel, {
            nivel_desc: 10, parentId: cronologicKeyId,
            microfase: opitionsMark?.microfase,
            threeP: opitionsMark?.threeP
        }]);
    };

    const removeCronologicData = (index) => {
        const removedCronoData = cronologicData[index];
        const newData = cronologicData.filter((_, i) => i !== index);
        setCronologicData(newData);

        // Remove dados somáticos associados ao cronológico removido
        const newSomaticData = somaticData.filter((data) => data.parentId !== removedCronoData.id);
        setSomaticData(newSomaticData);
    };

    const addNewDiscomfortData = (parentId) => {
        setDiscomfortLevel([...discomfortLevel, {
            nivel_desc: 10, parentId,
            microfase: opitionsMark?.microfase,
            threeP: opitionsMark?.threeP
        }]);
    };

    const addNewSomaticData = (parentId) => {
        setSomaticData([...somaticData, { nivel_sintoma: 10, parentId }]);
    };

    const removeSomaticData = (index) => {
        const newData = [...somaticData];
        newData.splice(index, 1);
        setSomaticData(newData);
    };



    const handleInputCronologicChange = (index, key, value) => {
        const newData = [...cronologicData];
        newData[index][key] = value;
        setCronologicData(newData);
    };

    const handleRemoveFile = async (fileId, key_file) => {
        setLoading(true)
        try {
            const response = await api.delete(`/consultion/file/delete/${fileId}?key_file=${key_file}`)

            if (response.status === 200) {
                alert.success('Arquivo excluído.')
                await handleGetFiles()
            } else {
                alert.error('Ocorreu um erro ao deletar Arquivo.')
            }
        } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro ao deletar Arquivo.')
            return error
        } finally {
            setLoading(false)
        }
    };

    // const addNewCronologicData = () => {
    //     setCronologicData([...cronologicData, { idade_inicial: 0, idade_final: 5 }]);
    // };

    // const removeCronologicData = (index) => {
    //     const newData = [...cronologicData];
    //     newData.splice(index, 1);
    //     setCronologicData(newData);
    // };



    // const handleInputSomaticChange = (index, key, value) => {
    //     const newData = [...somaticData];
    //     newData[index][key] = value;
    //     setSomaticData(newData);
    // };

    // const addNewSomaticData = () => {
    //     setSomaticData([...somaticData, { nivel_sintoma: 10 }]);
    // };

    // const removeSomaticData = (index) => {
    //     const newData = [...somaticData];
    //     newData.splice(index, 1);
    //     setSomaticData(newData);
    // };


    const groupCondition = [
        { label: 'Cronológico', value: 'cronologico', icon: 'cronologico' },
        { label: 'Somático', value: 'somatico' },
        { label: 'Temático', value: 'tematico' },
        { label: 'Futuro', value: 'futuro' },
        { label: 'Potencialização', value: 'potencializacao' },

    ]

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });


    const titleName = () => {
        let query = ''
        if (selectedConditions?.includes('cronologico')) {
            query += 'Cronológico'
        }
        if (selectedConditions?.includes('somatico')) {
            query += ' + Somático'
        }
        return query
    }


    return (
        <>
            <SectionHeader
                perfil={'Prontuário Online'}
                title={`${consultRecordData?.paciente} - (${formatTimeStamp(consultRecordData?.data)})` || `Novo Prontuário da Consulta`}
            />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    backgroundColor: colorPalette.secondary,
                    padding: '10px 20px',
                    borderRadius: 2,
                    overflowX: 'auto', // Permite o scroll horizontal
                    whiteSpace: 'nowrap', // Mantém o conteúdo em linha única
                    scrollbarWidth: 'thin', // Para navegadores que suportam, diminui a largura da barra de rolagem
                    '&::-webkit-scrollbar': {
                        height: '8px', // Altura da barra de rolagem no Chrome/Safari
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc', // Cor da barra de rolagem
                        borderRadius: '10px', // Borda arredondada para estilo
                    },
                }}
            >
                {sessions?.map((item, index) => {
                    const currentSession = item.id_consulta == id;
                    let formattedDate = item?.data;
                    let formattedHour = item?.data;

                    const currentDate = new Date(item?.data);
                    const options = {
                        day: 'numeric',
                        month: 'short',
                    };

                    formattedDate = currentDate
                        ? new Intl.DateTimeFormat('pt-BR', options).format(currentDate)
                        : 'none';
                    const horaMoment = moment(item?.data);
                    formattedHour = horaMoment.format('HH:mm');

                    return (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', position: 'relative', }}>
                            {/* Data e hora */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                backgroundColor: currentSession ? 'green' : colorPalette.primary,
                                padding: '5px 10px', borderRadius: 2,
                                '&:hover': {
                                    cursor: !currentSession && 'pointer',
                                    transform: !currentSession && 'scale(1.05, 1.05)',
                                    transition: '.3s'
                                }
                            }} onClick={() => {
                                if (!currentSession) {
                                    router.push(`/consultation/${item.id_consulta}`)
                                }
                            }}>
                                <Text bold large style={{ color: currentSession && 'white' }}>{formattedDate}</Text>
                                <Text light small style={{ color: currentSession && 'white' }}>{formattedHour}</Text>
                            </Box>

                            {/* Linha horizontal entre os steps */}
                            {(index < sessions.length - 1) && <Box sx={{
                                ...styles.menuIcon,
                                left: -6,
                                width: 12,
                                height: 12,
                                backgroundImage: `url('/icons/next.png')`,
                            }} />}
                        </Box>
                    );
                })}
            </Box>


            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, height: '100%' }}>
                        <Box sx={{ display: 'flex', gap: 3, backgroundColor: colorPalette.secondary, padding: '10px 12px', borderRadius: 2 }}>
                            {groupCondition?.map((item, index) => {
                                const selected = selectedConditions?.includes(item.value);
                                return (
                                    <Box key={index} sx={{
                                        display: 'flex', gap: .5, width: '120px', padding: '10px 12px', borderRadius: 4,
                                        alignItems: 'center', justifyContent: 'center',
                                        transition: '.3s',
                                        flexDirection: 'column',
                                        backgroundColor: selected ? colorPalette?.buttonColor : 'transparent',
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            transform: 'scale(1.1, 1.1)'
                                        },
                                    }} onClick={() => toggleCondition(item?.value)}>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url('/icons/${item?.value}_anaminese.png')`,
                                            transition: '.3s',
                                            width: 30, height: 30,
                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                            }
                                        }} />
                                        <Text style={{ color: selected ? '#fff' : colorPalette?.buttonColor }}>{item?.label}</Text>
                                    </Box>
                                )
                            })}
                        </Box>

                        <Box sx={{
                            display: 'flex', width: '100%', padding: '30px', flexDirection: 'column', height: '100%',
                            backgroundColor: '#fff', gap: 2,
                            boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        }}>

                            <Box sx={{
                                display: 'flex', gap: 1, justifyContent: 'flex-start', width: '100%'
                            }}>

                                <Box sx={{
                                    display: 'flex', gap: 1, flexDirection: 'column', padding: '10px 20px', border: `1px solid ${colorPalette?.buttonColor}`,
                                    borderRadius: 2
                                }}>
                                    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text bold style={{ color: colorPalette?.buttonColor }}>Temas salvos</Text>
                                        <Button small text="Novo tema" onClick={() => setShowTematic(true)} />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: `wrap` }}>
                                        {arrayTematic?.map((item, tematicIndex) => (
                                            <Box key={tematicIndex} sx={{
                                                display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: colorPalette?.primary, padding: '12px 15px'
                                            }}>
                                                <Text bold>{item?.nome_tema}</Text>
                                                <Box sx={{
                                                    ...styles.menuIcon,
                                                    backgroundImage: `url('/icons/remove_icon.png')`,
                                                    width: 13,
                                                    height: 13,
                                                    "&:hover": {
                                                        opacity: 0.8,
                                                        cursor: 'pointer',
                                                        transform: 'scale(1.1, 1.1)'
                                                    },
                                                }} onClick={() => handleDeleteTheme(item.id_tema_sessao)} text="Remover" />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                            </Box>

                            <TextInput
                                label="Anotações do paciente:"
                                multiline={true}
                                rows={3}
                                // maxRows={8}
                                value={consultRecordData?.anotacoes || ''}
                                onChange={(e) => setConsultRecordData({ ...consultRecordData, anotacoes: e.target.value })}
                                onBlur={() => handleUpdateNotes()}
                            />

                            {selectedConditions.includes('cronologico') &&
                                <Box sx={{
                                    display: 'flex', width: '100%', padding: '10px 10px', marginTop: 2, flexDirection: 'column', alignItems: 'start',
                                    gap: 1.8
                                }}>
                                    <Text bold title style={{ color: colorPalette?.buttonColor }}>{titleName()}</Text>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Text bold>Insira a faixa da Idade:</Text>
                                            <Button small onClick={addNewCronologicData} text="Novo" style={{ width: 90, height: 25 }} />
                                        </Box>

                                        {cronologicData?.map((data, index) => (
                                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                                                <Text bold small style={{ color: colorPalette?.buttonColor }}>{index + 1}º Faixa</Text>

                                                <Box sx={{ display: 'flex', width: '100%', gap: 2, alignItems: 'center' }}>
                                                    <TextInput
                                                        type="number"
                                                        value={data?.idade_inicial}
                                                        onChange={(e) => handleInputCronologicChange(index, 'idade_inicial', parseInt(e.target.value))}
                                                    />
                                                    <TextInput
                                                        type="number"
                                                        value={data?.idade_final}
                                                        onChange={(e) => handleInputCronologicChange(index, 'idade_final', parseInt(e.target.value))}
                                                    />
                                                    <Text>Anos</Text>
                                                    <Button secondary onClick={() => removeCronologicData(index)} text="Remover" />
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'column', border: `1px solid #eaeaea`,
                                                    padding: '15px 12px', borderRadius: 2
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 1.8, alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', gap: 1.8, alignItems: 'center' }}>
                                                            <Text bold>Nível de Desconforto - Filme:</Text>
                                                            <Box sx={{
                                                                ...styles.menuIcon,
                                                                backgroundImage: `url('/icons/include_icon.png')`,
                                                                transition: '.3s',
                                                                width: 22,
                                                                height: 22,
                                                                "&:hover": {
                                                                    opacity: 0.8,
                                                                    cursor: 'pointer',
                                                                    transform: 'scale(1.1, 1.1)'
                                                                },
                                                            }} onClick={() => addNewDiscomfortData(data.id)} />
                                                        </Box>

                                                        <Box sx={{
                                                            display: 'flex', gap: 1.5, border: `1px solid ${colorPalette?.buttonColor}`, padding: '8px 12px',
                                                            flexDirection: 'row'
                                                        }}>
                                                            <Text bold>Marcadores:</Text>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Box sx={{
                                                                    display: 'flex', gap: 1.8, alignItems: 'center',
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        '&:hover': {
                                                                            opacity: .7,
                                                                            cursor: 'pointer',
                                                                            backgroundColor: 'green' + '77'
                                                                        }
                                                                    }} onClick={() => setOpitionsMark({ ...opitionsMark, microfase: !opitionsMark?.microfase })}>
                                                                        {opitionsMark?.microfase ?
                                                                            <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                                                                            :
                                                                            <Box sx={{
                                                                                display: 'flex', border: `1px solid black`,
                                                                                width: 17, height: 17, borderRadius: 17,
                                                                                transition: '.3s',
                                                                            }} />
                                                                        }
                                                                    </Box>
                                                                    <Text light>MicroFase (MF)</Text>
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex', gap: 1.8, alignItems: 'center',
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        '&:hover': {
                                                                            opacity: .7,
                                                                            cursor: 'pointer',
                                                                            backgroundColor: 'green' + '77'
                                                                        }
                                                                    }} onClick={() => setOpitionsMark({ ...opitionsMark, threeP: !opitionsMark?.threeP })}>
                                                                        {opitionsMark?.threeP ?
                                                                            <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                                                                            :
                                                                            <Box sx={{
                                                                                display: 'flex', border: `1px solid black`,
                                                                                width: 17, height: 17, borderRadius: 17,
                                                                                transition: '.3s'
                                                                            }} />
                                                                        }
                                                                    </Box>
                                                                    <Text light>3P</Text>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: `wrap`,
                                                        // backgroundColor: colorPalette?.buttonColor + '77',
                                                        padding: '5px 8px'
                                                    }}>
                                                        {discomfortLevel?.map((data, discomfortIndex) => (
                                                            data.parentId === cronologicData[index].id && (
                                                                <Box key={discomfortIndex} sx={{
                                                                    display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-start',
                                                                    padding: '8px 12px',
                                                                    // backgroundColor: colorPalette?.buttonColor + '66',
                                                                    backgroundColor: colorPalette?.secondary,
                                                                    border: `1px solid #eaeaea`,
                                                                    borderRadius: 2,
                                                                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                                                                }}>
                                                                    {data?.microfase && <Box sx={{ display: 'flex', padding: '2px 4px', backgroundColor: 'orange' }}><Text>{data?.microfase && 'MF'}</Text></Box>}
                                                                    {data?.threeP && <Box sx={{ display: 'flex', padding: '2px 4px', backgroundColor: 'lightgreen' }}><Text>{data?.threeP && '3P'}</Text></Box>}
                                                                    <TextInput
                                                                        type="number"
                                                                        value={data?.nivel_desc}
                                                                        onChange={(e) => handleInputDiscomfortChange(discomfortIndex, 'nivel_desc', parseInt(e.target.value))}
                                                                        sx={{ width: 80 }}
                                                                    />
                                                                    <Box sx={{
                                                                        ...styles.menuIcon,
                                                                        backgroundImage: `url('/icons/remove_icon.png')`,
                                                                        transition: '.3s',
                                                                        width: 13,
                                                                        height: 13,
                                                                        "&:hover": {
                                                                            opacity: 0.8,
                                                                            cursor: 'pointer',
                                                                            transform: 'scale(1.1, 1.1)'
                                                                        },
                                                                    }} onClick={() => removeDiscomfortData(discomfortIndex)} text="Remover" />
                                                                </Box>
                                                            )
                                                        ))}
                                                    </Box>
                                                </Box>

                                                {selectedConditions.includes('somatico') &&

                                                    <Box sx={{
                                                        display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'column', border: `1px solid #eaeaea`,
                                                        padding: '15px 12px', borderRadius: 2
                                                    }}>
                                                        <Box sx={{ display: 'flex', gap: 1.8, alignItems: 'center' }}>
                                                            <Text bold>Nível de Desconforto - Corpo:</Text>
                                                            <Box sx={{
                                                                ...styles.menuIcon,
                                                                backgroundImage: `url('/icons/include_icon.png')`,
                                                                transition: '.3s',
                                                                width: 22,
                                                                height: 22,
                                                                "&:hover": {
                                                                    opacity: 0.8,
                                                                    cursor: 'pointer',
                                                                    transform: 'scale(1.1, 1.1)'
                                                                },
                                                            }} onClick={() => addNewSomaticData(data.id)} />

                                                            <Box sx={{
                                                                display: 'flex', gap: 1.5, border: `1px solid ${colorPalette?.buttonColor}`, padding: '8px 12px',
                                                                flexDirection: 'row'
                                                            }}>
                                                                <Text bold>Marcadores:</Text>
                                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                                    <Box sx={{
                                                                        display: 'flex', gap: 1.8, alignItems: 'center',
                                                                    }}>
                                                                        <Box sx={{
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            '&:hover': {
                                                                                opacity: .7,
                                                                                cursor: 'pointer',
                                                                                backgroundColor: 'green' + '77'
                                                                            }
                                                                        }} onClick={() => setOpitionsMark({ ...opitionsMark, microfase: !opitionsMark?.microfase })}>
                                                                            {opitionsMark?.microfase ?
                                                                                <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                                                                                :
                                                                                <Box sx={{
                                                                                    display: 'flex', border: `1px solid black`,
                                                                                    width: 17, height: 17, borderRadius: 17,
                                                                                    transition: '.3s',
                                                                                }} />
                                                                            }
                                                                        </Box>
                                                                        <Text light>MicroFase (MF)</Text>
                                                                    </Box>
                                                                    <Box sx={{
                                                                        display: 'flex', gap: 1.8, alignItems: 'center',
                                                                    }}>
                                                                        <Box sx={{
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            '&:hover': {
                                                                                opacity: .7,
                                                                                cursor: 'pointer',
                                                                                backgroundColor: 'green' + '77'
                                                                            }
                                                                        }} onClick={() => setOpitionsMark({ ...opitionsMark, threeP: !opitionsMark?.threeP })}>
                                                                            {opitionsMark?.threeP ?
                                                                                <CheckCircleIcon style={{ color: 'green', fontSize: 20 }} />
                                                                                :
                                                                                <Box sx={{
                                                                                    display: 'flex', border: `1px solid black`,
                                                                                    width: 17, height: 17, borderRadius: 17,
                                                                                    transition: '.3s'
                                                                                }} />
                                                                            }
                                                                        </Box>
                                                                        <Text light>3P</Text>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        {selectedConditions.includes('cronologico') &&
                                                            <Box sx={{ display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: `wrap` }}>
                                                                {somaticData?.map((data, somaticIndex) => (
                                                                    data.parentId === cronologicData[index].id && (
                                                                        <Box key={somaticIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                            <TextInput
                                                                                type="number"
                                                                                value={data?.nivel_sintoma}
                                                                                onChange={(e) => handleInputSomaticChange(index, somaticIndex, 'nivel_sintoma', parseInt(e.target.value), 'somatico')}
                                                                                sx={{ width: 80 }}
                                                                            />
                                                                            <Box sx={{
                                                                                ...styles.menuIcon,
                                                                                backgroundImage: `url('/icons/remove_icon.png')`,
                                                                                transition: '.3s',
                                                                                width: 13,
                                                                                height: 13,
                                                                                "&:hover": {
                                                                                    opacity: 0.8,
                                                                                    cursor: 'pointer',
                                                                                    transform: 'scale(1.1, 1.1)'
                                                                                },
                                                                            }} onClick={() => removeSomaticData(somaticIndex)} text="Remover" />
                                                                        </Box>
                                                                    )
                                                                ))}
                                                            </Box>
                                                        }
                                                    </Box>
                                                }
                                            </Box>
                                        ))}
                                    </Box >
                                </Box>
                            }
                            <Divider distance={5} />
                        </Box>
                    </Box>


                    <Box sx={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, backgroundColor: colorPalette.secondary,
                        padding: '30px', gap: 2
                    }}>
                        <Text bold title>Arquivos</Text>
                        <DropZoneSession callBack={() => handleGetFiles()} filesDrop={filesDrop} id={id} />
                        {filesDrop?.length > 0 &&
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {filesDrop?.map((item, index) => {
                                    const typePdf = item?.name?.includes('pdf') || null;
                                    return (
                                        <Box key={index} sx={{ display: 'flex', gap: 1, backgroundColor: colorPalette.primary, padding: '5px 12px', borderRadius: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                                            <Box sx={{ display: 'flex', gap: 1, padding: '0px 12px', borderRadius: 2, alignItems: 'center', justifyContent: 'space-between' }} >
                                                <Text small style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px'
                                                }}>
                                                    {encodeURIComponent(item?.name_file)}
                                                </Text>
                                                <Box sx={{
                                                    ...styles.menuIcon,
                                                    width: 12,
                                                    height: 12,
                                                    aspectRatio: '1:1',
                                                    backgroundImage: `url(${icons.gray_close})`,
                                                    transition: '.3s',
                                                    zIndex: 9999,
                                                    "&:hover": {
                                                        opacity: 0.8,
                                                        cursor: 'pointer'
                                                    }
                                                }} onClick={() => handleRemoveFile(item?.id_arq_sessao, item?.key_file)} />
                                            </Box>
                                            <Link href={item?.location || ''} target="_blank">
                                                <Box
                                                    sx={{
                                                        backgroundImage: `url('${typePdf ? '/icons/pdf_icon.png' : item?.location}')`,
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center center',
                                                        width: { xs: '100%', sm: 100, md: 100, lg: 150, xl: 150 },
                                                        aspectRatio: '1/1',
                                                    }} />
                                            </Link>
                                        </Box>
                                    )
                                })}
                    </Box>}
                </Box>
            </Box>

            <Box sx={{
                display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '15px 10px', borderRadius: 2,
                flexDirection: 'column', alignItems: 'center', width: '30%'
            }}>
                <Text light large>Dados do Paciente/Sessão</Text>
                <Avatar src={consultRecordData?.url_foto_paci || ''} sx={{
                    height: { xs: 45, sm: 45, md: 45, lg: 120 },
                    width: { xs: 45, sm: 45, md: 45, lg: 120 },
                }} variant="circle"
                />

                <Divider />

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%', padding: '10px 15px' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text light style={{ color: colorPalette.third }}>Nome:</Text>
                        <Text bold style={{ color: colorPalette.third }}>{consultRecordData?.paciente}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text light style={{ color: colorPalette.third }}>Idade:</Text>
                        <Text bold style={{ color: colorPalette.third }}>{formatTimeStamp(consultRecordData?.nascimento)} - ({calculationAgeUser(consultRecordData?.nascimento)} Anos)</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text light style={{ color: colorPalette.third }}>Empresa:</Text>
                        <Text bold style={{ color: colorPalette.third }}>{consultRecordData?.empresa || 'Particular'}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text light style={{ color: colorPalette.third }}>Agendamento:</Text>
                        <Text bold style={{ color: colorPalette.third }}>{formatTimeStamp(consultRecordData?.data, true) || '-'}</Text>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text light style={{ color: colorPalette.third }}>Nº Sessão:</Text>
                        <Text bold style={{ color: colorPalette.third }}>{currentSessionNumber || '-'}</Text>
                    </Box>

                    <Divider />


                    <Button text="Finalizar sessão" style={{}} onClick={() => {
                        handleUpdateNotes()
                    }} />
                    <Box sx={{
                        display: 'flex', padding: '5px 12px',
                        alignItems: 'center', justifyContent: 'center', gap: 1, border: `1px solid green`,
                        borderRadius: 2,
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer',
                            transform: 'scale(1.03, 1.03)'
                        }
                    }} onClick={() => {
                        handleUpdateNotes()
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url('/icons/include_icon.png')`,
                            transition: '.3s',
                            width: 25, height: 25,
                        }} />
                        <Text>Salvar Etapa</Text>
                    </Box>
                </Box>
            </Box>
        </Box >
            <Backdrop open={showTematic}>
                <ContentContainer>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text bold large>Adicionar Tema</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_close})`,
                            transition: '.3s',
                            width: 15,
                            height: 15,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            },
                        }}
                            onClick={() => setShowTematic(false)} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <TextInput
                            label="Tema:"
                            multiline={true}
                            value={tematicName?.tema}
                            onChange={(e) => setTematicName({ tema: e.target.value })}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                        <Button small text="Adicionar" style={{ width: '100%' }} onClick={() => handleAddTheme()} />
                        <Button small secondary text="Cancelar" style={{ width: '100%' }} onClick={() => setShowTematic(false)} />
                    </Box>
                </ContentContainer>
            </Backdrop>
        </>
    )
}


const DropZoneSession = ({ callBack = () => { }, setFilesDrop, id }) => {

    const { setLoading, alert, theme } = useAppContext()


    const onDropFiles = async (files) => {
        try {
            setLoading(true);
            const uploadedFiles = files.map(file => ({
                file,
                id: getRandomInt(1, 999),
                name: file.name,
                preview: URL.createObjectURL(file),
                progress: 0,
                uploaded: false,
                error: false,
                url: null
            }));

            // Iniciar o upload imediatamente
            for (const uploadedFile of uploadedFiles) {
                await handleUpload(uploadedFile);
            }

            callBack()

        } catch (error) {
            console.log(error);
            alert.error('Erro ao processar os arquivos.');
        } finally {
            setLoading(false);
        }
    }


    const handleUpload = async (uploadedFile) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile?.file, encodeURIComponent(uploadedFile?.name));

        try {
            const response = await api.post(`/consultion/file/upload?consultionId=${id}`, formData);
            const { status } = response;

            if (status === 201) {
                alert.info('Arquivo(s) atualizado(s).');
            } else {
                alert.error('Tivemos um problema ao fazer upload do arquivo.');
            }
        } catch (error) {
            alert.error('Tivemos um problema ao fazer upload do arquivo.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dropzone
            accept={{
                'image/jpeg': ['.jpeg', '.JPEG', '.jpg', '.JPG'],
                'image/png': ['.png', '.PNG'],
                'application/pdf': ['.pdf'],
                'text/csv': ['.csv'], // Adicionando suporte para arquivos CSV
                'application/vnd.ms-excel': ['.xls'], // Adicionando suporte para arquivos XLS
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] // Adicionando suporte para arquivos XLSX
            }}
            onDrop={onDropFiles}
            addRemoveLinks={true}
            removeLink={(file) => handleRemoveFile(file)}
        >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                <Box {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Box sx={{ textAlign: 'center', display: 'flex', fontSize: 12, gap: 0, alignItems: 'center' }}>
                        <Button small style={{ height: 25, borderRadius: '6px 0px 0px 6px' }} text="Selecionar" />
                        <Box sx={{ textAlign: 'center', display: 'flex', border: `1px solid ${(theme ? '#eaeaea' : '#404040')}`, padding: '0px 15px', maxWidth: 400, height: 25, alignItems: 'center' }}>
                            <Text light small>Selecione um arquivo ou foto</Text>
                        </Box>
                    </Box>
                </Box>
            )}
        </Dropzone>
    )
}

const styles = {
    containerRegister: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        padding: '40px'
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    }
}