"use client";

import { useEffect, useRef, useState } from "react";
import { silabificar } from "../../lib/silabas";
import { falar, falarSequencia, cancelarFala } from "../../lib/fala";
import { vozDisponivel, ouvir, parar as pararVoz } from "../../lib/voz";
import { falouCorreto } from "../../lib/comparar";

type Props = {
  nome: string;
  pronuncia?: string;
  // true  = a palavra aparece dividida em sílabas clicáveis;
  // false = a palavra aparece inteira (visão inicial).
  destacarSilabas: boolean;
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

export default function NameCard({
  nome,
  pronuncia,
  destacarSilabas,
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
    falar(texto);
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
    falar(acertou ? "Muito bem!" : "Tente de novo");
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
    falar("Muito bem!");
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

  const ouvindoAlvo = (alvo: Alvo) =>
    ouvindo === alvo ? " ouvindo" : "";

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

  return (
    <div className="cartao">
      <div className="linha">
        {/* Um único espaço: a palavra inteira ou as sílabas no mesmo lugar. */}
        <div className="espaco">
          {destacarSilabas ? (
            <div
              className="silabas"
              role="group"
              aria-label={`Sílabas de ${nome}`}
            >
              {silabasExibidas.map((silaba, indice) => (
                <div className="silaba-grupo" key={`${silaba}-${indice}`}>
                  <button
                    type="button"
                    className={`silaba${
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
                      className={`mic${ouvindoAlvo(indice)}${statusClasse(indice)}`}
                      onClick={() => aoPraticar(indice)}
                      aria-label={`Falar a sílaba ${silaba}`}
                    >
                      {icone(indice)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              className={`nome${ouvindoAlvo("palavra")}${statusClasse("palavra")}`}
              onClick={falarNomeCompleto}
              aria-label={`Ouvir o nome ${nome} completo`}
            >
              {nome}
            </button>
          )}
        </div>

        <div className="acoes">
          <button
            type="button"
            className="ouvir"
            onClick={aoClicarOuvir}
            aria-label={`Tocar o nome ${nome}`}
          >
            🔊
          </button>
          {suporteVoz && (
            <button
              type="button"
              className={`mic${ouvindoAlvo("palavra")}${statusClasse("palavra")}`}
              onClick={() => aoPraticar("palavra")}
              aria-label={`Falar o nome ${nome}`}
            >
              {icone("palavra")}
            </button>
          )}
        </div>
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
