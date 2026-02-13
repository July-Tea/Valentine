import { Button } from "@heroui/button";
import Confetti from "react-confetti";
import { type PointerEvent, useEffect, useRef, useState } from "react";

const noTexts = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "Maybe just a tiny yes?",
  "Come on, don't do this!",
  "I can wait... but can you?",
  "Are you testing me?",
  "Please don't be stubborn!",
  "That button looks tired already.",
  "One yes and we both win.",
  "You're making this dramatic.",
  "Still no? really?",
  "I brought virtual flowers!",
  "I can be extra cute.",
  "Let's pretend you mis-clicked.",
  "Destiny says click yes.",
  "Don't break the algorithm.",
  "Red button is not your friend.",
  "You sure you're sure sure?",
  "No pressure... okay maybe pressure.",
  "We can talk about this.",
  "Negotiation mode: ON.",
  "I promise snacks.",
  "Seriously? again no?",
  "You're too powerful.",
  "My heart has lag now.",
  "This is getting personal.",
  "Be kind to this poor app.",
  "I can do puppy eyes.",
  "One yes, infinite happiness.",
  "Say yes for science.",
  "Say yes for peace.",
  "Say yes for aesthetics.",
  "Say yes for my sanity.",
  "You clicked no how many times?!",
  "Even the red button is shocked.",
  "Are we speedrunning heartbreak?",
  "No button is overheating.",
  "You are relentless.",
  "Okay, now I'm panicking.",
  "This is emotional damage.",
  "Do you enjoy chaos?",
  "Maybe close your eyes and press yes.",
  "I admire your consistency.",
  "You win... maybe?",
  "Please reconsider, captain.",
  "Can we call this a prank?",
  "Be nice to my little heart.",
  "I am on my knees.",
  "This hurts in 4K.",
  "Still no? impossible.",
  "We're entering danger zone.",
  "No no no no no?",
  "Last LAST chance?",
  "Okay this is absurd.",
  "You're built different.",
  "I can't take much more.",
  "System warning: heart critical.",
  "Are you made of ice?",
  "Mercy please!",
  "I'm running out of lines.",
  "You broke me.",
  "You're breaking my heart ;(",
];
const NO_FINAL_TRIGGER_COUNT = 50;

const heartParticles = [
  { left: "8%", delay: "0s", duration: "10s", size: "16px", opacity: 0.55 },
  { left: "18%", delay: "1.2s", duration: "12s", size: "14px", opacity: 0.45 },
  { left: "32%", delay: "3s", duration: "9.5s", size: "20px", opacity: 0.5 },
  { left: "44%", delay: "2s", duration: "11s", size: "15px", opacity: 0.42 },
  { left: "58%", delay: "4.5s", duration: "10.5s", size: "18px", opacity: 0.5 },
  {
    left: "72%",
    delay: "2.6s",
    duration: "12.5s",
    size: "14px",
    opacity: 0.38,
  },
  { left: "86%", delay: "0.8s", duration: "9s", size: "17px", opacity: 0.48 },
];

