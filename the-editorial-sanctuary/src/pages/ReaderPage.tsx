import { useState } from "react";
import { ChevronLeft, Globe, LayoutGrid, Share2 } from "lucide-react";
import BookDownloadButton from "../components/BookDownloadButton";
import type { AppPage } from "../types/navigation";

export default function ReaderPage({
  setPage,
  readerTitle,
  readerBookId,
  readerFormat,
  readerUrl,
}: {
  setPage: (p: AppPage) => void;
  readerTitle: string;
  readerBookId?: string;
  readerFormat?: string;
  readerUrl?: string;
}) {
  const [activeChapter, setActiveChapter] = useState("Chapter III: The Party");
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [layout, setLayout] = useState<"spread" | "single">("spread");
  const [shareMessage, setShareMessage] = useState("");

  const readerShellClass =
    theme === "dark"
      ? "bg-[#171513] text-[#f7f2e7]"
      : theme === "sepia"
        ? "bg-[#f4ecd8] text-[#3b2d23]"
        : "bg-surface-container-low text-on-surface";

  const textScaleClass =
    textSize === "sm" ? "text-base leading-7" : textSize === "lg" ? "text-xl leading-9" : "text-lg leading-8";

  const chapterLabel = activeChapter;
  const isFlipbook = (readerFormat ?? '').toLowerCase() === 'flipbook';

  const handleOpenFlipbook = () => {
    if (!readerUrl) return;
    window.open(readerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    try {
      const payload = `${readerTitle} - ${window.location.href}`;
      await navigator.clipboard.writeText(payload);
      setShareMessage("Reader link copied to clipboard.");
    } catch {
      setShareMessage("Copy the current URL to share this reader session.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${readerShellClass}`}>
      <nav className="bg-white/90 border-b border-outline-variant/15 px-8 py-4 flex justify-between items-center backdrop-blur-md">
        <button
          type="button"
          onClick={() => setPage("personal-library")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Shelf
        </button>
        <div className="text-center space-y-1">
          <h2 className="font-headline text-2xl text-primary italic">{readerTitle}</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{isFlipbook ? 'Flipbook Reader' : chapterLabel}</p>
        </div>
        <div className="flex items-center gap-4">
          {isFlipbook && readerUrl ? (
            <button
              type="button"
              onClick={handleOpenFlipbook}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              title="Open the flipbook URL"
            >
              <Globe className="w-4 h-4" /> Open Flipbook
            </button>
          ) : readerBookId ? (
            <BookDownloadButton bookId={readerBookId} filename={`${readerTitle}.${isFlipbook ? 'epub' : 'pdf'}`} size="sm" />
          ) : (
            <button
              type="button"
              className="bg-primary text-on-primary px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-60"
              disabled
              title="No downloadable title is currently selected"
            >
              <Globe className="w-4 h-4" /> {isFlipbook ? 'Open Flipbook' : 'Download Offline'}
            </button>
          )}
          <button type="button" onClick={() => setLayout((current) => (current === "spread" ? "single" : "spread"))} className={`p-2 rounded-lg ${layout === "single" ? "text-primary bg-surface-container-low" : "text-on-surface-variant hover:text-primary"}`}>
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button type="button" onClick={handleShare} className="p-2 text-on-surface-variant hover:text-primary" title="Copy share link">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {shareMessage ? (
        <div className="px-8 pt-4 text-sm text-on-surface-variant">{shareMessage}</div>
      ) : null}

      <div className="flex-grow flex">
        <aside className="w-80 border-r border-outline-variant/15 p-12 space-y-12 bg-white/50 backdrop-blur-md">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contents</h4>
            <ul className="space-y-4">
              {[
                "Prologue",
                "Chapter I: The Arrival",
                "Chapter II: The Valley of Ashes",
                "Chapter III: The Party",
                "Chapter IV: Gatsby's Story",
                "Chapter V: The Reunion",
              ].map((chapter, i) => (
                <li
                  key={chapter}
                  className={`text-sm cursor-pointer transition-colors ${chapter === activeChapter ? "text-primary font-bold border-l-2 border-primary pl-4 -ml-4" : "text-on-surface-variant hover:text-primary"}`}
                  onClick={() => setActiveChapter(chapter)}
                >
                  {chapter}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8 pt-12 border-t border-outline-variant/15">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Typography</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Size</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTextSize("sm")} className={`w-8 h-8 rounded-full flex items-center justify-center ${textSize === "sm" ? "bg-primary text-on-primary" : "bg-surface-container-high text-xs"}`}>A</button>
                  <button type="button" onClick={() => setTextSize("md")} className={`w-8 h-8 rounded-full flex items-center justify-center ${textSize === "md" ? "bg-primary text-on-primary text-sm" : "bg-surface-container-high text-xs"}`}>A</button>
                  <button type="button" onClick={() => setTextSize("lg")} className={`w-8 h-8 rounded-full flex items-center justify-center ${textSize === "lg" ? "bg-primary text-on-primary text-lg" : "bg-surface-container-high text-lg"}`}>A</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Theme</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTheme("light")} className={`w-6 h-6 rounded-full border border-outline-variant ${theme === "light" ? "ring-2 ring-primary" : ""} bg-white`} />
                  <button type="button" onClick={() => setTheme("sepia")} className={`w-6 h-6 rounded-full border border-outline-variant ${theme === "sepia" ? "ring-2 ring-primary" : ""} bg-[#f4ecd8]`} />
                  <button type="button" onClick={() => setTheme("dark")} className={`w-6 h-6 rounded-full border border-outline-variant ${theme === "dark" ? "ring-2 ring-primary" : ""} bg-[#1c1c19]`} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className={`flex-grow p-12 flex flex-col items-center justify-center relative overflow-hidden ${layout === "single" ? "max-w-5xl mx-auto" : ""}`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-transparent" />
          </div>

          <div className={`max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden relative ${layout === "single" ? "grid grid-cols-1" : "aspect-[1.4/1] flex"}`}>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/10 z-10" />

            <div className={`${layout === "single" ? "w-full" : "w-1/2"} p-16 space-y-8 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-200 via-transparent to-transparent" />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                <span>THE GREAT GATSBY • F. SCOTT FITZGERALD</span>
              </div>
              <div className={`space-y-6 relative ${textScaleClass}`}>
                <p className="leading-relaxed text-on-surface indent-8">
                  <span className="text-6xl font-headline text-primary float-left mr-4 mt-2 italic">I</span>
                  n my younger and more vulnerable years my father gave me some advice that I&apos;ve been turning over in my mind ever since.
                </p>
                <p className="leading-relaxed text-on-surface">
                  &quot;Whenever you feel like criticizing any one,&quot; he told me, &quot;just remember that all the people in this world haven&apos;t had the advantages that you&apos;ve had.&quot;
                </p>
                <p className="leading-relaxed text-on-surface">
                  He didn&apos;t say any more, but we&apos;ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I&apos;m inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.
                </p>
                <p className="leading-relaxed text-on-surface">
                  The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.
                </p>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold italic text-on-surface-variant/50">42</div>
            </div>

            <div className={`${layout === "single" ? "w-full border-t border-outline-variant/10" : "w-1/2"} p-16 space-y-8 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-200 via-transparent to-transparent" />
              </div>
              <div className="flex justify-end text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                <span>CHAPTER III</span>
              </div>
              <div className={`space-y-6 relative ${textScaleClass}`}>
                <p className="leading-relaxed text-on-surface">
                  Most of the confidences were unsought—frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon; for the intimate revelations of young men, or at least the terms in which they express them, are usually plagiaristic and marred by obvious suppressions.
                </p>
                <p className="leading-relaxed text-on-surface">
                  Reserving judgments is a matter of infinite hope. I am still a little afraid of missing something if I forget that, as my father snobbishly suggested, and I snobbishly repeat, a sense of the fundamental decencies is parcelled out unequally at birth.
                </p>
                <p className="leading-relaxed text-on-surface">
                  And, after boasting this way of my tolerance, I come to the admission that it has a limit. Conduct may be founded on the hard rock or the wet marshes, but after a certain point I don&apos;t care what it&apos;s founded on.
                </p>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold italic text-on-surface-variant/50">43</div>
            </div>
          </div>

          <div className="max-w-5xl w-full mt-12 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Reading Progress</p>
                <p className="font-headline text-2xl text-primary italic">18% Complete • {chapterLabel}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Approx. 4h 12m Left</p>
            </div>
            <div className="h-1 w-full bg-secondary-container rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "18%" }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
