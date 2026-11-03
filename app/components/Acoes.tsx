type Props = {
  onTartaruga: () => void;
  onAdicionar: () => void;
};

export default function Acoes({ onTartaruga, onAdicionar }: Props) {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-md flex-col gap-2">
      <button
        type="button"
        onClick={onTartaruga}
        className="action-btn bg-secondary-container text-on-secondary-container shadow-[0_4px_0_0_#7ecc80] active:translate-y-1 active:shadow-none"
      >
        <span className="material-symbols-outlined text-[24px]">
          slow_motion_video
        </span>
        <span>Ouvir Todos Devagar (Modo Tartaruga)</span>
      </button>

      <button
        type="button"
        onClick={onAdicionar}
        className="action-btn bg-tertiary text-on-tertiary shadow-[0_4px_0_0_#00446b] active:translate-y-1 active:shadow-none"
      >
        <span className="material-symbols-outlined text-[24px]">
          add_circle
        </span>
        <span>+ Adicionar Meu Nome</span>
      </button>
    </div>
  );
}