const CLICK_CONFETTI_CONFIG = {
  // 一次点击触发的 confetti 粒子数量（越大越密）
  numberOfPieces: 12,
  // confetti 下落重力（越大下落越快）
  gravity: 0.24,
  // confetti 生成时长（毫秒，越大持续越久）
  tweenDuration: 320,
  // confetti 水平方向初速度范围
  initialVelocityX: { min: -4, max: 4 },
  // confetti 垂直方向初速度范围（负值表示向上喷）
  initialVelocityY: { min: -10, max: -5 },
  // confetti 爆发源区域大小（像素）
  sourceSize: 5,
  // confetti 彩带宽度（像素）
  ribbonWidth: 6,
  // confetti 彩带高度（像素）
  ribbonHeight: 12,
};
const YES_BUTTON_CONFIG = {
  // 绿色按钮初始宽度（像素）
  baseWidth: 220,
  // 绿色按钮初始高度（像素）
  baseHeight: 56,
  // 每次点击红色按钮后，绿色按钮的放大倍率
  growthFactor: 1.3,
  // 绿色按钮最大放大倍率
  maxScale: 3.3,
  // 桌面端：绿色按钮初始横向偏移（像素，负值表示在屏幕中心左侧）
  baseXOffsetDesktop: -120,
  // 手机端：绿色按钮初始横向偏移（像素，0 表示水平居中）
  baseXOffsetMobile: 0,
  // 桌面端：绿色按钮初始纵向位置（相对屏幕高度比例）
  baseYRatioDesktop: 0.5,
  // 手机端：绿色按钮初始纵向位置（相对屏幕高度比例）
  baseYRatioMobile: 0.56,
  // 绿色按钮距离屏幕边缘的最小安全距离（像素）
  edgePadding: 20,
  // 当绿色按钮快贴边时，向屏幕中心回拉的力度（0~1）
  recenterStrength: 0.38,
};
const NO_MOVE_PROBABILITY_CONFIG = {
  // 红色按钮移动概率下限
  min: 0.6,
  // 红色按钮移动概率上限
  max: 0.9,
  // 点击多少次后接近上限概率
  rampClicks: 14,
  // 概率曲线指数（越大越前缓后陡）
  exponent: 2,
};
const NO_MOVE_RANGE_CONFIG = {
  // 桌面端：红色按钮初始横向偏移（像素，>0 表示在绿色按钮右侧）
  initialOffsetXDesktop: 120,
  // 桌面端：红色按钮初始纵向偏移（像素）
  initialOffsetYDesktop: 0,
  // 手机端：红色按钮初始横向偏移（像素，0 表示水平居中）
  initialOffsetXMobile: 0,
  // 手机端：红色按钮初始纵向偏移（像素，>0 表示在绿色按钮下方）
  initialOffsetYMobile: 120,
  // 红色按钮移动边界安全内边距（像素）
  safePadding: 8,
  // 横向可移动范围系数（0~1，越大范围越大）
  horizontalRangeFactor: 1,
  // 纵向可移动范围系数（0~1，越大范围越大）
  verticalRangeFactor: 1,
};
const NO_COLLISION_CONFIG = {
  // 红绿按钮之间的最小安全间距（像素）
  minGap: 14,
  // 随机寻找不重叠位置时的最大尝试次数
  randomAttempts: 32,
};
const LAYOUT_CONFIG = {
  // 小于该宽度时，按手机端布局（上下排布）
  mobileBreakpoint: 640,
};

