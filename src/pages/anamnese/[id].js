import { useRouter } from "next/router";
import { Box, Divider, Text, TextInput } from "../../atoms";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { formatCPF } from "../../helpers";
import { CheckBoxComponent, RadioItem } from "../../organisms";
import { api } from "../../api/api";

export default function AnamneseForms() {
    const [page, setPage] = useState(1);
    const [anamnese, setAnamnese] = useState({})
    const { colorPalette } = useAppContext()
    const router = useRouter()
    const { id } = router.query;

    const pages = [
        { page: 1, title: 'Dados Pessoais' },
        { page: 2, title: 'Queixa Principal' },
        { page: 3, title: 'Fase 01 - Vida Pessoal' },
        { page: 4, title: 'Você sente frustração em relação a:' },
        { page: 5, title: 'Vida Sexual' },
        { page: 6, title: 'Fase 01 - Mental' },
        { page: 7, title: 'Fase 02 - Mental' },
        { page: 8, title: 'Fase 03 – Infância' },
        { page: 9, title: 'Fase 04 – Emocional' },
    ]

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

    const onBlurSaveForms = async (event) => {
        try {
            const field = event.target.name
            const value = event.target.value

            if (field && value) {
                await api.patch(`/user/anamnese/update/automatic/${id}`, { field, value })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%' }}>
            <Box>
                <Text bold title>TERAPIA - Formulário de Anamnese</Text>
            </Box>

            <Box>
                {pages.map((item, index) => {
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
                            onChange={handleChange}
                            value={anamnese?.email || ''}
                        />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nome Completo</Text>
                        <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.estado_civil}
                            group={[
                                { label: 'Casado(a)', value: 'Casado(a)' },
                                { label: 'Solteiro(a)', value: 'Solteiro(a)' },
                                { label: 'Viúvo(a)', value: 'Viúvo(a)' },
                                { label: 'Divorciado(a)', value: 'Divorciado(a)' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                estado_civil: value,
                            })}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Gênero *</Text>
                        <RadioItem
                            valueRadio={anamnese?.genero}
                            group={[
                                { label: 'Masculino', value: 'Masculino' },
                                { label: 'Feminino', value: 'Feminino' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                genero: value,
                            })}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Endereço *</Text>
                        <TextInput
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
                            name='religão'
                            onChange={handleChange}
                            value={anamnese?.religão || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Escolaridade</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.escolaridade}
                            boxGroup={[
                                { label: 'Fundamental', value: 'Fundamental' },
                                { label: 'Médio', value: 'Médio' },
                                { label: 'Superior (Graduação)', value: 'Superior (Graduação)' },
                                { label: 'Pós-graduação', value: 'Pós-graduação' },
                                { label: 'Mestrado', value: 'Mestrado' },
                                { label: 'Doutorado', value: 'Doutorado' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                escolaridade: value,
                            })}
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
                            name='sentimento_trabalho'
                            onChange={handleChange}
                            value={anamnese?.sentimento_trabalho || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se sente pertencendo ao Contexto Familiar?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pertence_contx_familiar}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pertence_contx_familiar: value,
                            })} />
                    </Box>

                    {anamnese?.pertence_contx_familiar !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.pertence_contx_social}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pertence_contx_social: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.pertence_contx_social !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
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
                        <Text light>Você se sente pertencendo ao Contexto Religioso?</Text>
                        <RadioItem
                            valueRadio={anamnese?.sent_contx_religioso}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sent_contx_religioso: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.sent_contx_religioso !== '' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê? (comente com base na resposta anterior)</Text>
                                <TextInput
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
                            name='inicio_vida_sex'
                            onChange={handleChange}
                            value={anamnese?.inicio_vida_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como foi sua primeira relação sexual?</Text>
                        <RadioItem
                            valueRadio={anamnese?.primaira_rel_sex}
                            group={[
                                { label: 'Traumática', value: 'Traumática' },
                                { label: 'Normal', value: 'Normal' },
                                { label: 'Boa', value: 'Boa' },
                                { label: 'Satisfátoria', value: 'Satisfátoria' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                primaira_rel_sex: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tem tido algum problema em relação ao sexo?</Text>
                        <TextInput
                            name='tem_probl_rela_sex'
                            onChange={handleChange}
                            value={anamnese?.tem_probl_rela_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Atualmente sempre se realiza nas relações sexuais?</Text>
                        <RadioItem
                            valueRadio={anamnese?.realizado_rela_sex}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                realizado_rela_sex: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O sexo para você é algo:</Text>
                        <RadioItem
                            valueRadio={anamnese?.sexo_e_algo}
                            group={[
                                { label: 'Sem importância', value: 'Sem importância' },
                                { label: 'Importante', value: 'Importante' },
                                { label: 'Muito importante', value: 'Muito importante' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sexo_e_algo: value,
                            })}
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
                        <RadioItem
                            valueRadio={anamnese?.trauma}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                trauma: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.trauma === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Qual? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.fobia}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                fobia: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.fobia === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Qual? (responda com base na pergunta anterior)</Text>
                            <TextInput
                                name='qual_trauma'
                                onChange={handleChange}
                                value={anamnese?.qual_trauma || ''}
                                sx={{ flex: 1, }}
                            />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tem medo de alguma coisa?</Text>
                        <RadioItem
                            valueRadio={anamnese?.medo}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                medo: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.medo === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>De quê? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.drogas}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                drogas: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.drogas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Quais? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.dor_cabeca}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                dor_cabeca: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.dor_cabeca === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.insonia}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                insonia: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.insonia === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.ideias_suicidas}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                ideias_suicidas: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.ideias_suicidas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Quais? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.bebidas_alcoolicas}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                bebidas_alcoolicas: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.bebidas_alcoolicas === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Com que frequência? (responda com base na pergunta anterior)</Text>
                            <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.fumante}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                fumante: value,
                            })} />
                    </Box>
                    <Divider />
                    {anamnese.genero === 'Feminino' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Está grávida?</Text>
                                <RadioItem
                                    valueRadio={anamnese?.gravida}
                                    group={[
                                        { label: 'Sim', value: 'Sim' },
                                        { label: 'Não', value: 'Não' }
                                    ]}
                                    onSelect={(value) => setAnamnese({
                                        ...anamnese,
                                        gravida: value,
                                    })} />
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
                        <RadioItem
                            valueRadio={anamnese?.nvl_estress}
                            group={[
                                { label: 'Alto', value: 'Alto' },
                                { label: 'Médio', value: 'Médio' },
                                { label: 'Baixo', value: 'Baixo' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                nvl_estress: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Atualmente está tomando alguma medicação?</Text>
                        <RadioItem
                            valueRadio={anamnese?.tomando_medicacao}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                tomando_medicacao: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese.tomando_medicacao === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Qual? (responda com base na pergunta anterior)</Text>
                                <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.consult_psicologo_psiq}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                consult_psicologo_psiq: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese.consult_psicologo_psiq === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Foi diagnosticado(a)?</Text>
                                <TextInput
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
                            name='crenca_rel_a_voce'
                            onChange={handleChange}
                            value={anamnese?.crenca_rel_a_voce || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você se considera feliz?</Text>
                        <RadioItem
                            valueRadio={anamnese?.considera_feliz}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                considera_feliz: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese.considera_feliz === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Por quê?</Text>
                                <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.tipo_pensamento}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                tipo_pensamento: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='quais_pensamentos'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua aparência física?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pensamento_aparencia}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pensamento_aparencia: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='quais_pensamentos_aparencia'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_aparencia || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua competência profissional?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pensamento_compet_profis}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pensamento_compet_profis: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='quais_pensamentos_profiss'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_profiss || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação a sua vida sexual?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pensamento_vida_sex}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pensamento_vida_sex: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='quais_pensamentos_vida_sex'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_vida_sex || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação ao seu passado?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pensamento_passado}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pensamento_passado: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='quais_pensamentos_passado'
                            onChange={handleChange}
                            value={anamnese?.quais_pensamentos_passado || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Em relação ao seu futuro?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pensamento_futuro}
                            group={[
                                { label: 'Positivos', value: 'Positivos' },
                                { label: 'Negativos', value: 'Negativos' },
                                { label: 'Ambos', value: 'Ambos' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pensamento_futuro: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Quais exatamente? (responda com base na pergunta anterior)</Text>
                        <TextInput
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
                <Box>
                    <TextInput />
                    <TextInput />
                    <TextInput />
                </Box>
            }
            {
                page === 9 &&
                <Box>
                    <TextInput />
                    <TextInput />
                    <TextInput />
                </Box>
            }

            <Pagination setPage={setPage} page={page} pages={pages} />
        </Box>
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
                setPage(page - 1)
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
                    onClick={() => setPage(item.page)}>
                    <Text style={{ color: 'inherit' }}>{item.page}</Text>
                </Box>
            ))}
        </Box>
        <Box sx={{
            ...styles.buttonArrow,
            opacity: page >= (pages.length) ? .4 : 1
        }} onClick={() => {
            if (page <= (pages.length - 1)) {
                setPage(page + 1)
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
        width: 20,
        height: 20,
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
    }
}