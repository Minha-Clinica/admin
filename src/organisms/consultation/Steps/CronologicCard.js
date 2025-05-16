import { useState } from "react";
import { Box, Button, Text, TextInput } from "../../../atoms"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppContext } from "../../../context/AppContext";
import { Marks } from "../Marks";
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
    const [ageGroup, setAgeGroup] = useState({
        idade_inicial: 0,
        idade_final: 5
    });
    const [indiceDesconfortoEmocional, setIndiceDesconfortoEmocional] = useState({
        valor_inicial: 0,
        comentario: '',
        microfase: false
    })
    const [indiceFisico, setIndiceFisico] = useState({
        valor_inicial: 0,
        comentario: '',
        microfase: false
    })
    const [opitionsMark, setOpitionsMark] = useState({
        threeP: false,
        microfase: false
    });

    function handleAddToggleAge() {
        const novaFaixa = {
            faixa: {
                ...ageGroup,
                ide: [],
                idf: []
            },
        };

        setCronologicData((prev) => ({
            ...prev,
            faixaIdade: [...prev.faixaIdade, novaFaixa]
        }));

        setAgeGroup({ idade_inicial: 0, idade_final: 5 });
    }

    function handleAddToggleIde() {
        setCronologicData((prev) => {
            const novaIDE = {
                ...indiceDesconfortoEmocional,
                tresP: opitionsMark.threeP,
                microfase: opitionsMark.microfase,
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
                ...indiceFisico,
                tresP: opitionsMark.threeP,
                microfase: opitionsMark.microfase,
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

    console.log('cronologicData: ', cronologicData)

    return (
        <Box sx={{ display: 'flex', padding: '15px', backgroundColor: '#fff', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={styles.menuIcon} />
                <Text title bold>Cronológico</Text>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, padding: '0px 10px', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextInput
                        placeholder='0'
                        value={ageGroup.idade_inicial}
                        onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_inicial: target.value }))}
                        InputProps={{ style: { width: 50, height: 30 } }}
                    />
                    <Text>a</Text>
                    <TextInput
                        placeholder='0'
                        value={ageGroup.idade_final}
                        onChange={({ target }) => setAgeGroup((prevAgeGroup) => ({ ...prevAgeGroup, idade_final: target.value }))}
                        InputProps={{ style: { width: 50, height: 30 } }}
                    />

                    <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }}
                        onClick={handleAddToggleAge} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {cronologicData?.faixaIdade?.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextInput
                                placeholder='0'
                                value={item.faixa.idade_inicial}
                                InputProps={{ style: { width: 50, height: 30 } }}
                            />
                            <Text>a</Text>
                            <TextInput
                                placeholder='0'
                                value={item.faixa.idade_final}
                                InputProps={{ style: { width: 50, height: 30 } }}
                            />
                        </Box>
                    ))}
                </Box>

                <Marks setOpitionsMark={setOpitionsMark} opitionsMark={opitionsMark} />

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                    <Text bold>IDE</Text>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextInput
                                placeholder='0'
                                value={indiceDesconfortoEmocional.valor_inicial}
                                onChange={({ target }) =>
                                    setIndiceDesconfortoEmocional((prev) => ({ ...prev, valor_inicial: target.value }))}
                                InputProps={{ style: { width: 68, height: 30 } }}
                            />
                            <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }}
                                onClick={handleAddToggleIde}
                            />
                        </Box>

                        {cronologicData?.faixaIdade?.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, }}>
                                {cronologicData?.faixaIdade[cronologicData.faixaIdade.length - 1]?.faixa?.ide.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                        <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                            <Box sx={{
                                                ...styles.containerMarks,
                                                backgroundColor: item.tresP ? 'gray' : colorPalette.inputColor
                                            }}>
                                                <Text small style={{ color: item.tresP ? '#fff' : 'black' }}>3P</Text>
                                            </Box>
                                            <Box sx={{
                                                ...styles.containerMarks,
                                                backgroundColor: item.microfase ? 'gray' : colorPalette.inputColor,
                                            }}>
                                                <Text small style={{ color: item.microfase ? '#fff' : 'black' }}>MF</Text>
                                            </Box>
                                        </Box>
                                        <TextInput
                                            fullWidth
                                            placeholder='0'
                                            value={item.valor_inicial}
                                            InputProps={{ style: { width: 68, height: 30 } }}
                                            type={item.comentario ? 'comment-active' : "comment"}
                                            onActive={() => {
                                                setActiveModal({
                                                    tipo_desconforto: 'ide',
                                                    key: item.key,
                                                    active: true,
                                                    comentario: item.comentario
                                                })
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}

                    </Box>
                </Box>

                {selectedConditions.includes('somatico') &&
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
                        <Text large bold>IDF</Text>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextInput
                                    placeholder='0'
                                    value={indiceFisico.valor_inicial}
                                    onChange={({ target }) => setIndiceFisico((prev) => ({ ...prev, valor_inicial: target.value }))}
                                    InputProps={{ style: { width: 50, height: 30 } }}
                                />
                                <AddCircleIcon sx={{ color: colorPalette?.buttonColor, cursor: 'pointer', maringLeft: 2 }}
                                    onClick={handleAddToggleIdf} />
                            </Box>

                            {cronologicData?.faixaIdade?.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, }}>
                                    {cronologicData?.faixaIdade[cronologicData.faixaIdade.length - 1]?.faixa?.idf.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%', }}>
                                            <Box sx={{ display: 'flex', gap: .5, width: '100%', alignItems: 'center' }}>
                                                <Box sx={{
                                                    ...styles.containerMarks,
                                                    backgroundColor: item.tresP ? 'gray' : colorPalette.inputColor
                                                }}>
                                                    <Text small style={{ color: item.tresP ? '#fff' : 'black' }}>3P</Text>
                                                </Box>
                                                <Box sx={{
                                                    ...styles.containerMarks,
                                                    backgroundColor: item.microfase ? 'gray' : colorPalette.inputColor,
                                                }}>
                                                    <Text small style={{ color: item.microfase ? '#fff' : 'black' }}>MF</Text>
                                                </Box>
                                            </Box>
                                            <TextInput
                                                fullWidth
                                                placeholder='0'
                                                value={item.valor_inicial}
                                                InputProps={{ style: { width: 68, height: 30 } }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                }
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
        justifyContent: 'center'
    }
}