import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'
import { Logo } from '@/assets/logo'

export function SignUp() {
  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen'>

        {/* ── Panneau gauche – branding ── */}
        <div
          className='relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex'
          style={{ background: 'linear-gradient(155deg, #051510 0%, #071a12 55%, #061814 100%)' }}
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
            className='pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,.22) 0%, transparent 70%)' }}
          />
          <div
            className='pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,.15) 0%, transparent 70%)' }}
          />
          <div
            className='pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 rounded-full'
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,.07) 0%, transparent 70%)' }}
          />

          {/* Logo */}
          <div className='relative flex items-center gap-3 p-10 pb-0'>
            <Logo className='size-10 rounded-xl' />
            <span className='text-base font-semibold uppercase tracking-widest text-white/90'>
              SIMADOU
            </span>
          </div>

          {/* ── Illustration SVG : réseau communautaire / avenir ── */}
          <div className='relative flex flex-1 items-center justify-center px-10'>
            <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-full max-w-md'>

              {/* Sol */}
              <ellipse cx="210" cy="335" rx="170" ry="14" fill="rgba(16,185,129,.06)" />

              {/* ── Réseau de nœuds connectés ── */}
              {/* Lignes de connexion */}
              <line x1="210" y1="120" x2="100" y2="200" stroke="rgba(52,211,153,.18)" strokeWidth="1" strokeDasharray="5 4"/>
              <line x1="210" y1="120" x2="320" y2="200" stroke="rgba(52,211,153,.18)" strokeWidth="1" strokeDasharray="5 4"/>
              <line x1="210" y1="120" x2="210" y2="230" stroke="rgba(52,211,153,.22)" strokeWidth="1" strokeDasharray="5 4"/>
              <line x1="100" y1="200" x2="50"  y2="280" stroke="rgba(52,211,153,.12)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="100" y1="200" x2="160" y2="290" stroke="rgba(52,211,153,.12)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="320" y1="200" x2="370" y2="280" stroke="rgba(52,211,153,.12)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="320" y1="200" x2="260" y2="290" stroke="rgba(52,211,153,.12)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="210" y1="230" x2="160" y2="290" stroke="rgba(52,211,153,.1)"  strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="210" y1="230" x2="260" y2="290" stroke="rgba(52,211,153,.1)"  strokeWidth="1" strokeDasharray="4 5"/>
              {/* Connexions secondaires */}
              <line x1="50"  y1="280" x2="160" y2="290" stroke="rgba(52,211,153,.08)" strokeWidth=".75" strokeDasharray="3 5"/>
              <line x1="160" y1="290" x2="260" y2="290" stroke="rgba(52,211,153,.08)" strokeWidth=".75" strokeDasharray="3 5"/>
              <line x1="260" y1="290" x2="370" y2="280" stroke="rgba(52,211,153,.08)" strokeWidth=".75" strokeDasharray="3 5"/>

              {/* Nœuds secondaires — niveau 3 */}
              {[[50,280],[160,290],[260,290],[370,280]].map(([cx,cy],i)=>(
                <g key={i}>
                  <circle cx={cx} cy={cy} r="18" fill="rgba(16,185,129,.1)" stroke="rgba(52,211,153,.2)" strokeWidth="1"/>
                  <circle cx={cx} cy={cy} r="9"  fill="rgba(16,185,129,.25)" stroke="rgba(52,211,153,.4)" strokeWidth="1"/>
                  {/* Avatars simplifiés */}
                  <circle cx={cx} cy={cy-3} r="3.5" fill="rgba(167,243,208,.7)"/>
                  <path d={`M${cx-5},${cy+8} Q${cx},${cy+3} ${cx+5},${cy+8}`} stroke="rgba(167,243,208,.7)" strokeWidth="1.2" fill="none"/>
                </g>
              ))}

              {/* Nœuds — niveau 2 */}
              {[[100,200],[320,200],[210,230]].map(([cx,cy],i)=>(
                <g key={i}>
                  <circle cx={cx} cy={cy} r="24" fill="rgba(16,185,129,.08)" stroke="rgba(52,211,153,.18)" strokeWidth="1"/>
                  <circle cx={cx} cy={cy} r="14" fill="rgba(16,185,129,.2)"  stroke="rgba(52,211,153,.35)" strokeWidth="1.2"/>
                  <circle cx={cx} cy={cy-4} r="4.5" fill="rgba(110,231,183,.85)"/>
                  <path d={`M${cx-7},${cy+10} Q${cx},${cy+4} ${cx+7},${cy+10}`} stroke="rgba(110,231,183,.85)" strokeWidth="1.4" fill="none"/>
                </g>
              ))}

              {/* Nœud central — hub principal */}
              <circle cx="210" cy="120" r="40" fill="rgba(16,185,129,.1)"  stroke="rgba(52,211,153,.15)" strokeWidth="1">
                <animate attributeName="r" values="40;44;40" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="210" cy="120" r="28" fill="rgba(16,185,129,.22)" stroke="rgba(52,211,153,.4)"  strokeWidth="1.5"/>
              <circle cx="210" cy="120" r="16" fill="rgba(16,185,129,.5)"  stroke="rgba(52,211,153,.8)"  strokeWidth="1.5"/>
              {/* Icône personne centrale */}
              <circle cx="210" cy="114" r="5.5" fill="rgba(167,243,208,.95)"/>
              <path d="M200,132 Q210,124 220,132" stroke="rgba(167,243,208,.95)" strokeWidth="2" fill="none" strokeLinecap="round"/>

              {/* Particules orbitales autour du hub */}
              {[0,60,120,180,240,300].map((deg,i)=>{
                const rad = deg * Math.PI / 180
                const x = 210 + 50 * Math.cos(rad)
                const y = 120 + 50 * Math.sin(rad)
                return (
                  <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(52,211,153,.6)">
                    <animate attributeName="opacity" values=".6;1;.6" dur={`${1.5+i*.3}s`} repeatCount="indefinite"/>
                  </circle>
                )
              })}

              {/* Carte flottante — gauche */}
              <rect x="8" y="60" width="90" height="50" rx="9" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.09)" strokeWidth=".75"/>
              <text x="20" y="80"  fill="rgba(255,255,255,.38)" fontSize="8"   fontFamily="system-ui,sans-serif">MEMBRES</text>
              <text x="20" y="97"  fill="rgba(52,211,153,.95)"  fontSize="17"  fontWeight="700" fontFamily="system-ui,sans-serif">10k+</text>

              {/* Carte flottante — droite */}
              <rect x="322" y="38" width="90" height="50" rx="9" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.09)" strokeWidth=".75"/>
              <text x="334" y="58" fill="rgba(255,255,255,.38)" fontSize="8"   fontFamily="system-ui,sans-serif">PROJETS</text>
              <text x="334" y="75" fill="rgba(167,139,250,.95)"  fontSize="17"  fontWeight="700" fontFamily="system-ui,sans-serif">340+</text>

              {/* Pill en haut */}
              <rect x="136" y="12" width="148" height="30" rx="15" fill="rgba(16,185,129,.3)" stroke="rgba(52,211,153,.35)" strokeWidth=".75"/>
              <text x="180" y="31" fill="rgba(255,255,255,.92)" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">Simadou 2040 🌱</text>

              {/* Badge "En ligne" pulsant */}
              <circle cx="226" cy="104" r="6" fill="rgba(6,95,70,1)" stroke="rgba(6,78,59,1)" strokeWidth="1"/>
              <circle cx="226" cy="104" r="3.5" fill="rgba(52,211,153,1)">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/>
              </circle>

              {/* Étoiles */}
              {[[32,40],[395,65],[18,170],[408,180],[38,310],[400,305]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,.35)">
                  <animate attributeName="opacity" values=".35;.9;.35" dur={`${2.1+i*.4}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </svg>
          </div>

          {/* Contenu textuel */}
          <div className='relative space-y-5 px-10 pb-10'>
            <div className='space-y-2'>
              <p className='text-xs font-semibold uppercase tracking-widest' style={{ color: 'rgba(52,211,153,.85)' }}>
                Programme Simadou 2040
              </p>
              <h2 className='text-2xl font-light leading-snug' style={{ color: 'rgba(255,255,255,.88)' }}>
                Rejoignez une communauté qui{' '}
                <span className='font-bold text-white'>bâtit l'avenir.</span>
              </h2>
            </div>

            {/* Steps */}
            <div className='space-y-3' style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.25rem' }}>
              {[
                { n: '01', label: 'Créez votre compte en 30 secondes' },
                { n: '02', label: 'Accédez à votre tableau de bord' },
                { n: '03', label: 'Commencez à collaborer' },
              ].map((step) => (
                <div key={step.n} className='flex items-center gap-4'>
                  <span className='text-xs font-bold' style={{ color: 'rgba(52,211,153,.85)' }}>
                    {step.n}
                  </span>
                  <span className='text-sm' style={{ color: 'rgba(255,255,255,.55)' }}>{step.label}</span>
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
                Créer un compte
              </h1>
            </div>

            {/* Formulaire — logique inchangée */}
            <SignUpForm />

            {/* Séparateur + connexion */}
            <div className='space-y-3'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-zinc-100' />
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='bg-white px-3 text-zinc-400'>
                    Déjà un compte ?
                  </span>
                </div>
              </div>

              <Link
                to='/sign-in'
                className='flex w-full items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50'
              >
                Se connecter
              </Link>
            </div>

            {/* CGU */}
            <p className='text-center text-xs text-zinc-400'>
              En créant un compte, vous acceptez nos{' '}
              <a href='/terms' className='underline underline-offset-2 hover:text-zinc-700'>
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href='/privacy' className='underline underline-offset-2 hover:text-zinc-700'>
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}