import { useRouter } from "next/router";
import { Box, Button, Divider, Text, TextInput } from "../../atoms";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { formatCPF } from "../../helpers";
import { CheckBoxComponent, RadioItem } from "../../organisms";
import { api } from "../../api/api";

export default function AnamneseForms() {
    const [page, setPage] = useState(1);
    const [anamnese, setAnamnese] = useState({

    })
    const { colorPalette, user } = useAppContext()
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

    useEffect(() => {


        if (!anamnese?.nome) {

            setAnamnese({
                ...anamnese,
                email: user?.email,
                nome: user?.nome,
                nascimento: user?.nascimento,
                cpf: user?.cpf,
                celular: user?.telefone,
                genero: user?.genero
            })
        }
    }, [])

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
                            onSelect={(value) => {
                                if (value) {
                                    setAnamnese({
                                        ...anamnese,
                                        escolaridade: value,
                                    })
                                }
                            }}
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
                <Box sx={{
                    display: 'flex', gap: 2, padding: '15px', backgroundColor: colorPalette.secondary, borderRadius: 2,
                    boxShadow: `rgba(149, 157, 165, 0.6) 0px 6px 24px`, flexDirection: 'column', width: { xs: '100%', xm: '100%', md: `100%`, lg: 600 }
                }}>

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você foi criado pelos pais?</Text>
                        <RadioItem
                            valueRadio={anamnese?.criado_pais}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                criado_pais: value,
                            })} />
                    </Box>
                    <Divider />

                    <Text bold>Como é sua relação com seus pais?</Text>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Pai</Text>
                        <TextInput
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
                            name='relacao_pai'
                            onChange={handleChange}
                            value={anamnese?.relacao_pai || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Seus pais foram agressivos com você?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pais_agressivos}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pais_agressivos: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese.pais_agressivos === 'Sim' && <>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                            <Text light>Como?</Text>
                            <RadioItem
                                valueRadio={anamnese?._como_pais_agressivos}
                                group={[
                                    { label: 'Sim', value: 'Sim' },
                                    { label: 'Não', value: 'Não' },
                                ]}
                                onSelect={(value) => setAnamnese({
                                    ...anamnese,
                                    _como_pais_agressivos: value,
                                })} />
                        </Box>
                        <Divider />
                    </>}

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual deles era o mais bravo?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.qual_pais_mais_bravo}
                            boxGroup={[
                                { label: 'Pai', value: 'Pai' },
                                { label: 'Mãe', value: 'Mãe' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                qual_pais_mais_bravo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='como_pais_mais_bravo'
                            onChange={handleChange}
                            value={anamnese?.como_pais_mais_bravo || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Usavam bebidas ou drogas?</Text>
                        <RadioItem
                            valueRadio={anamnese?.pais_usavam_beb_drog}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                pais_usavam_beb_drog: value,
                            })} />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Algum comentário? (responda com base na pergunta anterior)</Text>
                        <TextInput
                            name='pais_usavam_beb_drog_coment'
                            onChange={handleChange}
                            value={anamnese?.pais_usavam_beb_drog_coment || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como você descreveria o relacionamento entre seus pais?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.descr_relac_pais}
                            boxGroup={[
                                { label: 'Excelente', value: 'Excelente' },
                                { label: 'Muito Bom', value: 'Muito Bom' },
                                { label: 'Bom', value: 'Bom' },
                                { label: 'Regular', value: 'Regular' },
                                { label: 'Péssimo', value: 'Péssimo' },
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                descr_relac_pais: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Por quê? (responda com base na pergunta anterior)</Text>
                        <TextInput
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
                            name='crenca_adq_rel_pais_repetem'
                            onChange={handleChange}
                            value={anamnese?.crenca_adq_rel_pais_repetem || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Na infância, era obrigado(a) a fazer alguma coisa que lhe desagradava?</Text>
                        <RadioItem
                            valueRadio={anamnese?.algo_desegradavel_inf}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                algo_desegradavel_inf: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.algo_desegradavel_inf === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.magoa_na_infancia}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                magoa_na_infancia: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.magoa_na_infancia === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
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
                        <RadioItem
                            valueRadio={anamnese?.perdas_famil_infancia}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                perdas_famil_infancia: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.perdas_famil_infancia === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quais? (responda com base na pergunta anterior)</Text>
                                <TextInput
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
                            name='dormia_com_a_luz'
                            onChange={handleChange}
                            value={anamnese?.dormia_com_a_luz || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Como foi sua adolescência?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.adolecencia}
                            boxGroup={[
                                { label: 'Excelente', value: 'Excelente' },
                                { label: 'Muito Bom', value: 'Muito Bom' },
                                { label: 'Bom', value: 'Bom' },
                                { label: 'Regular', value: 'Regular' },
                                { label: 'Péssimo', value: 'Péssimo' },
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                adolecencia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Com qual de seus pais você tinha mais dificuldade de relacionamento?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.qual_pais_dificul_relac}
                            boxGroup={[
                                { label: 'Pai', value: 'Pai' },
                                { label: 'Mãe', value: 'Mãe' },
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                qual_pais_dificul_relac: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual a filosofia de sua família em relação ao sucesso profissional?</Text>
                        <TextInput
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
                            name='como_agir_p_ser_amado'
                            onChange={handleChange}
                            value={anamnese?.como_agir_p_ser_amado || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Possui irmãos?</Text>
                        <RadioItem
                            valueRadio={anamnese?.tem_irmaos}
                            group={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' },
                            ]}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                tem_irmaos: value,
                            })} />
                    </Box>
                    <Divider />

                    {anamnese?.tem_irmaos === 'Sim' &&
                        <>
                            <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                                <Text light>Quantos? (responda com base na pergunta anterior)</Text>
                                <TextInput
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
                            name='primeiro_rel_amoroso'
                            onChange={handleChange}
                            value={anamnese?.primeiro_rel_amoroso || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Se você avaliasse sua atuação na vida, qual papel que mais caberia a você hoje?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.qual_seu_papel_hj}
                            boxGroup={[
                                { label: 'Vítima', value: 'Vítima' },
                                { label: 'Responsável', value: 'Responsável' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                qual_seu_papel_hj: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Qual o ganho secundário? O que "ganhava" com isso? (responda com base na pergunta anterior)</Text>
                        <TextInput
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.se_considera}
                            boxGroup={[
                                { label: 'Vitorioso(a)', value: 'Vitorioso(a)' },
                                { label: 'Derrotado(a)', value: 'Derrotado(a)' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                se_considera: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nos relacionamentos e na vida, você prefere ser:</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.prefere_no_rel_da_vida}
                            boxGroup={[
                                { label: 'Dominante', value: 'Dominante' },
                                { label: 'Submisso', value: 'Submisso' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                prefere_no_rel_da_vida: value,
                            })}
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
                            onChange={handleChange}
                            value={anamnese?.quem_e_culpado_punido || ''}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Sente-se de alguma forma pressionado(a) na atualidade?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sente_pressionado}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sente_pressionado: value,
                            })}
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.controladora}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                controladora: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Sente-se de alguma forma inferior aos outros?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sente_inferior_a_outros}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sente_inferior_a_outros: value,
                            })}
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.duvida_propria_capac}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                duvida_propria_capac: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Você é audacioso(a), corre atrás de suas metas, ou é autoprotetor(a), preferindo se poupar dos eventuais riscos?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.audacioso_ou_autoprotetor}
                            boxGroup={[
                                { label: 'Audacioso(a)', value: 'Audacioso(a)' },
                                { label: 'Autoprotetor(a)', value: 'Autoprotetor(a)' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                audacioso_ou_autoprotetor: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Existe algo que o(a) faz sentir-se culpado(a)?</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.algo_q_sente_culpado}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                algo_q_sente_culpado: value,
                            })}
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_raiva}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_raiva: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medo de algo concreto</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_medo_concreto}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_medo_concreto: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medos vagos</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_medos_vagos}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_medos_vagos: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Culpa</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_culpa}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_culpa: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Revolta</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_revolta}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_revolta: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Medo de perder o controle</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_perder_controle}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_perder_controle: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Tristeza</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_tristeza}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_tristeza: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Mágoa</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_magoa}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_magoa: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Orgulho</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_orgulho}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_orgulho: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ódio</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_odio}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_odio: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Egoísmo</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_egoismo}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_egoismo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ansiedade</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_ansiedade}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_ansiedade: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Intolerância</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_intolerancia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_intolerancia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />



                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Subsmissao</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_submissao}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_submissao: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Indecisão</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_indecisao}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_indecisao: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Desespero</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_desespero}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_desespero: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Desnânimo</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_desanimo}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_desanimo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Covardia</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_covardia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_covardia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Egocentrismo</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_egocentrismo}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_egocentrismo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cíume</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_ciume}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_ciume: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Frustração</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_frustracao}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_frustracao: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Nostalgia</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_nostalgia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_nostalgia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Cansaço</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_cansaco}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_cansaco: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Impaciência</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_impaciencia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_impaciencia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Angústia</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_angustia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_angustia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Timidez</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_timidez}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_timidez: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Apatia</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_apatia}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_apatia: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Ressentimento</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_ressentimento}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_ressentimento: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Solidão</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_solidao}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_solidao: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />


                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>Autoritarismo</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sentimento_autoritarismo}
                            boxGroup={[
                                { label: 'Muita Intensidade', value: 'Muita Intensidade' },
                                { label: 'Média Intensidade', value: 'Média Intensidade' },
                                { label: 'Pouca Intensidade', value: 'Pouca Intensidade' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sentimento_autoritarismo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <Button text="Enviar" style={{ width: 120 }} />
                    </Box>

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
                    <Text small style={{ color: 'inherit' }}>{item.page}</Text>
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
    }
}