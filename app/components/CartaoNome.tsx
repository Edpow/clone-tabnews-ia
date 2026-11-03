"use client";

import { useEffect, useRef, useState } from "react";
import { silabificar } from "../../lib/silabas";
import { falar, falarSequencia, cancelarFala } from "../../lib/fala";
import { vozDisponivel, ouvir, parar as pararVoz } from "../../lib/voz";
import { falouCorreto } from "../../lib/comparar";

type Props = {
  nome: string;
  pronuncia?: string;
  // Paleta da palavra no design LudoLeitura (amarelo/verde/azul/rosa/cinza).
  cor: string;
  // true = a palavra aparece dividida em sílabas clicáveis;
  // false = a palavra aparece inteira (visão inicial).
  destacarSilabas: boolean;
  // Destaque do Modo Tartaruga.
  iluminado: boolean;
  // Notifica o que está sendo falado (toast) e o nome "soletrado"
  // (progresso "Treino de Hoje").
  aoFalar: (texto: string) => void;
  aoLeitura: () => void;
};

// O que a criança está praticando: uma sílaba (índice) ou o nome inteiro.
type Alvo = number | "palavra";

type Feedback = {
  alvo: Alvo | null;
  status: "correto" | "errado" | "aviso";
  texto: string;
  // Mostra o botão "Está certo ✓" quando o reconhecimento pode estar
  // errado (erros do reconhecimento e acertos manuais).
  aceitavel?: boolean;
};

const PONTOS: Record<string, string> = {
  amarelo: "bg-primary",
  verde: "bg-secondary",
  azul: "bg-tertiary",
  rosa: "bg-error",
  cinza: "bg-outline",
};

