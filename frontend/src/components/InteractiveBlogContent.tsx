import React, { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

import { CanvasSandboxWidget } from './CanvasSandboxWidget';
import { AnimatedArchitectureVisualizer } from './AnimatedArchitectureVisualizer';
import { IconX } from '@tabler/icons-react';

interface InteractiveBlogContentProps {
  html: string;
}

export const InteractiveBlogContent: React.FC<InteractiveBlogContentProps> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      Prism.highlightAllUnder(containerRef.current);
    }
  }, [html]);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Pre-process HTML string to extract shortcodes or replace tags
  const processContent = () => {
    if (!html) return '';

    let content = html;

    // Convert shortcodes like [WIDGET:CANVAS_SANDBOX] into data attributes
    content = content.replace(/\[WIDGET:CANVAS_SANDBOX\]/gi, '<div data-widget="canvas-sandbox"></div>');
    content = content.replace(/\[WIDGET:ARCHITECTURE_VISUALIZER\]/gi, '<div data-widget="architecture-visualizer"></div>');

    return content;
  };

  const formattedHtml = processContent();

  // Helper to split HTML string around interactive widget markers
  const renderSections = () => {
    const parts = formattedHtml.split(/(<div data-widget="(?:canvas-sandbox|architecture-visualizer)"><\/div>)/gi);

    return parts.map((part, index) => {
      if (part.includes('data-widget="canvas-sandbox"')) {
        return <CanvasSandboxWidget key={`widget-canvas-${index}`} />;
      }
      if (part.includes('data-widget="architecture-visualizer"')) {
        return <AnimatedArchitectureVisualizer key={`widget-arch-${index}`} />;
      }

      return (
        <HTMLSegment
          key={`segment-${index}`}
          htmlContent={part}
          onImageClick={(src, alt) => setSelectedImage({ src, alt })}
          onCopyCode={handleCopyCode}
          copiedIndex={copiedCodeIndex}
        />
      );
    });
  };

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-4 text-slate-800 dark:text-slate-200 leading-relaxed font-sans" ref={containerRef}>
      {renderSections()}

      {/* Image / GIF Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-slate-800 hover:bg-slate-700 rounded-full transition shadow-lg"
              title="Close Preview"
            >
              <IconX size={24} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border border-slate-700 bg-slate-950"
            />
            {selectedImage.alt && (
              <p className="mt-3 text-center text-slate-300 font-medium text-sm bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
                {selectedImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface HTMLSegmentProps {
  htmlContent: string;
  onImageClick: (src: string, alt: string) => void;
  onCopyCode: (codeText: string, index: number) => void;
  copiedIndex: number | null;
}

const HTMLSegment: React.FC<HTMLSegmentProps> = ({ htmlContent, onImageClick, onCopyCode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Process standard images and GIFs for responsive lightbox zoom
    const imgs = containerRef.current.querySelectorAll('img');
    imgs.forEach((img) => {
      img.classList.add('rounded-xl', 'shadow-lg', 'my-4', 'cursor-zoom-in', 'hover:scale-[1.01]', 'transition-all', 'duration-300', 'border', 'border-slate-700/50');
      img.onclick = () => {
        onImageClick(img.src, img.alt || 'Blog Media Preview');
      };
    });

    // 2. Enhance code blocks with copy buttons and styling
    const preBlocks = containerRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre, idx) => {
      if (pre.querySelector('.code-wrapper-btn')) return; // Already enhanced

      pre.classList.add('relative', 'group', 'my-6', 'rounded-xl', 'overflow-hidden', 'bg-slate-900', 'border', 'border-slate-800');

      const codeElem = pre.querySelector('code');
      const codeText = codeElem ? codeElem.innerText : pre.innerText;

      // Extract language if available
      const langMatch = pre.className.match(/language-(\w+)/) || (codeElem && codeElem.className.match(/language-(\w+)/));
      const language = langMatch ? langMatch[1] : 'code';

      // Create header bar for code block
      const headerDiv = document.createElement('div');
      headerDiv.className = 'flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 font-mono select-none';
      headerDiv.innerHTML = `
        <span class="text-amber-400 font-semibold uppercase tracking-wider">${language}</span>
        <button class="code-copy-btn flex items-center gap-1 hover:text-white transition px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700">
          <span>Copy</span>
        </button>
      `;

      pre.insertBefore(headerDiv, pre.firstChild);

      const copyBtn = headerDiv.querySelector('.code-copy-btn');
      if (copyBtn) {
        (copyBtn as HTMLElement).onclick = (e) => {
          e.stopPropagation();
          onCopyCode(codeText, idx);
          copyBtn.innerHTML = '<span class="text-emerald-400">Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>';
          }, 2000);
        };
      }
    });

    // 3. Convert GitHub-style Blockquotes/Alerts
    const blockquotes = containerRef.current.querySelectorAll('blockquote');
    blockquotes.forEach((bq) => {
      const text = bq.innerText.trim();
      if (text.startsWith('[NOTE]') || text.startsWith('[TIP]') || text.startsWith('[DEEP DIVE]') || text.startsWith('[WARNING]')) {
        let bgClass = 'bg-blue-950/40 border-blue-500/60 text-blue-200';
        let title = 'Note';

        if (text.startsWith('[TIP]')) {
          bgClass = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
          title = 'Pro Tip';
        } else if (text.startsWith('[DEEP DIVE]')) {
          bgClass = 'bg-purple-950/40 border-purple-500/60 text-purple-200';
          title = 'Architecture Deep Dive';
        } else if (text.startsWith('[WARNING]')) {
          bgClass = 'bg-amber-950/40 border-amber-500/60 text-amber-200';
          title = 'Warning';
        }

        const cleanText = text.replace(/^\[(NOTE|TIP|DEEP DIVE|WARNING)\]/i, '').trim();
        bq.className = `my-6 p-4 rounded-xl border-l-4 shadow-md ${bgClass} font-sans leading-relaxed`;
        bq.innerHTML = `
          <div class="flex items-center gap-2 font-bold mb-1 text-sm uppercase tracking-wide">
            <span>${title}</span>
          </div>
          <div>${cleanText}</div>
        `;
      }
    });
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="prose dark:prose-invert max-w-none prose-img:mx-auto prose-pre:p-0 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-blue-500"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
