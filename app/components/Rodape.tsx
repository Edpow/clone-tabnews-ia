const itens = [
  { icone: "map", rotulo: "Mundos" },
  { icone: "extension", rotulo: "Sílabas", ativo: true },
  { icone: "sports_esports", rotulo: "Jogos" },
  { icone: "military_tech", rotulo: "Troféus" },
];

export default function Rodape() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 z-50 w-full bg-surface/80 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl"
    >
      <div className="flex h-20 items-center justify-around px-1">
        {itens.map((item) => (
          <a
            key={item.rotulo}
            href="#"
            aria-current={item.ativo ? "page" : undefined}
            className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 transition-transform ${
              item.ativo
                ? "scale-105 font-bold text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">
              {item.icone}
            </span>
            <span className="font-label-sm">{item.rotulo}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
