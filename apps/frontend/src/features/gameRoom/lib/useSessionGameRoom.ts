"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";

type Side = "w" | "b";
type Winner = "player" | "opponent" | null;
type OutgoingRequest = "draw" | "undo" | null;
type IncomingRequest = "draw" | "undo" | null;

export type GameRoomChatMessage = {
  id: string;
  author: "player" | "opponent" | "system";
  text: string;
  timestamp: string;
};

export type GameRoomMovePair = {
  moveNumber: number;
  white: string | null;
  black: string | null;
};

export type GameRoomSettings = {
  showCoordinates: boolean;
  showLegalMoves: boolean;
  enableAnimations: boolean;
};

type PendingPromotion = {
  from: Square;
  to: Square;
};

type ManualOutcome = {
  resultLabel: string;
  winner: Winner;
};

type UseSessionGameRoomOptions = {
  sessionId: string;
  opponentName: string;
  playerName: string;
  playerColor?: Side;
};

const DEFAULT_OPENING_MOVES = [
  "e4",
  "e5",
  "Nf3",
  "Nc6",
  "Bc4",
  "Bc5",
  "c3",
  "Nf6",
  "d4",
  "exd4",
] as const;

const INITIAL_CLOCKS: Record<Side, number> = {
  w: 381_000,
  b: 514_000,
};

function createInitialChess() {
  const chess = new Chess();

  DEFAULT_OPENING_MOVES.forEach((move) => {
    chess.move(move);
  });

  return chess;
}

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getKingSquare(chess: Chess, side: Side) {
  const [square] = chess.findPiece({ type: "k", color: side });
  return square ?? null;
}

function getRandomOpponentReply() {
  const replies = [
    "حرکت خوبی بود.",
    "فشار روی مرکز را نگه می‌دارم.",
    "دارم روی تاکتیک بعدی فکر می‌کنم.",
    "اگر بخواهم قلعه کوتاه کنم، فضا باز می‌شود.",
    "فعلا تمرکزم روی کنترل خانه‌های روشن است.",
  ];

  return replies[Math.floor(Math.random() * replies.length)] ?? replies[0];
}

