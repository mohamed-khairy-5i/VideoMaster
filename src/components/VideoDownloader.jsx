import { useState, useRef, useEffect, useCallback } from 'react';
import {
  LinkIcon,
  SpinnerIcon,
  WarningCircleIcon,
  DownloadSimpleIcon,
  MusicNotesIcon,
  FilmSlateIcon,
  ClipboardTextIcon,
  XIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CpuIcon,
} from '@phosphor-icons/react';
import {
  extractVideo, buildDownloadOptions, saveDirect, formatDuration,
  formatBytes, formatCount, detectPlatform, looksLikeUrl, APIError,
} from '../utils/api';
import { muxVideoAudio, saveBlob, canMuxSafely } from '../utils/muxer';

const PLATFORM_LABEL = {
  youtube: 'YouTube', tiktok: 'TikTok',
  reddit: 'Reddit', twitter: 'Twitter / X',
};

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [info, setInfo] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null); // { id, progress, message }
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  const platformGuess = detectPlatform(url);

  useEffect(() => () => abortRef.current?.abort(), []);

  /*
   * PWA share target. manifest.json declares that the installed app accepts a
   * shared link, which lands here as /?url=... (Android sometimes puts the link
   * in `text` instead, so both are checked). Nothing read those params before,
   * so sharing a video into the installed app opened an empty box: the manifest
   * was promising a feature that did not exist.
   *
   * Runs once on mount. The param is stripped afterwards with replaceState so a
   * refresh does not re-trigger the fetch and the URL stays clean.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('url') || params.get('text');
    if (!shared) return;

    const candidate = shared.trim();
    if (!looksLikeUrl(candidate)) return;

    setUrl(candidate);
    analyse(candidate);
    window.history.replaceState({}, '', window.location.pathname);
    // Mount-only on purpose: `analyse` is recreated on every url change, and
    // depending on it here would re-run the shared-link fetch as the user types.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyse = useCallback(
    async (rawUrl) => {
      const target = rawUrl ?? url;
      if (!looksLikeUrl(target)) {
        setError({ message: 'الرجاء لصق رابط فيديو صالح', code: 'INVALID_URL' });
        setStatus('error');
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus('loading');
      setError(null);
      setInfo(null);
      setOptions([]);

      try {
        const data = await extractVideo(target, { signal: controller.signal });
        setInfo(data);
        setOptions(buildDownloadOptions(data));
        setStatus('ready');
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError({
          message: e.message || 'تعذّر تحليل الفيديو',
          code: e instanceof APIError ? e.code : 'UNKNOWN',
        });
        setStatus('error');
      }
    },
    [url]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    analyse();
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        analyse(text);
      }
    } catch {
      inputRef.current?.focus(); // clipboard blocked, let the user paste manually
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setUrl('');
    setInfo(null);
    setOptions([]);
    setError(null);
    setJob(null);
    setStatus('idle');
    inputRef.current?.focus();
  };

  /** Instant options download straight through the proxy; merged ones run locally. */
  const handleDownload = async (opt) => {
    if (opt.instant) {
      saveDirect(opt.downloadUrl);
      return;
    }

    if (!canMuxSafely(opt.filesize)) {
      setJob({
        id: opt.id,
        progress: 0,
        message: 'هذا الملف كبير جدًا للدمج على هذا الجهاز. اختر جودة أقل أو استخدم حاسوبًا.',
        failed: true,
      });
      return;
    }

    setJob({ id: opt.id, progress: 0, message: 'جاري التحضير' });
    try {
      const blob = await muxVideoAudio({
        videoUrl: opt.videoUrl,
        audioUrl: opt.audioUrl,
        onProgress: (p) => setJob((j) => (j?.id === opt.id ? { ...j, progress: Math.round(p) } : j)),
        onStatus: (m) => setJob((j) => (j?.id === opt.id ? { ...j, message: m } : j)),
      });
      const name = `${(info.title || 'video').replace(/[\\/:*?"<>|]/g, '')}_${opt.label}.mp4`;
      saveBlob(blob, name);
      setJob({ id: opt.id, progress: 100, message: 'تم الحفظ', done: true });
      setTimeout(() => setJob((j) => (j?.id === opt.id ? null : j)), 4000);
    } catch (e) {
      setJob({ id: opt.id, progress: 0, message: e.message || 'فشل الدمج', failed: true });
    }
  };

  const videoOptions = options.filter((o) => o.kind === 'video');
  const audioOptions = options.filter((o) => o.kind === 'audio');

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-0" id="downloader">
      <form onSubmit={onSubmit}>
        <div
          className={`flex items-center gap-2 rounded-panel border bg-surface-raised p-2 shadow-raised transition
            ${status === 'error' ? 'border-danger/50' : 'border-line focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/12'}`}
        >
          <LinkIcon size={18} className="ms-2 shrink-0 text-content-subtle" aria-hidden />

          {/*
            dir="ltr" on the input only: URLs are left-to-right even inside an
            RTL page, and without it the cursor and any pasted link render
            scrambled for Arabic users.
          */}
          <input
            ref={inputRef}
            type="text"
            inputMode="url"
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            aria-label="رابط الفيديو"
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? 'dl-error' : undefined}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-start text-content outline-none"
          />

          {url ? (
            <button
              type="button"
              onClick={reset}
              aria-label="مسح الرابط"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-control text-content-subtle
                         transition hover:bg-surface-sunken hover:text-content active:translate-y-px"
            >
              <XIcon size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="hidden shrink-0 items-center gap-1.5 rounded-control px-3 py-2 text-sm
                         text-content-muted transition hover:bg-surface-sunken active:translate-y-px sm:flex"
            >
              <ClipboardTextIcon size={16} />
              لصق
            </button>
          )}

          <button type="submit" disabled={status === 'loading' || !url} className="btn-primary shrink-0">
            {status === 'loading' ? (
              <>
                <SpinnerIcon size={16} className="animate-spin" />
                <span className="hidden sm:inline">جاري التحليل</span>
              </>
            ) : (
              <>
                <DownloadSimpleIcon size={16} weight="bold" />
                تحليل
              </>
            )}
          </button>
        </div>

        {/* aria-live so a screen reader announces the detection without focus moving. */}
        <p aria-live="polite" className="min-h-[1.5rem]">
          {platformGuess && status === 'idle' && (
            <span className="mt-2 flex items-center gap-1.5 text-sm text-content-muted">
              <CheckCircleIcon size={15} weight="fill" className="text-accent" />
              تم التعرّف على {PLATFORM_LABEL[platformGuess]}
            </span>
          )}
        </p>
      </form>

      {status === 'error' && error && (
        <div
          id="dl-error"
          role="alert"
          className="mt-2 flex items-start gap-3 rounded-card border border-danger/25 bg-danger-soft p-4"
        >
          <WarningCircleIcon size={20} className="mt-0.5 shrink-0 text-danger" />
          <div className="min-w-0">
            <p className="font-medium text-danger-soft-fg">{error.message}</p>
            {error.code === 'UNSUPPORTED_PLATFORM' && (
              <p className="mt-1 text-sm text-danger-soft-fg/80">
                المنصات المدعومة: {Object.values(PLATFORM_LABEL).join('، ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Skeleton matches the result card's shape, so nothing shifts on arrival. */}
      {status === 'loading' && (
        <div className="mt-2 rounded-card border border-line bg-surface-raised p-4">
          <div className="flex gap-4">
            <div className="skeleton h-24 w-40 shrink-0 rounded-control" />
            <div className="flex-1 space-y-3 py-1">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        </div>
      )}

      {status === 'ready' && info && (
        <div className="mt-2 overflow-hidden rounded-card border border-line bg-surface-raised shadow-raised">
          <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row">
            {info.thumbnail && (
              <img
                src={info.thumbnail}
                alt={`صورة مصغّرة للفيديو: ${info.title || ''}`}
                loading="lazy"
                width={160}
                height={96}
                className="h-auto w-full shrink-0 rounded-control bg-surface-sunken object-cover sm:h-24 sm:w-40"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 font-semibold leading-snug text-content">{info.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-content-muted">
                {info.author && <span className="truncate">{info.author}</span>}
                {info.duration != null && (
                  <span className="flex items-center gap-1" data-numeric>
                    <ClockIcon size={14} />
                    {formatDuration(info.duration)}
                  </span>
                )}
                {info.viewCount != null && (
                  <span className="flex items-center gap-1" data-numeric>
                    <EyeIcon size={14} />
                    {formatCount(info.viewCount)}
                  </span>
                )}
                <span className="rounded bg-surface-sunken px-2 py-0.5 text-xs font-medium text-content-muted">
                  {PLATFORM_LABEL[info.platform] || info.platform}
                </span>
              </div>
            </div>
          </div>

          {info.notice && (
            <p className="border-b border-line bg-warn-soft px-4 py-2.5 text-sm text-warn-soft-fg">
              {info.notice}
            </p>
          )}

          {!options.length && (
            <p className="p-4 text-sm text-content-muted">
              لم نجد صيغة قابلة للتحميل لهذا الفيديو.
            </p>
          )}

          <div className="divide-y divide-line">
            {videoOptions.length > 0 && (
              <FormatGroup
                icon={<FilmSlateIcon size={16} />}
                title="فيديو"
                options={videoOptions}
                job={job}
                onDownload={handleDownload}
              />
            )}
            {audioOptions.length > 0 && (
              <FormatGroup
                icon={<MusicNotesIcon size={16} />}
                title="صوت فقط"
                options={audioOptions}
                job={job}
                onDownload={handleDownload}
              />
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line bg-surface-sunken px-4 py-3 text-xs text-content-subtle">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon size={14} /> لا نحتفظ بأي ملف
            </span>
            <span className="flex items-center gap-1.5">
              <CpuIcon size={14} /> الدمج داخل متصفحك
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function FormatGroup({ icon, title, options, job, onDownload }) {
  return (
    <div className="p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-content">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2">
        {options.map((opt) => {
          const active = job?.id === opt.id;
          const busy = active && !job.failed && !job.done;
          return (
            <li key={opt.id}>
              <button
                onClick={() => onDownload(opt)}
                disabled={busy}
                className="group flex w-full items-center gap-3 rounded-control border border-line p-3 text-start
                           transition hover:border-accent hover:bg-accent-soft
                           active:translate-y-px disabled:cursor-wait disabled:hover:border-line
                           disabled:hover:bg-transparent"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-content" data-numeric>
                      {opt.label}
                    </span>
                    <span className="rounded bg-surface-sunken px-1.5 py-0.5 text-xs uppercase text-content-subtle">
                      {opt.ext}
                    </span>
                    {opt.fps > 30 && (
                      <span
                        className="rounded bg-surface-sunken px-1.5 py-0.5 text-xs text-content-muted"
                        data-numeric
                      >
                        {opt.fps}fps
                      </span>
                    )}
                    {opt.noWatermark && (
                      <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent-soft-fg">
                        بدون علامة
                      </span>
                    )}
                    {opt.needsMux && (
                      <span className="rounded border border-line-strong px-1.5 py-0.5 text-xs text-content-muted">
                        دمج محلي
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-content-subtle">
                    {opt.filesize ? `${formatBytes(opt.filesize)} · ` : ''}
                    {opt.note}
                  </p>

                  {active && (
                    <div className="mt-2">
                      {busy && (
                        <div
                          className="h-1 overflow-hidden rounded-full bg-surface-sunken"
                          role="progressbar"
                          aria-valuenow={job.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-accent transition-[width] duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      )}
                      <p
                        aria-live="polite"
                        className={`mt-1 text-xs ${
                          job.failed ? 'text-danger' : job.done ? 'text-accent' : 'text-content-muted'
                        }`}
                      >
                        {job.message}
                        {busy ? ` · ${job.progress}%` : ''}
                      </p>
                    </div>
                  )}
                </div>

                {busy ? (
                  <SpinnerIcon size={20} className="shrink-0 animate-spin text-accent" />
                ) : (
                  <DownloadSimpleIcon
                    size={20}
                    className="shrink-0 text-content-subtle transition group-hover:text-accent"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
