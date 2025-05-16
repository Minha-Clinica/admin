import { useState, useEffect } from "react";
import { Box, Text, TextInput, Button } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";
import { CommentModal } from "../Comments";
import { v4 as uuidv4 } from 'uuid';


export const PotencializationCard = (props) => {
    const { selectedTemes, setPotencializationData, potencializationData } = props
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

        const newPotencialization = {
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
                potencializacao: [newPotencialization]
            },
        };

        console.log('novoTema', novoTema)
        console.log('potencializationData', potencializationData)

        setPotencializationData((prev) => ({
            ...prev,
            temas: [...prev.temas, novoTema]
        }));


    }


    function handleAddTogglePotencialization() {
        setPotencializationData((prev) => {
            const novoPotencialization = {
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
                        potencializacao: [...(novoTema[lastIndex].tema.potencializacao || []), novoPotencialization]
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
        setPotencializationData(prev => {
            switch (activeModal.tipo_desconforto) {
                case 'potencializacao':
                    const novoTema = [...prev.temas];
                    const lastIndex = novoTema.length - 1;
                    if (lastIndex >= 0) {
                        novoTema[lastIndex] = {
                            ...novoTema[lastIndex],
                            tema: {
                                ...novoTema[lastIndex].tema,
                                potencializacao: [...(novoTema[lastIndex].tema.potencializacao || [])].map(item => {
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
            }

        })
    }

    const handleChangePotencialization = ({ target, indexFaixaItem, keyPot }) => {
        setPotencializationData((prevPotencializationData) => {
            const novoTema = prevPotencializationData?.temas?.map((item, indexFaixa) => {
                if (indexFaixaItem === indexFaixa) {
                    const newTema = item?.tema?.potencializacao?.map((potencialization) => {
                        if (potencialization.key === keyPot) {
                            return { ...potencialization, valor_inicial: target.value }
                        }
                        return potencialization
                    })
                    return { ...item, tema: { ...item?.tema, potencializacao: newTema } }
                }
                return item
            })
            return { ...prevPotencializationData, temas: novoTema }
        })
    }

    const handleChangeTheme = ({ value, index, field }) => {
        setPotencializationData((prevPotencializationData) => {
            const novoTema = prevPotencializationData?.temas?.map((item, indexFaixa) => {
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
            return { ...prevPotencializationData, temas: novoTema }
        })
    }

    const handleChangeMarks = ({ type, field, index, keyId }) => {
        setPotencializationData((prevPotencializationData) => {
            const newFaixaTema = prevPotencializationData?.temas?.map((item, indexFaixa) => {
                if (indexFaixa !== index) return item;

                const newItem = { ...item };


                switch (type) {
                    case 'potencializacao':
                        newItem?.tema?.potencializacao?.map((potencialization) => {
                            if (potencialization.key === keyId) {
                                potencialization[field] = !potencialization[field]
                            }
                            return potencialization
                        })
                        break;
                    default:
                        break
                }

                return newItem;
            });

            return { ...prevPotencializationData, temas: newFaixaTema }
        })
    }

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Potencialização</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {potencializationData?.temas?.map((item, index) => {
                        const faixaPotencialization = item?.tema?.potencializacao || [];
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
                                    <Text bold>P</Text>
                                    {faixaPotencialization.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                                            {faixaPotencialization.map((potItems, indexP) => (
                                                <Box key={indexP} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                                    <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: potItems.tresP ? 'gray' : colorPalette.inputColor
                                                        }} onClick={() => handleChangeMarks({ type: 'potencializacao', field: 'tresP', index, keyId: potItems.key })}>
                                                            <Text small style={{ color: potItems.tresP ? '#fff' : 'black' }}>3P</Text>
                                                        </Box>
                                                        <Box sx={{
                                                            ...styles.containerMarks,
                                                            backgroundColor: potItems.microfase ? 'gray' : colorPalette.inputColor,
                                                        }} onClick={() => handleChangeMarks({ type: 'potencializacao', field: 'microfase', index, keyId: potItems.key })}>
                                                            <Text small style={{ color: potItems.microfase ? '#fff' : 'black' }}>MF</Text>
                                                        </Box>
                                                    </Box>
                                                    <TextInput
                                                        fullWidth
                                                        placeholder='0'
                                                        value={potItems.valor_inicial}
                                                        InputProps={{ style: { width: 68, height: 30 } }}
                                                        onChange={({ target }) => handleChangePotencialization({
                                                            target,
                                                            indexFaixaItem: index,
                                                            keyPot: potItems.key
                                                        })}
                                                        type={potItems.comentario ? 'comment-active' : "comment"}
                                                        onActive={() => {
                                                            setActiveModal({
                                                                tipo_desconforto: 'potencializacao',
                                                                key: potItems.key,
                                                                active: true,
                                                                comentario: potItems.comentario
                                                            })
                                                        }}
                                                    />
                                                </Box>
                                            ))}

                                            <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2, marginBottom: `2px` }}
                                                onClick={handleAddTogglePotencialization}
                                            />
                                        </Box>
                                    )}
                                </Box>
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
        backgroundImage: `url('/icons/orange_icon_afectu.png')`,
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