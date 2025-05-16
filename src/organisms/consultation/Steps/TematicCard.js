import { useEffect, useState } from "react";
import { Box, Button, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";
import { CommentModal } from "../Comments";
import { v4 as uuidv4 } from 'uuid';

export const TematicCard = (props) => {
    const { selectedConditions, selectedTemes, setTematicData, tematicData } = props
    const { colorPalette } = useAppContext()
    const [activeModal, setActiveModal] = useState({
        active: false,
        tipo_desconforto: '',
        comentario: '',
        key: ''
    })

    const indices = {
        valor_inicial: 0,
        comentario: '',
        microfase: false
    }

    useEffect(() => {
        handleAddToggleTheme();
    }, [])

    useEffect(() => {
        if (selectedTemes.length > 0) {
            handleChangeTheme({ value: selectedTemes[0], index: 0, field: 'nome_tema' })
        }
    }, [selectedTemes])


    function handleAddToggleTheme() {

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

        const novoTema = {
            tema: {
                nome_tema: '',
                dt_criacao: new Date(),
                ide: [novaIDE],
                idf: [novaIDF]
            },
        };

        setTematicData((prev) => ({
            ...prev,
            temas: [...prev.temas, novoTema]
        }));
    }

    function handleAddToggleIde() {
        setTematicData((prev) => {
            const novaIDE = {
                ...indices,
                tresP: false,
                microfase: false,
                key: uuidv4()
            };

            const novoTema = [...prev.temas];
            const lastIndex = novoTema.length - 1;
            if (lastIndex >= 0) {
                novoTema[lastIndex] = {
                    ...novoTema[lastIndex],
                    tema: {
                        ...novoTema[lastIndex].tema,
                        ide: [...(novoTema[lastIndex].tema.ide || []), novaIDE]
                    }
                };
            }

            return {
                ...prev,
                temas: novoTema
            };
        });
    }

    function handleAddToggleIdf() {
        setTematicData((prev) => {
            const novaIDF = {
                ...indices,
                tresP: false,
                microfase: false,
                key: uuidv4()
            };

            const novoTema = [...prev.temas];
            const lastIndex = novoTema.length - 1;
            if (lastIndex >= 0) {
                novoTema[lastIndex] = {
                    ...novoTema[lastIndex],
                    tema: {
                        ...novoTema[lastIndex].tema,
                        idf: [...(novoTema[lastIndex].tema.idf || []), novaIDF]
                    }
                };
            }

            return {
                ...prev,
                temas: novoTema
            };
        });
    }

    async function handleSaveComment() {
        setTematicData(prev => {
            switch (activeModal.tipo_desconforto) {
                case 'ide':
                    const novoTema = [...prev.temas];
                    const lastIndex = novoTema.length - 1;
                    if (lastIndex >= 0) {
                        novoTema[lastIndex] = {
                            ...novoTema[lastIndex],
                            tema: {
                                ...novoTema[lastIndex].tema,
                                ide: [...(novoTema[lastIndex].tema.ide || [])].map(item => {
                                    if (item.key === activeModal.key) return { ...item, comentario: activeModal.comentario }
                                    return item
                                })
                            }
                        };
                    }
                    return {
                        ...prev,
                        temas: novoTema
                    };
                case 'idf':
                    const novoTema2 = [...prev.temas];
                    const lastIndex2 = novoTema2.length - 1;
                    if (lastIndex2 >= 0) {
                        novoTema2[lastIndex2] = {
                            ...novoTema2[lastIndex2],
                            tema: {
                                ...novoTema2[lastIndex2].tema,
                                idf: [...(novoTema2[lastIndex2].tema.idf || [])].map(item => {
                                    if (item.key === activeModal.key) return { ...item, comentario: activeModal.comentario }
                                    return item
                                })
                            }
                        };
                    }
                    return {
                        ...prev,
                        temas: novoTema2
                    };
            }

        })
    }

    const handleChangeIde = ({ target, indexFaixaItem, keyIde }) => {
        setTematicData((prevTematicData) => {
            const novoTema = prevTematicData?.temas?.map((item, indexFaixa) => {
                if (indexFaixaItem === indexFaixa) {
                    const newTema = item?.tema?.ide?.map((ide) => {
                        if (ide.key === keyIde) {
                            return { ...ide, valor_inicial: target.value }
                        }
                        return ide
                    })
                    return { ...item, tema: { ...item?.tema, ide: newTema } }
                }
                return item
            })
            return { ...prevTematicData, temas: novoTema }
        })
    }

    const handleChangeIdf = ({ target, indexFaixaItem, keyIde }) => {
        setTematicData((prevTematicData) => {
            const novoTema = prevTematicData?.temas?.map((item, indexFaixa) => {
                if (indexFaixaItem === indexFaixa) {
                    const newTema = item?.tema?.idf?.map((ide) => {
                        if (ide.key === keyIde) {
                            return { ...ide, valor_inicial: target.value }
                        }
                        return ide
                    })
                    return { ...item, tema: { ...item?.tema, idf: newTema } }
                }
                return item
            })
            return { ...prevTematicData, temas: novoTema }
        })
    }

    const handleChangeTheme = ({ value, index, field }) => {
        setTematicData((prevTematicData) => {
            const novoTema = prevTematicData?.temas?.map((item, indexFaixa) => {
                console.log('entrou em tema', item)
                if (indexFaixa === index) {
                    return {
                        ...item,
                        tema: {
                            ...item?.tema,
                            [field]: value
                        }
                    }
                }
                return item
            })
            return { ...prevTematicData, temas: novoTema }
        })
    }

    const handleChangeMarks = ({ type, field, index, keyId }) => {
        setTematicData((prevTematicData) => {
            const newFaixaTema = prevTematicData?.temas?.map((item, indexFaixa) => {
                if (indexFaixa !== index) return item;

                const newItem = { ...item };


                switch (type) {
                    case 'ide':
                        newItem?.tema?.ide?.map((ide) => {
                            if (ide.key === keyId) {
                                ide[field] = !ide[field]
                            }
                            return ide
                        })
                        break;

                    case 'idf':
                        newItem?.tema?.idf?.map((idf) => {
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

            return { ...prevTematicData, temas: newFaixaTema }
        })
    }

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Temático</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {tematicData?.temas?.map((item, index) => {
                        const faixaIde = item?.tema?.ide || [];
                        const faixaIdf = item?.tema?.idf || [];
                        return (
                            <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextInput
                                        placeholder='Ex: Tema 1'
                                        value={item.tema.nome_tema}
                                        onChange={({ target }) => handleChangeTheme({ value: target.value, index, field: 'nome_tema' })}
                                        InputProps={{ style: { height: 30 } }}
                                    />

                                    <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }}
                                        onClick={handleAddToggleTheme} />
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
        backgroundImage: `url('/icons/blue_icon_afectu.png')`,
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