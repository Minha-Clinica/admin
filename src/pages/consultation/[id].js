import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { Avatar, Backdrop, Tooltip } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, Divider } from "../../atoms"
import moment from "moment";
import { useAppContext } from "../../context/AppContext"
import { calculationAgeUser, getRandomInt } from "../../helpers"
import { Colors, icons } from "../../organisms/layout/Colors"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dropzone from "react-dropzone"
import Link from "next/link"
import { CronologicCard, FutureCard, PotencializationCard, SomaticCard, TematicCard } from "../../organisms"
import { v4 as uuidv4 } from 'uuid';
import { ViewCronologicCard } from "../../organisms/consultation/Steps/View/ViewCronologicCard"
import { ViewTematicCard } from "../../organisms/consultation/Steps/View/ViewTematicCard"
import { ViewFutureCard } from "../../organisms/consultation/Steps/View/ViewFutureCard"
import { ViewPotencializationCard } from "../../organisms/consultation/Steps/View/ViewPotencializationCard"


function ConsultationRecord() {
    const { setLoading, alert, colorPalette, user } = useAppContext()
    let userId = user?.id;
    const router = useRouter()
    const { id } = router.query;
    const newConsultRecord = id === 'new';
    const [discomfortLevel, setDiscomfortLevel] = useState([]);
    const [tematicName, setTematicName] = useState({ tema: '' })
    const [showTematic, setShowTematic] = useState(false)
    const [showUploadFile, setUploadFile] = useState(false)
    const [showComment, setShowComment] = useState({ active: false, index: 0, text: '', new: true })
    const [currentSessionNumber, setCurrentSessionNumber] = useState(1)
    const [filesDrop, setFilesDrop] = useState([])
    const [consultRecordData, setConsultRecordData] = useState({
        anotacoes: ''
    })
    const [sessions, setSessions] = useState([])
    const [selectedConditions, setSelectedConditions] = useState([])
    const [arraySomatic, setArraySomatic] = useState([]);
    const [somaticData, setSomaticData] = useState({
        stepKey: '',
        faixaIdade: [],
    });
    const [arrayCronologic, setArrayCronologic] = useState([]);
    const [cronologicData, setCronologicData] = useState({
        stepKey: '',
        faixaIdade: [],
    });
    const [arrayFuture, setArrayFuture] = useState([]);
    const [futureData, setFutureData] = useState({
        stepKey: '',
        temas: [],
    })
    const [arrayTematic, setArrayTematic] = useState([]);
    const [tematicData, setTematicData] = useState({
        stepKey: '',
        temas: [],
    })
    const [arrayPotencialization, setArrayPotencialization] = useState([]);
    const [potencializationData, setPotencializationData] = useState({
        stepKey: '',
        temas: []
    });
    const [arrayThemes, setArrayThemes] = useState([]);
    const [selectedTemes, setSelectedTemes] = useState([]);
    const boxRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            if (!boxRef.current) return;

            const offsetTop = boxRef.current.getBoundingClientRect().top;

            // Quando atingir o topo, fixa
            setIsSticky(offsetTop <= 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                setArrayThemes(data)
            } else {
                setArrayThemes([])
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateNotes = async (e) => {
        if (e.target.value != consultRecordData?.anotacoes && e.target.value != '') {
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

    // const toggleCondition = (value) => {
    //     if (selectedConditions.includes(value)) {
    //         setSelectedConditions(selectedConditions.filter((condition) => condition !== value));
    //     } else {
    //         setSelectedConditions([...selectedConditions, value]);
    //     }
    // };

    const handleAddComment = () => {
        const newData = [...discomfortLevel];
        newData[showComment.index] = { ...newData[showComment.index], comment: showComment.text };
        setDiscomfortLevel(newData);
        setShowComment({ active: false, index: null, text: null, new: true });
    };

    const handleDeleteComment = () => {
        const newData = [...discomfortLevel];
        newData[showComment.index] = { ...newData[showComment.index], comment: null };
        setDiscomfortLevel(newData);
        setShowComment({ active: false, index: null, text: '', new: true });
    };




    // const handleInputSomaticChange = (cronoIndex, somaticIndex, key, value, type) => {
    //     const newData = [...somaticData];
    //     newData[somaticIndex][key] = value;
    //     setSomaticData(newData);
    // };

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


    const toggleCondition = (value) => {
        setSelectedConditions(prev => {
            const isSelected = prev.includes(value);
            if (isSelected) {
                // Deselecionando: mover dados para o array correspondente
                switch (value) {
                    case 'cronologico':
                        if (cronologicData.faixaIdade.length > 0) {
                            setArrayCronologic(prevArray => [...prevArray, cronologicData]);
                        }

                        setCronologicData({ stepKey: '', faixaIdade: [] });
                        break;
                    case 'somatico':
                        if (somaticData.faixaIdade.length > 0) {
                            setArraySomatic(prevArray => [...prevArray, somaticData]);
                        }
                        setSomaticData({ stepKey: '', faixaIdade: [] });
                        break;
                    case 'tematico':
                        if (tematicData.temas.length > 0) {
                            setArrayTematic(prevArray => [...prevArray, tematicData]);
                        }
                        setTematicData({ stepKey: '', temas: [] });
                        break;
                    case 'futuro':
                        if (futureData.temas.length > 0) {
                            setArrayFuture(prevArray => [...prevArray, futureData]);
                        }
                        setFutureData({ stepKey: '', temas: [] });
                        break;
                    case 'potencializacao':
                        if (potencializationData.temas.length > 0) {
                            setArrayPotencialization(prevArray => [...prevArray, potencializationData]);
                        }
                        setPotencializationData({ stepKey: '', temas: [] });
                        break;
                }
                return [];
            } else {
                // Selecionando: iniciar novo stepKey e resetar os dados temporários
                const newStepKey = `${uuidv4()}`; // ← usando UUID aqui
                switch (value) {
                    case 'cronologico':
                        setCronologicData({ stepKey: newStepKey, faixaIdade: [] });
                        break;
                    case 'somatico':
                        setSomaticData({ stepKey: newStepKey, faixaIdade: [] });
                        break;
                    case 'tematico':
                        setTematicData({ stepKey: newStepKey, temas: [] });
                        break;
                    case 'futuro':
                        setFutureData({ stepKey: newStepKey, temas: [] });
                        break;
                    case 'potencializacao':
                        setPotencializationData({ stepKey: newStepKey, temas: [] });
                        break;
                }
                return [...prev, value];
            }
        });
    };



    const groupCondition = [
        { label: 'Cronológico', value: 'cronologico', icon: 'red_icon' },
        { label: 'Somático', value: 'somatico', icon: 'yellow_icon' },
        { label: 'Temático', value: 'tematico', icon: 'blue_icon' },
        { label: 'Futuro', value: 'futuro', icon: 'pink_icon' },
        { label: 'Potencialização', value: 'potencializacao', icon: 'orange_icon' },
    ]

    const showHistoric = () => {
        if (arrayCronologic.length > 0) return true
        if (arraySomatic.length > 0) return true
        if (arrayTematic.length > 0) return true
        if (arrayFuture.length > 0) return true
        if (arrayPotencialization.length > 0) return true
        return false
    }



    return (
        <>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar src={consultRecordData?.url_foto_paci || ''} sx={{
                    height: { xs: 45, sm: 45, md: 45, lg: 60 },
                    width: { xs: 45, sm: 45, md: 45, lg: 60 },
                }} variant="circle"
                />
                <Text title>{consultRecordData?.paciente}</Text>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{
                        display: 'flex', gap: 2, alignItems: 'center',
                        backgroundColor: colorPalette.buttonColor,
                        borderRadius: 40, width: 40, height: 40,
                        justifyContent: 'center',
                    }}>
                        <Text bold large style={{ color: '#fff' }}>{calculationAgeUser(consultRecordData?.nascimento)}</Text>
                    </Box>

                    <Box sx={{
                        display: 'flex', gap: 2, alignItems: 'center',
                        backgroundColor: colorPalette.third,
                        borderRadius: 40, width: 40, height: 40,
                        justifyContent: 'center',
                    }}>
                        <Text bold large style={{ color: '#fff' }}>{currentSessionNumber || 1}ª</Text>
                    </Box>
                </Box>

            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: colorPalette.secondary,
                    padding: '20px',
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

                    const date = new Date();
                    const currentDate = new Date(item?.data);
                    const options = {
                        day: 'numeric',
                        month: 'numeric',
                    };

                    formattedDate = currentDate
                        ? new Intl.DateTimeFormat('pt-BR', options).format(currentDate)
                        : 'none';
                    const horaMoment = moment(item?.data);
                    formattedHour = horaMoment.format('HH:mm');

                    return (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', position: 'relative', gap: 1 }}>

                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                backgroundColor: currentSession ? colorPalette.third : date > currentDate ? '#d4f5d4' : Colors.yellowLight + '66',
                                padding: '8px 10px', borderRadius: 2,
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

                            {(index < sessions.length - 1) && <Box sx={{
                                ...styles.menuIcon,
                                width: 30,
                                height: 30,
                                backgroundImage: `url('/icons/afectu_arrow_gray.png')`,
                            }} />
                            }
                        </Box>
                    );
                })}
            </Box>

            <div ref={boxRef}>
                <Box
                    sx={{
                        position: isSticky && 'fixed',
                        transition: '.2s',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        backgroundColor: colorPalette.background || '#fff',
                        paddingTop: 1,
                        display: 'flex', gap: 2, width: '100%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        ...(isSticky && {
                            width: '90%',
                            marginLeft: '7%',
                            overflowY: 'auto',
                        })
                    }}
                >
                    <Box sx={{ display: 'flex', gap: .5, backgroundColor: colorPalette.secondary, padding: '10px 12px', borderRadius: 2 }}>
                        {groupCondition?.map((item, index) => {
                            const selected = selectedConditions?.includes(item.value);
                            return (
                                <Box key={index} sx={{
                                    display: 'flex', padding: '10px', borderRadius: 4,
                                    alignItems: 'center', justifyContent: 'center',
                                    transition: '.3s',
                                    flexDirection: 'column',
                                    backgroundColor: selected ? (colorPalette?.buttonColor + '66') : 'transparent',
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer',
                                        transform: 'scale(1.03, 1.03)'
                                    },
                                }} onClick={() => toggleCondition(item?.value)}>
                                    <Box sx={{ ...styles.iconCondition, backgroundImage: `url('/icons/${item?.icon}_afectu.png')` }} />
                                    <Text>{item?.label}</Text>
                                </Box>
                            )
                        })}
                    </Box>

                    <Box sx={{
                        display: 'flex', gap: 2, backgroundColor: colorPalette.secondary, padding: '10px 12px',
                        borderRadius: 2, alignItems: 'center', width: '100%', justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Text bold large>Temas</Text>
                        </Box>
                        <Box sx={{
                            display: 'flex', gap: 1.8, justifyContent: 'justify-between', border: `.5px solid ${colorPalette?.third}`,
                            width: '100%', height: '100%', alignItems: 'end', padding: '5px', borderRadius: 2
                        }}>
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexWrap: `wrap`, gap: 1.8, minWidth: 0, }}>
                                {arrayThemes?.map((item, tematicIndex) => (
                                    <Tooltip key={tematicIndex} title={selectedTemes?.includes(item?.nome_tema) && 'Tema em uso'} placement="top" arrow sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
                                        <div >
                                            <Box sx={{
                                                display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: selectedTemes?.includes(item?.nome_tema) ? colorPalette?.buttonColor + '66' : colorPalette?.primary, padding: '12px 15px', height: '35px', borderRadius: 2,
                                                ...(selectedConditions.length > 0 && {
                                                    cursor: 'pointer',
                                                    transition: '.3s',
                                                    '&:hover': {
                                                        opacity: .8,
                                                        transform: 'scale(1.01, 1.01)'
                                                    }
                                                })
                                            }} onClick={() => setSelectedTemes((prev) => [...prev, item.nome_tema])}>
                                                <Text bold>{item?.nome_tema}</Text>
                                                <Box sx={styles.iconRemove} onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleDeleteTheme(item.id_tema_sessao)
                                                }} text="Remover" />
                                            </Box>
                                        </div>
                                    </Tooltip>
                                ))}
                            </Box>
                            <AddCircleIcon onClick={() => setShowTematic(true)} sx={{ color: colorPalette?.buttonColor, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Box>
            </div >

            <Box sx={{ display: showHistoric() ? 'flex' : 'none', gap: 1, alignItems: 'center', justifyContent: 'center', margin: '15px 0px' }}>
                <Box sx={{ height: '1px', width: '100%', backgroundColor: 'darkgray' }} />
                <Text small bold style={{ color: 'darkgray' }}>Registrado</Text>
                <Box sx={{ height: '1px', width: '100%', backgroundColor: 'darkgray' }} />
            </Box>

            {arrayCronologic?.map((item, idx) => (
                <ViewCronologicCard arrayCronologic={item} key={idx} />
            ))}

            {arrayTematic?.map((item, idx) => (
                <ViewTematicCard arrayTematic={item} key={idx} />
            ))}

            {arrayFuture?.map((item, idx) => (
                <ViewFutureCard arrayFuture={item} key={idx} />
            ))}

            {arrayPotencialization?.map((item, idx) => (
                <ViewPotencializationCard arrayPotencialization={item} key={idx} />
            ))}

            <Box sx={{ display: showHistoric() ? 'flex' : 'none', gap: 1, alignItems: 'center', justifyContent: 'center', margin: '15px 0px' }}>
                <Box sx={{ height: '1px', width: '100%', backgroundColor: 'darkgray' }} />
                <Text small bold style={{ color: 'darkgray' }}>Registrado</Text>
                <Box sx={{ height: '1px', width: '100%', backgroundColor: 'darkgray' }} />
            </Box>

            {selectedConditions.includes('cronologico') &&
                <CronologicCard
                    selectedConditions={selectedConditions}
                    cronologicData={cronologicData}
                    setCronologicData={setCronologicData}
                />}
            {selectedConditions == 'somatico' &&
                <SomaticCard />}
            {selectedConditions.includes('tematico') &&
                <TematicCard
                    selectedConditions={selectedConditions}
                    selectedTemes={selectedTemes}
                    tematicData={tematicData}
                    setTematicData={setTematicData}
                />}
            {selectedConditions.includes('futuro') &&
                <FutureCard
                    selectedConditions={selectedConditions}
                    selectedTemes={selectedTemes}
                    setFutureData={setFutureData}
                    futureData={futureData}
                />}
            {
                selectedConditions.includes('potencializacao') &&
                <PotencializationCard
                    arrayPotencialization={arrayPotencialization}
                    setArrayPotencialization={setArrayPotencialization}
                    selectedTemes={selectedTemes}
                    potencializationData={potencializationData}
                    setPotencializationData={setPotencializationData}
                />
            }


            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <ContentContainer fullWidth>
                    <Text bold large>Anotações do Paciente</Text>
                    <TextInput
                        multiline={true}
                        rows={3}
                        value={consultRecordData?.anotacoes || ''}
                        onChange={(e) => setConsultRecordData({ ...consultRecordData, anotacoes: e.target.value })}
                        onBlur={(e) => handleUpdateNotes(e)}
                        InputProps={{ style: { backgroundColor: colorPalette?.secondary } }}
                    />
                </ContentContainer>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <Button text="Upload de Arquivo" style={{ width: 150 }} onClick={() => setUploadFile(true)} />
                    <Button secondary text="Finalizar Sessão" style={{ width: 150, backgroundColor: colorPalette?.third }} />
                </Box>
            </Box>


            <Backdrop open={showUploadFile}>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, backgroundColor: colorPalette.secondary,
                    padding: '30px', gap: 2
                }}>

                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text bold large>Adicionar Tema</Text>
                        <Box sx={styles.iconClose}
                            onClick={() => setUploadFile(false)} />
                    </Box>
                    <Divider />

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
            </Backdrop>

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


            <Backdrop open={showComment.active}>
                <ContentContainer>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text bold large>Adicionar Comentário</Text>
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
                            onClick={() => setShowComment({ active: false, index: null, text: '', new: true })} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <TextInput
                            label="Comentário:"
                            multiline={true}
                            value={showComment?.text || ''}
                            rows={3}
                            onChange={(e) => setShowComment({ ...showComment, text: e.target.value })}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                        <Button small text={showComment.new ? "Adicionar" : "Atualizar"} style={{ width: '100%' }} onClick={() => {
                            if (showComment.text) {
                                handleAddComment()
                            } else {
                                alert.info('Escreva algum comentário')
                            }
                        }} />
                        <Button small secondary text={showComment.new ? "Cancelar" : "Deletar"} style={{ width: '100%' }} onClick={() => handleDeleteComment()} />
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
    iconCondition: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transition: '.3s',
        width: 60, height: 50,
        aspectRatio: '1/1',
        "&:hover": {
            opacity: 0.8,
            cursor: 'pointer'
        }
    },
    iconRemove: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('/icons/remove_icon.png')`,
        width: 13,
        height: 13,
        "&:hover": {
            opacity: 0.8,
            cursor: 'pointer',
            transform: 'scale(1.1, 1.1)'
        }
    },
    iconClose: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${icons.gray_close})`,
        transition: '.3s',
        width: 15,
        height: 15,
        "&:hover": {
            opacity: 0.8,
            cursor: 'pointer'
        }
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    }
}


export default ConsultationRecord