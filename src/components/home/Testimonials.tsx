import { Star } from "lucide-react";

const reviews = [
  {
    id: "1",
    name: "Mariana S.",
    city: "São Paulo, SP",
    rating: 5,
    text: "Chegou rapidíssimo e o produto é exatamente como descrito. Minha filha adorou a Guardiã. Me sinto muito mais tranquila agora.",
  },
  {
    id: "2",
    name: "Carlos R.",
    city: "Curitiba, PR",
    rating: 5,
    text: "Comprei o Kit Dupla para mim e para minha esposa. Qualidade excelente, atendimento ótimo. Com certeza vou indicar para amigos.",
  },
  {
    id: "3",
    name: "Fernanda L.",
    city: "Belo Horizonte, MG",
    rating: 5,
    text: "Os Oliveiras é diferente das outras lojas. Produto chega com cuidado, embalado direitinho. Parece presente de família mesmo.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground">
            O que as famílias dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-bold text-foreground">4.8</span>
            <span className="text-text-muted text-sm">· 424 avaliações</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-text-body leading-relaxed text-sm flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="font-bold text-foreground text-sm">{review.name}</p>
                <p className="text-text-muted text-xs">{review.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
