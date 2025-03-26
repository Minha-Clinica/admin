import { useRouter } from "next/router";
import {
    Box, Button, Divider, Text, TextInput
} from "../../atoms";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { formatCPF } from "../../helpers";
import { api } from "../../api/api";
import { CircularProgress, keyframes } from "@mui/material";
import CheckboxGroup from "./components/CheckboxGroup";
import RadioGroup from "./components/RadioGroup";

export default function AnamneseForms() {
    const [page, setPage] = useState(1);
    const [loadingData, setLoadingData] = useState(false);
    const [currentTable, setCurrentTable] = useState('anamnese_dados_pessoais');
    const [anamnese, setAnamnese] = useState({})
    const [localValues, setLocalValues] = useState({});
    const { colorPalette, user, alert, verifyValidToken } = useAppContext()
    const router = useRouter()
    const { id } = router.query;

    const pages = [
        { page: 1, title: 'Dados Pessoais', table: 'anamnese_dados_pessoais' },
        { page: 2, title: 'Queixa Principal', table: 'anamnese_queixa_principal' },
        { page: 3, title: 'Fase 01 - Vida Pessoal', table: 'anamnese_vida_pessoal' },
        { page: 4, title: 'Você sente frustração em relação a:', table: 'anamnese_frustracao_relacionamentos' },
        { page: 5, title: 'Vida Sexual', table: 'anamnese_vida_sexual_anamnese' },
        { page: 6, title: 'Fase 01 - Mental', table: 'anamnese_fase_01_mental' },
        { page: 7, title: 'Fase 02 - Mental', table: 'anamnese_fase_02_mental' },
        { page: 8, title: 'Fase 03 – Infância', table: 'anamnese_fase_03_infancia' },
        { page: 9, title: 'Fase 04 – Emocional', table: 'anamnese_fase_04_emocional' },
    ]


    console.log(anamnese?.sentimento_ciume)

    useEffect(() => {
        if (id) {
            handleGetAnamnese()
        }
    }, [id])

    const handleGetAnamnese = async () => {
        try {
            setLoadingData(true)
            const response = await api.get(`/anamnese/paciente/${id}`)
            if (response?.data) {
                setAnamnese(response?.data)
                setLocalValues(response?.data)
            } else {
                setAnamnese({
                    ...anamnese,
                    email: user?.email,
                    nome: user?.nome,
                    nascimento: user?.nascimento,
                    cpf: user?.cpf,
                    celular: user?.telefone,
                    genero: user?.genero
                })

                let keys = [
                    { name: 'email', value: user?.email },
                    { name: 'nome', value: user?.nome },
                    { name: 'nascimento', value: user?.nascimento },
                    { name: 'cpf', value: user?.cpf },
                    { name: 'celular', value: user?.celular },
                    { name: 'genero', value: user?.genero }
                ]
                for (let keyData of keys) {
                    handleBlurSelecAndRadio(keyData.name, keyData.value)
                }
            }

        } catch (error) {
            console.log(error)
            verifyValidToken(error.response.status)
        } finally {
            setLoadingData(false)
        }
    }

    const handleChange = (event) => {


        if (event.target.name == 'cpf') {
            let str = event.target.value;
            event.target.value = formatCPF(str)
        }

        setAnamnese((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSendAnamnese = async () => {
        try {
            setLoadingData(true)
            alert.success('Anamnese enviada!')
            router.push('/')
        } catch (error) {
            console.log(error)
            verifyValidToken(error.response.status)
        } finally {
            setLoadingData(false)
        }
    }

    const handleBlur = async (event) => {
        const { name, value } = event.target;
        const table = currentTable;

        if (table && localValues[name] !== value) { // Atualizar apenas se houver diferença.
            setLocalValues((prev) => ({ ...prev, [name]: value })); // Atualizar o valor local.
            try {
                await api.patch(`/anamnese/paciente/update/${anamnese?.id}`, { table, field: name, value });
            } catch (error) {
                console.log(error);
                verifyValidToken(error.response.status);
            }
        }
    };

    const handleBlurSelecAndRadio = async (name, value) => {

        if (anamnese[name] === value) return;

        setAnamnese((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))

        const table = currentTable; // Nome da tabela
        if (table && localValues[name] !== value) { // Atualizar apenas se houver diferença.
            setLocalValues((prev) => ({ ...prev, [name]: value })); // Atualizar o valor local.
            try {
                await api.patch(`/anamnese/paciente/update/${anamnese?.id}`, { table, field: name, value });
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (!anamnese || Object.keys(anamnese).length === 0) {
        return <div>Carregando...</div>; // Mostre um loader enquanto os dados são carregados
    }


    return (
        <Box sx={{ opacity: loadingData ? .6 : 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%' }}>
            <Box>
                <Text bold title>TERAPIA - Formulário de Anamnese</Text>
            </Box>

            {loadingData &&
                <Box sx={styles.loadingContainer}>
                    <CircularProgress />
                    <Text>Carregando anamnese...</Text>
                </Box>}

            <Box>
                {pages?.map((item, index) => {
                    if (item.page === page) {
                        return (
                            <Box key={index} sx={{
                                display: 'flex', padding: '10px', borderRadius: 2, alignItems: 'center', justifyContent: 'center',
                                width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }, backgroundColor: colorPalette.buttonColor
                            }}>
                                <Box>
                                    <Text title bold style={{ color: '#fff' }}>{item.title}</Text>
                                </Box>
                            </Box>
                        )
                    } else {
                        return <></>
                    }
                })}
            </Box>

            {page === 1 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>E-mail *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            placeholder='fulano@gmail.com'
                            name='email'
                            onChange={handleChange}
                            value={anamnese?.email || ''}
                        />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nome Completo</Text>
                        <TextInput
                            onBlur={handleBlur}
                            placeholder='Nome Completo'
                            name='nome'
                            onChange={handleChange}
                            value={anamnese?.nome || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>CPF</Text>
                        <TextInput
                            onBlur={handleBlur}
                            placeholder='CPF'
                            name='cpf'
                            onChange={handleChange}
                            value={anamnese?.cpf || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Data de Nascimento *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            type="date"
                            name='nascimento'
                            onChange={handleChange}
                            value={anamnese?.nascimento?.split('T')[0] || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Estado Cívil *</Text>
                        <RadioGroup
                            value={anamnese?.estado_civil}
                            options={[
                                { label: 'Casado(a)', value: 'Casado(a)' },
                                { label: 'Solteiro(a)', value: 'Solteiro(a)' },
                                { label: 'Viúvo(a)', value: 'Viúvo(a)' },
                                { label: 'Divorciado(a)', value: 'Divorciado(a)' },
                            ]}
                            onBlur={(value) => {
                                handleBlurSelecAndRadio('estado_civil', value)
                            }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Gênero *</Text>
                        <RadioGroup
                            value={anamnese?.genero}
                            options={[
                                { label: 'Masculino', value: 'Masculino' },
                                { label: 'Feminino', value: 'Feminino' }
                            ]}
                            onBlur={(value) => {
                                handleBlurSelecAndRadio('genero', value)
                            }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Endereço *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='endereco'
                            onChange={handleChange}
                            value={anamnese?.endereco || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>CEP *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='cep'
                            onChange={handleChange}
                            value={anamnese?.cep || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Bairro</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='bairro'
                            onChange={handleChange}
                            value={anamnese?.bairro || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cidade</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='cidade'
                            onChange={handleChange}
                            value={anamnese?.cidade || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>UF *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='uf'
                            onChange={handleChange}
                            value={anamnese?.uf || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Celular *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='celular'
                            onChange={handleChange}
                            value={anamnese?.celular || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nacionalidade *</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='nacionalidade'
                            onChange={handleChange}
                            value={anamnese?.nacionalidade || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Profissão</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='profissao'
                            onChange={handleChange}
                            value={anamnese?.profissao || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cargo</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='religão'
                            onChange={handleChange}
                            value={anamnese?.religão || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Escolaridade</Text>
                        <CheckboxGroup
                            value={anamnese?.escolaridade}
                            options={[
                                { label: 'Fundamental', value: 'Fundamental' },
                                { label: 'Médio', value: 'Médio' },
                                { label: 'Superior (Graduação)', value: 'Superior (Graduação)' },
                                { label: 'Pós-graduação', value: 'Pós-graduação' },
                                { label: 'Mestrado', value: 'Mestrado' },
                                { label: 'Doutorado', value: 'Doutorado' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('escolaridade', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                </Box>
            }
            {
                page === 2 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O que te trouxe aqui?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='queixa_principal'
                            onChange={handleChange}
                            value={anamnese?.queixa_principal || ''}
                            sx={{ flex: 1, }}
                            multiline
                            maxRows={8}
                            rows={4}
                        />
                    </Box>
                </Box>
            }

            {page === 3 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>
                    {anamnese.estado_civil === 'Divorciado(a)' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por qual motivo é divorciado(a), e como se sente??</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='motivo_divorcio'
                                    onChange={handleChange}
                                    value={anamnese?.motivo_divorcio || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Número de Filhos:</Text>
                        <TextInput
                            onBlur={handleBlur}
                            type="number"
                            name='numero_filhos'
                            onChange={handleChange}
                            value={anamnese?.numero_filhos || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese?.numero_filhos > 0 &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como é o seu relacionamento com seus filhos?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='relacionamento_c_filho'
                                    onChange={handleChange}
                                    value={anamnese?.relacionamento_c_filho || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>}

                    {anamnese.estado_civil !== 'Solteiro(a)' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light> Como você se sente em seu relacionamento com sua(eu) parceira(o)?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='relacionamento_parceiro'
                                    onChange={handleChange}
                                    value={anamnese?.relacionamento_parceiro || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como você se sente em sua casa, dentro do contexto familiar?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='sentimento_em_casa'
                            onChange={handleChange}
                            value={anamnese?.sentimento_em_casa || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como você se sente no seu trabalho?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='sentimento_trabalho'
                            onChange={handleChange}
                            value={anamnese?.sentimento_trabalho || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se sente pertencendo ao Contexto Familiar?</Text>
                        <RadioGroup
                            value={anamnese?.pertence_contx_familiar}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pertence_contx_familiar', value)} />
                    </Box>

                    {anamnese?.pertence_contx_familiar !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='just_contx_familiar'
                                    onChange={handleChange}
                                    value={anamnese?.just_contx_familiar || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se sente pertencendo ao Contexto Social?</Text>
                        <RadioGroup
                            value={anamnese?.pertence_contx_social}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pertence_contx_social', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.pertence_contx_social !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='just_contx_social'
                                    onChange={handleChange}
                                    value={anamnese?.just_contx_social || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se sente pertencendo ao Contexto Religioso?</Text>
                        <RadioGroup
                            value={anamnese?.sent_contx_religioso}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('sent_contx_religioso', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.sent_contx_religioso !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='just_contx_religioso'
                                    onChange={handleChange}
                                    value={anamnese?.just_contx_religioso || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }
                </Box>}
            {
                page === 4 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Pais?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_pais'
                            onChange={handleChange}
                            value={anamnese?.frustracao_pais || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Irmãos?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_irmaos'
                            onChange={handleChange}
                            value={anamnese?.frustracao_irmaos || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese.numero_filhos > 0 &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Filhos?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='frustracao_filhos'
                                    onChange={handleChange}
                                    value={anamnese?.frustracao_filhos || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Profissão?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_profissao'
                            onChange={handleChange}
                            value={anamnese?.frustracao_profissao || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Colégio?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_colegio'
                            onChange={handleChange}
                            value={anamnese?.frustracao_colegio || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese.estado_civil === 'Casado(a)' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Cônjuge?</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='frustracao_conguje'
                                onChange={handleChange}
                                value={anamnese?.frustracao_conguje || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Vida Sexual?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_vida_sex'
                            onChange={handleChange}
                            value={anamnese?.frustracao_vida_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Por quê? (comente com base nas respostas anteriores)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='frustracao_justificativa'
                            onChange={handleChange}
                            value={anamnese?.frustracao_justificativa || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />
                </Box>
            }
            {page === 5 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Iniciou sua vida sexual com que idade?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='inicio_vida_sex'
                            onChange={handleChange}
                            value={anamnese?.inicio_vida_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como foi sua primeira relação sexual?</Text>
                        <RadioGroup
                            value={anamnese?.primaira_rel_sex}
                            options={[
                                { label: 'Traumática', value: 'Traumática' },
                                { label: 'Normal', value: 'Normal' },
                                { label: 'Boa', value: 'Boa' },
                                { label: 'Satisfátoria', value: 'Satisfátoria' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('primaira_rel_sex', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tem tido algum problema em relação ao sexo?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='tem_probl_rela_sex'
                            onChange={handleChange}
                            value={anamnese?.tem_probl_rela_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Atualmente sempre se realiza nas relações sexuais?</Text>
                        <RadioGroup
                            value={anamnese?.realizado_rela_sex}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('realizado_rela_sex', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O sexo para você é algo:</Text>
                        <RadioGroup
                            value={anamnese?.sexo_e_algo}
                            options={[
                                { label: 'Sem importância', value: 'Sem importância' },
                                { label: 'Importante', value: 'Importante' },
                                { label: 'Muito importante', value: 'Muito importante' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('sexo_e_algo', value)} />
                    </Box>
                    <Divider />
                </Box>}
            {page === 6 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Algum Trauma?</Text>
                        <RadioGroup
                            value={anamnese?.trauma}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('trauma', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.trauma === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Qual? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='qual_trauma'
                                onChange={handleChange}
                                value={anamnese?.qual_trauma || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Algum fobia?</Text>
                        <RadioGroup
                            value={anamnese?.fobia}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('fobia', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.fobia === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Qual? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='qual_trauma'
                                onChange={handleChange}
                                value={anamnese?.qual_fobia || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tem medo de alguma coisa?</Text>
                        <RadioGroup
                            value={anamnese?.medo}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('medo', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.medo === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>De quê? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='qual_medo'
                                onChange={handleChange}
                                value={anamnese?.qual_medo || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Usa drogas?</Text>
                        <RadioGroup
                            value={anamnese?.drogas}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('drogas', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.drogas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Quais? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='qual_medo'
                                onChange={handleChange}
                                value={anamnese?.qual_medo || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Dor de Cabeça?</Text>
                        <RadioGroup
                            value={anamnese?.dor_cabeca}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('dor_cabeca', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.dor_cabeca === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='freq_dor_cabeca'
                                onChange={handleChange}
                                value={anamnese?.freq_dor_cabeca || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Insônia?</Text>
                        <RadioGroup
                            value={anamnese?.insonia}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('insonia', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.insonia === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='freq_insonia'
                                onChange={handleChange}
                                value={anamnese?.freq_insonia || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tem ideias suicidas?</Text>
                        <RadioGroup
                            value={anamnese?.ideias_suicidas}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('ideias_suicidas', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.ideias_suicidas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Quais? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='quais_ideias_suicidas'
                                onChange={handleChange}
                                value={anamnese?.quais_ideias_suicidas || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Usa bebidas alcoólicas?</Text>
                        <RadioGroup
                            value={anamnese?.bebidas_alcoolicas}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('bebidas_alcoolicas', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.bebidas_alcoolicas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='freq_bebidas_alcoolicas'
                                onChange={handleChange}
                                value={anamnese?.freq_bebidas_alcoolicas || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>É fumante?</Text>
                        <RadioGroup
                            value={anamnese?.fumante}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('fumante', value)} />
                    </Box>
                    <Divider />
                    {anamnese.genero === 'Feminino' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Está grávida?</Text>
                                <RadioGroup
                                    value={anamnese?.gravida}
                                    options={[
                                        { label: 'Sim', value: 'Sim' },
                                        { label: 'Não', value: 'Não' }
                                    ]}
                                    onBlur={(value) => handleBlurSelecAndRadio('gravida', value)} />
                            </Box>
                            <Divider />
                        </>
                    }

                    {anamnese.gravida === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quantas semanas? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='semanas_gravidez'
                                    onChange={handleChange}
                                    value={anamnese?.semanas_gravidez || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual o seu nível de stress?</Text>
                        <RadioGroup
                            value={anamnese?.nvl_estress}
                            options={[
                                { label: 'Alto', value: 'Alto' },
                                { label: 'Médio', value: 'Médio' },
                                { label: 'Baixo', value: 'Baixo' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('nvl_estress', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Atualmente está tomando alguma medicação?</Text>
                        <RadioGroup
                            value={anamnese?.tomando_medicacao}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('tomando_medicacao', value)} />
                    </Box>
                    <Divider />

                    {anamnese.tomando_medicacao === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='qual_medicacao'
                                    onChange={handleChange}
                                    value={anamnese?.qual_medicacao || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Já consultou algum tipo de psiquiatra ou psicólogo?</Text>
                        <RadioGroup
                            value={anamnese?.consult_psicologo_psiq}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('consult_psicologo_psiq', value)} />
                    </Box>
                    <Divider />

                    {anamnese.consult_psicologo_psiq === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Foi diagnosticado(a)?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='diag_psiq_psicolog'
                                    onChange={handleChange}
                                    value={anamnese?.diag_psiq_psicolog || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a quantidade de amigos que você tem?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='qnt_amigos'
                            onChange={handleChange}
                            value={anamnese?.qnt_amigos || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual seu passatempo preferido?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='qual_passatempo'
                            onChange={handleChange}
                            value={anamnese?.qual_passatempo || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a principal a crença que as pessoas possuem em relação a você que mais se repete?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='crenca_rel_a_voce'
                            onChange={handleChange}
                            value={anamnese?.crenca_rel_a_voce || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se considera feliz?</Text>
                        <RadioGroup
                            value={anamnese?.considera_feliz}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('considera_feliz', value)} />
                    </Box>
                    <Divider />

                    {anamnese.considera_feliz === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='pq_consid_feliz'
                                    onChange={handleChange}
                                    value={anamnese?.pq_consid_feliz || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Se você pudesse mudar alguma coisa em você, no seu modo de ser, ou agir, ou no seu comportamento atual, o que mudaria?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='oq_mudaria_em_vc'
                            onChange={handleChange}
                            value={anamnese?.oq_mudaria_em_vc || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Defina o que é a vida em apenas uma frase.</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='oq_a_vida_e'
                            onChange={handleChange}
                            value={anamnese?.oq_a_vida_e || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                </Box>}
            {
                page === 7 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais são os tipos de pensamentos que você costuma alimentar em relação a si mesma(o), de uma maneira geral?</Text>
                        <RadioGroup
                            value={anamnese?.tipo_pensamento}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('tipo_pensamento', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua aparência física?</Text>
                        <RadioGroup
                            value={anamnese?.pensamento_aparencia}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pensamento_aparencia', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos_aparencia'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_aparencia || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua competência profissional?</Text>
                        <RadioGroup
                            value={anamnese?.pensamento_compet_profis}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pensamento_compet_profis', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos_profiss'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_profiss || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua vida sexual?</Text>
                        <RadioGroup
                            value={anamnese?.pensamento_vida_sex}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pensamento_vida_sex', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos_vida_sex'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_vida_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação ao seu passado?</Text>
                        <RadioGroup
                            value={anamnese?.pensamento_passado}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pensamento_passado', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos_passado'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_passado || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação ao seu futuro?</Text>
                        <RadioGroup
                            value={anamnese?.pensamento_futuro}
                            options={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pensamento_futuro', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quais_pensamentos_futuro'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_futuro || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual sua visão sobre você</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='visao_sobre_voce'
                            onChange={handleChange}
                            value={anamnese?.visao_sobre_voce || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                </Box>
            }
            {
                page === 8 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você foi criado pelos pais?</Text>
                        <RadioGroup
                            value={anamnese?.criado_pais}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('criado_pais', value)} />
                    </Box>
                    <Divider />

                    <Text bold>Como é sua relação com seus pais?</Text>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Pai</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='relacao_mae'
                            onChange={handleChange}
                            value={anamnese?.relacao_mae || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Mãe</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='relacao_pai'
                            onChange={handleChange}
                            value={anamnese?.relacao_pai || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Seus pais foram agressivos com você?</Text>
                        <RadioGroup
                            value={anamnese?.pais_agressivos}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pais_agressivos', value)} />
                    </Box>
                    <Divider />

                    {anamnese.pais_agressivos === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Como?</Text>
                            <TextInput
                                onBlur={handleBlur}
                                name='como_pais_agressivos'
                                onChange={handleChange}
                                value={anamnese?.como_pais_agressivos || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual deles era o mais bravo?</Text>
                        <CheckboxGroup
                            value={anamnese?.qual_pais_mais_bravo}
                            options={[
                                { label: 'Pai', value: 'Pai' },
                                { label: 'Mãe', value: 'Mãe' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('qual_pais_mais_bravo', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='como_pais_mais_bravo'
                            onChange={handleChange}
                            value={anamnese?.como_pais_mais_bravo || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Usavam bebidas ou drogas?</Text>
                        <RadioGroup
                            value={anamnese?.pais_usavam_beb_drog}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('pais_usavam_beb_drog', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Algum comentário? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='pais_usavam_beb_drog_coment'
                            onChange={handleChange}
                            value={anamnese?.pais_usavam_beb_drog_coment || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como você descreveria o relacionamento entre seus pais?</Text>
                        <CheckboxGroup
                            value={anamnese?.descr_relac_pais}
                            options={[
                                { label: 'Excelente', value: 'Excelente' },
                                { label: 'Muito Bom', value: 'Muito Bom' },
                                { label: 'Bom', value: 'Bom' },
                                { label: 'Regular', value: 'Regular' },
                                { label: 'Péssimo', value: 'Péssimo' },
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('descr_relac_pais', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='justific_relac_pais'
                            onChange={handleChange}
                            value={anamnese?.justific_relac_pais || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais os aspectos deste relacionamento que se assemelham, ou se repetem em sua vida hoje?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='aspect_rel_pais_repetem'
                            onChange={handleChange}
                            value={anamnese?.aspect_rel_pais_repetem || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais as características deste relacionamento, que você se mantém determinado(a) a não repetir?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='caracteris_rel_pais_repetem'
                            onChange={handleChange}
                            value={anamnese?.caracteris_rel_pais_repetem || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='just_caracteris_rel_pais_repetem'
                            onChange={handleChange}
                            value={anamnese?.just_caracteris_rel_pais_repetem || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quanto ao relacionamento de seus pais, responda: Qual a crença que você adquiriu em relação a relacionamentos?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='crenca_adq_rel_pais_repetem'
                            onChange={handleChange}
                            value={anamnese?.crenca_adq_rel_pais_repetem || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Na infância, era obrigado(a) a fazer alguma coisa que lhe desagradava?</Text>
                        <RadioGroup
                            value={anamnese?.algo_desegradavel_inf}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('algo_desegradavel_inf', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.algo_desegradavel_inf === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='oq_fazia_algo_desegradavel_inf'
                                    onChange={handleChange}
                                    value={anamnese?.fazia_algo_desegradavel_inf || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Lembra-se, de alguma coisa que o magoou muito na Infância?</Text>
                        <RadioGroup
                            value={anamnese?.magoa_na_infancia}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('magoa_na_infancia', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.magoa_na_infancia === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='oq_magoou_infancia'
                                    onChange={handleChange}
                                    value={anamnese?.oq_magoou_infancia || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Teve perdas familiares ou de amigos na Infância?</Text>
                        <RadioGroup
                            value={anamnese?.perdas_famil_infancia}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('perdas_famil_infancia', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.perdas_famil_infancia === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='quais_perdas_famil_infancia'
                                    onChange={handleChange}
                                    value={anamnese?.quais_perdas_famil_infancia || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O que te faz sentir tristeza ao relembrar do passado?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='tristeza_passado'
                            onChange={handleChange}
                            value={anamnese?.tristeza_passado || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quando criança tinha medo de quê?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='do_q_tinha_medo_infancia'
                            onChange={handleChange}
                            value={anamnese?.do_q_tinha_medo_infancia || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Dormia com a luz acesa ou apagada?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='dormia_com_a_luz'
                            onChange={handleChange}
                            value={anamnese?.dormia_com_a_luz || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como foi sua adolescência?</Text>
                        <CheckboxGroup
                            value={anamnese?.adolecencia}
                            options={[
                                { label: 'Excelente', value: 'Excelente' },
                                { label: 'Muito Bom', value: 'Muito Bom' },
                                { label: 'Bom', value: 'Bom' },
                                { label: 'Regular', value: 'Regular' },
                                { label: 'Péssimo', value: 'Péssimo' },
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('adolecencia', value)} />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Com qual de seus pais você tinha mais dificuldade de relacionamento?</Text>
                        <CheckboxGroup
                            value={anamnese?.qual_pais_dificul_relac}
                            options={[
                                { label: 'Pai', value: 'Pai' },
                                { label: 'Mãe', value: 'Mãe' },
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('qual_pais_dificul_relac', value)} />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a filosofia de sua família em relação ao sucesso profissional?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='filos_familia_sucess_profissional'
                            onChange={handleChange}
                            value={anamnese?.filos_familia_sucess_profissional || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a filosofia de sua família em relação ao dinheiro?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='filos_familia_relac_dinheiro'
                            onChange={handleChange}
                            value={anamnese?.filos_familia_relac_dinheiro || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a filosofia de sua família em relação ao amor?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='filos_familia_relac_amor'
                            onChange={handleChange}
                            value={anamnese?.filos_familia_relac_amor || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a filosofia de sua família em relação ao sexo?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='filos_familia_relac_sex'
                            onChange={handleChange}
                            value={anamnese?.filos_familia_relac_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O que era para você, ser um bom(boa) menino(a)? Descreva.</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='descr_bom_menino'
                            onChange={handleChange}
                            value={anamnese?.descr_bom_menino || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como você deveria agir, ou ser para ser amado(a)?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='como_agir_p_ser_amado'
                            onChange={handleChange}
                            value={anamnese?.como_agir_p_ser_amado || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Possui irmãos?</Text>
                        <RadioGroup
                            value={anamnese?.tem_irmaos}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onBlur={(value) => handleBlurSelecAndRadio('tem_irmaos', value)} />
                    </Box>
                    <Divider />

                    {anamnese?.tem_irmaos === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quantos? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='qnt_irmaos'
                                    onChange={handleChange}
                                    value={anamnese?.qnt_irmaos || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como é sua relação com eles?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='relac_c_irmaos'
                                    onChange={handleChange}
                                    value={anamnese?.relac_c_irmaos || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você foi uma criança introvertida ou extrovertida?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='introvertido_ou_extrovertido'
                            onChange={handleChange}
                            value={anamnese?.introvertido_ou_extrovertido || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Havia dificuldades de relacionamentos com os colegas do colégio? Se sim, cite-os</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='dificul_rel_colegas'
                            onChange={handleChange}
                            value={anamnese?.dificul_rel_colegas || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais eram seus maiores medos na infância?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='maiores_medos_infanc'
                            onChange={handleChange}
                            value={anamnese?.maiores_medos_infanc || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Relate algum fato marcante em sua infância</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='relato_fato_marcante_infanc'
                            onChange={handleChange}
                            value={anamnese?.relato_fato_marcante_infanc || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                </Box>
            }
            {
                page === 9 &&
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais são seus maiores medos hoje?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='maiores_medos_hoje'
                            onChange={handleChange}
                            value={anamnese?.maiores_medos_hoje || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O que você pensa a seu respeito?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='pensamento_ao_seu_respeito'
                            onChange={handleChange}
                            value={anamnese?.pensamento_ao_seu_respeito || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como foi o seu primeiro relacionamento amoroso?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='primeiro_rel_amoroso'
                            onChange={handleChange}
                            value={anamnese?.primeiro_rel_amoroso || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Se você avaliasse sua atuação na vida, qual papel que mais caberia a você hoje?</Text>
                        <CheckboxGroup
                            value={anamnese?.qual_seu_papel_hj}
                            options={[
                                { label: 'Vítima', value: 'Vítima' },
                                { label: 'Responsável', value: 'Responsável' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('qual_seu_papel_hj', value)} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual o ganho secundário? O que "ganhava" com isso? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='ganho_secund_c_papel'
                            onChange={handleChange}
                            value={anamnese?.ganho_secund_c_papel || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese?.qual_seu_papel_hj === 'Vítima' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Em quais situações você desempenha o papel de vítima?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='primeiro_rel_amoroso'
                                    onChange={handleChange}
                                    value={anamnese?.primeiro_rel_amoroso || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    {anamnese?.qual_seu_papel_hj === 'Responsável' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Em quais situações você desempenha o papel de responsável?</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='primeiro_rel_amoroso'
                                    onChange={handleChange}
                                    value={anamnese?.primeiro_rel_amoroso || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se considera:</Text>
                        <CheckboxGroup
                            value={anamnese?.se_considera}
                            options={[
                                { label: 'Vitorioso(a)', value: 'Vitorioso(a)' },
                                { label: 'Derrotado(a)', value: 'Derrotado(a)' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('se_considera', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nos relacionamentos e na vida, você prefere ser:</Text>
                        <CheckboxGroup
                            value={anamnese?.prefere_no_rel_da_vida}
                            options={[
                                { label: 'Dominante', value: 'Dominante' },
                                { label: 'Submisso', value: 'Submisso' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('prefere_no_rel_da_vida', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quem deve ser punido por problemas que ocorrem com você?</Text>
                        <Text light>OU</Text>
                        <Text light>Quem é o culpado por seus problemas pessoais?</Text>
                        <TextInput
                            onBlur={handleBlur}
                            name='quem_e_culpado_punido'
                            onChange={handleChange}
                            value={anamnese?.quem_e_culpado_punido || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Sente-se de alguma forma pressionado(a) na atualidade?</Text>
                        <CheckboxGroup
                            value={anamnese?.sente_pressionado}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sente_pressionado', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese?.sente_pressionado === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>De que maneira? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='pressionado_de_q_forma'
                                    onChange={handleChange}
                                    value={anamnese?.pressionado_de_q_forma || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se acha uma pessoa controladora?</Text>
                        <CheckboxGroup
                            value={anamnese?.controladora}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('controladora', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Sente-se de alguma forma inferior aos outros?</Text>
                        <CheckboxGroup
                            value={anamnese?.sente_inferior_a_outros}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sente_inferior_a_outros', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    {anamnese?.sente_inferior_a_outros === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='porq_sente_inferior'
                                    onChange={handleChange}
                                    value={anamnese?.porq_sente_inferior || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Dúvida de sua própria capacidade?</Text>
                        <CheckboxGroup
                            value={anamnese?.duvida_propria_capac}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('duvida_propria_capac', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você é audacioso(a), corre atrás de suas metas, ou é autoprotetor(a), preferindo se poupar dos eventuais riscos?</Text>
                        <CheckboxGroup
                            value={anamnese?.audacioso_ou_autoprotetor}
                            options={[
                                { label: 'Audacioso(a)', value: 'Audacioso(a)' },
                                { label: 'Autoprotetor(a)', value: 'Autoprotetor(a)' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('audacioso_ou_autoprotetor', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Existe algo que o(a) faz sentir-se culpado(a)?</Text>
                        <CheckboxGroup
                            value={anamnese?.algo_q_sente_culpado}
                            options={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('algo_q_sente_culpado', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    {anamnese?.algo_q_sente_culpado === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>O que exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput
                                    onBlur={handleBlur}
                                    name='oq_sente_culpado'
                                    onChange={handleChange}
                                    value={anamnese?.oq_sente_culpado || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />
                        </>
                    }

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text bold>Quais os sentimentos mais comuns em você hoje?</Text>
                    </Box>


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Raiva</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_raiva}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_raiva', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medo de algo concreto</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_medo_concreto}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_medo_concreto', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medos vagos</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_medos_vagos}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_medos_vagos', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Culpa</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_culpa}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_culpa', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Revolta</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_revolta}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_revolta', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medo de perder o controle</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_perder_controle}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_perder_controle', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tristeza</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_tristeza}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_tristeza', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Mágoa</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_magoa}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_magoa', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Orgulho</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_orgulho}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_orgulho', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ódio</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_odio}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_odio', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Egoísmo</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_egoismo}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_egoismo', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ansiedade</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_ansiedade}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_ansiedade', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Intolerância</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_intolerancia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_intolerancia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Subsmissao</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_submissao}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_submissao', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Indecisão</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_indecisao}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_indecisao', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Desespero</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_desespero}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_desespero', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Desnânimo</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_desanimo}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_desanimo', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Covardia</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_covardia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_covardia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Egocentrismo</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_egocentrismo}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_egocentrismo', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cíume</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_ciume}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_ciume', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Frustração</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_frustracao}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_frustracao', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nostalgia</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_nostalgia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_nostalgia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cansaço</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_cansaco}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_cansaco', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Impaciência</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_impaciencia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_impaciencia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Angústia</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_angustia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_angustia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Timidez</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_timidez}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_timidez', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Apatia</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_apatia}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_apatia', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ressentimento</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_ressentimento}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_ressentimento', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Solidão</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_solidao}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_solidao', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Autoritarismo</Text>
                        <CheckboxGroup
                            value={anamnese?.sentimento_autoritarismo}
                            options={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onBlur={(value) => handleBlurSelecAndRadio('sentimento_autoritarismo', value)}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <Button text="Enviar" style={{ width: 120 }} onClick={() => handleSendAnamnese()} />
                    </Box>

                </Box>
            }

            <Pagination setPage={setPage} page={page} pages={pages} setCurrentTable={setCurrentTable} />
        </Box>
    )
}

const Pagination = ({ setPage, page, pages, setCurrentTable }) => {

    const { colorPalette } = useAppContext()

    const getPageData = (currPage) => pages?.find(pg => pg.page === currPage);

    const handlePageChange = (newPage) => {
        const pageData = getPageData(newPage);
        if (pageData) {
            setPage(newPage);
            setCurrentTable(pageData.table);
        }
    };

    return (<Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{
            ...styles.buttonArrow,
            opacity: page === 1 ? .4 : 1
        }} onClick={() => {
            if (page > 1) handlePageChange(page - 1);
        }}>
            <Box sx={{
                ...styles.menuIcon,
                backgroundImage: `url('/icons/arrow_left.png')`,
            }} />
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderRadius: 2, backgroundColor: colorPalette.secondary }}>
            {pages.map((item, index) => (
                <Box key={index} sx={{
                    display: 'flex', padding: '8px 12px',
                    backgroundColor: page === item.page ? colorPalette.buttonColor : colorPalette.secondary,
                    width: '100%', borderRadius: 2,
                    color: page === item.page ? 'white' : colorPalette.textColor,
                    transition: '.3s',
                    '&:hover': {
                        opacity: .8,
                        cursor: 'pointer'
                    }
                }}
                    onClick={() => {
                        setPage(item.page)
                        setCurrentTable(item.table)
                        console.log(item.table)
                    }}>
                    <Text small style={{ color: 'inherit' }}>{item.page}</Text>
                </Box>
            ))}
        </Box>
        <Box sx={{
            ...styles.buttonArrow,
            opacity: page >= (pages.length) ? .4 : 1
        }} onClick={() => {
            if (page < pages.length) handlePageChange(page + 1);
        }}>
            <Box sx={{
                ...styles.menuIcon,
                backgroundImage: `url('/icons/arrow_right.png')`,
            }} />
        </Box>
    </Box>)
}

const styles = {
    icon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        width: '15px',
        height: '15px',
        marginRight: '0px',
        backgroundImage: `url('/favicon.svg')`,
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 16,
        height: 16,
        display: 'flex',
        borderRadius: 2,
    },
    buttonArrow: {
        display: 'flex', gap: 2, padding: '5px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        border: '1px solid',
        '&:hover': {
            opacity: .8,
            cursor: 'pointer'
        }
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        heigth: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
}
