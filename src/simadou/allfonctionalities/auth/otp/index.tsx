import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'
import { Logo } from '@/assets/logo'

export function Otp() {
  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen'>

        {/* ── Panneau gauche – branding ── */}
        <div
          className='relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex'
          style={{ background: 'linear-gradient(155deg, #0c0714 0%, #100a1e 55%, #0d0818 100%)' }}
        >
          {/* Grille décorative */}
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Orbes lumineux */}
          <div
            className='pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,.24) 0%, transparent 70%)' }}
          />
          <div
            className='pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,.14) 0%, transparent 70%)' }}
          />
          <div
            className='pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 70%)' }}
          />

          {/* Logo */}
          <div className='relative flex items-center gap-3 p-10 pb-0'>
            <Logo className='size-10 rounded-xl' />
            <span className='text-base font-semibold uppercase tracking-widest text-white/90'>
              SIMADOU
            </span>
          </div>

          {/* ── Illustration SVG : bouclier / sécurité / OTP ── */}
          <div className='relative flex flex-1 items-center justify-center px-10'>
            <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-full max-w-md'>

              {/* Halo de fond */}
              <circle cx="210" cy="168" r="120" fill="rgba(124,58,237,.04)" stroke="rgba(139,92,246,.08)" strokeWidth="1"/>
              <circle cx="210" cy="168" r="88"  fill="rgba(124,58,237,.06)" stroke="rgba(139,92,246,.1)"  strokeWidth="1"/>

              {/* Anneau orbital externe — pointillés */}
              <circle cx="210" cy="168" r="148" stroke="rgba(139,92,246,.12)" strokeWidth="1" strokeDasharray="6 5"/>

              {/* Bouclier principal */}
              <path
                d="M210 42 L272 68 L272 148 Q272 204 210 228 Q148 204 148 148 L148 68 Z"
                fill="rgba(109,40,217,.18)"
                stroke="rgba(167,139,250,.35)"
                strokeWidth="1.5"
              />
              {/* Reflet interne bouclier */}
              <path
                d="M210 56 L258 78 L258 148 Q258 194 210 214 Q162 194 162 148 L162 78 Z"
                fill="rgba(139,92,246,.12)"
                stroke="rgba(167,139,250,.2)"
                strokeWidth="1"
              />

              {/* Cadenas au centre du bouclier */}
              {/* Corps du cadenas */}
              <rect x="190" y="148" width="40" height="32" rx="6" fill="rgba(139,92,246,.5)" stroke="rgba(167,139,250,.7)" strokeWidth="1.2"/>
              {/* Anse */}
              <path d="M198 148 L198 136 Q198 122 210 122 Q222 122 222 136 L222 148"
                stroke="rgba(167,139,250,.8)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Trou de serrure */}
              <circle cx="210" cy="162" r="5" fill="rgba(30,10,60,.8)" stroke="rgba(167,139,250,.5)" strokeWidth="1"/>
              <rect x="208" y="163" width="4" height="6" rx="1" fill="rgba(30,10,60,.8)"/>

              {/* Digits OTP flottants autour du bouclier */}
              {[
                { x: 80,  y: 100, digit: '4', delay: '0s'   },
                { x: 340, y: 100, digit: '7', delay: '0.3s' },
                { x: 58,  y: 200, digit: '2', delay: '0.6s' },
                { x: 358, y: 200, digit: '9', delay: '0.9s' },
                { x: 110, y: 290, digit: '1', delay: '1.2s' },
                { x: 310, y: 290, digit: '5', delay: '1.5s' },
              ].map(({ x, y, digit, delay }) => (
                <g key={digit + x}>
                  <rect x={x - 18} y={y - 18} width="36" height="36" rx="9"
                    fill="rgba(255,255,255,.05)" stroke="rgba(167,139,250,.18)" strokeWidth=".75"/>
                  <text x={x} y={y + 7} textAnchor="middle"
                    fill="rgba(196,181,253,.7)" fontSize="16" fontWeight="700" fontFamily="monospace,system-ui">
                    {digit}
                    <animate attributeName="opacity" values=".7;1;.7" dur="2.4s" begin={delay} repeatCount="indefinite"/>
                  </text>
                </g>
              ))}

              {/* Lignes de connexion digit → bouclier */}
              {[
                [80, 100, 165, 110],
                [340, 100, 258, 110],
                [72, 200, 155, 168],
                [348, 200, 268, 168],
                [118, 282, 175, 220],
                [302, 282, 248, 220],
              ].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(139,92,246,.15)" strokeWidth=".75" strokeDasharray="4 4"/>
              ))}

              {/* Particules de sécurité */}
              {[
                [210, 22], [370, 140], [50, 140], [210, 318],
                [340, 268], [80, 268],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(167,139,250,.5)" stroke="rgba(167,139,250,.15)" strokeWidth="4">
                  <animate attributeName="opacity" values=".5;1;.5" dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite"/>
                </circle>
              ))}

              {/* Étoiles */}
              {[[30,50],[395,55],[20,280],[408,275],[30,170],[400,170]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,.3)">
                  <animate attributeName="opacity" values=".3;.85;.3" dur={`${2.2+i*.4}s`} repeatCount="indefinite"/>
                </circle>
              ))}

              {/* Card stat — gauche */}
              <rect x="8" y="58" width="96" height="50" rx="9" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.09)" strokeWidth=".75"/>
              <text x="20" y="78"  fill="rgba(255,255,255,.38)" fontSize="8"  fontFamily="system-ui,sans-serif">SÉCURITÉ</text>
              <text x="20" y="96"  fill="rgba(196,181,253,.95)" fontSize="16" fontWeight="700" fontFamily="system-ui,sans-serif">256-bit</text>

              {/* Card stat — droite */}
              <rect x="318" y="34" width="96" height="50" rx="9" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.09)" strokeWidth=".75"/>
              <text x="330" y="54" fill="rgba(255,255,255,.38)" fontSize="8"  fontFamily="system-ui,sans-serif">EXPIRATION</text>
              <text x="330" y="72" fill="rgba(251,191,36,.95)"  fontSize="16" fontWeight="700" fontFamily="system-ui,sans-serif">10 min</text>

              {/* Pill top */}
              <rect x="130" y="10" width="160" height="30" rx="15" fill="rgba(109,40,217,.32)" stroke="rgba(167,139,250,.3)" strokeWidth=".75"/>
              <text x="174" y="29" fill="rgba(255,255,255,.9)" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">Vérification 2FA 🔐</text>

              {/* Checkmark animé sous le bouclier */}
              <circle cx="210" cy="248" r="14" fill="rgba(16,185,129,.15)" stroke="rgba(52,211,153,.35)" strokeWidth="1">
                <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <path d="M203 248 L208 254 L218 243" stroke="rgba(52,211,153,.9)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Contenu textuel */}
          <div className='relative space-y-5 px-10 pb-10'>
            <div className='space-y-2'>
              <p className='text-xs font-semibold uppercase tracking-widest' style={{ color: 'rgba(167,139,250,.85)' }}>
                Vérification en deux étapes
              </p>
              <h2 className='text-2xl font-light leading-snug' style={{ color: 'rgba(255,255,255,.88)' }}>
                Une couche de sécurité{' '}
                <span className='font-bold text-white'>supplémentaire.</span>
              </h2>
              <p className='text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,.35)' }}>
                Le code à usage unique expire dans 10 minutes. Ne le partagez
                jamais avec quelqu'un d'autre.
              </p>
            </div>

            {/* Garanties sécurité */}
            <div className='space-y-3' style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.25rem' }}>
              {[
                { icon: '🔒', label: 'Code chiffré de bout en bout' },
                { icon: '⏱️', label: 'Expire automatiquement après 10 min' },
                { icon: '🚫', label: 'Usage unique, non réutilisable' },
              ].map((item) => (
                <div key={item.label} className='flex items-center gap-4'>
                  <span className='text-base'>{item.icon}</span>
                  <span className='text-sm' style={{ color: 'rgba(255,255,255,.55)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className='relative px-10 pb-6 text-xs' style={{ color: 'rgba(255,255,255,.18)' }}>
            © {new Date().getFullYear()} SIMANDOU. Tous droits réservés.
          </p>
        </div>

        {/* ── Panneau droit – formulaire ── */}
        <div className='flex w-full flex-col items-center justify-center bg-white px-6 lg:w-1/2 lg:px-16'>

          {/* Logo mobile */}
          <div className='mb-10 flex items-center gap-3 lg:hidden'>
            <Logo className='size-10 rounded-lg' />
            <span className='text-lg font-semibold tracking-tight'>SIMANDOU</span>
          </div>

          <div className='w-full max-w-sm space-y-8'>

            {/* En-tête */}
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold tracking-tight text-zinc-900'>
                Vérification 2FA
              </h1>
            </div>

            {/* Formulaire OTP — logique inchangée */}
            <OtpForm />

            {/* Séparateur + renvoyer */}
            <div className='space-y-3'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-zinc-100' />
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='bg-white px-3 text-zinc-400'>
                    Vous n'avez pas reçu le code ?
                  </span>
                </div>
              </div>

              <Link
                to='/sign-in'
                className='flex w-full items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50'
              >
                Renvoyer un nouveau code
              </Link>
            </div>

            {/* Note bas de page */}
            <p className='text-center text-xs text-zinc-400'>
              Problème de connexion ?{' '}
              <a href='mailto:support@SIMANDOU.com' className='underline underline-offset-2 hover:text-zinc-700'>
                Contacter le support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}