import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms"
import { SearchBar, SectionHeader, Table_V1 } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { api } from "../../api/api"
import moment from "moment";
import "moment/locale/pt-br";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ListProfissionals(props) {
    const [planList, setPlanList] = useState([])
    const [planActually, setPlanActually] = useState('free')
    const { setLoading, colorPalette, alert } = useAppContext()
    const router = useRouter()
    moment.locale("pt-br");

    const pathname = router.pathname === '/' ? null : router.asPath.split('/')[2]

    // useEffect(() => {
    //     getPlans();
    // }, []);

    // const getPlans = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await api.get(`/users/search/profissional`)
    //         const { data = [] } = response;
    //         setPlanList(data)
    //     } catch (error) {
    //         console.log(error)
    //         return error
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const column = [
        { key: 'id', label: 'ID' },
        { key: 'nome', avatar: true, label: 'Nome', avatarUrl: 'location', matricula: true },
        { key: 'email', label: 'E-mail' },
        { key: 'perfil', label: 'Perfil' },
    ];

    const plansAssignment = [
        {
            id: '01', nome: 'Free', price: 0.00, description: '', key: 'free', icon: '',
            listPlans: [
                { include: 'Simples acesso a plataforma', access: true },
                { include: 'Gestão de reservas disponíveis', access: true },
                { include: 'Gestão de pagamentos dentro da plataforma', access: false },
                { include: 'Ofertar diversas formas de pagamento para o paciente', access: false },
                { include: 'Prontuário do paciente', access: false },
                { include: 'Controle do acompanhamento do paciente por consulta', access: false },
            ]
        },
        {
            id: '02', nome: 'Standart', price: 49.90, description: '', key: 'standart', icon: '', preferency: true,
            listPlans: [
                { include: 'Simples acesso a plataforma', access: true },
                { include: 'Gestão de Agendas das consultas', access: true },
                { include: 'Gestão de pagamentos dentro da plataforma', access: true },
                { include: 'Ofertar diversas formas de pagamento para o paciente', access: true },
                { include: 'Prontuário do paciente', access: true },
                { include: 'Controle do acompanhamento do paciente por consulta', access: true },
            ]
        }
    ]

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <>
            <SectionHeader
                icon={'/icons/plan_payment.png'}
                title={`Planos de Assinatura`}

            />

            <Text veryLarge bold style={{ color: colorPalette.buttonColor, textAlign: 'center' }}>Confirma nossos planos disponíveis:</Text>

            <Box sx={{ display: 'flex', gap: 5, width: '100%', justifyContent: 'center' }}>
                {plansAssignment?.map((item, index) => {
                    const listIncludes = item?.listPlans;
                    const isPreferency = item?.preferency;
                    const isPlan = planActually === item?.key;
                    return (
                        <Box key={index} sx={{ position: 'relative', display: 'flex', gap: 1 }}>
                            <ContentContainer sx={{
                                backgroundColor: isPreferency ? colorPalette.third : '#FFF',
                                transition: '.5s',
                                "&:hover": {
                                    // opacity: 0.8,
                                    transform: 'scale(1.1, 1.1)'
                                },
                            }}>
                                {isPlan && <Box sx={{
                                    transition: '.5s',
                                    padding: '8px 12px', alignItems: 'center', display: 'flex', backgroundColor: 'red', borderRadius: 2,
                                    position: 'absolute', top: 5, left: 5
                                }}>
                                    <Text bold style={{ color: '#fff' }}>Plano atual</Text>
                                </Box>}

                                <Box sx={{
                                    display: 'flex', gap: 3, flexDirection: 'column', width: 300, alignItems: 'center',
                                    color: isPreferency && '#fff'
                                }}>
                                    <Text veryLarge bold style={{ color: 'inherit' }}>{item?.nome}</Text>
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'start' }}>
                                        {listIncludes?.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                {item?.access ? (
                                                    <CheckCircleIcon style={{ color: 'green', fontSize: 12 }} />
                                                ) : (
                                                    <CancelIcon style={{ color: 'red', fontSize: 12 }} />
                                                )}
                                                <Text style={{ color: 'inherit' }}>{item?.include}</Text>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Text indicator bold style={{ color: 'inherit' }}>{formatter.format(item?.price)}/mês</Text>
                                    <Box sx={{
                                        padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        maxWidth: 200,
                                        marginTop: 2,
                                        transition: '.5s',
                                        gap: 2,
                                        backgroundColor: isPreferency ? colorPalette.buttonColor : colorPalette.buttonColor,
                                        borderRadius: 2,
                                        "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            transform: 'scale(1.1, 1.1)'
                                        }
                                    }} onClick={() => {
                                        if (isPlan) {
                                            alert.info('O plano selecionado já corresponde a seu plano atual.')
                                        } else {
                                            setPlanActually(item?.key)
                                        }
                                    }}>
                                        <Text bold style={{ color: '#fff' }}>Assinar plano {item?.nome}</Text>
                                    </Box>
                                </Box>
                            </ContentContainer>
                        </Box>
                    )
                })}
            </Box>

        </>
    )
}


const styles = {
    containerRegister: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        padding: '40px'
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 15,
        height: 15,
    },
}
