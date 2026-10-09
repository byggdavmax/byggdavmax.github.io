// Bygger sidorna: node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const PHONE = '070-939 98 96';
const TEL = '+46709399896';
const MAIL = 'max.engellau@gmail.com';
const year = new Date().getFullYear();

const head = ({ title, desc, path, lamp = false }) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#141110">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23141110'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='34' fill='%23d4a35a' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;1,400&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css">
<link rel="stylesheet" href="/css/style.css">
<script>document.documentElement.classList.add('js')</script>
${lamp ? `<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js","three/examples/jsm/":"https://unpkg.com/three@0.160.0/examples/jsm/"}}</script>
<script type="module" src="/js/lamp.js"></script>` : ''}
</head>
<body>
<a class="skip" href="#innehall">Hoppa till innehållet</a>
<header class="site-head">
  <div class="bar glass">
    <a class="wordmark" href="/">Byggd av Max</a>
    <nav class="nav" aria-label="Huvudmeny">
      <a href="/arbeten/"${path === 'arbeten' ? ' aria-current="page"' : ''}>Arbeten</a>
      <a class="opt" href="/#sa-gar-det-till">Så går det till</a>
      <a href="/kontakt/"${path === 'kontakt' ? ' aria-current="page"' : ''}>Kontakt</a>
      <a class="btn btn--solid" href="${path === 'kontakt' ? '#kontakt' : '/kontakt/'}">Kontakta mig</a>
    </nav>
  </div>
</header>
<main id="innehall">
`;

const contactPanel = ({ title, text, h = 'h2' }) => `<section class="section" id="kontakt" aria-labelledby="kontakt-rubrik">
  <div class="wrap">
    <div class="contact glass reveal">
      <div>
        <${h} class="h2" id="kontakt-rubrik">${title}</${h}>
        <p class="lead">${text}</p>
      </div>
      <div class="ways">
        <div class="way">
          <i class="ph-light ph-phone" aria-hidden="true"></i>
          <div><span class="label">Ring eller sms:a</span><a class="value" href="tel:${TEL}">${PHONE}</a></div>
          <div class="acts">
            <a class="icon-btn" href="sms:${TEL}" aria-label="Skicka sms"><i class="ph-light ph-chat-circle-text" aria-hidden="true"></i></a>
            <button class="icon-btn" type="button" data-copy="${PHONE}" aria-label="Kopiera telefonnummer"><i class="ph-light ph-copy" aria-hidden="true"></i></button>
          </div>
        </div>
        <div class="way">
          <i class="ph-light ph-envelope-simple" aria-hidden="true"></i>
          <div><span class="label">Mejla</span><a class="value" href="mailto:${MAIL}?subject=Ny%20hemsida">${MAIL}</a></div>
          <div class="acts">
            <button class="icon-btn" type="button" data-copy="${MAIL}" aria-label="Kopiera mejladress"><i class="ph-light ph-copy" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const foot = `</main>
<footer class="site-foot">
  <div class="wrap">
    <span>© ${year} Byggd av Max</span>
    <nav aria-label="Sidfot"><a href="/arbeten/">Arbeten</a><a href="/kontakt/">Kontakt</a><a href="tel:${TEL}">${PHONE}</a></nav>
  </div>
</footer>
<script>
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function () {
        b.classList.add('ok'); b.setAttribute('aria-label', 'Kopierat');
        setTimeout(function () { b.classList.remove('ok'); }, 1600);
      }, function () {});
    });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
</script>
</body>
</html>
`;

