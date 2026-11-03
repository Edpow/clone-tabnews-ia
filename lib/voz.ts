// Captura de voz (reconhecimento de fala) em pt-BR via Web Speech API.
//
// A API não faz parte do lib.dom do TypeScript, então os tipos mínimos
// são declarados aqui. Cada chamada invalida a anterior (contador de
// geração), para cliques rápidos não misturarem respostas.

type Opcoes = {
  aoIniciar?: () => void;
  aoTranscrever?: (transcricoes: string[]) => void;
  aoEncerrar?: () => void;
  aoErro?: (tipo: string) => void;
};

type Reconhecimento = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((evento: EventoResultado) => void) | null;
  onerror: ((evento: EventoErro) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type EventoResultado = {
  results: {
    length: number;
    [indice: number]: {
      length: number;
      [alternativa: number]: { transcript: string };
    };
  };
};

type EventoErro = {
  error: string;
};

type ConstrutorReconhecimento = new () => Reconhecimento;

let geracao = 0;
let atual: Reconhecimento | null = null;

function construtor(): ConstrutorReconhecimento | null {
  if (typeof window === "undefined") return null;
  const janela = window as unknown as {
    SpeechRecognition?: ConstrutorReconhecimento;
    webkitSpeechRecognition?: ConstrutorReconhecimento;
  };
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition ?? null;
}

export function vozDisponivel(): boolean {
  return construtor() !== null;
}

export function ouvir(opcoes: Opcoes = {}): void {
  const Construtor = construtor();
  if (!Construtor) return;

  parar(); // encerra e invalida qualquer escuta anterior
  const minhaGeracao = ++geracao;

  const reconhecimento = new Construtor();
  reconhecimento.lang = "pt-BR";
  reconhecimento.interimResults = false;
  reconhecimento.maxAlternatives = 5;
  reconhecimento.continuous = false;
  atual = reconhecimento;

  let finalizado = false;
  const encerrar = (erro?: string) => {
    if (finalizado || minhaGeracao !== geracao) return;
    finalizado = true;
    atual = null;
    if (erro) opcoes.aoErro?.(erro);
    opcoes.aoEncerrar?.();
  };

  reconhecimento.onstart = () => {
    if (minhaGeracao === geracao) opcoes.aoIniciar?.();
  };

  reconhecimento.onresult = (evento) => {
    if (minhaGeracao !== geracao) return;
    const transcricoes: string[] = [];
    for (let i = 0; i < evento.results.length; i++) {
      const resultado = evento.results[i];
      for (let j = 0; j < resultado.length; j++) {
        transcricoes.push(resultado[j].transcript);
      }
    }
    opcoes.aoTranscrever?.(transcricoes);
  };

  reconhecimento.onerror = (evento) => encerrar(evento.error);
  reconhecimento.onend = () => encerrar();

  try {
    reconhecimento.start();
  } catch {
    encerrar("aborted");
  }
}

export function parar(): void {
  geracao++; // callbacks da escuta atual passam a ser ignorados
  if (atual) {
    const reconhecimento = atual;
    atual = null;
    try {
      reconhecimento.stop();
    } catch {
      // já parado
    }
  }
}
