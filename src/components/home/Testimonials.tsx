import { Star } from "lucide-react";

const reviews = [
  {
    id: "1", name: "Mariana S.", city: "São Paulo, SP", rating: 5, initials: "MS",
    text: "Chegou rapidíssimo e o produto é exatamente como descrito. Minha filha adorou. Me sinto muito mais tranquila.",
  },
  {
    id: "2", name: "Carlos R.", city: "Curitiba, PR", rating: 5, initials: "CR",
    text: "Comprei o Kit Dupla para mim e para minha esposa. Qualidade excelente, atendimento ótimo. Recomendo muito.",
  },
  {
    id: "3", name: "Fernanda L.", city: "Belo Horizonte, MG", rating: 5, initials: "FL",
    text: "Os Oliveiras é diferente das outras lojas. Produto chegou embalado com cuidado. Parece presente de família.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#111111]">O que nossos clientes dizem</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex" aria-label="4.8 de 5 estrelas">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
              ))}
            </div>
            <span className="font-bold text-[#111111] text-sm">4.8</span>
            <span className="text-gray-400 text-sm">· 424 avaliações</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <article key={r.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex" aria-label={`${r.rating} estrelas`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0" aria-hidden>
                  <span className="text-[10px] font-bold text-gray-600">{r.initials}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111111]">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.city}</p>
                </div>
                <span className="ml-auto text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verificado</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