const home = head({ title: 'Byggd av Max | Hemsidor för företag', desc: `Jag bygger lugna, snygga och snabba hemsidor för lokala företag. Ring ${PHONE} eller mejla ${MAIL}.`, path: 'home', lamp: true }) + `
<section class="hero">
  <div class="wrap">
    <div>
      <p class="eyebrow rise">Hemsidor för företag</p>
      <h1 class="rise d1">En hemsida som känns som <em>ditt</em> företag</h1>
      <p class="lead rise d2">Jag bygger lugna, snygga och snabba hemsidor för restauranger, gårdar, butiker och andra lokala företag.</p>
      <div class="btn-row rise d3">
        <a class="btn btn--solid" href="/kontakt/">Kontakta mig</a>
        <a class="btn btn--glass" href="/arbeten/">Se arbeten</a>
      </div>
    </div>
    <div class="stage rise d4" id="lamp-stage" role="img" aria-label="En mässingslampa i 3D som lyser varmt och svajar sakta">
      <div class="stage__fallback" aria-hidden="true"><span></span></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ingar">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 class="h2" id="ingar">Det här ingår</h2>
      <p class="lead">Allt som behövs för en sida som syns. Du behöver inte kunna något om webb.</p>
    </div>
    <div class="bento">
      <article class="cell cell--a glass reveal">
        <i class="ph-light ph-paint-brush-broad" aria-hidden="true"></i>
        <h3>En egen design</h3>
        <p>En form som passar just ditt företag, med dina färger, din ton och dina bilder. Ingen mall som tusen andra använder.</p>
      </article>
      <article class="cell cell--b glass reveal">
        <i class="ph-light ph-device-mobile" aria-hidden="true"></i>
        <h3>Mobilen först</h3>
        <p>De flesta besökare kommer från telefonen. Sidan byggs för dem från början.</p>
      </article>
      <article class="cell cell--c glass reveal">
        <i class="ph-light ph-text-aa" aria-hidden="true"></i>
        <h3>Text och bild</h3>
        <p>Hjälp att formulera vad ni gör och att välja bilder som säger något.</p>
      </article>
      <article class="cell cell--d glass reveal">
        <i class="ph-light ph-lightning" aria-hidden="true"></i>
        <h3>Snabb och hittbar</h3>
        <p>Lätt kod som laddar direkt, med grunderna för Google på plats.</p>
      </article>
    </div>
  </div>
</section>

<section class="statement reveal" aria-label="Varje sida byggd för hand">
  <p class="small">Varje sida</p>
  <p class="big">Byggd för hand</p>
  <hr>
</section>

<section class="section" id="sa-gar-det-till" aria-labelledby="steg">
  <div class="wrap process">
    <div class="section-head">
      <h2 class="h2" id="steg">Så går det till</h2>
      <p class="lead">Från första samtal till färdig sida. Du ser resultatet på riktigt innan något bestäms.</p>
    </div>
    <ol class="steps">
      <li class="glass reveal"><div><h3>Vi pratar</h3><p>Du berättar om företaget, vilka ni vill nå och vad sidan ska göra. Har du en sida i dag går vi igenom vad som fungerar.</p></div></li>
      <li class="glass reveal"><div><h3>Jag bygger ett förslag</h3><p>Du får en riktig sida att klicka runt i, med dina texter och bilder. Vi justerar tills den känns rätt.</p></div></li>
      <li class="glass reveal"><div><h3>Sidan går live</h3><p>Jag lägger upp sidan, kopplar din adress och ser till att allt fungerar. Efteråt finns jag kvar om något behöver ändras.</p></div></li>
    </ol>
  </div>
</section>

${contactPanel({ title: 'Hör av dig', text: 'Berätta kort om ditt företag, så återkommer jag så snart jag kan.' })}` + foot;

const arbeten = head({ title: 'Arbeten | Byggd av Max', desc: 'Hemsidor som jag har byggt åt företag.', path: 'arbeten' }) + `
<section class="page-head">
  <div class="wrap">
    <h1 class="rise">Arbeten</h1>
    <p class="lead rise d1">Här samlar jag hemsidor jag har gjort åt företag, med vad uppdraget var och hur resultatet blev.</p>
  </div>
</section>
<section aria-labelledby="snart">
  <div class="wrap">
    <div class="empty">
      <div class="empty__visual glass reveal" aria-hidden="true"><span>Under arbete</span></div>
      <div class="empty__text glass reveal">
        <h2 id="snart">De första exemplen kommer snart</h2>
        <p>Flera sidor är på gång just nu. Hör av dig om du vill se exempel som passar ditt företag redan i dag.</p>
        <a class="btn btn--solid" href="/kontakt/">Kontakta mig</a>
      </div>
    </div>
    <!-- MALL för ett arbete (ta bort .empty ovan när det första läggs in):
    <article class="work glass">
      <img src="/img/arbeten/NAMN-desktop.webp" alt="Startsidan för NAMN" width="1440" height="900" loading="lazy">
      <div><h2 class="h2">Företagsnamn</h2><p class="lead">Bransch, ort och år. Vad uppdraget var i två meningar.</p><a class="btn" href="https://..." target="_blank" rel="noopener">Besök sidan</a></div>
    </article>
    -->
  </div>
</section>
` + foot;

