import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

/* ── Inject global styles once ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

  .login-bg {
    min-height: 100vh;
    background: #050a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem;
  }

  /* Orbs */
  .login-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    pointer-events: none;
    animation: loginOrbDrift 8s ease-in-out infinite alternate;
  }
  .login-orb1 { width:340px;height:340px;background:#6c63ff;top:-60px;left:-80px;animation-delay:0s; }
  .login-orb2 { width:280px;height:280px;background:#00d2ff;bottom:-40px;right:-60px;animation-delay:-4s; }
  .login-orb3 { width:200px;height:200px;background:#a855f7;top:40%;left:60%;animation-delay:-2s; }

  @keyframes loginOrbDrift {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(30px,20px) scale(1.1); }
  }

  /* Grid */
  .login-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,.08) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  /* Particles */
  .login-particle {
    position: absolute;
    border-radius: 50%;
    animation: loginFloatUp linear infinite;
    bottom: -10px;
  }
  @keyframes loginFloatUp {
    0%   { transform:translateY(0) scale(1); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:.6; }
    100% { transform:translateY(-600px) scale(.3); opacity:0; }
  }

  /* Card */
  .login-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 24px;
    padding: 2.5rem 2rem;
    box-shadow: 0 0 80px rgba(108,99,255,.15), inset 0 1px 0 rgba(255,255,255,.08);
    animation: loginSlideUp .7s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes loginSlideUp {
    from { opacity:0; transform:translateY(40px) scale(.97); }
    to   { opacity:1; transform:translateY(0)    scale(1); }
  }

  /* Logo ring */
  .login-logo-wrap { width:60px;height:60px;margin:0 auto 1.5rem;position:relative;display:flex;align-items:center;justify-content:center; }
  .login-logo-track { fill:none;stroke:rgba(108,99,255,.2);stroke-width:2; }
  .login-logo-arc   { fill:none;stroke:#6c63ff;stroke-width:2;stroke-linecap:round;
    stroke-dasharray:138;stroke-dashoffset:138;
    transform-origin:50% 50%;transform:rotate(-90deg);
    animation:loginDrawArc 1.2s .4s cubic-bezier(.4,0,.2,1) forwards; }
  @keyframes loginDrawArc { to { stroke-dashoffset:0; } }
  .login-logo-dot {
    position:absolute;width:26px;height:26px;
    background:linear-gradient(135deg,#6c63ff,#00d2ff);
    border-radius:8px;display:flex;align-items:center;justify-content:center;
    opacity:0;
    animation:loginDotPop .5s .9s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes loginDotPop { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }

  /* Typography */
  .login-title { text-align:center;color:#f0f0ff;font-size:22px;font-weight:600;letter-spacing:-.3px;margin-bottom:4px; animation:loginFadeIn .5s .45s both; }
  .login-sub   { text-align:center;color:rgba(160,160,200,.8);font-size:13px;margin-bottom:2rem; animation:loginFadeIn .5s .55s both; }
  @keyframes loginFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  /* Fields */
  .login-field { margin-bottom:1rem; }
  .login-field:nth-child(1) { animation:loginFadeIn .5s .6s both; }
  .login-field:nth-child(2) { animation:loginFadeIn .5s .7s both; }
  .login-label {
    display:block;font-size:12px;color:rgba(160,160,200,.7);
    font-weight:500;margin-bottom:6px;letter-spacing:.4px;text-transform:uppercase;
  }
  .login-field-wrap { position:relative;display:flex;align-items:center; }
  .login-field-icon { position:absolute;left:14px;width:16px;height:16px;opacity:.45;pointer-events:none; }
  .login-input {
    width:100%;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.1);
    border-radius:12px;
    padding:12px 14px 12px 40px;
    color:#f0f0ff;font-size:14px;
    font-family:'Sora',sans-serif;
    outline:none;
    transition:border-color .2s,background .2s,box-shadow .2s;
  }
  .login-input::placeholder { color:rgba(160,160,200,.35); }
  .login-input:focus {
    border-color:rgba(108,99,255,.7);
    background:rgba(108,99,255,.07);
    box-shadow:0 0 0 3px rgba(108,99,255,.12);
  }
  .login-eye-btn {
    position:absolute;right:12px;
    background:none;border:none;cursor:pointer;
    padding:4px;opacity:.45;
    transition:opacity .2s;
  }
  .login-eye-btn:hover { opacity:.85; }

  /* Forgot */
  .login-forgot-row { text-align:right;margin:-4px 0 1.25rem; animation:loginFadeIn .5s .75s both; }
  .login-link-sm { font-size:12px;color:rgba(108,99,255,.85);text-decoration:none;transition:color .2s; }
  .login-link-sm:hover { color:#a5a0ff; }

  /* Primary button */
  .login-btn {
    width:100%;padding:13px;border:none;border-radius:12px;
    background:linear-gradient(135deg,#6c63ff 0%,#4f8ef7 100%);
    color:white;font-family:'Sora',sans-serif;font-size:15px;font-weight:500;
    cursor:pointer;position:relative;overflow:hidden;
    transition:transform .18s,box-shadow .18s;
    animation:loginFadeIn .5s .8s both;
    letter-spacing:.2px;
  }
  .login-btn::before {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);
    opacity:0;transition:opacity .2s;
  }
  .login-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 8px 32px rgba(108,99,255,.45); }
  .login-btn:hover:not(:disabled)::before { opacity:1; }
  .login-btn:active:not(:disabled) { transform:scale(.99); }
  .login-btn:disabled { opacity:.6;cursor:not-allowed; }
  .login-btn-shine {
    position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
    animation:loginShine 3s 2s infinite;
  }
  @keyframes loginShine { 0%{left:-100%} 30%{left:160%} 100%{left:160%} }
  .login-btn-label { position:relative;z-index:1; }

  /* Divider */
  .login-divider { display:flex;align-items:center;gap:12px;margin:1.25rem 0; animation:loginFadeIn .5s .85s both; }
  .login-divider-line { flex:1;height:1px;background:rgba(255,255,255,.08); }
  .login-divider-text { font-size:12px;color:rgba(160,160,200,.4);white-space:nowrap; }

  /* Social */
  .login-social-row { display:flex;gap:10px; animation:loginFadeIn .5s .9s both; }
  .login-social-btn {
    flex:1;padding:10px;
    border:1px solid rgba(255,255,255,.09);border-radius:10px;
    background:rgba(255,255,255,.03);color:rgba(200,200,220,.7);
    font-size:12px;font-family:'Sora',sans-serif;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:7px;
    transition:background .2s,border-color .2s,transform .15s;
  }
  .login-social-btn:hover { background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18);transform:translateY(-1px); }

  /* Register row */
  .login-register-row { text-align:center;margin-top:1.5rem;font-size:13px;color:rgba(160,160,200,.5); animation:loginFadeIn .5s .95s both; }
  .login-link-primary { color:#8b83ff;text-decoration:none;font-weight:500;margin-left:4px;transition:color .2s; }
  .login-link-primary:hover { color:#b0aaff; }

  /* Loading bar */
  .login-loading-bar {
    position:absolute;bottom:0;left:0;height:2px;width:0;
    background:linear-gradient(90deg,#6c63ff,#00d2ff);
    border-radius:0 0 24px 24px;
    transition:width 1.5s ease;
  }

  /* Success overlay */
  .login-success {
    display:none;position:absolute;inset:0;z-index:20;
    align-items:center;justify-content:center;flex-direction:column;gap:12px;
    background:rgba(5,10,26,.92);border-radius:24px;
  }
  .login-success.show { display:flex;animation:loginFadeIn .3s both; }
  .login-success-check {
    width:56px;height:56px;border-radius:50%;
    background:linear-gradient(135deg,#22c55e,#10b981);
    display:flex;align-items:center;justify-content:center;
    animation:loginPopIn .4s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes loginPopIn { from{transform:scale(0)} to{transform:scale(1)} }
  .login-success-text { color:#f0f0ff;font-size:15px;font-weight:500; }
  .login-success-sub  { color:rgba(160,160,200,.6);font-size:13px; }

  /* Spinner */
  .login-spinner {
    display:inline-block;width:16px;height:16px;
    border:2px solid rgba(255,255,255,.3);border-top-color:white;
    border-radius:50%;vertical-align:middle;margin-right:6px;
    animation:loginSpin .6s linear infinite;
  }
  @keyframes loginSpin { to{transform:rotate(360deg)} }

  /* Shake */
  @keyframes loginShake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
  .login-shake { animation:loginShake .4s ease !important; }
`;

/* ── Particle data (generated once) ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  duration: `${5 + Math.random() * 10}s`,
  delay: `${Math.random() * 8}s`,
  size: `${2 + Math.random() * 3}px`,
  color: i % 2 === 0 ? "rgba(108,99,255,.7)" : "rgba(0,210,255,.6)",
}));

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState("");
  const [type, setType]         = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [shake, setShake]       = useState(false);
  const [barWidth, setBarWidth] = useState("0%");

  const navigate  = useNavigate();
  const cardRef   = useRef(null);

  /* Inject styles */
  useEffect(() => {
    const id = "login-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setType("error");
      setMessage("Please fill in all fields.");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      setBarWidth("90%");

      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));

      setBarWidth("100%");
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      }, 200);
    } catch (err) {
      setBarWidth("0%");
      setType("error");
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      {/* Ambient orbs */}
      <div className="login-orb login-orb1" />
      <div className="login-orb login-orb2" />
      <div className="login-orb login-orb3" />

      {/* Grid */}
      <div className="login-grid" />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="login-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={`login-card${shake ? " login-shake" : ""}`}
      >
        {/* Loading bar */}
        <div className="login-loading-bar" style={{ width: barWidth }} />

        {/* Success overlay */}
        <div className={`login-success${success ? " show" : ""}`}>
          <div className="login-success-check">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M5 13L10.5 18.5L21 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="login-success-text">Logged in successfully</div>
          <div className="login-success-sub">Redirecting you now…</div>
        </div>

        {/* Logo ring */}
        <div className="login-logo-wrap">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="22" className="login-logo-track" />
            <circle cx="30" cy="30" r="22" className="login-logo-arc" />
          </svg>
          <div className="login-logo-dot">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L9.5 6H12.5L10 9L11 12.5L7 10.5L3 12.5L4 9L1.5 6H4.5L7 1.5Z" fill="white" />
            </svg>
          </div>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to continue your journey</p>

        {/* Message */}
        {message && <Message type={type} text={message} />}

        <form onSubmit={submitHandler} style={{ marginTop: "0.5rem" }}>
          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email address</label>
            <div className="login-field-wrap">
              <svg className="login-field-icon" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="white" strokeWidth="1.3" />
                <path d="M1 5.5L8 9.5L15 5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-field-wrap">
              <svg className="login-field-icon" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="8" rx="2" stroke="white" strokeWidth="1.3" />
                <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="11" r="1" fill="white" />
              </svg>
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <ellipse cx="8" cy="8" rx="6" ry="4" stroke="white" strokeWidth="1.3" />
                    <circle cx="8" cy="8" r="1.5" fill="white" />
                    <path d="M2 14L14 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <ellipse cx="8" cy="8" rx="6" ry="4" stroke="white" strokeWidth="1.3" />
                    <circle cx="8" cy="8" r="1.5" fill="white" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="login-forgot-row">
            <Link to="/forgot-password" className="login-link-sm">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button className="login-btn" type="submit" disabled={loading}>
            <span className="login-btn-label">
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </span>
            <div className="login-btn-shine" />
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">or continue with</span>
          <div className="login-divider-line" />
        </div>

        {/* Social buttons */}
        <div className="login-social-row">
          <button type="button" className="login-social-btn">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="login-social-btn">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M9 .5C4.306.5.5 4.306.5 9s3.806 8.5 8.5 8.5S17.5 13.694 17.5 9 13.694.5 9 .5zm2.1 13.47H9.67v-4.6H8.4V7.35h1.27V6.08c0-1.38.83-2.13 2.07-2.13.59 0 1.2.04 1.8.12v1.39h-.96c-.57 0-.68.27-.68.67v.88h1.6l-.23 1.52H11.6v4.62H11.1z" fill="#1877F2"/>
            </svg>
            Facebook
          </button>
          <button type="button" className="login-social-btn">
            <svg width="15" height="15" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.6 26.1 256 26.1 140.9 26.1 57.3 49 17.9 87.5 6.8c36.6-10.9 73.2-16.4 108.7-16.4 92.2 0 167.5 57.3 226.6 57.3 56.5 0 144.7-57.3 249.6-57.3 31.4 0 108.2 3.2 170.4 74.2zm-325.1-64.6c-13.5-64 26.4-141.9 84.3-183.4 56.5-40.8 126.1-52.5 178.6-52.5 3.2 0 6.4.6 9.6.6-.6 68.7-28.9 140.2-77.5 186.1-45.2 42.2-114.8 71.9-194.3 71.9-.6 0-1.2 0-0.7-22.7z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Register */}
        <div className="login-register-row">
          Don&apos;t have an account?
          <Link to="/register" className="login-link-primary">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}