type ClickBurst = {
  id: number;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getNoMoveProbability(
  clickCount: number,
  config = NO_MOVE_PROBABILITY_CONFIG,
) {
  const safeMin = clamp(config.min, 0, 1);
  const safeMax = clamp(config.max, safeMin, 1);
  const normalizedClicks = clamp(clickCount / config.rampClicks, 0, 1);
  const easedProgress = Math.pow(normalizedClicks, config.exponent);

  return safeMin + (safeMax - safeMin) * easedProgress;
}

export default function IndexPage() {
  const getInitialNoOffset = () => {
    const isMobileViewport =
      typeof window !== "undefined" &&
      window.innerWidth < LAYOUT_CONFIG.mobileBreakpoint;

    if (isMobileViewport) {
      return {
        x: NO_MOVE_RANGE_CONFIG.initialOffsetXMobile,
        y: NO_MOVE_RANGE_CONFIG.initialOffsetYMobile,
      };
    }

    return {
      x: NO_MOVE_RANGE_CONFIG.initialOffsetXDesktop,
      y: NO_MOVE_RANGE_CONFIG.initialOffsetYDesktop,
    };
  };

  const [noClickCount, setNoClickCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noOffset, setNoOffset] = useState(getInitialNoOffset);
  const [yesOffset, setYesOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [clickBursts, setClickBursts] = useState<ClickBurst[]>([]);

  const noZoneRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLDivElement | null>(null);

  const viewportWidth =
    viewportSize.width ||
    (typeof window !== "undefined" ? window.innerWidth : 390);
  const viewportHeight =
    viewportSize.height ||
    (typeof window !== "undefined" ? window.innerHeight : 844);
  const isMobileLayout = viewportWidth < LAYOUT_CONFIG.mobileBreakpoint;
  const yesBaseXOffset = isMobileLayout
    ? YES_BUTTON_CONFIG.baseXOffsetMobile
    : YES_BUTTON_CONFIG.baseXOffsetDesktop;
  const yesBaseYRatio = isMobileLayout
    ? YES_BUTTON_CONFIG.baseYRatioMobile
    : YES_BUTTON_CONFIG.baseYRatioDesktop;
  const initialNoOffsetX = isMobileLayout
    ? NO_MOVE_RANGE_CONFIG.initialOffsetXMobile
    : NO_MOVE_RANGE_CONFIG.initialOffsetXDesktop;
  const initialNoOffsetY = isMobileLayout
    ? NO_MOVE_RANGE_CONFIG.initialOffsetYMobile
    : NO_MOVE_RANGE_CONFIG.initialOffsetYDesktop;

  const isNoEnding = !accepted && noClickCount >= NO_FINAL_TRIGGER_COUNT;
  const noLabel = noTexts[Math.min(noClickCount, noTexts.length - 1)];
  const getViewportCappedYesScale = (desiredScale: number) => {
    const safeWidth = Math.max(
      viewportWidth - YES_BUTTON_CONFIG.edgePadding * 2,
      1,
    );
    const safeHeight = Math.max(
      viewportHeight - YES_BUTTON_CONFIG.edgePadding * 2,
      1,
    );
    const widthScaleCap = safeWidth / YES_BUTTON_CONFIG.baseWidth;
    const heightScaleCap = safeHeight / YES_BUTTON_CONFIG.baseHeight;
    const reserveNoWidth =
      YES_BUTTON_CONFIG.baseWidth + NO_COLLISION_CONFIG.minGap * 2;
    const reserveNoHeight =
      YES_BUTTON_CONFIG.baseHeight + NO_COLLISION_CONFIG.minGap * 2;
    const horizontalSeparationCap =
      (safeWidth - reserveNoWidth) / YES_BUTTON_CONFIG.baseWidth;
    const verticalSeparationCap =
      (safeHeight - reserveNoHeight) / YES_BUTTON_CONFIG.baseHeight;
    const overlapSafeCap = Math.max(
      0.2,
      Math.max(horizontalSeparationCap, verticalSeparationCap),
    );
    const viewportScaleCap = Math.max(
      0.2,
      Math.min(widthScaleCap, heightScaleCap, overlapSafeCap),
    );

    return Math.min(desiredScale, viewportScaleCap);
  };
  const desiredYesScale = Math.min(
    Math.pow(YES_BUTTON_CONFIG.growthFactor, noClickCount),
    YES_BUTTON_CONFIG.maxScale,
  );
  const yesScale = getViewportCappedYesScale(desiredYesScale);

  const getSafeYesOffset = (
    scale: number,
    currentOffset: { x: number; y: number },
  ) => {
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    const baseCenterX = viewportCenterX + yesBaseXOffset;
    const baseCenterY = viewportHeight * yesBaseYRatio;
    const scaledWidth = YES_BUTTON_CONFIG.baseWidth * scale;
    const scaledHeight = YES_BUTTON_CONFIG.baseHeight * scale;
    const minCenterX = YES_BUTTON_CONFIG.edgePadding + scaledWidth / 2;
    const maxCenterX =
      viewportWidth - YES_BUTTON_CONFIG.edgePadding - scaledWidth / 2;
    const minCenterY = YES_BUTTON_CONFIG.edgePadding + scaledHeight / 2;
    const maxCenterY =
      viewportHeight - YES_BUTTON_CONFIG.edgePadding - scaledHeight / 2;

    const targetCenterX = baseCenterX + currentOffset.x;
    const targetCenterY = baseCenterY + currentOffset.y;
    let safeCenterX = clamp(targetCenterX, minCenterX, maxCenterX);
    let safeCenterY = clamp(targetCenterY, minCenterY, maxCenterY);

    if (targetCenterX !== safeCenterX || targetCenterY !== safeCenterY) {
      safeCenterX +=
        (viewportCenterX - safeCenterX) * YES_BUTTON_CONFIG.recenterStrength;
      safeCenterY +=
        (viewportCenterY - safeCenterY) * YES_BUTTON_CONFIG.recenterStrength;
      safeCenterX = clamp(safeCenterX, minCenterX, maxCenterX);
      safeCenterY = clamp(safeCenterY, minCenterY, maxCenterY);
    }

    return {
      x: safeCenterX - baseCenterX,
      y: safeCenterY - baseCenterY,
    };
  };

  const getNoButtonSize = () => {
    const buttonRect = noButtonRef.current?.getBoundingClientRect();

    return {
      width: buttonRect?.width ?? YES_BUTTON_CONFIG.baseWidth,
      height: buttonRect?.height ?? YES_BUTTON_CONFIG.baseHeight,
    };
  };

  const clampNoOffset = (
    offset: { x: number; y: number },
    bounds: { maxX: number; maxY: number },
  ) => ({
    x: clamp(offset.x, -bounds.maxX, bounds.maxX),
    y: clamp(offset.y, -bounds.maxY, bounds.maxY),
  });

  const isNoOverlappingYes = (
    candidateNoOffset: { x: number; y: number },
    targetYesScale: number,
    targetYesOffset: { x: number; y: number },
  ) => {
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    const yesCenterX = viewportCenterX + yesBaseXOffset + targetYesOffset.x;
    const yesCenterY = viewportHeight * yesBaseYRatio + targetYesOffset.y;
    const noCenterX = viewportCenterX + candidateNoOffset.x;
    const noCenterY = viewportCenterY + candidateNoOffset.y;
    const noSize = getNoButtonSize();
    const yesSize = {
      width: YES_BUTTON_CONFIG.baseWidth * targetYesScale,
      height: YES_BUTTON_CONFIG.baseHeight * targetYesScale,
    };
    const minXDistance =
      (noSize.width + yesSize.width) / 2 + NO_COLLISION_CONFIG.minGap;
    const minYDistance =
      (noSize.height + yesSize.height) / 2 + NO_COLLISION_CONFIG.minGap;

    return (
      Math.abs(noCenterX - yesCenterX) < minXDistance &&
      Math.abs(noCenterY - yesCenterY) < minYDistance
    );
  };

  const pushNoOffsetAwayFromYes = (
    preferredOffset: { x: number; y: number },
    bounds: { maxX: number; maxY: number },
    targetYesScale: number,
    targetYesOffset: { x: number; y: number },
  ) => {
    const clampedPreferred = clampNoOffset(preferredOffset, bounds);

    if (
      !isNoOverlappingYes(clampedPreferred, targetYesScale, targetYesOffset)
    ) {
      return clampedPreferred;
    }

    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    const yesCenterX = viewportCenterX + yesBaseXOffset + targetYesOffset.x;
    const yesCenterY = viewportHeight * yesBaseYRatio + targetYesOffset.y;
    const noSize = getNoButtonSize();
    const yesSize = {
      width: YES_BUTTON_CONFIG.baseWidth * targetYesScale,
      height: YES_BUTTON_CONFIG.baseHeight * targetYesScale,
    };
    const requiredX =
      (noSize.width + yesSize.width) / 2 + NO_COLLISION_CONFIG.minGap;
    const requiredY =
      (noSize.height + yesSize.height) / 2 + NO_COLLISION_CONFIG.minGap;
    const candidates = [
      { x: yesCenterX + requiredX - viewportCenterX, y: clampedPreferred.y },
      { x: yesCenterX - requiredX - viewportCenterX, y: clampedPreferred.y },
      { x: clampedPreferred.x, y: yesCenterY + requiredY - viewportCenterY },
      { x: clampedPreferred.x, y: yesCenterY - requiredY - viewportCenterY },
    ];

    for (const candidate of candidates) {
      const clampedCandidate = clampNoOffset(candidate, bounds);

      if (
        !isNoOverlappingYes(clampedCandidate, targetYesScale, targetYesOffset)
      ) {
        return clampedCandidate;
      }
    }

    return clampedPreferred;
  };

  const findRandomNoOffset = (
    bounds: { maxX: number; maxY: number },
    targetYesScale: number,
    targetYesOffset: { x: number; y: number },
    fallbackOffset: { x: number; y: number },
  ) => {
    for (
      let index = 0;
      index < NO_COLLISION_CONFIG.randomAttempts;
      index += 1
    ) {
      const candidate = {
        x: (Math.random() * 2 - 1) * bounds.maxX,
        y: (Math.random() * 2 - 1) * bounds.maxY,
      };

      if (!isNoOverlappingYes(candidate, targetYesScale, targetYesOffset)) {
        return candidate;
      }
    }

    return fallbackOffset;
  };

  const getNoBounds = () => {
    const zoneElement = noZoneRef.current;
    const buttonElement = noButtonRef.current;

    if (!zoneElement || !buttonElement) {
      return { maxX: 0, maxY: 0 };
    }

    const zoneRect = zoneElement.getBoundingClientRect();
    const buttonRect = buttonElement.getBoundingClientRect();
    const padding = NO_MOVE_RANGE_CONFIG.safePadding;
    const horizontalFactor = clamp(
      NO_MOVE_RANGE_CONFIG.horizontalRangeFactor,
      0,
      1,
    );
    const verticalFactor = clamp(
      NO_MOVE_RANGE_CONFIG.verticalRangeFactor,
      0,
      1,
    );
    const rawMaxX = Math.max(
      (zoneRect.width - buttonRect.width) / 2 - padding,
      0,
    );
    const rawMaxY = Math.max(
      (zoneRect.height - buttonRect.height) / 2 - padding,
      0,
    );

    return {
      maxX: rawMaxX * horizontalFactor,
      maxY: rawMaxY * verticalFactor,
    };
  };

  useEffect(() => {
    const handleResize = () => {
      const bounds = getNoBounds();

      setNoOffset((currentOffset) =>
        pushNoOffsetAwayFromYes(currentOffset, bounds, yesScale, yesOffset),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [noClickCount, yesScale, yesOffset.x, yesOffset.y]);

  useEffect(() => {
    if (noClickCount !== 0) {
      return;
    }

    setYesOffset({ x: 0, y: 0 });
    setNoOffset({ x: initialNoOffsetX, y: initialNoOffsetY });
  }, [isMobileLayout, noClickCount, initialNoOffsetX, initialNoOffsetY]);

  useEffect(() => {
    setYesOffset((currentOffset) => {
      const nextOffset = getSafeYesOffset(yesScale, currentOffset);

      if (
        Math.abs(nextOffset.x - currentOffset.x) < 0.5 &&
        Math.abs(nextOffset.y - currentOffset.y) < 0.5
      ) {
        return currentOffset;
      }

      return nextOffset;
    });
  }, [yesScale, viewportSize.width, viewportSize.height]);

  const handleNoPress = () => {
    if (accepted || isNoEnding) {
      return;
    }

    const nextClickCount = noClickCount + 1;
    const moveProbability = getNoMoveProbability(nextClickCount);
    const nextDesiredYesScale = Math.min(
      Math.pow(YES_BUTTON_CONFIG.growthFactor, nextClickCount),
      YES_BUTTON_CONFIG.maxScale,
    );
    const nextYesScale = getViewportCappedYesScale(nextDesiredYesScale);
    const nextYesOffset = getSafeYesOffset(nextYesScale, yesOffset);
    const bounds = getNoBounds();

    setNoClickCount(nextClickCount);

    if (nextClickCount >= NO_FINAL_TRIGGER_COUNT) {
      return;
    }

    setYesOffset(nextYesOffset);
    setNoOffset((currentOffset) => {
      const safeCurrent = pushNoOffsetAwayFromYes(
        currentOffset,
        bounds,
        nextYesScale,
        nextYesOffset,
      );

      if (Math.random() >= moveProbability) {
        return safeCurrent;
      }

      return findRandomNoOffset(
        bounds,
        nextYesScale,
        nextYesOffset,
        safeCurrent,
      );
    });
  };

  const rootBackground = isNoEnding
    ? "bg-[linear-gradient(135deg,#d4e0f5,#b9cbe6,#9db6d9,#87a5cf)]"
    : accepted
      ? "bg-[linear-gradient(135deg,#ffc1e3,#ffd4ea,#ffe0f2,#ffd8ea)]"
      : "bg-[linear-gradient(135deg,#ffd1dc,#ffe0e8,#ffe6f2,#ffd9ec)]";
  const rootAnimationClass = isNoEnding
    ? ""
    : "animate-valentine-gradient bg-[length:220%_220%]";

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  const handleAcceptedScreenPointerDown = (
    event: PointerEvent<HTMLElement>,
  ) => {
    if (!accepted) {
      return;
    }

    const newBurst = {
      id: Date.now() + Math.random(),
      x: event.clientX,
      y: event.clientY,
    };

    setClickBursts((bursts) => [...bursts, newBurst]);
  };

  return (
    <section
      className={`relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 ${rootBackground} ${rootAnimationClass}`}
      onPointerDown={handleAcceptedScreenPointerDown}
    >
      {accepted
        ? clickBursts.map((burst) => (
            <Confetti
              key={burst.id}
              className="pointer-events-none z-[2]"
              confettiSource={{
                x: burst.x - CLICK_CONFETTI_CONFIG.sourceSize / 2,
                y: burst.y - CLICK_CONFETTI_CONFIG.sourceSize / 2,
                w: CLICK_CONFETTI_CONFIG.sourceSize,
                h: CLICK_CONFETTI_CONFIG.sourceSize,
              }}
              gravity={CLICK_CONFETTI_CONFIG.gravity}
              height={viewportSize.height}
              initialVelocityX={CLICK_CONFETTI_CONFIG.initialVelocityX}
              initialVelocityY={CLICK_CONFETTI_CONFIG.initialVelocityY}
              numberOfPieces={CLICK_CONFETTI_CONFIG.numberOfPieces}
              recycle={false}
              tweenDuration={CLICK_CONFETTI_CONFIG.tweenDuration}
              width={viewportSize.width}
              drawShape={(ctx) => {
                ctx.fillRect(
                  -CLICK_CONFETTI_CONFIG.ribbonWidth / 2,
                  -CLICK_CONFETTI_CONFIG.ribbonHeight / 2,
                  CLICK_CONFETTI_CONFIG.ribbonWidth,
                  CLICK_CONFETTI_CONFIG.ribbonHeight,
                );
              }}
              onConfettiComplete={() => {
                setClickBursts((bursts) =>
                  bursts.filter((item) => item.id !== burst.id),
                );
              }}
            />
          ))
        : null}

      {!isNoEnding ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {heartParticles.map((particle) => (
            <span
              key={particle.left}
              className="heart-fall"
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                fontSize: particle.size,
                opacity: particle.opacity,
              }}
            >
              ❤
            </span>
          ))}
        </div>
      ) : null}

      {accepted ? (
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h1 className="animate-pop-in text-4xl font-black tracking-tight text-[#c6285c] sm:text-5xl md:text-6xl">
            I knew it! ❤️
          </h1>
        </div>
      ) : isNoEnding ? (
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h1 className="animate-pop-in text-4xl font-black tracking-tight text-[#2f4f6f] sm:text-5xl md:text-6xl">
            Nooooo😭
          </h1>
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute left-1/2 top-8 z-40 w-full max-w-5xl -translate-x-1/2 px-4 text-center sm:top-12">
            <h1 className="text-4xl font-black tracking-tight text-[#d32f2f] sm:text-5xl md:text-6xl">
              Will you be my Valentine?
            </h1>
          </div>

          <div
            ref={noZoneRef}
            className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
          >
            <div
              ref={noButtonRef}
              className="pointer-events-auto absolute left-1/2 top-1/2 max-w-[min(92vw,320px)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${YES_BUTTON_CONFIG.baseWidth}px`,
                transform: `translate(calc(-50% + ${noOffset.x}px), calc(-50% + ${noOffset.y}px))`,
              }}
            >
              <Button
                className="h-auto min-h-14 w-full whitespace-normal break-words px-4 py-2 text-base leading-snug sm:text-lg"
                color="danger"
                size="lg"
                variant="solid"
                onPress={handleNoPress}
              >
                {noLabel}
              </Button>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 z-30 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              top: `${yesBaseYRatio * 100}%`,
              transform: `translate(calc(-50% + ${yesBaseXOffset + yesOffset.x}px), calc(-50% + ${yesOffset.y}px))`,
            }}
          >
            <Button
              className="yes-bouncy pointer-events-auto h-14 max-w-full px-6 text-lg font-bold sm:text-xl"
              color="success"
              size="lg"
              style={{
                width: `${YES_BUTTON_CONFIG.baseWidth}px`,
                transform: `scale(${yesScale})`,
                transformOrigin: "center center",
              }}
              onPress={() => {
                setAccepted(true);
              }}
            >
              Yes
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