export default function CartaoNome({
  nome,
  pronuncia,
  cor,
  destacarSilabas,
  iluminado,
  aoFalar,
  aoLeitura,
}: Props) {
  const silabasExibidas = silabificar(nome);
  const silabasFaladas = silabificar(pronuncia ?? nome);

  const [ativa, setAtiva] = useState<number | null>(null);
  const [suporteVoz, setSuporteVoz] = useState(false);
  const [ouvindo, setOuvindo] = useState<Alvo | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Suporte ao microfone só é conhecido no cliente (evita divergência
    // de hidratação); sem suporte, os botões 🎤 simplesmente não aparecem.
    setSuporteVoz(vozDisponivel());
    return () => {
      pararVoz();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (feedbackRef.current) clearTimeout(feedbackRef.current);
    };
  }, []);

  useEffect(() => {
    // Trocar de visão encerra qualquer prática em andamento.
    pararVoz();
    setOuvindo(null);
    setFeedback(null);
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
  }, [destacarSilabas]);

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

  function falarSilaba(indice: number) {
    falar(textoFalado(indice), {
      rate: 0.75,
      pitch: 1.15,
      aoEncerrar: limparDestaque,
    });
    aoFalar(`"${textoFalado(indice).toUpperCase()}"`);
    aoLeitura();
  }

  // Nome inteiro numa fala só, com a pronúncia natural ("Rian", "Élen").
  function falarNomeCompleto() {
    falar(pronuncia ?? nome, { rate: 0.85, pitch: 1.05 });
    aoFalar(`"${nome.toUpperCase()}"`);
    aoLeitura();
  }

  // Botão 🔊: com as sílabas visíveis, fala sílaba por sílaba destacando
  // cada uma na sequência; sem sílabas, fala o nome numa fala só.
  function aoClicarOuvir() {
    aoFalar(`"${nome.toUpperCase()}"`);
    aoLeitura();
    if (destacarSilabas) {
      falarSequencia(
        silabasExibidas.map((_, indice) => textoFalado(indice)),
        {
          aoIniciarSilaba: destacar,
          aoEncerrar: limparDestaque,
          rate: 0.75,
          pitch: 1.15,
        },
      );
    } else {
      falarNomeCompleto();
    }
  }

  function aoClicarSilaba(indice: number) {
    destacar(indice);
    falarSilaba(indice);
  }

  // Formas aceitas na comparação: sílaba falada e exibida (Ri/Ry),
  // palavra falada e escrita (Rian/Ryan).
  function esperados(alvo: Alvo): string[] {
    return alvo === "palavra"
      ? [pronuncia ?? nome, nome]
      : [textoFalado(alvo), silabasExibidas[alvo]];
  }

  // Palavra inteira não vale quando o alvo é uma sílaba
  // (dizer "Ellen"/"Élen" para a sílaba "El" continua erro).
  function rejeitar(alvo: Alvo): string[] {
    return alvo === "palavra" ? [] : [nome, pronuncia ?? ""];
  }

  function agendarLimpeza() {
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => setFeedback(null), 3000);
  }

  function mostrarAviso(alvo: Alvo, texto: string, aceitavel: boolean) {
    setOuvindo(null);
    setFeedback({ alvo, status: "aviso", texto, aceitavel });
    falar(texto, { rate: 0.9 });
    aoFalar(texto);
    agendarLimpeza();
  }

  function aoTranscrever(transcricoes: string[], alvo: Alvo) {
    pararVoz(); // fecha o microfone antes do retorno falado

    const semConteudo = transcricoes.every((t) => t.trim() === "");
    if (semConteudo) {
      mostrarAviso(alvo, "Não consegui ouvir. Tente de novo", true);
      return;
    }

    const ouvida = transcricoes[0].trim();
    const acertou = falouCorreto(esperados(alvo), transcricoes, {
      rejeitar: rejeitar(alvo),
    });
    setOuvindo(null);
    setFeedback({
      alvo,
      status: acertou ? "correto" : "errado",
      texto: acertou
        ? "Muito bem! ✅"
        : `Ouvi: "${ouvida}" — Tente de novo ❌`,
      aceitavel: !acertou,
    });
    falar(acertou ? "Muito bem!" : "Tente de novo", { rate: 0.9 });
    aoFalar(acertou ? "Muito bem! ✅" : "Tente de novo ❌");
    agendarLimpeza();
  }

  function aoErro(erro: string, alvo: Alvo) {
    if (
      erro === "not-allowed" ||
      erro === "service-not-allowed" ||
      erro === "audio-capture"
    ) {
      mostrarAviso(alvo, "Preciso do microfone para ouvir você", false);
    } else if (erro === "no-speech") {
      mostrarAviso(alvo, "Não consegui ouvir. Tente de novo", true);
    } else if (erro === "network") {
      mostrarAviso(alvo, "Sem conexão para reconhecer a fala", false);
    } else {
      setOuvindo(null);
    }
  }

  // Saída manual: o reconhecimento pode errar; a criança (ou um adulto)
  // confirma mesmo assim e recebe o mesmo acerto visual e falado.
  function aceitarManual() {
    const alvo = feedback?.alvo ?? null;
    setOuvindo(null);
    setFeedback({
      alvo,
      status: "correto",
      texto: "Muito bem! ✅",
      aceitavel: false,
    });
    falar("Muito bem!", { rate: 0.9 });
    aoFalar("Muito bem! ✅");
    agendarLimpeza();
  }

  function aoPraticar(alvo: Alvo) {
    if (!suporteVoz) return;
    cancelarFala(); // evita captar o próprio áudio do app
    setFeedback(null);
    setOuvindo(alvo);
    ouvir({
      aoTranscrever: (transcricoes) => aoTranscrever(transcricoes, alvo),
      aoErro: (erro) => aoErro(erro, alvo),
      aoEncerrar: () => setOuvindo(null),
    });
  }

  // --- renderização -------------------------------------------------

  function statusDe(alvo: Alvo): "correto" | "errado" | null {
    if (feedback && feedback.alvo === alvo && feedback.status !== "aviso") {
      return feedback.status;
    }
    return null;
  }

  function statusClasse(alvo: Alvo): string {
    const status = statusDe(alvo);
    return status === "correto"
      ? " correta"
      : status === "errado"
        ? " errada"
        : "";
  }

  function icone(alvo: Alvo): string {
    const status = statusDe(alvo);
    return status === "correto" ? "✅" : status === "errado" ? "❌" : "🎤";
  }

  const ouvindoAlvo = (alvo: Alvo) => (ouvindo === alvo ? " ouvindo" : "");

  const textoMensagem =
    ouvindo !== null ? "Ouvindo..." : (feedback?.texto ?? "");
  const classeMensagem =
    ouvindo !== null
      ? "ouvindo"
      : feedback?.status === "correto"
        ? "boa"
        : feedback?.status === "errado"
          ? "ruim"
          : "aviso";

  const legenda = `${silabasExibidas.length} sílabas · ${silabasExibidas.join(" + ")}`;

  return (
    <div
      className={`flex flex-col items-center rounded-[1rem] p-4 shadow-sm transition-all duration-200 ${
        iluminado ? "bg-primary-container/20" : "bg-surface-container-low/70"
      }`}
    >
      <div className="flex w-full items-center justify-center gap-2">
        {destacarSilabas ? (
          silabasExibidas.map((silaba, indice) => (
            <div
              key={`${silaba}-${indice}`}
              className="flex flex-col items-center gap-1"
            >
              <button
                type="button"
                className={`syllable-tile tile-${cor}${
                  ativa === indice ? " ativa" : ""
                }${ouvindoAlvo(indice)}${statusClasse(indice)}`}
                onClick={() => aoClicarSilaba(indice)}
                aria-label={`Ouvir a sílaba ${silaba}`}
              >
                {silaba}
              </button>
              {suporteVoz && (
                <button
                  type="button"
                  className={`mic-btn${ouvindoAlvo(indice)}${statusClasse(indice)}`}
                  onClick={() => aoPraticar(indice)}
                  aria-label={`Falar a sílaba ${silaba}`}
                >
                  {icone(indice)}
                </button>
              )}
            </div>
          ))
        ) : (
          <button
            type="button"
            className={`syllable-tile tile-${cor} grow${ouvindoAlvo(
              "palavra",
            )}${statusClasse("palavra")}`}
            onClick={falarNomeCompleto}
            aria-label={`Ouvir o nome ${nome} completo`}
          >
            {nome}
          </button>
        )}

        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="audio-btn"
            onClick={aoClicarOuvir}
            aria-label={`Tocar o nome ${nome}`}
          >
            <span className="material-symbols-outlined text-[26px]">
              volume_up
            </span>
          </button>
          {suporteVoz && (
            <button
              type="button"
              className={`mic-btn${ouvindoAlvo("palavra")}${statusClasse("palavra")}`}
              onClick={() => aoPraticar("palavra")}
              aria-label={`Falar o nome ${nome}`}
            >
              {icone("palavra")}
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 font-label-sm text-on-surface-variant/70">
        <span className={`h-1.5 w-1.5 rounded-full ${PONTOS[cor] ?? "bg-primary"}`} />
        <span>{legenda}</span>
      </div>

      <p className={`mensagem ${classeMensagem}`} aria-live="polite">
        {textoMensagem}
        {feedback?.aceitavel && (
          <button type="button" className="aceitar" onClick={aceitarManual}>
            Está certo ✓
          </button>
        )}
      </p>
    </div>
  );
}
