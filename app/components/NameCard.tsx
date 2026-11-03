"use client";

import { useEffect, useRef, useState } from "react";
import { silabificar } from "../../lib/silabas";
import { falar, falarSequencia } from "../../lib/fala";

type Props = {
  nome: string;
  pronuncia?: string;
  // true  = a palavra aparece dividida em sílabas clicáveis;
  // false = a palavra aparece inteira (visão inicial).
  destacarSilabas: boolean;
};

export default function NameCard({
  nome,
  pronuncia,
  destacarSilabas,
}: Props) {
  const silabasExibidas = silabificar(nome);
  const silabasFaladas = silabificar(pronuncia ?? nome);
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

  // Som da sílaba: usa a pronúncia (Ri, É...) quando existir e alinha
  // por índice; se a contagem divergir, cai na sílaba exibida.
  function textoFalado(indice: number): string {
    return silabasFaladas[indice] ?? silabasExibidas[indice];
  }

  // Nome inteiro numa fala só, com a pronúncia natural ("Rian", "Élen").
  function falarNomeCompleto() {
    falar(pronuncia ?? nome);
  }

  // Botão 🔊: com as sílabas visíveis, fala sílaba por sílaba destacando
  // cada uma na sequência; sem sílabas, fala o nome numa fala só.
  function aoClicarOuvir() {
    if (destacarSilabas) {
      falarSequencia(
        silabasExibidas.map((_, indice) => textoFalado(indice)),
        {
          aoIniciarSilaba: destacar,
          aoEncerrar: limparDestaque,
        },
      );
    } else {
      falarNomeCompleto();
    }
  }

  function aoClicarSilaba(indice: number) {
    destacar(indice);
    falar(textoFalado(indice), { aoEncerrar: limparDestaque });
  }

  return (
    <div className="cartao">
      {/* Um único espaço: a palavra inteira ou as sílabas no mesmo lugar. */}
      <div className="espaco">
        {destacarSilabas ? (
          <div
            className="silabas"
            role="group"
            aria-label={`Sílabas de ${nome}`}
          >
            {silabasExibidas.map((silaba, indice) => (
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
        ) : (
          <button
            type="button"
            className="nome"
            onClick={falarNomeCompleto}
            aria-label={`Ouvir o nome ${nome} completo`}
          >
            {nome}
          </button>
        )}
      </div>

      <button
        type="button"
        className="ouvir"
        onClick={aoClicarOuvir}
        aria-label={`Tocar o nome ${nome}`}
      >
        🔊
      </button>
    </div>
  );
}
