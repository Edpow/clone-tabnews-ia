type Props = {
  texto: string | null;
};

export default function Toast({ texto }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full bg-inverse-surface px-4 py-2 font-label-md text-inverse-on-surface shadow-xl transition-opacity duration-300 ${
        texto ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] text-primary-fixed">
        graphic_eq
      </span>
      <span>{texto ?? ""}</span>
    </div>
  );
}