export function formatClockTime(totalMs: number) {
  const safeMs = Math.max(0, totalMs);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function useSessionGameRoom({
  sessionId,
  opponentName,
  playerName,
  playerColor = "w",
}: UseSessionGameRoomOptions) {
  const chessRef = useRef<Chess>(createInitialChess());
  const lastTickRef = useRef<number>(Date.now());
  const opponentMoveTimerRef = useRef<number | null>(null);
  const opponentReplyTimerRef = useRef<number | null>(null);
  const [fen, setFen] = useState(() => chessRef.current.fen());
  const [history, setHistory] = useState<Move[]>(() =>
    chessRef.current.history({ verbose: true }),
  );
  const [turn, setTurn] = useState<Side>(() => chessRef.current.turn() as Side);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    playerColor === "w" ? "white" : "black",
  );
  const [chatMessages, setChatMessages] = useState<GameRoomChatMessage[]>(() => [
    {
      id: createMessageId(),
      author: "system",
      text: `جلسه ${sessionId.slice(0, 8)} آماده شد. اتصال بازی روی همین ساختار فعلی سوار می‌شود.`,
      timestamp: formatTimestamp(),
    },
    {
      id: createMessageId(),
      author: "opponent",
      text: "سلام! بازی خوبی داشته باشیم.",
      timestamp: formatTimestamp(),
    },
  ]);
  const [chatDraft, setChatDraft] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const [clocks, setClocks] = useState(INITIAL_CLOCKS);
  const [settings, setSettings] = useState<GameRoomSettings>({
    showCoordinates: true,
    showLegalMoves: true,
    enableAnimations: true,
  });
  const [manualOutcome, setManualOutcome] = useState<ManualOutcome | null>(null);
  const [outgoingRequest, setOutgoingRequest] =
    useState<OutgoingRequest>(null);
  const [incomingRequest, setIncomingRequest] =
    useState<IncomingRequest>(null);

  const syncBoardState = useCallback(() => {
    const chess = chessRef.current;

    setFen(chess.fen());
    setHistory(chess.history({ verbose: true }));
    setTurn(chess.turn() as Side);
  }, []);

  const appendMessage = useCallback(
    (
      message: Omit<GameRoomChatMessage, "id" | "timestamp">,
      options?: { countAsUnread?: boolean },
    ) => {
      const nextMessage: GameRoomChatMessage = {
        id: createMessageId(),
        timestamp: formatTimestamp(),
        ...message,
      };

      setChatMessages((current) => [...current, nextMessage]);

      if (
        message.author === "opponent" &&
        options?.countAsUnread !== false &&
        !isChatOpen
      ) {
        setUnreadCount((current) => current + 1);
      }
    },
    [isChatOpen],
  );

  const finishGame = useCallback(
    (outcome: ManualOutcome) => {
      if (manualOutcome) {
        return;
      }

      setManualOutcome(outcome);
      setIncomingRequest(null);
      setOutgoingRequest(null);
      setSelectedSquare(null);
      setLegalTargets([]);
      appendMessage(
        {
          author: "system",
          text: outcome.resultLabel,
        },
        { countAsUnread: false },
      );
    },
    [appendMessage, manualOutcome],
  );

  const maybeSpawnIncomingRequest = useCallback(
    (updatedHistory: Move[]) => {
      if (incomingRequest || manualOutcome || updatedHistory.length < 14) {
        return;
      }

      if (updatedHistory.length === 14) {
        setIncomingRequest("draw");
        appendMessage({
          author: "system",
          text: `${opponentName} پیشنهاد تساوی فرستاد.`,
        });
        return;
      }

      if (updatedHistory.length === 18) {
        setIncomingRequest("undo");
        appendMessage({
          author: "system",
          text: `${opponentName} درخواست بازگشت آخرین حرکت را ثبت کرد.`,
        });
      }
    },
    [appendMessage, incomingRequest, manualOutcome, opponentName],
  );

  const maybeScheduleOpponentReply = useCallback(() => {
    if (opponentReplyTimerRef.current) {
      window.clearTimeout(opponentReplyTimerRef.current);
    }

    setIsOpponentTyping(true);

    opponentReplyTimerRef.current = window.setTimeout(() => {
      setIsOpponentTyping(false);
      appendMessage({
        author: "opponent",
        text: getRandomOpponentReply(),
      });
    }, 1200);
  }, [appendMessage]);

  const applyMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      const chess = chessRef.current;

      try {
        chess.move({
          from,
          to,
          promotion,
        });
      } catch {
        return false;
      }

      setSelectedSquare(null);
      setLegalTargets([]);
      setPendingPromotion(null);
      syncBoardState();

      const updatedHistory = chess.history({ verbose: true });

      if (chess.isCheckmate()) {
        finishGame({
          resultLabel:
            chess.turn() === playerColor
              ? "کیش‌ومات. بازی را حریف برد."
              : "کیش‌ومات. شما برنده شدید.",
          winner: chess.turn() === playerColor ? "opponent" : "player",
        });
      } else if (chess.isDraw()) {
        finishGame({
          resultLabel: "بازی با نتیجه مساوی تمام شد.",
          winner: null,
        });
      } else {
        maybeSpawnIncomingRequest(updatedHistory);
      }

      return true;
    },
    [finishGame, maybeSpawnIncomingRequest, playerColor, syncBoardState],
  );

  const resolveMoveIntent = useCallback(
    (from: Square, to: Square) => {
      const chess = chessRef.current;
      const candidateMoves = chess
        .moves({ square: from, verbose: true })
        .filter((move) => move.to === to);

      if (candidateMoves.length === 0) {
        return false;
      }

      if (candidateMoves.some((move) => Boolean(move.promotion))) {
        setPendingPromotion({ from, to });
        return false;
      }

      return applyMove(from, to);
    },
    [applyMove],
  );

  const submitPromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) {
        return;
      }

      applyMove(pendingPromotion.from, pendingPromotion.to, piece);
    },
    [applyMove, pendingPromotion],
  );

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const selectSquare = useCallback(
    (square: Square) => {
      if (manualOutcome || turn !== playerColor) {
        return;
      }

      const chess = chessRef.current;

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalTargets([]);
          return;
        }

        if (legalTargets.includes(square)) {
          resolveMoveIntent(selectedSquare, square);
          return;
        }
      }

      const piece = chess.get(square);
      if (!piece || piece.color !== playerColor) {
        setSelectedSquare(null);
        setLegalTargets([]);
        return;
      }

      const nextTargets = chess
        .moves({ square, verbose: true })
        .map((move) => move.to);

      setSelectedSquare(square);
      setLegalTargets(nextTargets);
    },
    [
      legalTargets,
      manualOutcome,
      playerColor,
      resolveMoveIntent,
      selectedSquare,
      turn,
    ],
  );

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      if (!targetSquare) {
        return false;
      }

      return resolveMoveIntent(sourceSquare as Square, targetSquare as Square);
    },
    [resolveMoveIntent],
  );

  const sendChatMessage = useCallback(() => {
    const message = chatDraft.trim();

    if (!message) {
      return;
    }

    appendMessage({
      author: "player",
      text: message,
    });
    setChatDraft("");
    maybeScheduleOpponentReply();
  }, [appendMessage, chatDraft, maybeScheduleOpponentReply]);

  const flipBoard = useCallback(() => {
    setBoardOrientation((current) =>
      current === "white" ? "black" : "white",
    );
  }, []);

  const resign = useCallback(() => {
    finishGame({
      resultLabel: "شما از بازی انصراف دادید.",
      winner: "opponent",
    });
  }, [finishGame]);

  const offerDraw = useCallback(() => {
    if (manualOutcome || outgoingRequest) {
      return;
    }

    setOutgoingRequest("draw");
    appendMessage({
      author: "system",
      text: "پیشنهاد تساوی شما ارسال شد.",
    });

    window.setTimeout(() => {
      if (manualOutcome) {
        return;
      }

      setOutgoingRequest(null);

      if (history.length >= 16) {
        finishGame({
          resultLabel: `${opponentName} پیشنهاد تساوی را پذیرفت.`,
          winner: null,
        });
        return;
      }

      appendMessage({
        author: "system",
        text: `${opponentName} پیشنهاد تساوی را رد کرد.`,
      });
    }, 1400);
  }, [appendMessage, finishGame, history.length, manualOutcome, opponentName, outgoingRequest]);

  const requestUndo = useCallback(() => {
    if (manualOutcome || outgoingRequest || history.length === 0) {
      return;
    }

    setOutgoingRequest("undo");
    appendMessage({
      author: "system",
      text: "درخواست بازگشت حرکت ارسال شد.",
    });

    window.setTimeout(() => {
      if (manualOutcome) {
        return;
      }

      setOutgoingRequest(null);

      if (history.length > 0) {
        chessRef.current.undo();
        syncBoardState();
        appendMessage({
          author: "system",
          text: `${opponentName} با بازگشت آخرین حرکت موافقت کرد.`,
        });
      }
    }, 1400);
  }, [appendMessage, history.length, manualOutcome, opponentName, outgoingRequest, syncBoardState]);

  const acceptIncomingRequest = useCallback(() => {
    if (!incomingRequest) {
      return;
    }

    if (incomingRequest === "draw") {
      finishGame({
        resultLabel: "بازی با پذیرش تساوی پایان یافت.",
        winner: null,
      });
      return;
    }

    chessRef.current.undo();
    syncBoardState();
    appendMessage({
      author: "system",
      text: "درخواست بازگشت آخرین حرکت پذیرفته شد.",
    });
    setIncomingRequest(null);
  }, [appendMessage, finishGame, incomingRequest, syncBoardState]);

  const rejectIncomingRequest = useCallback(() => {
    if (!incomingRequest) {
      return;
    }

    appendMessage({
      author: "system",
      text:
        incomingRequest === "draw"
          ? "پیشنهاد تساوی رد شد."
          : "درخواست بازگشت حرکت رد شد.",
    });
    setIncomingRequest(null);
  }, [appendMessage, incomingRequest]);

  const setChatOpen = useCallback((value: boolean) => {
    setIsChatOpen(value);
    if (value) {
      setUnreadCount(0);
    }
  }, []);

  const toggleSetting = useCallback((key: keyof GameRoomSettings) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }, []);

  useEffect(() => {
    if (!manualOutcome) {
      return;
    }

    if (opponentMoveTimerRef.current) {
      window.clearTimeout(opponentMoveTimerRef.current);
    }

    if (opponentReplyTimerRef.current) {
      window.clearTimeout(opponentReplyTimerRef.current);
    }
  }, [manualOutcome]);

  useEffect(() => {
    lastTickRef.current = Date.now();
  }, [turn]);

  useEffect(() => {
    if (manualOutcome) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setClocks((current) => {
        const updated = {
          ...current,
          [turn]: current[turn] - delta,
        };

        if (updated[turn] <= 0) {
          window.setTimeout(() => {
            finishGame({
              resultLabel:
                turn === playerColor
                  ? "زمان شما تمام شد."
                  : `زمان ${opponentName} تمام شد.`,
              winner: turn === playerColor ? "opponent" : "player",
            });
          }, 0);

          updated[turn] = 0;
        }

        return updated;
      });
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [finishGame, manualOutcome, opponentName, playerColor, turn]);

  useEffect(() => {
    if (manualOutcome || pendingPromotion || turn === playerColor) {
      return;
    }

    if (opponentMoveTimerRef.current) {
      window.clearTimeout(opponentMoveTimerRef.current);
    }

    opponentMoveTimerRef.current = window.setTimeout(() => {
      const chess = chessRef.current;
      const legalMoves = chess.moves({ verbose: true });

      if (legalMoves.length === 0) {
        return;
      }

      const forcingMoves = legalMoves.filter(
        (move) => move.isCapture() || move.san.includes("+"),
      );
      const preferredPool = forcingMoves.length > 0 ? forcingMoves : legalMoves;
      const chosenMove =
        preferredPool[Math.floor(Math.random() * preferredPool.length)] ??
        preferredPool[0];

      applyMove(
        chosenMove.from,
        chosenMove.to,
        chosenMove.promotion as PieceSymbol | undefined,
      );
    }, 1300);

    return () => {
      if (opponentMoveTimerRef.current) {
        window.clearTimeout(opponentMoveTimerRef.current);
      }
    };
  }, [applyMove, manualOutcome, pendingPromotion, playerColor, turn]);

  useEffect(() => {
    return () => {
      if (opponentMoveTimerRef.current) {
        window.clearTimeout(opponentMoveTimerRef.current);
      }

      if (opponentReplyTimerRef.current) {
        window.clearTimeout(opponentReplyTimerRef.current);
      }
    };
  }, []);

  const movePairs = useMemo<GameRoomMovePair[]>(() => {
    const pairs: GameRoomMovePair[] = [];

    for (let index = 0; index < history.length; index += 2) {
      pairs.push({
        moveNumber: Math.floor(index / 2) + 1,
        white: history[index]?.san ?? null,
        black: history[index + 1]?.san ?? null,
      });
    }

    return pairs;
  }, [history]);

  const currentMoveIndex = history.length - 1;
  const lastMove = history.at(-1) ?? null;
  const checkSquare = useMemo(() => {
    if (!chessRef.current.inCheck()) {
      return null;
    }

    return getKingSquare(chessRef.current, turn);
  }, [fen, turn]);

  const statusLabel = manualOutcome
    ? manualOutcome.resultLabel
    : turn === playerColor
      ? "نوبت شماست"
      : `نوبت ${opponentName} است`;

  const playerStatus =
    manualOutcome?.winner === "player"
      ? "winner"
      : manualOutcome?.winner === "opponent"
        ? "loser"
        : turn === playerColor
          ? "active"
          : "idle";

  const opponentStatus =
    manualOutcome?.winner === "opponent"
      ? "winner"
      : manualOutcome?.winner === "player"
        ? "loser"
        : turn !== playerColor
          ? "active"
          : "idle";

  return {
    boardOrientation,
    chatDraft,
    chatMessages,
    checkSquare,
    clocks,
    currentMoveIndex,
    fen,
    history,
    incomingRequest,
    isChatOpen,
    isOpponentTyping,
    isPlayerTurn: !manualOutcome && turn === playerColor,
    lastMove,
    legalTargets,
    manualOutcome,
    movePairs,
    opponentStatus,
    outgoingRequest,
    pendingPromotion,
    playerColor,
    playerName,
    playerStatus,
    selectedSquare,
    sessionId,
    settings,
    statusLabel,
    turn,
    unreadCount,
    opponentName,
    acceptIncomingRequest,
    cancelPromotion,
    flipBoard,
    offerDraw,
    onPieceDrop,
    rejectIncomingRequest,
    requestUndo,
    resign,
    selectSquare,
    sendChatMessage,
    setChatDraft,
    setChatOpen,
    submitPromotion,
    toggleSetting,
  };
}
