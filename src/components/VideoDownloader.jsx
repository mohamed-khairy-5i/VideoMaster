import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Link2, Loader2, AlertCircle, Download, Music, Video, Clipboard,
  X, Eye, Clock, CheckCircle2, ShieldCheck, Cpu, Zap,
} from 'lucide-react';
import {
  extractVideo, buildDownloadOptions, saveDirect, formatDuration,
  formatBytes, formatCount, detectPlatform, looksLikeUrl, APIError,
} from '../utils/api';
import { muxVideoAudio, saveBlob, canMuxSafely } from '../utils/muxer';

const PLATFORM_LABEL = {
  youtube: 'YouTube', tiktok: 'TikTok', vimeo: 'Vimeo',
  reddit: 'Reddit', twitter: 'Twitter / X', dailymotion: 'Dailymotion',
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
      inputRef.current?.focus(); // clipboard blocked — let the user paste manually
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

    setJob({ id: opt.id, progress: 0, message: 'جاري التحضير…' });
    try {
      const blob = await muxVideoAudio({
        videoUrl: opt.videoUrl,
        audioUrl: opt.audioUrl,
        onProgress: (p) => setJob((j) => (j?.id === opt.id ? { ...j, progress: Math.round(p) } : j)),
        onStatus: (m) => setJob((j) => (j?.id === opt.id ? { ...j, message: m } : j)),
      });
      const name = `${(info.title || 'video').replace(/[\\/:*?"<>|]/g, '')}_${opt.label}.mp4`;
      saveBlob(blob, name);
      setJob({ id: opt.id, progress: 100, message: 'تم الحفظ ✅', done: true });
      setTimeout(() => setJob((j) => (j?.id === opt.id ? null : j)), 4000);
    } catch (e) {
      setJob({ id: opt.id, progress: 0, message: e.message || 'فشل الدمج', failed: true });
    }
  };

  const videoOptions = options.filter((o) => o.kind === 'video');
  const audioOptions = options.filter((o) => o.kind === 'audio');

  return (
    <section className="w-full max-w-3xl mx-auto px-4" id="downloader">
      {/* ---------------------------------------------------------- input */}
      <form onSubmit={onSubmit} className="relative">
        <div
          className={`flex items-center gap-2 rounded-2xl border-2 bg-white p-2 shadow-lg transition
            ${status === 'error' ? 'border-red-300' : 'border-slate-200 focus-within:border-blue-500'}`}
        >
          <Link2 className="ms-2 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            inputMode="url"
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="الصق رابط الفيديو هنا…"
            aria-label="رابط الفيديو"
            className="min-w-0 flex-1 bg-transparent py-3 text-start text-slate-800 outline-none placeholder:text-slate-400"
          />

          {url ? (
            <button
              type="button"
              onClick={reset}
              aria-label="مسح"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 sm:flex"
            >
              <Clipboard className="h-4 w-4" />
              لصق
            </button>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !url}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition
                       hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">جاري التحليل</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>تحليل</span>
              </>
            )}
          </button>
        </div>

        {platformGuess && status === 'idle' && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            تم التعرّف على {PLATFORM_LABEL[platformGuess]}
          </p>
        )}
      </form>

      {/* ---------------------------------------------------------- error */}
      {status === 'error' && error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="min-w-0">
            <p className="font-medium text-red-800">{error.message}</p>
            {error.code === 'UNSUPPORTED_PLATFORM' && (
              <p className="mt-1 text-sm text-red-600">
                المنصات المدعومة: {Object.values(PLATFORM_LABEL).join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- skeleton */}
      {status === 'loading' && (
        <div className="mt-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex gap-4">
            <div className="h-24 w-40 shrink-0 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="h-3 w-1/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- result */}
      {status === 'ready' && info && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* real metadata straight from the platform */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row">
            {info.thumbnail && (
              <img
                src={info.thumbnail}
                alt=""
                loading="lazy"
                className="h-auto w-full shrink-0 rounded-lg bg-slate-100 object-cover sm:h-24 sm:w-40"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900">
                {info.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                {info.author && <span className="truncate">{info.author}</span>}
                {info.duration != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(info.duration)}
                  </span>
                )}
                {info.viewCount != null && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {formatCount(info.viewCount)}
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {PLATFORM_LABEL[info.platform] || info.platform}
                </span>
              </div>
            </div>
          </div>

          {info.notice && (
            <p className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              {info.notice}
            </p>
          )}

          {!options.length && (
            <p className="p-4 text-sm text-slate-500">
              لم نجد صيغة قابلة للتحميل لهذا الفيديو.
            </p>
          )}

          {/* download choices */}
          <div className="divide-y divide-slate-100">
            {videoOptions.length > 0 && (
              <FormatGroup
                icon={<Video className="h-4 w-4" />}
                title="فيديو"
                options={videoOptions}
                job={job}
                onDownload={handleDownload}
              />
            )}
            {audioOptions.length > 0 && (
              <FormatGroup
                icon={<Music className="h-4 w-4" />}
                title="صوت فقط"
                options={audioOptions}
                job={job}
                onDownload={handleDownload}
              />
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> لا نحتفظ بأي ملف
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> الدمج يتم داخل متصفحك
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> بدون إعلانات
            </span>
          </p>
        </div>
      )}
    </section>
  );
}

function FormatGroup({ icon, title, options, job, onDownload }) {
  return (
    <div className="p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2">
        {options.map((opt) => {
          const active = job?.id === opt.id;
          return (
            <li key={opt.id}>
              <button
                onClick={() => onDownload(opt)}
                disabled={active && !job.failed && !job.done}
                className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-start
                           transition hover:border-blue-400 hover:bg-blue-50/50 disabled:cursor-wait"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{opt.label}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs uppercase text-slate-500">
                      {opt.ext}
                    </span>
                    {opt.fps > 30 && (
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">
                        {opt.fps}fps
                      </span>
                    )}
                    {opt.noWatermark && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                        بدون علامة
                      </span>
                    )}
                    {opt.needsMux && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                        دمج محلي
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {opt.filesize ? `${formatBytes(opt.filesize)} · ` : ''}
                    {opt.note}
                  </p>

                  {active && (
                    <div className="mt-2">
                      {!job.failed && !job.done && (
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      )}
                      <p
                        className={`mt-1 text-xs ${
                          job.failed ? 'text-red-600' : job.done ? 'text-emerald-600' : 'text-blue-600'
                        }`}
                      >
                        {job.message}
                        {!job.failed && !job.done ? ` · ${job.progress}%` : ''}
                      </p>
                    </div>
                  )}
                </div>

                {active && !job.failed && !job.done ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                ) : (
                  <Download className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
