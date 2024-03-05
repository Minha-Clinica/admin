import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Backdrop, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, Divider } from "../../atoms"
import { RadioItem, SectionHeader } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { calculationAgeUser, formatTimeStamp } from "../../helpers"
import { icons } from "../../organisms/layout/Colors"

export default function ConsultationRecord(props) {
    const { setLoading, alert, colorPalette, user, setShowConfirmationDialog, userPermissions, menuItemsList } = useAppContext()
    let userId = user?.id;
    const router = useRouter()
    const { id } = router.query;
    const newConsultRecord = id === 'new';
    const [cronologicData, setCronologicData] = useState([]);
    const [somaticData, setSomaticData] = useState([]);
    const [patientNotes, setPatientNotes] = useState('')
    const [arrayTematic, setArrayTematic] = useState([])
    const [tematicName, setTematicName] = useState({ tema: '' })
    const [showTematic, setShowTematic] = useState(false)
    const [consultRecordData, setConsultRecordData] = useState({
    })
    const [selectedConditions, setSelectedConditions] = useState([])
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))

    const getConsult = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/consultation/${id}`)
            const { data } = response
            setConsultRecordData(data)
        } catch (error) {
            console.log(error)
            return error
        } finally { }
        setLoading(false)
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
            await getConsult()
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
        if (value === 'tematico') {
            setShowTematic(true)
            return
        }
        if (selectedConditions.includes(value)) {
            setSelectedConditions(selectedConditions.filter((condition) => condition !== value));
        } else {
            setSelectedConditions([...selectedConditions, value]);
        }
    };

    const handleInputSomaticChange = (cronoIndex, somaticIndex, key, value, type) => {
        const newData = [...somaticData];
        newData[somaticIndex][key] = value;
        setSomaticData(newData);
    };

    const addNewCronologicData = () => {
        const newCronoData = { idade_inicial: 0, idade_final: 5, id: generateUniqueId() }; // Adiciona um ID único
        setCronologicData([...cronologicData, newCronoData]);
        // setSomaticData([...somaticData, { nivel_sintoma: 10, parentId: newCronoData.id }]);
    };

    const removeCronologicData = (index) => {
        const removedCronoData = cronologicData[index];
        const newData = cronologicData.filter((_, i) => i !== index);
        setCronologicData(newData);

        // Remove dados somáticos associados ao cronológico removido
        const newSomaticData = somaticData.filter((data) => data.parentId !== removedCronoData.id);
        setSomaticData(newSomaticData);
    };

    // ...

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
        { label: 'Cronológico', value: 'cronologico' },
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
                perfil={consultRecordData?.paciente}
                title={`${consultRecordData?.paciente} (${calculationAgeUser(consultRecordData?.nascimento)} Anos) - 1º Sessão (${formatTimeStamp(consultRecordData?.data)})` || `Novo Prontuário da Consulta`}
                saveButton={true}
            />

            {/* usuario */}
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {groupCondition?.map((item, index) => {
                        const selected = selectedConditions?.includes(item.value);
                        return (
                            <Box key={index} sx={{
                                display: 'flex', gap: 2, width: '100%', padding: '10px 12px', borderRadius: 2,
                                border: `1px solid ${colorPalette?.buttonColor}`,
                                alignItems: 'center', justifyContent: 'center',
                                transition: '.3s',
                                backgroundColor: selected ? colorPalette?.buttonColor : 'transparent',
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    transform: 'scale(1.1, 1.1)'
                                },
                            }} onClick={() => toggleCondition(item?.value)}>
                                {item?.value === 'tematico' &&
                                    <Box sx={{
                                        ...styles.menuIcon,
                                        backgroundImage: `url('/icons/include_icon.png')`,
                                        transition: '.3s',
                                        width: 20, height: 20,
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer'
                                        }
                                    }} />
                                }
                                <Text large style={{ color: selected ? '#fff' : colorPalette?.buttonColor }}>{item?.label}</Text>
                            </Box>
                        )
                    })}
                </Box>

                <Box sx={{
                    display: 'flex', width: '100%', padding: '30px', flexDirection: 'column',
                    backgroundColor: '#fff', marginTop: 2,
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                }}>

                    <TextInput
                        label="Anotações do paciente:"
                        multiline={true}
                        rows={3}
                        maxRows={8}
                        value={patientNotes}
                        onChange={(e) => setPatientNotes(e.target.value)}
                    />
                    {selectedConditions.includes('cronologico') &&
                        <Box sx={{
                            display: 'flex', width: '100%', padding: '10px 10px', marginTop: 2, flexDirection: 'column', alignItems: 'start',
                            // border: `1px solid ${colorPalette?.buttonColor}`, 
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

                                        {selectedConditions.includes('somatico') &&
                                            <Box sx={{ display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', gap: 1.8, alignItems: 'center' }}>
                                                    <Text bold>Nível de Sintoma:</Text>
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

                    <Box sx={{
                        display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%'
                    }}>

                        {arrayTematic?.length > 0 &&
                            <Box sx={{
                                display: 'flex', gap: 1, flexDirection: 'column', padding: '20px 20px', border: `1px solid ${colorPalette?.buttonColor}`,
                                width: '500px'
                            }}>
                                <Text title bold style={{ color: colorPalette?.buttonColor }}>Temático</Text>
                                <Box sx={{ display: 'flex', gap: 1.8, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: `wrap` }}>
                                    {arrayTematic?.map((item, tematicIndex) => (
                                        <Box key={tematicIndex} sx={{
                                            display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: colorPalette?.primary, padding: '12px 15px'
                                        }}>
                                            <Text bold>{item?.tema}</Text>
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
                                            }} onClick={() => deleteTematicName(tematicIndex)} text="Remover" />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        }

                    </Box>
                </Box>
            </Box>

            <Backdrop open={showTematic}>
                <ContentContainer>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text bold large>Adicionar Tema (Temático)</Text>
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
                        <Button small text="Adicionar" style={{ width: '100%' }} onClick={() => addTematic()} />
                        <Button small secondary text="Cancelar" style={{ width: '100%' }} onClick={() => setShowTematic(false)} />
                    </Box>
                </ContentContainer>
            </Backdrop>
        </>
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