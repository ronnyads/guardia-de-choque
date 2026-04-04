import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: "1",
    name: "Mariana S.",
    city: "São Paulo, SP",
    rating: 5,
    text: "Chegou rapidíssimo e o produto é exatamente como descrito. Minha filha adorou a Guardiã. Me sinto muito mais tranquila agora.",
    initials: "MS",
  },
  {
    id: "2",
    name: "Carlos R.",
    city: "Curitiba, PR",
    rating: 5,
    text: "Comprei o Kit Dupla para mim e para minha esposa. Qualidade excelente, atendimento ótimo. Vou indicar para todos os amigos.",
    initials: "CR",
  },
  {
    id: "3",
    name: "Fernanda L.",
    city: "Belo Horizonte, MG",
    rating: 5,
    text: "Os Oliveiras é diferente das outras lojas. Produto chegou com cuidado e embalado direitinho. Parece presente de família mesmo.",
    initials: "FL",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase">
            Avaliações
          </span>
          <h2 className="text-3xl md:text-4xl text-foreground mt-3">
            O que as famílias dizem
          </h2>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex" aria-label="4.8 de 5 estrelas" role="img">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-accent text-accent" aria-hidden />
              ))}
            </div>
            <span className="font-bold text-foreground text-lg">4.8</span>
            <span className="text-text-muted text-sm">· 424 avaliações verificadas</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col gap-5 bg-surface border border-border rounded-2xl p-6 hover:border-accent/30 transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-accent/40 shrink-0" aria-hidden />

              {/* Text */}
              <p className="text-text-body leading-relaxed text-sm flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {/* Avatar initials */}
                <div
                  className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0"
                  aria-hidden
                >
                  <span className="text-xs font-bold text-accent">{review.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-text-muted text-xs">{review.city}</p>
                </div>
                {/* Star rating */}
                <div className="ml-auto flex" aria-label={`${review.rating} estrelas`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" aria-hidden />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