const kontakt = head({ title: 'Kontakt | Byggd av Max', desc: `Ring ${PHONE} eller mejla ${MAIL} om du vill ha en ny hemsida.`, path: 'kontakt' }) + `
<section class="page-head">
  <div class="wrap">
    <h1 class="rise">Kontakt</h1>
    <p class="lead rise d1">Ring, sms:a eller mejla. Berätta kort om ditt företag, så återkommer jag så snart jag kan.</p>
  </div>
</section>
${contactPanel({ title: 'Enklast är att ringa', text: 'Eller skicka ett mejl om det passar bättre. Båda går direkt till mig.' }).replace('class="section"', 'class="section" style="padding-top:0"')}
<section class="section" aria-labelledby="med" style="padding-top:0">
  <div class="wrap split">
    <div class="section-head reveal">
      <h2 class="h2" id="med">Bra att skicka med</h2>
      <p class="lead">Inget av det här krävs, men det gör det lättare att ge dig ett bra svar direkt.</p>
    </div>
    <div class="bring">
      <div class="glass reveal"><i class="ph-light ph-storefront" aria-hidden="true"></i><p>Vad företaget heter och vad ni gör</p></div>
      <div class="glass reveal"><i class="ph-light ph-globe-simple" aria-hidden="true"></i><p>Adressen till er nuvarande hemsida, om ni har en</p></div>
      <div class="glass reveal"><i class="ph-light ph-target" aria-hidden="true"></i><p>Vad sidan ska hjälpa till med, till exempel bokningar eller fler kunder</p></div>
      <div class="glass reveal"><i class="ph-light ph-heart" aria-hidden="true"></i><p>Sidor du gillar, även från helt andra branscher</p></div>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="fragor" style="padding-top:0">
  <div class="wrap split">
    <div class="section-head reveal"><h2 class="h2" id="fragor">Vanliga frågor</h2></div>
    <div class="faq">
      <details class="glass"><summary>Vad kostar en hemsida?<i class="ph-light ph-plus" aria-hidden="true"></i></summary><p>Det beror på hur stor sidan är och vad den ska kunna. När jag vet vad du behöver får du ett fast pris innan jag börjar.</p></details>
      <details class="glass"><summary>Hur lång tid tar det?<i class="ph-light ph-plus" aria-hidden="true"></i></summary><p>Det beror på sidans storlek och hur snabbt texter och bilder finns på plats. Du får en tidsplan när vi har pratat.</p></details>
      <details class="glass"><summary>Kan du göra om vår nuvarande sida?<i class="ph-light ph-plus" aria-hidden="true"></i></summary><p>Ja. Jag går igenom er nuvarande sida, behåller det som fungerar och bygger om resten.</p></details>
      <details class="glass"><summary>Måste jag kunna något om webb?<i class="ph-light ph-plus" aria-hidden="true"></i></summary><p>Nej. Du berättar om företaget, och jag tar hand om resten. Du får se allt innan sidan går live.</p></details>
    </div>
  </div>
</section>
` + foot;

writeFileSync('index.html', home);
mkdirSync('arbeten', { recursive: true });
writeFileSync('arbeten/index.html', arbeten);
mkdirSync('kontakt', { recursive: true });
writeFileSync('kontakt/index.html', kontakt);
writeFileSync('404.html', head({ title: 'Sidan finns inte | Byggd av Max', desc: 'Sidan finns inte.', path: '' }) + `
<section class="page-head"><div class="wrap"><h1>Sidan finns inte</h1><p class="lead">Adressen kan vara fel, eller så har sidan flyttat.</p><div class="btn-row" style="margin-top:28px"><a class="btn btn--solid" href="/">Till startsidan</a></div></div></section>
` + foot);
console.log('4 sidor byggda');
