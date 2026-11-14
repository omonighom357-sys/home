import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  baseDelay?: number;
  charStep?: number;
  duration?: number;
  className?: string;
  wordClassName?: string;
  align?: 'center' | 'left';
  mode?: 'mount' | 'inView';
}

/**
 * Word-safe, screen-reader-accessible character reveal component.
 * Wraps every word in an `inline-flex whitespace-nowrap` container so individual
 * letters never split across lines even on narrow 320px viewports.
 */
export function AnimatedText({
  text,
  as: Tag = 'span',
  baseDelay = 0,
  charStep = 0.04,
  duration = 0.55,
  className = '',
  wordClassName = '',
  align = 'center',
  mode = 'mount',
}: AnimatedTextProps) {
  const words = text.split(' ');
  let runningCharIndex = 0;

  const justifyClass = align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <Tag className={`relative block ${className}`}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={`flex flex-wrap items-baseline gap-x-[0.32em] gap-y-[0.12em] ${justifyClass}`}
      >
        {words.map((word, wordIdx) => {
          const chars = Array.from(word);
          const wordStartIdx = runningCharIndex;
          runningCharIndex += chars.length + 1;

          return (
            <span
              key={`${word}-${wordIdx}`}
              className={`inline-flex whitespace-nowrap ${wordClassName}`}
            >
              {chars.map((char, charIdx) => {
                const delay = baseDelay + (wordStartIdx + charIdx) * charStep;
                const animateProps = { opacity: 1, y: 0, filter: 'blur(0px)' };

                return (
                  <motion.span
                    key={`${wordIdx}-${charIdx}-${char}`}
                    initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                    animate={mode === 'mount' ? animateProps : undefined}
                    whileInView={mode === 'inView' ? animateProps : undefined}
                    viewport={mode === 'inView' ? { once: true, amount: 0.4 } : undefined}
                    transition={{
                      duration,
                      delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block will-change-transform"
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
