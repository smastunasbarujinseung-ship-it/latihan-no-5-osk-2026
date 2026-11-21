import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  block?: boolean;
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'inline-math'; content: string }
  | { type: 'block-math'; content: string };

function tokenizeMath(input: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    if (input[i] === '$' && input[i + 1] === '$') {
      const end = input.indexOf('$$', i + 2);
      if (end !== -1) {
        segments.push({ type: 'block-math', content: input.slice(i + 2, end).trim() });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === '$') {
      let end = i + 1;
      while (end < n) {
        if (input[end] === '$' && input[end - 1] !== '\\') {
          break;
        }
        end += 1;
      }
      if (end < n && input[end] === '$') {
        segments.push({ type: 'inline-math', content: input.slice(i + 1, end).trim() });
        i = end + 1;
        continue;
      }
    }
    const nextDollar = input.indexOf('$', i + 1);
    if (nextDollar === -1) {
      segments.push({ type: 'text', content: input.slice(i) });
      break;
    }
    segments.push({ type: 'text', content: input.slice(i, nextDollar) });
    i = nextDollar;
  }

  return segments;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', block = false }) => {
  const rendered = useMemo(() => {
    if (block) {
      try {
        return katex.renderToString(text, { displayMode: true, throwOnError: false });
      } catch {
        return text;
      }
    }
    return tokenizeMath(text);
  }, [text, block]);

  if (block && typeof rendered === 'string') {
    return (
      <div
        className={`overflow-x-auto py-1 ${className}`}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  }

  const segments = rendered as Segment[];
  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        }
        const html = katex.renderToString(seg.content, {
          displayMode: seg.type === 'block-math',
          throwOnError: false,
        });
        if (seg.type === 'block-math') {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};
