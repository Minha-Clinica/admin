import { useEffect, useState } from "react";
import { Box, Button, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";
import { CommentModal } from "../Comments";
import { v4 as uuidv4 } from 'uuid';



export const CronologicCard = (props) => {
    const { selectedConditions, cronologicData, setCronologicData } = props
    const { colorPalette } = useAppContext()
    const [activeModal, setActiveModal] = useState({
        active: false,
        tipo_desconforto: '',
        comentario: '',
        key: ''
    })

    useEffect(() => {
        handleAddToggleAge();
    }, [])

    const indices = {
        valor_inicial: 0,
        comentario: '',
        microfase: false
    }

    const ageGroup = {
        idade_inicial: 0,
        idade_final: 5
    }

    function handleAddToggleAge() {

        const novaIDE = {
            valor_inicial: 0,
            comentario: '',
            tresP: false,
            microfase: false,
            key: uuidv4()
        };

        const novaIDF = {
            valor_inicial: 0,
            comentario: '',
            tresP: false,
            microfase: false,
            key: uuidv4()
        };

        const novaFaixa = {
            faixa: {
                ...ageGroup,
                ide: [novaIDE],
                idf: [novaIDF]
            },
        };

        setCronologicData((prev) => ({
            ...prev,
            faixaIdade: [...prev.faixaIdade, novaFaixa]
        }));
    }

    function handleAddToggleIde() {
        setCronologicData((prev) => {
            const novaIDE = {
                ...indices,
                tresP: false,
                microfase: false,
                key: uuidv4()
            };

            const novaFaixaIdade = [...prev.faixaIdade];
            const lastIndex = novaFaixaIdade.length - 1;
            if (lastIndex >= 0) {
                novaFaixaIdade[lastIndex] = {
                    ...novaFaixaIdade[lastIndex],
                    faixa: {
                        ...novaFaixaIdade[lastIndex].faixa,
                        ide: [...(novaFaixaIdade[lastIndex].faixa.ide || []), novaIDE]
                    }
                };
            }

            return {
                ...prev,
                faixaIdade: novaFaixaIdade
            };
        });
    }

    function handleAddToggleIdf() {
        setCronologicData((prev) => {
            const novaIDF = {
                ...indices,
                tresP: false,
                microfase: false,
                key: uuidv4()
            };

            const novaFaixaIdade = [...prev.faixaIdade];
            const lastIndex = novaFaixaIdade.length - 1;
            if (lastIndex >= 0) {
                novaFaixaIdade[lastIndex] = {
                    ...novaFaixaIdade[lastIndex],
                    faixa: {
                        ...novaFaixaIdade[lastIndex].faixa,
                        idf: [...(novaFaixaIdade[lastIndex].faixa.idf || []), novaIDF]
                    }
                };
            }

            return {
                ...prev,
                faixaIdade: novaFaixaIdade
            };
        });
    }


    async function handleSaveComment() {
        setCronologicData(prev => {
            switch (activeModal.tipo_desconforto) {
                case 'ide':
                    const novaFaixaIdade = [...prev.faixaIdade];
                    const lastIndex = novaFaixaIdade.length - 1;
                    if (lastIndex >= 0) {
                        novaFaixaIdade[lastIndex] = {
                            ...novaFaixaIdade[lastIndex],
                            faixa: {
                                ...novaFaixaIdade[lastIndex].faixa,
                                ide: [...(novaFaixaIdade[lastIndex].faixa.ide || [])].map(item => {
                                    if (item.key === activeModal.key) return { ...item, comentario: activeModal.comentario }
                                    return item
                                })
                            }
                        };
                    }
                    return {
                        ...prev,
                        faixaIdade: novaFaixaIdade
                    };
                case 'idf':
                    const novaFaixaIdade2 = [...prev.faixaIdade];
                    const lastIndex2 = novaFaixaIdade2.length - 1;
                    if (lastIndex2 >= 0) {
                        novaFaixaIdade2[lastIndex2] = {
                            ...novaFaixaIdade2[lastIndex2],
                            faixa: {
                                ...novaFaixaIdade2[lastIndex2].faixa,
                                idf: [...(novaFaixaIdade2[lastIndex2].faixa.idf || [])].map(item => {
                                    if (item.key === activeModal.key) return { ...item, comentario: activeModal.comentario }
                                    return item
                                })
                            }
                        };
                    }
                    return {
                        ...prev,
                        faixaIdade: novaFaixaIdade2
                    };
            }

        })
    }

    const handleChangeIde = ({ target, indexFaixaItem, keyIde }) => {
        setCronologicData((prevCronologicData) => {
            const newFaixaIdade = prevCronologicData?.faixaIdade?.map((item, indexFaixa) => {
                if (indexFaixaItem === indexFaixa) {
                    const newFaixa = item?.faixa?.ide?.map((ide) => {
                        if (ide.key === keyIde) {
                            return { ...ide, valor_inicial: target.value }
                        }
                        return ide
                    })
                    return { ...item, faixa: { ...item?.faixa, ide: newFaixa } }
                }
                return item
            })
            return { ...prevCronologicData, faixaIdade: newFaixaIdade }
        })
    }

    const handleChangeIdf = ({ target, indexFaixaItem, keyIde }) => {
        setCronologicData((prevCronologicData) => {
            const newFaixaIdade = prevCronologicData?.faixaIdade?.map((item, indexFaixa) => {
                if (indexFaixaItem === indexFaixa) {
                    const newFaixa = item?.faixa?.idf?.map((ide) => {
                        if (ide.key === keyIde) {
                            return { ...ide, valor_inicial: target.value }
                        }
                        return ide
                    })
                    return { ...item, faixa: { ...item?.faixa, idf: newFaixa } }
                }
                return item
            })
            return { ...prevCronologicData, faixaIdade: newFaixaIdade }
        })
    }

    const handleChangeFaixaIdade = ({ value, index, field }) => {
        setCronologicData((prevCronologicData) => {
            const newFaixaIdade = prevCronologicData?.faixaIdade?.map((item, indexFaixa) => {
                if (indexFaixa === index) {
                    return {
                        ...item,
                        faixa: {
                            ...item?.faixa,
                            [field]: value
                        }
                    }
                }
                return item
            })
            return { ...prevCronologicData, faixaIdade: newFaixaIdade }
        })
    }

    const handleChangeMarks = ({ type, field, index, keyId }) => {
        setCronologicData((prevCronologicData) => {
            const newFaixaIdade = prevCronologicData?.faixaIdade?.map((item, indexFaixa) => {
                if (indexFaixa !== index) return item;

                const newItem = { ...item };


                switch (type) {
                    case 'ide':
                        newItem?.faixa?.ide?.map((ide) => {
                            if (ide.key === keyId) {
                                ide[field] = !ide[field]
                            }
                            return ide
                        })
                        break;

                    case 'idf':
                        newItem?.faixa?.idf?.map((idf) => {
                            if (idf.key === keyId) {
                                idf[field] = !idf[field]
                            }
                            return idf
                        })
                    default:
                        break
                }

                return newItem;
            });

            return { ...prevCronologicData, faixaIdade: newFaixaIdade }
        })
    }

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Cronológico</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {cronologicData?.faixaIdade?.map((item, index) => {
                        const faixaIde = item?.faixa?.ide || [];
                        const faixaIdf = item?.faixa?.idf || [];
                        return (
                            <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextInput
                                        placeholder='0'
                                        value={item.faixa.idade_inicial}
                                        InputProps={{ style: { width: 50, height: 30 } }}
                                        onChange={({ target }) => handleChangeFaixaIdade({ value: target.value, index, field: 'idade_inicial' })}
                                    />
                                    <Text>a</Text>
                                    <TextInput
                                        placeholder='0'
                                        value={item.faixa.idade_final}
                                        InputProps={{ style: { width: 50, height: 30 } }}
                                        onChange={({ target }) => handleChangeFaixaIdade({ value: target.value, index, field: 'idade_final' })}
                                    />

                                    <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }}
                                        onClick={handleAddToggleAge} />
                                </Box>


                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                                    <Text bold>IDE</Text>
                                    {faixaIde.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                            {faixaIde.map((ideItems, indexIde) => (
                                                <Box key={indexIde} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                    <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: ideItems.tresP ? 'gray' : colorPalette.inputColor
                                                        }} onClick={() => handleChangeMarks({ type: 'ide', field: 'tresP', index, keyId: ideItems.key })}>
                                                            <Text small style={{ color: ideItems.tresP ? '#fff' : 'black' }}>3P</Text>
                                                        </Box>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: ideItems.microfase ? 'gray' : colorPalette.inputColor,
                                                        }} onClick={() => handleChangeMarks({ type: 'ide', field: 'microfase', index, keyId: ideItems.key })}>
                                                            <Text small style={{ color: ideItems.microfase ? '#fff' : 'black' }}>MF</Text>
                                                        </Box>
                                                    </Box>
                                                    <TextInput
                                                        fullWidth
                                                        placeholder='0'
                                                        value={ideItems.valor_inicial}
                                                        InputProps={{ style: { width: 68, height: 30 } }}
                                                        onChange={({ target }) => handleChangeIde({
                                                            target,
                                                            indexFaixaItem: index,
                                                            keyIde: ideItems.key
                                                        })}
                                                        type={ideItems.comentario ? 'comment-active' : "comment"}
                                                        onActive={() => {
                                                            setActiveModal({
                                                                tipo_desconforto: 'ide',
                                                                key: ideItems.key,
                                                                active: true,
                                                                comentario: ideItems.comentario
                                                            })
                                                        }}
                                                    />
                                                </Box>
                                            ))}

                                            <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2, marginBottom: `2px` }}
                                                onClick={handleAddToggleIde}
                                            />
                                        </Box>
                                    )}
                                </Box>


                                {selectedConditions.includes('somatico') &&
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                                        <Text large bold>IDF</Text>

                                        {faixaIdf?.length > 0 && (
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                                {faixaIdf.map((itemIde, indexIde) => (
                                                    <Box key={indexIde} sx={{ display: 'flex', gap: 1, width: '100%', }}>
                                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                            <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                                <Box sx={{
                                                                    ...styles.containerMarks,
                                                                    backgroundColor: itemIde.tresP ? 'gray' : colorPalette.inputColor
                                                                }} onClick={() => handleChangeMarks({ type: 'idf', field: 'tresP', index, keyId: itemIde.key })}>
                                                                    <Text small style={{ color: itemIde.tresP ? '#fff' : 'black' }}>3P</Text>
                                                                </Box>
                                                                <Box sx={{
                                                                    ...styles.containerMarks,
                                                                    backgroundColor: itemIde.microfase ? 'gray' : colorPalette.inputColor,
                                                                }} onClick={() => handleChangeMarks({ type: 'idf', field: 'microfase', index, keyId: itemIde.key })}>
                                                                    <Text small style={{ color: itemIde.microfase ? '#fff' : 'black' }}>MF</Text>
                                                                </Box>
                                                            </Box>
                                                            <TextInput
                                                                fullWidth
                                                                placeholder='0'
                                                                value={itemIde.valor_inicial}
                                                                onChange={({ target }) => handleChangeIdf({
                                                                    target,
                                                                    indexFaixaItem: index,
                                                                    keyIde: itemIde.key
                                                                })}
                                                                InputProps={{ style: { width: 68, height: 30 } }}
                                                                type={itemIde.comentario ? 'comment-active' : "comment"}
                                                                onActive={() => {
                                                                    setActiveModal({
                                                                        tipo_desconforto: 'idf',
                                                                        key: itemIde.key,
                                                                        active: true,
                                                                        comentario: itemIde.comentario
                                                                    })
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                ))}

                                                <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2, marginBottom: `2px` }}
                                                    onClick={handleAddToggleIdf} />
                                            </Box>
                                        )}
                                    </Box>
                                }
                            </Box>
                        )
                    })}
                </Box>

            </Box>

            <CommentModal setActive={() => setActiveModal((prev) => ({ ...prev, active: !prev.active }))} active={activeModal.active}>
                <TextInput
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Comentarios'
                    value={activeModal?.comentario}
                    onChange={({ target }) => setActiveModal((prev) => ({ ...prev, comentario: target.value }))}
                />
                <Button text='Salvar' onClick={async () => {
                    await handleSaveComment()
                    setActiveModal((prev) => ({ ...prev, active: !prev.active }))
                }} style={{ marginTop: 2, width: 120 }} />
            </CommentModal>
        </Box>
    )
}

const styles = {
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 30,
        height: 30,
        backgroundImage: `url('/icons/red_icon_afectu.png')`,
    },
    containerMarks: {
        display: 'flex',
        width: '100%',
        gap: 1,
        borderRadius: '3px',
        alignItems: 'center',
        padding: '3px',
        transition: '.2s',
        transform: 'scale(.8)',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            opacity: .8
        }
    }
}