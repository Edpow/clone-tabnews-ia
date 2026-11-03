"use client";

import { useEffect, useRef, useState } from "react";
import CartaoNome from "./CartaoNome";
import Progresso from "./Progresso";
import Acoes from "./Acoes";
import Toast from "./Toast";
import { falar } from "../../lib/fala";

export type CorNome = "amarelo" | "verde" | "azul" | "rosa" | "cinza";

export type Nome = {
  nome: string;
  pronuncia?: string;
  cor: CorNome;
};

const CORES: CorNome[] = ["amarelo", "verde", "azul", "rosa", "cinza"];

type Props = {
  nomesIniciais: Nome[];
};

export default function ListaNomes({ nomesIniciais }: Props) {
  const [nomes, setNomes] = useState<Nome[]>(nomesIniciais);
  const [destacarSilabas, setDestacarSilabas] = useState(false);
  const [soletrados, setSoletrados] = useState<string[]>([]);
  const [iluminado, setIluminado] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      if (toastRef.current) clearTimeout(toastRef.current);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  function mostrarToast(texto: string) {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast(texto);
    toastRef.current = setTimeout(() => setToast(null), 1500);
  }

  function registrarLeitura(nome: string) {
    setSoletrados((atual) =>
      atual.includes(nome) ? atual : [...atual, nome],
    );
  }

  function alternarDestaque() {
    setDestacarSilabas((valor) => {
      const proximo = !valor;
      mostrarToast(
        proximo
          ? "Destaque por sílabas ATIVADO"
          : "Toque para palavra inteira",
      );
      return proximo;
    });
  }

  // Modo Tartaruga: fala cada nome devagar, destacando o card em sequência.
  function modoTartaruga() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    nomes.forEach((item, indice) => {
      const timer = setTimeout(() => {
        setIluminado(indice);
        falar(item.pronuncia ?? item.nome, { rate: 0.6, pitch: 1.1 });
        mostrarToast(`"${(item.pronuncia ?? item.nome).toUpperCase()}"`);
        registrarLeitura(item.nome);
        const apagar = setTimeout(() => {
          setIluminado((atual) => (atual === indice ? null : atual));
        }, 1200);
        timersRef.current.push(apagar);
      }, indice * 1500);
      timersRef.current.push(timer);
    });
  }

  function adicionarNome() {
    const entrada = window.prompt("Digite um nome para soletrar:", "ANA");
    if (!entrada || !entrada.trim()) return;
    const limpo = entrada.trim();
    if (
      nomes.some((item) => item.nome.toLowerCase() === limpo.toLowerCase())
    ) {
      mostrarToast(`Nome "${limpo}" já está na lista!`);
      return;
    }
    setNomes((atual) => [
      ...atual,
      { nome: limpo, cor: CORES[atual.length % CORES.length] },
    ]);
    mostrarToast(`Nome "${limpo}" adicionado!`);
  }

  return (
    <>
      <div className="mb-6 flex w-full flex-col items-center text-center">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary-container/30 px-4 py-1 shadow-sm">
          <span className="material-symbols-outlined text-[20px] text-primary">
            auto_stories
          </span>
          <span className="font-label-sm font-bold uppercase tracking-wider text-on-primary-container">
            Aprender &amp; Soletar
          </span>
        </div>

        <h1 className="mb-1 font-headline-lg-mobile text-headline-lg-mobile font-extrabold uppercase tracking-[0.03em] text-on-surface">
          NOMES
        </h1>

        <p className="max-w-xs font-body-md leading-snug text-on-surface-variant">
          Toque na palavra para ouvir o nome · Ative o destaque para tocar cada
          sílaba
        </p>

        <div className="mt-4 flex w-full max-w-md items-center justify-between gap-4 rounded-[1rem] bg-surface-container px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-tertiary">
              spellcheck
            </span>
            <span className="font-label-md select-none font-semibold text-on-surface">
              Destacar sílabas
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={destacarSilabas}
            aria-label="Destacar sílabas"
            onClick={alternarDestaque}
            className={`relative flex h-[30px] w-[52px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${
              destacarSilabas ? "bg-tertiary" : "bg-surface-dim"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-lowest shadow-md transition-transform duration-300 ${
                destacarSilabas ? "translate-x-[22px]" : "translate-x-0"
              }`}
            >
              <span className="material-symbols-outlined text-[14px] text-tertiary">
                check
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mb-8 flex w-full max-w-md flex-col gap-6">
        {nomes.map((item, indice) => (
          <CartaoNome
            key={item.nome}
            nome={item.nome}
            pronuncia={item.pronuncia}
            cor={item.cor}
            destacarSilabas={destacarSilabas}
            iluminado={iluminado === indice}
            aoFalar={mostrarToast}
            aoLeitura={() => registrarLeitura(item.nome)}
          />
        ))}
      </div>

      <Progresso total={nomes.length} lidos={soletrados.length} />
      <Acoes onTartaruga={modoTartaruga} onAdicionar={adicionarNome} />
      <Toast texto={toast} />
    </>
  );
}
