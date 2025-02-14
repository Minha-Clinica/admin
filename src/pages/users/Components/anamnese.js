import {
    Box, Button, Divider, Text, TextInput
} from "../../../atoms";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { CheckBoxComponent, RadioItem } from "../../../organisms";
import { api } from "../../../api/api";
import { CircularProgress, keyframes } from "@mui/material";
import RadioGroup from "../../anamnese/components/RadioGroup";
import CheckboxGroup from "../../anamnese/components/CheckboxGroup";

export default function AnamneseUser({ id }) {
    const [page, setPage] = useState(1);
    const [loadingData, setLoadingData] = useState(false);
    const [anamnese, setAnamnese] = useState({})
    const { colorPalette, user, alert } = useAppContext()

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


    useEffect(() => {
        handleGetAnamnese()
    }, [])

    const handleGetAnamnese = async () => {
        try {
            setLoadingData(true)
            const response = await api.get(`/anamnese/paciente/userdata/${id}`)
            if (response?.data) {
                setAnamnese(response?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingData(false)
        }
    }


    return (
        <>
            {anamnese?.email ?
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

                                    placeholder='fulano@gmail.com'
                                    name='email'

                                    value={anamnese?.email || ''}
                                />
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Nome Completo</Text>
                                <TextInput

                                    placeholder='Nome Completo'
                                    name='nome'

                                    value={anamnese?.nome || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>CPF</Text>
                                <TextInput

                                    placeholder='CPF'
                                    name='cpf'

                                    value={anamnese?.cpf || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Data de Nascimento *</Text>
                                <TextInput

                                    type="date"
                                    name='nascimento'

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
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Endereço *</Text>
                                <TextInput

                                    name='endereco'

                                    value={anamnese?.endereco || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>CEP *</Text>
                                <TextInput

                                    name='cep'

                                    value={anamnese?.cep || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Bairro</Text>
                                <TextInput

                                    name='bairro'

                                    value={anamnese?.bairro || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Cidade</Text>
                                <TextInput

                                    name='cidade'

                                    value={anamnese?.cidade || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>UF *</Text>
                                <TextInput

                                    name='uf'

                                    value={anamnese?.uf || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Celular *</Text>
                                <TextInput

                                    name='celular'

                                    value={anamnese?.celular || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Nacionalidade *</Text>
                                <TextInput

                                    name='nacionalidade'

                                    value={anamnese?.nacionalidade || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Profissão</Text>
                                <TextInput

                                    name='profissao'

                                    value={anamnese?.profissao || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Cargo</Text>
                                <TextInput

                                    name='religão'

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

                                    name='queixa_principal'

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

                                            name='motivo_divorcio'

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

                                    type="number"
                                    name='numero_filhos'

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

                                            name='relacionamento_c_filho'

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

                                            name='relacionamento_parceiro'

                                            value={anamnese?.relacionamento_parceiro || ''}
                                            sx={{ flex: 1, }}
                                        />
                                    </Box>
                                    <Divider />
                                </>}

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como você se sente em sua casa, dentro do contexto familiar?</Text>
                                <TextInput

                                    name='sentimento_em_casa'

                                    value={anamnese?.sentimento_em_casa || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como você se sente no seu trabalho?</Text>
                                <TextInput

                                    name='sentimento_trabalho'

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
                                />
                            </Box>

                            {anamnese?.pertence_contx_familiar !== '' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                        <TextInput

                                            name='just_contx_familiar'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.pertence_contx_social !== '' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                        <TextInput

                                            name='just_contx_social'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.sent_contx_religioso !== '' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                        <TextInput

                                            name='just_contx_religioso'

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

                                    name='frustracao_pais'

                                    value={anamnese?.frustracao_pais || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Irmãos?</Text>
                                <TextInput

                                    name='frustracao_irmaos'

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

                                            name='frustracao_filhos'

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

                                    name='frustracao_profissao'

                                    value={anamnese?.frustracao_profissao || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Colégio?</Text>
                                <TextInput

                                    name='frustracao_colegio'

                                    value={anamnese?.frustracao_colegio || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            {anamnese.estado_civil === 'Casado(a)' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Cônjuge?</Text>
                                    <TextInput

                                        name='frustracao_conguje'

                                        value={anamnese?.frustracao_conguje || ''}
                                        sx={{ flex: 1, }}
                                    />
                                </Box>
                                <Divider />
                            </>}

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Vida Sexual?</Text>
                                <TextInput

                                    name='frustracao_vida_sex'

                                    value={anamnese?.frustracao_vida_sex || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base nas respostas anteriores)</Text>
                                <TextInput

                                    name='frustracao_justificativa'

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

                                    name='inicio_vida_sex'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Tem tido algum problema em relação ao sexo?</Text>
                                <TextInput

                                    name='tem_probl_rela_sex'

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
                                />
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
                                />
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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.trauma === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Qual? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='qual_trauma'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.fobia === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Qual? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='qual_trauma'

                                        value={anamnese?.qual_trauma || ''}
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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.medo === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>De quê? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='qual_medo'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.drogas === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='qual_medo'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.dor_cabeca === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='freq_dor_cabeca'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.insonia === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='freq_insonia'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.ideias_suicidas === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='quais_ideias_suicidas'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.bebidas_alcoolicas === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                                    <TextInput

                                        name='freq_bebidas_alcoolicas'

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
                                />
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
                                        />
                                    </Box>
                                    <Divider />
                                </>
                            }

                            {anamnese.gravida === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Quantas semanas? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='semanas_gravidez'

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
                                />
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
                                />
                            </Box>
                            <Divider />

                            {anamnese.tomando_medicacao === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Qual? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='qual_medicacao'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese.consult_psicologo_psiq === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Foi diagnosticado(a)?</Text>
                                        <TextInput

                                            name='diag_psiq_psicolog'

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

                                    name='qnt_amigos'

                                    value={anamnese?.qnt_amigos || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual seu passatempo preferido?</Text>
                                <TextInput

                                    name='qual_passatempo'

                                    value={anamnese?.qual_passatempo || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual a principal a crença que as pessoas possuem em relação a você que mais se repete?</Text>
                                <TextInput

                                    name='crenca_rel_a_voce'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese.considera_feliz === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Por quê?</Text>
                                        <TextInput

                                            name='pq_consid_feliz'

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

                                    name='oq_mudaria_em_vc'

                                    value={anamnese?.oq_mudaria_em_vc || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Defina o que é a vida em apenas uma frase.</Text>
                                <TextInput

                                    name='oq_a_vida_e'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos_aparencia'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos_profiss'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos_vida_sex'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos_passado'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='quais_pensamentos_futuro'

                                    value={anamnese?.quais_pensamentos_futuro || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual sua visão sobre você</Text>
                                <TextInput

                                    name='visao_sobre_voce'

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
                                />
                            </Box>
                            <Divider />

                            <Text bold>Como é sua relação com seus pais?</Text>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Pai</Text>
                                <TextInput

                                    name='relacao_mae'

                                    value={anamnese?.relacao_mae || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Mãe</Text>
                                <TextInput

                                    name='relacao_pai'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese.pais_agressivos === 'Sim' && <>
                                <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                    <Text light>Como?</Text>
                                    <TextInput

                                        name='como_pais_agressivos'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='como_pais_mais_bravo'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Algum comentário? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='pais_usavam_beb_drog_coment'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='justific_relac_pais'

                                    value={anamnese?.justific_relac_pais || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais os aspectos deste relacionamento que se assemelham, ou se repetem em sua vida hoje?</Text>
                                <TextInput

                                    name='aspect_rel_pais_repetem'

                                    value={anamnese?.aspect_rel_pais_repetem || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais as características deste relacionamento, que você se mantém determinado(a) a não repetir?</Text>
                                <TextInput

                                    name='caracteris_rel_pais_repetem'

                                    value={anamnese?.caracteris_rel_pais_repetem || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='just_caracteris_rel_pais_repetem'

                                    value={anamnese?.just_caracteris_rel_pais_repetem || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quanto ao relacionamento de seus pais, responda: Qual a crença que você adquiriu em relação a relacionamentos?</Text>
                                <TextInput

                                    name='crenca_adq_rel_pais_repetem'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.algo_desegradavel_inf === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='oq_fazia_algo_desegradavel_inf'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.magoa_na_infancia === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='oq_magoou_infancia'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.perdas_famil_infancia === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='quais_perdas_famil_infancia'

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

                                    name='tristeza_passado'

                                    value={anamnese?.tristeza_passado || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quando criança tinha medo de quê?</Text>
                                <TextInput

                                    name='do_q_tinha_medo_infancia'

                                    value={anamnese?.do_q_tinha_medo_infancia || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Dormia com a luz acesa ou apagada?</Text>
                                <TextInput

                                    name='dormia_com_a_luz'

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
                                />
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
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual a filosofia de sua família em relação ao sucesso profissional?</Text>
                                <TextInput

                                    name='filos_familia_sucess_profissional'

                                    value={anamnese?.filos_familia_sucess_profissional || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual a filosofia de sua família em relação ao dinheiro?</Text>
                                <TextInput

                                    name='filos_familia_relac_dinheiro'

                                    value={anamnese?.filos_familia_relac_dinheiro || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual a filosofia de sua família em relação ao amor?</Text>
                                <TextInput

                                    name='filos_familia_relac_amor'

                                    value={anamnese?.filos_familia_relac_amor || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual a filosofia de sua família em relação ao sexo?</Text>
                                <TextInput

                                    name='filos_familia_relac_sex'

                                    value={anamnese?.filos_familia_relac_sex || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>O que era para você, ser um bom(boa) menino(a)? Descreva.</Text>
                                <TextInput

                                    name='descr_bom_menino'

                                    value={anamnese?.descr_bom_menino || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como você deveria agir, ou ser para ser amado(a)?</Text>
                                <TextInput

                                    name='como_agir_p_ser_amado'

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
                                />
                            </Box>
                            <Divider />

                            {anamnese?.tem_irmaos === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Quantos? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='qnt_irmaos'

                                            value={anamnese?.qnt_irmaos || ''}
                                            sx={{ flex: 1, }}
                                        />
                                    </Box>
                                    <Divider />

                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Como é sua relação com eles?</Text>
                                        <TextInput

                                            name='relac_c_irmaos'

                                            value={anamnese?.relac_c_irmaos || ''}
                                            sx={{ flex: 1, }}
                                        />
                                    </Box>
                                    <Divider />
                                </>}

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Você foi uma criança introvertida ou extrovertida?</Text>
                                <TextInput

                                    name='introvertido_ou_extrovertido'

                                    value={anamnese?.introvertido_ou_extrovertido || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Havia dificuldades de relacionamentos com os colegas do colégio? Se sim, cite-os</Text>
                                <TextInput

                                    name='dificul_rel_colegas'

                                    value={anamnese?.dificul_rel_colegas || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais eram seus maiores medos na infância?</Text>
                                <TextInput

                                    name='maiores_medos_infanc'

                                    value={anamnese?.maiores_medos_infanc || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Relate algum fato marcante em sua infância</Text>
                                <TextInput

                                    name='relato_fato_marcante_infanc'

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

                                    name='maiores_medos_hoje'

                                    value={anamnese?.maiores_medos_hoje || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>O que você pensa a seu respeito?</Text>
                                <TextInput

                                    name='pensamento_ao_seu_respeito'

                                    value={anamnese?.pensamento_ao_seu_respeito || ''}
                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Como foi o seu primeiro relacionamento amoroso?</Text>
                                <TextInput

                                    name='primeiro_rel_amoroso'

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
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual o ganho secundário? O que "ganhava" com isso? (responda com base na pergunta anterior)</Text>
                                <TextInput

                                    name='ganho_secund_c_papel'

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

                                            name='primeiro_rel_amoroso'

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

                                            name='primeiro_rel_amoroso'

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

                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quem deve ser punido por problemas que ocorrem com você?</Text>
                                <Text light>OU</Text>
                                <Text light>Quem é o culpado por seus problemas pessoais?</Text>
                                <TextInput

                                    name='quem_e_culpado_punido'

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

                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            {anamnese?.sente_pressionado === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>De que maneira? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='pressionado_de_q_forma'

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

                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />

                            {anamnese?.sente_inferior_a_outros === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='porq_sente_inferior'

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

                                    sx={{ flex: 1, }}
                                />
                            </Box>
                            <Divider />


                            {anamnese?.algo_q_sente_culpado === 'Sim' &&
                                <>
                                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                        <Text light>O que exatamente? (responda com base na pergunta anterior)</Text>
                                        <TextInput

                                            name='oq_sente_culpado'

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

                                    sx={{ flex: 1, }}
                                />
                            </Box>

                        </Box>
                    }

<Pagination setPage={setPage} page={page} pages={pages} />
                </Box>
                :
                <Text light>Não encontramos anamnese preenchida.</Text>
            }
        </>
    )
}

const Pagination = ({ setPage, page, pages }) => {

    const { colorPalette } = useAppContext()


    return (<Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{
            ...styles.buttonArrow,
            opacity: page === 1 ? .4 : 1
        }} onClick={() => {
            if (page !== 1) {
                let currPage = page - 1
                setPage(currPage)
            }
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
                    }}>
                    <Text small style={{ color: 'inherit' }}>{item.page}</Text>
                </Box>
            ))}
        </Box>
        <Box sx={{
            ...styles.buttonArrow,
            opacity: page >= (pages.length) ? .4 : 1
        }} onClick={() => {
            if (page <= (pages.length - 1)) {
                let currPage = page + 1
                setPage(currPage)
            }
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