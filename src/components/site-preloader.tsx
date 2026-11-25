export function SitePreloader() {
  return (
    <div className="site-preloader" aria-hidden="true">
      <div className="site-preloader-sky" />
      <div className="site-preloader-halo" />
      <div className="site-preloader-horizon" />
      <div className="site-preloader-sun" />

      <svg
        className="site-preloader-landscape"
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="preloader-far" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#232321" />
            <stop offset="1" stopColor="#10100f" />
          </linearGradient>
          <linearGradient id="preloader-near" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#151718" />
            <stop offset="1" stopColor="#090a0a" />
          </linearGradient>
        </defs>
        <path d="M0 271 C142 230 209 284 337 252 C466 219 549 269 671 235 C789 202 891 270 1011 233 C1155 192 1264 259 1440 216 L1440 520 L0 520Z" fill="#403729" opacity=".4" />
        <path d="M0 324 C129 280 223 325 360 293 C467 270 566 315 704 283 C835 254 919 324 1061 279 C1195 245 1315 305 1440 264 L1440 520 L0 520Z" fill="url(#preloader-far)" />
        <path d="M0 377 C129 343 207 393 337 365 C487 331 556 401 705 358 C846 318 922 384 1078 348 C1212 317 1316 375 1440 339 L1440 520 L0 520Z" fill="#111414" />
        <path d="M0 429 C158 391 261 456 401 418 C542 378 625 452 766 409 C901 368 1007 445 1145 401 C1258 367 1335 418 1440 392 L1440 520 L0 520Z" fill="url(#preloader-near)" />
      </svg>

      <div className="site-preloader-identity">
        <span className="site-preloader-eyebrow">A moment before the work</span>
        <span className="site-preloader-name">Gera Anggara Putra<span className="site-preloader-period">.</span></span>
        <span className="site-preloader-role">Backend engineer <span aria-hidden="true">·</span> Portfolio</span>
      </div>
    </div>
  );
}
