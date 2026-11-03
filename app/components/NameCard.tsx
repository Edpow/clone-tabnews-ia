"use client";

import { useEffect, useRef, useState } from "react";
import { silabificar } from "../../lib/silabas";
import { falar, falarSequencia } from "../../lib/fala";

type Props = {
  nome: string;
};

export default function NameCard({ nome }: Props) {
  const silabas = silabificar(nome);
  const [ativa, setAtiva] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function destacar(indice: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAtiva(indice);
    // Segurança: o destaque se apaga sozinho caso a fala não termine
    // (ou caso o navegador nem tenha suporte à Web Speech API).
    timerRef.current = setTimeout(() => setAtiva(null), 1500);
  }

  function limparDestaque() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAtiva(null);
  }

  function aoClicarNome() {
    falarSequencia(silabas, {
      aoIniciarSilaba: destacar,
      aoEncerrar: limparDestaque,
    });
  }

  function aoClicarSilaba(indice: number) {
    destacar(indice);
    falar(silabas[indice], { aoEncerrar: limparDestaque });
  }

  return (
    <div className="cartao">
      <button
        type="button"
        className="nome"
        onClick={aoClicarNome}
        aria-label={`Ouvir o nome ${nome} completo`}
      >
        {nome}
      </button>

      <div className="silabas" role="group" aria-label={`Sílabas de ${nome}`}>
        {silabas.map((silaba, indice) => (
          <button
            key={`${silaba}-${indice}`}
            type="button"
            className={`silaba${ativa === indice ? " ativa" : ""}`}
            onClick={() => aoClicarSilaba(indice)}
            aria-label={`Ouvir a sílaba ${silaba}`}
          >
            {silaba}
          </button>
        ))}
      </div>
    </div>
  );
}
