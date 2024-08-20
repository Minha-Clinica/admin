import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { emailValidator, formatCPF, formatPhone } from "../helpers"
import { Colors, IconTheme, SelectList } from "../organisms"
import { Box, ContentContainer, TextInput, Text, Divider } from "../atoms"
import Button from '@mui/material/Button';
import Head from "next/head"
import { createContract, createUser, getImageByScreen } from "../validators/api-requests"
import { icons } from "../organisms/layout/Colors"
import Link from "next/link"
import { api } from "../api/api"
import { Backdrop, FormControlLabel, Switch } from "@mui/material"
import { useRouter } from "next/router"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const Register = ({ type = `paciente`, setTypeSelected, typeSelected, setShowRegisterType, companyCode }) => {

    const { login, alert, theme, colorPalette, setLoading, setShowConfirmationDialog } = useAppContext()
    const router = useRouter()
    const cod_key = companyCode
    const [userData, setUserData] = useState({
        cpf: null,
        genero: '',
        telefone: null,
        ativo: 1,
        admin_sistema: 1,
        login: null,
        nascimento: null,
        foto_perfil_id: null,
        nome_social: null, perfil: type || null
    })
    const [contract, setContract] = useState({
        funcao: null,
        area: null,
        horario: null,
        admissao: null,
        desligamento: null,
        conta_id: null,
        banco_1: null,
        conta_1: null,
        agencia_1: null,
        tipo_conta_1: null,
        banco_2: null,
        conta_2: null,
        agencia_2: null,
        tipo_conta_2: null
    })
    const [themeName, setThemeName] = useState('')
    const [company, setCompany] = useState({})
    const [showPreferences, setShowPreferences] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)
    const [stepSelected, setStepSelected] = useState(1)
    const smallWidthDevice = windowWidth < 1000

    console.log(cod_key)

    useEffect(() => {
        const themeAltern = theme ? setThemeName('dark') : setThemeName('clear')
        return themeAltern
    }, [theme])


    const checkRequiredFields = () => {
        if (!userData?.nome) {
            alert?.error('O campo nome é obrigatório')
            return false
        }
        if (!userData?.email) {
            alert?.error('O campo email é obrigatório')
            return false
        }

        if (!userData?.telefone) {
            alert?.error('O campo Telefone é obrigatório')
            return false
        }

        if (!userData?.nascimento) {
            alert?.error('O campo Telefone é obrigatório')
            return false
        }

        if (!userData?.genero) {
            alert?.error('O campo Telefone é obrigatório')
            return false
        }

        if (!emailValidator(userData?.email)) {
            alert?.error('O e-mail inserido parece estar incorreto.')
            return false
        }

        if (userData?.senha !== '' && (userData?.senha !== userData?.confirmar_senha)) {
            alert?.error('As senhas não correspondem. Por favor, verifique novamente.')
            return false
        }

        return true
    }

    const handleCreateUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                userData.perfil = type;
                const response = await api.post('/user/create', { userData })
                const { data } = response
                if (response?.status === 201) {
                    alert.success('Parabéns! Seu cadastro foi realizado com sucesso!. Faça Login para começar a ultilizar a plataforma!');
                    if (data?.userId) router.push(`/`)
                }
                if (response?.status === 422) {
                    alert.error('Já existe um usuário cadastrado em nossa plataforma, com o e-mail informado.');
                }
            } catch (error) {
                alert.error('Tivemos um problema ao criar seu cadastro.');
                if (error?.response?.status === 422) {
                    alert.error('Já existe um usuário cadastrado em nossa plataforma, com o e-mail informado.');
                }
                console.log(error)
            } finally {
                setLoading(false)
            }
            return setLoading(false)
        }
    }

    const handleCompany = async () => {
        if (cod_key) {
            try {
                const response = await api.get(`/company/key/${cod_key}`)
                if (response?.data) {
                    setCompany(response?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }


    const handleChange = (value) => {

        if (value.target.name == 'cpf') {
            let str = value.target.value;
            value.target.value = formatCPF(str)
        }

        if (value.target.name == 'telefone') {
            let str = value.target.value;
            value.target.value = formatPhone(str)
        }

        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeContract = (value) => {
        setContract((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }


    useEffect(() => {
        handleCompany()
        setWindowWidth(window.innerWidth)
        window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
        document.title = `Admin Meliés`
        return () => window.removeEventListener('resize', () => { });
    }, [])

    const groupGender = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' }
    ]

    const steps = [
        {
            id: '01', step: 1, key: 'userData', title: 'Dados Cadastrais', description: 'Insira seu dados cadastrais.',
            type: ['parceiro', 'paciente']
        },
        {
            id: '02', step: 2, key: 'accessDara', title: 'Dados de Acesso', description: 'Insira suas credenciais.',
            type: ['parceiro', 'paciente']
        },
        {
            id: '03', step: 3, key: 'terapeutData', title: 'Preferências de Pagamento', description: 'Preferências e configurações.',
            type: ['parceiro']
        },
    ]

    return (
        <>
            <Head>
                <title>Afectu - Cadastro</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charset="utf-8" />
                <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/Afectu+-+PNG+-+Fundo+Tranparente-8%402x.png" />
            </Head>
            <Box sx={{
                zIndex: 999,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transition: 'background-color 1s',
                width: '100%', height: '100%',
            }}>
                <Box sx={{
                    display: 'flex', gap: 1, backgroundColor: colorPalette.third, width: '100%', height: '100%', position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '30px 50px',
                    flexDirection: { xs: 'column', xm: 'column', md: 'row', lg: 'row' }

                }}>
                    <Box sx={{ display: { xs: 'none', xm: 'none', md: 'flex', lg: 'flex' }, gap: 2, flexDirection: 'column', maxWidth: 480, marginBottom: 20, padding: '20px' }}>
                        <Text bold veryLarge style={{ color: '#fff' }}>Crie seu cadastro e aproveite o melhor da plataforma!</Text>
                        <Text large light style={{ color: '#fff' }}>Bem vindo Paciente! É um prazer fazer parte dessa jornada com você, e oferecer todo o suporte, facilitando seu uso da plataforma!</Text>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: showPreferences ? 'flex-start' : 'center',
                        borderRadius: 2,
                        width: 700,
                        minHeight: 800,
                        alignItems: 'center',
                        padding: '30px 15px',
                        backgroundColor: '#fff',
                        gap: 3,
                        marginTop: 10,
                        zIndex: 9999
                    }}>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: .8, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                            <Text bold indicator style={{ color: !theme ? '#fff' : Colors.backgroundPrimary, transition: 'background-color 1s', textAlign: 'center' }}>Bem vindo </Text>
                            <Text bold indicator style={{ color: colorPalette?.buttonColor, transition: 'background-color 1s', textAlign: 'center' }}> {type === 'parceiro' ? 'Terapeuta!' : 'Paciente!'}</Text>
                        </Box>

                        {cod_key &&
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: .8, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                <Text bold style={{ color: !theme ? '#fff' : Colors.backgroundPrimary, transition: 'background-color 1s', textAlign: 'center' }}>
                                    Você está se cadastrando pela empresa
                                </Text>
                                <Text bold large style={{ color: colorPalette?.buttonColor, transition: 'background-color 1s', textAlign: 'center' }}>
                                    {company?.razao_social}
                                </Text>
                            </Box>
                        }

                        <Box sx={{ display: 'flex' }}>
                            {steps?.map((item, index) => {
                                const stepNow = item?.step === stepSelected
                                const stepOk = item?.step < stepSelected
                                const vizualizedType = item?.type?.includes(type)
                                if (vizualizedType) {
                                    return (
                                        <Box key={index} sx={{
                                            display: 'flex', padding: '8px 12px', border: `1px solid #eaeaea`, alignItems: 'center',
                                            gap: 1, transition: '.3s',
                                            borderRadius: '8px',
                                            borderRight: item?.step !== 3 && 'none', // Remova a borda direita para criar a ilusão de uma seta
                                            borderBottomRightRadius: 0, // Ajusta o raio da borda para criar a seta
                                            borderTopRightRadius: 0, // Ajusta o raio da borda para criar a seta
                                            borderBottom: stepNow && `3px solid ${colorPalette?.buttonColor}`,
                                            '&:hover': {
                                                opacity: .7,
                                                cursor: 'pointer'
                                            }
                                        }} onClick={() => {
                                            setStepSelected(item?.step)
                                        }}>
                                            {stepOk ?
                                                <CheckCircleIcon style={{ color: colorPalette?.buttonColor, fontSize: 20 }} />
                                                :
                                                <Box sx={{
                                                    display: 'flex', width: 20, height: 20, borderRadius: 20,
                                                    border: `1px solid ${colorPalette?.buttonColor}`, alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text bold style={{ color: colorPalette?.buttonColor }}>{item?.step}</Text>
                                                </Box>}
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Text bold style={{ color: stepNow && colorPalette?.buttonColor }}>{item?.title}</Text>
                                                <Text light small style={{ color: '#gray' }}>{item?.description}</Text>
                                            </Box>
                                        </Box>
                                    )
                                }
                            })}
                        </Box>

                        {stepSelected > 1 &&
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'flex-start',
                                marginLeft: 5,
                                gap: 0.5,
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer'
                                }
                            }} onClick={() => {
                                setStepSelected(stepSelected - 1)
                            }}>
                                <Box sx={{
                                    ...styles.menuIcon,
                                    backgroundImage: `url(${icons.goback})`,
                                    width: 25, height: 25,
                                    // filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                                    transition: '.3s',
                                    aspectRatio: '1/1'
                                }} />
                                <Text sx={{}}>Voltar</Text>
                            </Box>
                        }
                        <form style={{ display: 'flex', zIndex: 999, flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>
                            {stepSelected === 3 ?
                                < PaymentConfigScreen />
                                :
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: smallWidthDevice ? '80%' : '100%', }}>

                                    <Box sx={{
                                        display: 'flex', flexDirection: 'column', gap: 2, width: { xs: `80%`, xm: `80%`, md: '62.5%', lg: '80%' }, justifyContent: 'center',
                                    }}>
                                        <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>

                                            {stepSelected === 1 &&
                                                <>
                                                    <Box sx={{ ...styles.inputSection }}>
                                                        <TextInput placeholder='Nome Completo' name='nome' onChange={handleChange} value={userData?.nome || ''} label='Nome Completo: *' sx={{ flex: 1, }} />
                                                    </Box>
                                                    <TextInput placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail: *' sx={{ flex: 1, }} />
                                                    <TextInput placeholder='Telefone' name='telefone' onChange={handleChange} value={userData?.telefone || ''} label='Telefone: *' sx={{ flex: 1, }} />
                                                    <Box sx={{ ...styles.inputSection }}>
                                                        <TextInput placeholder='Nascimento' name='nascimento' onChange={handleChange} type="date" value={(userData?.nascimento)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                                                        <SelectList fullWidth data={groupGender} valueSelection={userData?.genero || ''} onSelect={(value) => setUserData({ ...userData, genero: value })}
                                                            title="Gênero *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                                                        />
                                                    </Box>
                                                    <TextInput placeholder='CPF' name='cpf' onChange={handleChange} value={userData?.cpf || ''} label='CPF' sx={{ flex: 1, }} />
                                                </>
                                            }

                                            {stepSelected === 2 &&
                                                <>
                                                    {type === 'parceiro' &&
                                                        <>
                                                            <Text bold>Mostre para seus pacientes sua especialização:</Text>
                                                            <TextInput placeholder='Terapeuta formado em ...' name='funcao' onChange={handleChangeContract} value={contract?.funcao || ''} label='Profissão/Especialidade:' sx={{ flex: 1, }} />
                                                        </>
                                                    }
                                                    <Text bold>Digite sua senha de acesso:</Text>
                                                    <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                                        <TextInput placeholder='Senha' name='senha' onChange={handleChange} value={userData?.senha || ''} type="password" label='Senha' sx={{ flex: 1, }} />
                                                        <TextInput placeholder='Confirmar senha' name='confirmar_senha' onChange={handleChange} value={userData?.confirmar_senha || ''} type="password" label='Confirmar senha' sx={{ flex: 1, }} />
                                                    </Box>
                                                </>}
                                        </Box>

                                    </Box>
                                </Box>}
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', marginTop: 5, alignItems: 'center' }}>
                                {(type === 'parceiro' && stepSelected !== 3) || (type === 'paciente' && stepSelected !== 2) ?
                                    <Button
                                        style={{
                                            width: { xs: `80%`, xm: `80%`, md: '60%', lg: '60%' },
                                            padding: '12px 80px',
                                            marginBottom: 5,
                                            borderRadius: '12px',
                                            backgroundColor: colorPalette.buttonColor,
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                backgroundColor: colorPalette.buttonColor + 'dd',
                                                cursor: 'pointer'
                                            },
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#f0f0f0',
                                            borderRadius: '12px',
                                        }}
                                        text='Entrar'
                                        onClick={() => {
                                            if (type === 'parceiro') {
                                                setStepSelected(stepSelected + 1)
                                            } else {
                                                setStepSelected(2)
                                            }
                                        }}>
                                        <Text small bold style={{ color: 'inherit' }}>Próximo</Text>
                                    </Button>
                                    :
                                    <Button
                                        style={{
                                            width: { xs: `80%`, xm: `80%`, md: '60%', lg: '60%' },
                                            padding: '12px 80px',
                                            marginBottom: 5,
                                            borderRadius: '12px',
                                            backgroundColor: colorPalette.buttonColor,
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                backgroundColor: colorPalette.buttonColor + 'dd',
                                                cursor: 'pointer'
                                            },
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#f0f0f0',
                                            // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                            borderRadius: '12px',
                                        }}
                                        text='Entrar'
                                        onClick={() => handleCreateUser()}>
                                        <Text small bold style={{ color: 'inherit' }}>CADASTRAR</Text>
                                    </Button>}
                                <Text light small style={{ marginTop: 5 }}>Deseja voltar para tela de login?</Text>
                                <Button
                                    style={{
                                        width: '205px',
                                        padding: '10px 30px',
                                        marginBottom: 5,
                                        borderRadius: '100px',
                                        border: `1px solid ${colorPalette.buttonColor}`,
                                        transition: 'background-color 1s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.buttonColor + '22',
                                            cursor: 'pointer'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#f0f0f0',
                                        // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                        borderRadius: '12px',
                                    }}
                                    text='Entrar'
                                    onClick={() => {
                                        setTypeSelected({ value: '', active: false })
                                        setShowRegisterType(false)
                                    }}
                                >
                                    <Text small bold style={{ color: colorPalette.buttonColor }}>FAZER LOGIN</Text>
                                </Button>
                            </Box>

                        </form>
                    </Box>
                </Box >
            </Box >

        </>
    )
}



const PaymentConfigScreen = () => {

    const { setLoading, alert, colorPalette, user, theme } = useAppContext()


    const [showSection, setShowSection] = useState({
        paymentPlataform: true,
        consultValues: true,
        typesPayment: false,
    })
    const [consultValues, setConsultValues] = useState({
        valor_terapeuta: '',
        valor_final: '',
        comissao_valor: '',
        comissao_porcentagem: 10
    })
    const [paymentsPreference, setPaymentsPreference] = useState({
        pagamentos_plataforma: 0,
        forma_pagamento: {
            pix: true,
            boleto: true,
            creditCard: true
        },
    })

    const handleChange = (event) => {

        const rawValue = event.target.value.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos

        if (rawValue === '') {
            event.target.value = '';
        } else {
            let intValue = rawValue.slice(0, -2) || '0'; // Parte inteira
            const decimalValue = rawValue.slice(-2).padStart(2, '0');; // Parte decimal

            if (intValue === '0' && rawValue.length > 2) {
                intValue = '';
            }

            const formattedValue = `${parseInt(intValue, 10).toLocaleString()},${decimalValue}`; // Adicionando o separador de milhares
            event.target.value = formattedValue;

        }

        setConsultValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));

    }

    const handleCalculateComission = async (consultValues) => {
        if (consultValues?.valor_terapeuta) {
            const terapeutaValue = consultValues?.valor_terapeuta?.replace(/\./g, '').replace(',', '.');
            const comissionPorcent = consultValues?.comissao_porcentagem;
            const comissionValueCalculate = (parseFloat(terapeutaValue) * parseInt(comissionPorcent)) / 100;
            const totalValue = parseFloat(terapeutaValue) + comissionValueCalculate;

            setConsultValues((prevValues) => ({
                ...prevValues,
                comissao_valor: parseFloat(comissionValueCalculate),
                valor_final: parseFloat(totalValue),
            }));
        }
    }


    const handleUpdatePreferences = (event) => {
        const { checked } = event.target;
        const paymentPlataform = checked === true ? 1 : 0;

        setPaymentsPreference((prevValues) => ({
            ...prevValues,
            pagamentos_plataforma: paymentPlataform
        }))
    }

    const handleUpdateFormsPayment = (field) => {
        setPaymentsPreference((prevValues) => ({
            ...prevValues,
            forma_pagamento: {
                ...prevValues.forma_pagamento,
                [field]: !prevValues.forma_pagamento[field]
            }
        }));
    };


    const formsPayment = [
        {
            id: '01', icon: '/icons/pix_icon.png', title: 'Pix', key: 'pix',
            description: 'Recebimento em até 2 horas.'
        },
        {
            id: '02', icon: '/icons/creditCard_icon.png', title: 'Cartão de Crédito', key: 'creditCard',
            to: `/assignmentPlan/subscriptions`,
            description: 'Recebimento em até 7 dias.'
        },
        {
            id: '02', icon: '/icons/barcode.png', title: 'Boleto', key: 'boleto',
            to: `/assignmentPlan/subscriptions`,
            description: 'Recebimento em até 72 horas.'
        },
    ]

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: '20px' }}>
                <Divider />
                <Text title bold>Valor da Consulta</Text>
                <Box>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'start' }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Text large>Defina o Valor de sua consulta:</Text>
                            <TextInput
                                placeholder='0,00'
                                name='valor_terapeuta'
                                type="coin"
                                onChange={handleChange}
                                value={consultValues?.valor_terapeuta || ''}
                                onBlur={() => handleCalculateComission(consultValues)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column', alignItems: 'start' }}>
                            <Text light>Ao definir o valor que será cobrado em suas consultas, geramos automáticamente a taxa cobrada pela plataforma. Fique tranquilo,
                                o valor da taxa é "repassado" para o paciente, sem afetar seu lucro líquido.</Text>
                            <Text light>Os valores podem ser alterado depois, e é possível criar "Cupons" de desconto, caso queira dar algum desconto sobre o valor da consulta para algum paciente.</Text>
                            <Text bold large style={{ color: colorPalette?.buttonColor, marginTop: '5px' }}>O valor que irá ser disponibilizado para pagamento do paciente, está abaixo (Já incluso na taxa)!</Text>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text bold>Comissão cobrada: </Text>
                            <Text>{consultValues?.comissao_porcentagem?.toFixed(1)}%</Text>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center', padding: '8px 12px', border: `1px solid ${colorPalette?.buttonColor}`, borderRadius: 2 }}>
                            <Text bold>Valor Final para o paciente: </Text>
                            <Text veryLarge>{formatter.format(consultValues?.valor_final)}</Text>
                        </Box>
                    </Box>
                </Box>
                <Divider />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: '20px' }}>
                <Text title bold >Preferências de Pagamento</Text>
                <Box>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'start' }}>

                        <FormControlLabel small
                            control={
                                <Switch checked={paymentsPreference?.pagamentos_plataforma} name="pagamentos_plataforma" size="small" onChange={(e) => handleUpdatePreferences(e)} />
                            }
                            label="Controlar Pagamentos por meio da Plataforma"
                        />

                        <Box sx={{ display: 'flex', gap: .5, flexDirection: 'column', alignItems: 'start' }}>
                            <Text light>Ao optar pelo gerenciamento dos pagamentos pela própria plataforma, nós cuidamos de tudo para você!</Text>
                            <Text light>Além de não ter a responsabilidade de gerenciar os pagamentos, a nossa plataforma oferece um leque de opcões de pagamento para o paciente, como <strong style={{ color: colorPalette?.buttonColor, fontFamily: 'MetropolisBold' }}>PIX, Boleto e Cartão de Crédito!</strong></Text>
                            <Text bold large style={{ color: colorPalette?.buttonColor, marginTop: '5px' }}>Nunca mais deixe de dar atendimento por questões de pagamento!</Text>
                        </Box>
                    </Box>

                    {paymentsPreference?.pagamentos_plataforma === 1 && <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', marginTop: 5 }}>
                        <Text bold large>Escolha as Formas de Pagamento que deseja disponibilizar:</Text>

                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                            {formsPayment?.map((item, index) => {
                                const isSelected = paymentsPreference?.forma_pagamento[item?.key];
                                return (
                                    <Box key={index} sx={{
                                        display: 'flex', padding: '25px',
                                        borderRadius: 2,
                                        backgroundColor: colorPalette.secondary,
                                        border: isSelected && `1px solid ${colorPalette?.buttonColor}`,
                                        boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        position: 'relative',
                                        gap: 2,
                                        transition: '.3s',
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            transform: 'scale(1.05, 1.05)'
                                        }

                                    }} onClick={() => {
                                        handleUpdateFormsPayment(item?.key)
                                    }}>
                                        {isSelected && <CheckCircleIcon style={{ color: 'green', fontSize: 18, position: 'absolute', top: 5, left: 5 }} />}
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            width: 30, height: 30, aspectRatio: '1/1',
                                            backgroundImage: `url('${item?.icon}')`,
                                            transition: '.3s'

                                        }} />
                                        <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                                            <Text large bold>{item?.title}</Text>
                                            <Text small light>{item?.description}</Text>
                                        </Box>
                                    </Box>
                                )
                            })
                            }
                        </Box>
                    </Box>}
                </Box>
                <Divider />
            </Box>
        </Box>
    )
}


const styles = {
    favicon: {
        backgroundSize: 'cover',
        display: 'flex',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        width: '140px',
        height: '67px',
        marginLeft: 12,
        // backgroundColor: 'pink'
    },
    icon: {
        width: '30px',
        height: '30px'
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
        gap: 1.8,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    },
    containerRegister: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        padding: '40px'
    },
    containerContract: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1.8,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    },
    containerFile: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'gray lightgray',
        '&::-webkit-scrollbar': {
            width: '5px',

        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'darkgray',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'gray',

        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray',

        },
    }
}