type Props = {
  total: number;
  lidos: number;
};

export default function Progresso({ total, lidos }: Props) {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-between rounded-[1rem] bg-surface-container p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm">
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            military_tech
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-lg font-bold text-on-surface">
            Treino de Hoje
          </span>
          <span className="font-label-sm text-on-surface-variant">
            {lidos} de {total} nomes soletrados
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, indice) => (
          <span
            key={indice}
            className={`material-symbols-outlined text-[24px] ${
              indice < lidos ? "text-primary" : "text-outline-variant"
            }`}
            style={
              indice < lidos ? { fontVariationSettings: "'FILL' 1" } : undefined
            }
          >
            star
          </span>
        ))}
      </div>
    </div>
  );
}
