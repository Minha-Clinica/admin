import { useRouter } from "next/router";
import { Box, Divider, Text, TextInput } from "../../atoms";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { formatCPF } from "../../helpers";
import { CheckBoxComponent } from "../../organisms";

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
        { page: 6, title: 'Dados Pessoais' },
        { page: 7, title: 'Dados Pessoais' },
        { page: 8, title: 'Dados Pessoais' },
        { page: 9, title: 'Dados Pessoais' },
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.estado_civil}
                            boxGroup={[
                                { label: 'Casado(a)', value: 'Casado(a)' },
                                { label: 'Solteiro(a)', value: 'Solteiro(a)' },
                                { label: 'Viúvo(a)', value: 'Viúvo(a)' },
                                { label: 'Divorciado(a)', value: 'Divorciado(a)' },
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                estado_civil: value,
                            })}
                            sx={{ flex: 1, }}
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
                        <TextInput
                            name='pertence_contx_familiar'
                            onChange={handleChange}
                            value={anamnese?.pertence_contx_familiar || ''}
                            sx={{ flex: 1, }}
                        />
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
                        <TextInput
                            name='pertence_contx_social'
                            onChange={handleChange}
                            value={anamnese?.pertence_contx_social || ''}
                            sx={{ flex: 1, }}
                        />
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
                        <TextInput
                            name='sent_contx_religioso'
                            onChange={handleChange}
                            value={anamnese?.sent_contx_religioso || ''}
                            sx={{ flex: 1, }}
                        />
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
            {
                page === 5 &&
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.primaira_rel_sex}
                            boxGroup={[
                                { label: 'Traumática', value: 'Traumática' },
                                { label: 'Normal', value: 'Normal' },
                                { label: 'Boa', value: 'Boa' },
                                { label: 'Satisfátoria', value: 'Satisfátoria' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                primaira_rel_sex: value,
                            })}
                            sx={{ flex: 1, }}
                        />
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
                        <CheckBoxComponent
                            valueChecked={anamnese?.realizado_rela_sex}
                            boxGroup={[
                                { label: 'Sim', value: 'Sim' },
                                { label: 'Não', value: 'Não' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                realizado_rela_sex: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column' }}>
                        <Text light>O sexo para você é algo:</Text>
                        <CheckBoxComponent
                            valueChecked={anamnese?.sexo_e_algo}
                            boxGroup={[
                                { label: 'Sem importância', value: 'Sem importância' },
                                { label: 'Importante', value: 'Importante' },
                                { label: 'Muito importante', value: 'Muito importante' }
                            ]}
                            horizontal={false}
                            onSelect={(value) => setAnamnese({
                                ...anamnese,
                                sexo_e_algo: value,
                            })}
                            sx={{ flex: 1, }}
                        />
                    </Box>
                    <Divider />
                </Box>
            }
            {
                page === 6 &&
                <Box>
                    <TextInput />
                    <TextInput />
                    <TextInput />
                </Box>
            }
            {
                page === 7 &&
                <Box>
                    <TextInput />
                    <TextInput />
                    <TextInput />
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
            {
                page === 10 &&
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