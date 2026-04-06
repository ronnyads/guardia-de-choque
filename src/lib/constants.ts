import { Review, FAQItem, Stat } from "@/types";

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Carlos M.",
    location: "São Paulo, SP",
    rating: 5,
    text: "Comprei para minha esposa e ela se sente muito mais segura agora. O produto é excelente, bem acabado e a lanterna é um bônus incrível. Recomendo demais!",
    verified: true,
  },
  {
    id: "2",
    name: "Ana L.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Pequeno, discreto e potente. Trabalho à noite e agora me sinto protegida. A trava de segurança me dá tranquilidade para carregar na bolsa.",
    verified: true,
  },
  {
    id: "3",
    name: "Marcos R.",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Já tenho há 3 meses, funciona perfeitamente. O arco elétrico é impressionante — só o barulho já afasta qualquer pessoa mal-intencionada.",
    verified: true,
  },
  {
    id: "4",
    name: "Juliana S.",
    location: "Curitiba, PR",
    rating: 4,
    text: "Comprei o Kit Dupla e dei um para minha mãe. As duas estamos muito satisfeitas. O mini taser de brinde foi uma surpresa excelente!",
    verified: true,
  },
  {
    id: "5",
    name: "Roberto F.",
    location: "Salvador, BA",
    rating: 5,
    text: "Sou segurança particular e uso profissionalmente. Qualidade excelente, bateria dura bastante e o coldre é muito prático.",
    verified: true,
  },
  {
    id: "6",
    name: "Fernanda C.",
    location: "Brasília, DF",
    rating: 5,
    text: "Entrega rápida, produto bem embalado e funciona exatamente como descrito. Melhor investimento em segurança que já fiz.",
    verified: true,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "O aparelho de choque é legal no Brasil?",
    answer:
      "Sim! O aparelho de choque NÃO é classificado como arma de fogo, pois não dispara projéteis. Seu uso é permitido para civis e profissionais de segurança em todo o território nacional, sem necessidade de registro ou autorização.",
  },
  {
    question: "Como funciona a recarga?",
    answer:
      "O aparelho vem com cabo de recarga bivolt (110/220V). Basta conectar em qualquer tomada comum. Uma carga completa dura semanas em modo standby, garantindo que esteja sempre pronto quando você precisar.",
  },
  {
    question: "A lanterna LED é potente?",
    answer:
      "Sim! Utilizamos LED Cree de alta potência com baixo consumo de energia. A lanterna é ideal para iluminar ambientes escuros, servindo também como ferramenta de uso diário.",
  },
  {
    question: "O aparelho pode machucar gravemente alguém?",
    answer:
      "O aparelho foi projetado para imobilizar temporariamente, causando contração muscular involuntária sem danos permanentes. O efeito é temporário e não deixa sequelas. Importante: não deve ser utilizado por pessoas com condições cardíacas.",
  },
  {
    question: "Qual o tamanho do aparelho?",
    answer:
      "O Guardiã de Choque tem 16cm de comprimento, tamanho ideal para segurar com firmeza e transportar discretamente no coldre que acompanha o produto.",
  },
  {
    question: "O que vem incluso na compra?",
    answer:
      "Cada unidade vem com: 1x Aparelho de Choque Guardiã, 1x Coldre protetor para transporte, 1x Cabo de recarga bivolt. Nos Kits Dupla e Família, você ainda recebe um Mini Taser de brinde!",
  },
  {
    question: "Qual a política de garantia?",
    answer:
      "Oferecemos garantia de 30 dias contra defeitos de fabricação. Se o produto apresentar qualquer problema, entre em contato conosco que faremos a troca ou devolução do valor integral.",
  },
  {
    question: "Como funciona a entrega?",
    answer:
      "Enviamos para todo o Brasil via transportadora. O prazo médio é de 5 a 12 dias úteis dependendo da região. Você receberá o código de rastreio assim que o pedido for despachado.",
  },
];

export const STATS: Stat[] = [
  {
    value: "50.000+",
    numericValue: 50000,
    suffix: "+",
    label: "assaltos registrados por ano no Brasil",
    icon: "AlertTriangle",
  },
  {
    value: "1 a cada 10",
    numericValue: 10,
    suffix: " min",
    label: "uma pessoa é vítima de roubo a cada 10 minutos",
    icon: "Clock",
  },
  {
    value: "87%",
    numericValue: 87,
    suffix: "%",
    label: "das vítimas estavam completamente desprevenidas",
    icon: "ShieldOff",
  },
];

export const CHECKOUT_URLS = {
  "kit-individual": "/checkout?kit=guardia-de-choque",
  "kit-dupla": "/checkout?kit=kit-dupla",
  "kit-familia": "/checkout?kit=kit-familia",
  "downsell": "/checkout?kit=guardia-de-choque",
};
