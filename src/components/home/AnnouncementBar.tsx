export default function AnnouncementBar() {
  const items = [
    "AS MELHORES OFERTAS AQUI NA OS OLIVEIRAS",
    "FRETE GRÁTIS ACIMA DE R$ 199",
    "5% DE DESCONTO NO PIX",
    "PARCELE EM ATÉ 6X SEM JUROS",
    "ENTREGA PARA TODO O BRASIL",
  ];

  // Duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div className="bg-gray-50 border-y border-gray-100 overflow-hidden py-2.5">
      <div className="flex animate-marquee whitespace-nowrap" aria-hidden>
        {all.map((item, i) => (
          <span key={i} className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase mx-8">
            {item}
            <span className="mx-8 text-gray-300">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
