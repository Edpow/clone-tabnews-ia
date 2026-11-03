export default function Cabecalho() {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 pt-[env(safe-area-inset-top,0px)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <img
            alt="LudoLeitura Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U67kgMgP6GKTMreV6EPHSWbHa-zpbB5kyrkeOCuvo2uvXLfr7KIX9PVM48CX2zLRuHQ_9h0ZPbuGeGYb7f2zuDR05LIJAAaQ0IkPcLkI2GKl2mxodsjvSPAI0KGsopyTd-wfXVmKOvDdpxSgC_RoGDIZzR8ZmXTzgMjFIjoGzVrPbgno__N_anc7ntrXiXKBu9Tx3lQv_Nv1zgZXzYyk4YgEjjokM7U99-HucnboYp"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-label-lg font-bold leading-tight text-primary">
              LudoLeitura
            </span>
            <span className="truncate font-label-sm font-bold text-on-surface-variant">
              Palavras &amp; Sílabas
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-primary-container/40 px-2 py-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
            <span className="material-symbols-outlined select-none text-[20px] text-primary">
              star
            </span>
            <span className="font-label-md font-bold text-on-primary-container">
              120
            </span>
          </div>
          <div className="rounded-full bg-surface-container-high p-0.5">
            <img
              alt="Perfil"
              className="h-8 w-8 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAty8yxLx4xCHYNRFo3hCB48YuzTEx0EcNKlSBDF9VMJT9PlhUFkWFymx8uUIJsAxeObQoUWuKlhXQd404NTGjWiqPfrXpfEkdVXOC41qs9tKpszZQ4MZ1o5xZjC3naP2zjAjzKhqCaNzYKosvirvMzdNOTDMHzmfDqQ6iA-jdvjsVeduoGK3ES9hn_Aq_YNEDJw9OFZy33ndI05GjteYxXY4G4z6vzFHCxq9X9P4g"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
