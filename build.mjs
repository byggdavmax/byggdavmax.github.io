// Bygger sidorna med stilmallen Kvarterskrog: node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const PHONE = '070-939 98 96';
const TEL = '+46709399896';
const MAIL = 'max.engellau@gmail.com';
const year = new Date().getFullYear();

const nav = (path, night) => `<header class="kk-header${night ? ' kk-header--night' : ''}">
    <a class="kk-wordmark" href="/">Byggd av Max</a>
    <nav class="kk-nav" aria-label="Huvudmeny">
      <a href="/arbeten/"${path === 'arbeten' ? ' aria-current="page"' : ''}>Arbeten</a>
      <a class="opt" href="/#sa-gar-det-till">Så går det till</a>
      <a href="/kontakt/"${path === 'kontakt' ? ' aria-current="page"' : ''}>Kontakt</a>
    </nav>
    <a class="kk-btn${night ? ' kk-btn--night' : ''}" href="tel:${TEL}">Ring mig</a>
  </header>`;

const head = ({ title, desc, path }) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#1c1816">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%231c1816'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='34' letter-spacing='2' fill='%23f3ede6' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/kvarterskrog.css">
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<a class="skip" href="#innehall">Hoppa till innehållet</a>
${path === 'home' ? '' : `<div class="head-bar">${nav(path, false)}</div>`}
<main id="innehall">
`;

const contact = (title = 'Kontakta mig', sub = 'Ring, sms:a eller mejla') => `<section class="band band--alt" id="kontakt" aria-labelledby="kontakt-rubrik">
  <div class="kk-section">
    <h2 class="kk-section__title" id="kontakt-rubrik">${title}</h2>
    <p class="kk-section__sub">${sub}</p>
  </div>
  <div class="wrap">
    <div class="ways">
      <div class="way">
        <p class="kk-label">Telefon</p>
        <a class="big" href="tel:${TEL}">${PHONE}</a>
        <div class="btn-row"><a class="kk-btn kk-btn--solid" href="tel:${TEL}">Ring</a><a class="kk-btn" href="sms:${TEL}">Sms</a><button class="kk-btn" type="button" data-copy="${PHONE}">Kopiera</button></div>
      </div>
      <div class="way">
        <p class="kk-label">Mejl</p>
        <a class="big" href="mailto:${MAIL}?subject=Ny%20hemsida">${MAIL}</a>
        <div class="btn-row"><a class="kk-btn kk-btn--solid" href="mailto:${MAIL}?subject=Ny%20hemsida">Mejla</a><button class="kk-btn" type="button" data-copy="${MAIL}">Kopiera</button></div>
      </div>
    </div>
  </div>
</section>
`;

const foot = `</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <p class="kk-wordmark" style="margin-bottom:16px">Byggd av Max</p>
        <p>Hemsidor för restauranger, gårdar, butiker och andra företag som vill synas på riktigt.</p>
      </div>
      <div>
        <h3 class="kk-label">Kontakt</h3>
        <ul><li><a href="tel:${TEL}">${PHONE}</a></li><li><a href="mailto:${MAIL}">${MAIL}</a></li></ul>
      </div>
      <div>
        <h3 class="kk-label">Sidor</h3>
        <ul><li><a href="/">Start</a></li><li><a href="/arbeten/">Arbeten</a></li><li><a href="/kontakt/">Kontakt</a></li></ul>
      </div>
    </div>
  </div>
  <div class="foot-base"><div class="wrap">© ${year} Byggd av Max</div></div>
</footer>
<script>
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var old = b.textContent;
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function () {
        b.textContent = 'Kopierat'; setTimeout(function () { b.textContent = old; }, 1600);
      }, function () {});
    });
  });
</script>
</body>
</html>
`;

const home = head({ title: 'Byggd av Max – hemsidor för företag', desc: `Jag bygger lugna, snygga och snabba hemsidor för företag. Ring ${PHONE} eller mejla ${MAIL}.`, path: 'home' }) + `
<section class="kk-hero">
  <div class="kk-hero__glow" aria-hidden="true"></div>
  ${nav('home', true)}
  <div class="kk-hero__body">
    <p class="kk-label rise">Hemsidor för företag</p>
    <h1 class="rise rise-2">En hemsida som känns som ditt företag</h1>
    <p class="hero-lead rise rise-3">Du har nog hittat hit via en sida jag har byggt. Jag gör lugna, snygga och snabba hemsidor för restauranger, gårdar, butiker och andra företag som vill synas på riktigt.</p>
    <div class="btn-row rise rise-4">
      <a class="kk-btn kk-btn--light" href="#kontakt">Kontakta mig</a>
      <a class="kk-btn kk-btn--night" href="/arbeten/">Se arbeten</a>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="ingar">
  <div class="kk-section">
    <h2 class="kk-section__title" id="ingar">Det här ingår</h2>
    <p class="kk-section__sub">Allt som behövs för en sida som syns</p>
    <p class="kk-section__text">Du behöver inte kunna något om webb. Jag tar hand om helheten, från första skiss till att sidan ligger ute.</p>
  </div>
  <div class="wrap">
    <div class="offer">
      <div><h3>Design</h3><p>En egen form som passar just ditt företag, inte en mall som tusen andra använder.</p></div>
      <div><h3>Text och bild</h3><p>Hjälp att formulera vad ni gör och att välja bilder som säger något.</p></div>
      <div><h3>Mobilen först</h3><p>De flesta besökare kommer från telefonen. Sidan byggs för dem från början.</p></div>
      <div><h3>Snabb och hittbar</h3><p>Lätt kod som laddar direkt, med grunderna för Google på plats.</p></div>
    </div>
  </div>
</section>

<section class="kk-statement" aria-label="Varje sida byggd för hand">
  <p class="kk-statement__small">Varje sida</p>
  <p class="kk-statement__big">Byggd för hand</p>
  <hr class="kk-statement__rule">
</section>

<section class="band" id="sa-gar-det-till" aria-labelledby="steg">
  <div class="kk-section">
    <h2 class="kk-section__title" id="steg">Så går det till</h2>
    <p class="kk-section__sub">Från första samtal till färdig sida</p>
  </div>
  <div class="wrap">
    <ol class="steps">
      <li><span class="n">1</span><h3>Vi pratar</h3><p>Du berättar om företaget, vilka ni vill nå och vad sidan ska göra. Har du en sida i dag går vi igenom vad som fungerar.</p></li>
      <li><span class="n">2</span><h3>Jag bygger ett förslag</h3><p>Du får en riktig sida att klicka runt i, med dina texter och bilder. Vi justerar tills den känns rätt.</p></li>
      <li><span class="n">3</span><h3>Sidan går live</h3><p>Jag lägger upp sidan, kopplar din adress och ser till att allt fungerar. Efteråt finns jag kvar om något behöver ändras.</p></li>
    </ol>
  </div>
</section>

${contact()}` + foot;

const arbeten = head({ title: 'Arbeten – Byggd av Max', desc: 'Exempel på hemsidor som jag har byggt åt företag.', path: 'arbeten' }) + `
<section class="band" aria-labelledby="arbeten-rubrik">
  <div class="kk-section page-title">
    <h1 class="kk-section__title rise" id="arbeten-rubrik">Arbeten</h1>
    <p class="kk-section__sub rise rise-2">Sidor jag har byggt</p>
    <p class="kk-section__text rise rise-3">Här samlar jag hemsidor jag har gjort åt företag, med vad uppdraget var och hur resultatet blev.</p>
  </div>
  <div class="wrap">
    <div class="empty">
      <div class="empty__frame" aria-hidden="true"><span>Under arbete</span></div>
      <h2 class="kk-label">De första exemplen kommer snart</h2>
      <p>Flera sidor är på gång just nu. Vill du se vad jag har gjort redan i dag? Hör av dig, så visar jag gärna exempel som passar ditt företag.</p>
      <a class="kk-btn" href="/kontakt/">Be om exempel</a>
    </div>

    <!-- MALL för ett arbete. Kopiera, fyll i och ta bort .empty ovan när första arbetet läggs in.
    <article class="work">
      <img src="/img/arbeten/NAMN-desktop.webp" alt="Startsidan för NAMN" width="1440" height="900" loading="lazy">
      <div class="kk-section">
        <h2 class="kk-section__title">Företagsnamn</h2>
        <p class="kk-section__sub">Bransch · Ort · År</p>
        <p class="kk-section__text">Vad uppdraget var och vad som blev bättre, i två meningar.</p>
        <a class="kk-btn" href="https://..." target="_blank" rel="noopener">Besök sidan</a>
      </div>
    </article>
    -->
  </div>
</section>

${contact('Vill du ha en egen?', 'Hör av dig så pratar vi')}` + foot;

const kontakt = head({ title: 'Kontakt – Byggd av Max', desc: `Ring ${PHONE} eller mejla ${MAIL} om du vill ha en ny hemsida.`, path: 'kontakt' }) + `
<section class="band" aria-labelledby="kontakt-sida">
  <div class="kk-section page-title">
    <h1 class="kk-section__title rise" id="kontakt-sida">Kontakt</h1>
    <p class="kk-section__sub rise rise-2">Ring, sms:a eller mejla</p>
    <p class="kk-section__text rise rise-3">Berätta kort om ditt företag, så återkommer jag så snart jag kan.</p>
  </div>
  <div class="wrap">
    <div class="ways">
      <div class="way">
        <p class="kk-label">Telefon</p>
        <a class="big" href="tel:${TEL}">${PHONE}</a>
        <div class="btn-row"><a class="kk-btn kk-btn--solid" href="tel:${TEL}">Ring</a><a class="kk-btn" href="sms:${TEL}">Sms</a><button class="kk-btn" type="button" data-copy="${PHONE}">Kopiera</button></div>
      </div>
      <div class="way">
        <p class="kk-label">Mejl</p>
        <a class="big" href="mailto:${MAIL}?subject=Ny%20hemsida">${MAIL}</a>
        <div class="btn-row"><a class="kk-btn kk-btn--solid" href="mailto:${MAIL}?subject=Ny%20hemsida">Mejla</a><button class="kk-btn" type="button" data-copy="${MAIL}">Kopiera</button></div>
      </div>
    </div>
  </div>
</section>

<section class="band band--alt" aria-labelledby="med">
  <div class="kk-section">
    <h2 class="kk-section__title" id="med">Bra att skicka med</h2>
    <p class="kk-section__sub">Inget krävs, men det hjälper</p>
  </div>
  <div class="wrap">
    <ul class="bring">
      <li>Vad företaget heter och vad ni gör</li>
      <li>Adressen till er nuvarande hemsida, om ni har en</li>
      <li>Vad sidan ska hjälpa till med, till exempel bokningar eller fler kunder</li>
      <li>Sidor du gillar, även från helt andra branscher</li>
    </ul>
  </div>
</section>

<section class="kk-statement" aria-label="Svar inom kort">
  <p class="kk-statement__small">Inga dumma frågor</p>
  <p class="kk-statement__big">Bara att höra av sig</p>
  <hr class="kk-statement__rule">
</section>

<section class="band" aria-labelledby="fragor">
  <div class="kk-section">
    <h2 class="kk-section__title" id="fragor">Vanliga frågor</h2>
    <p class="kk-section__sub">Fråga hellre en gång för mycket</p>
  </div>
  <div class="wrap">
    <div class="faq">
      <details><summary>Vad kostar en hemsida?</summary><p>Det beror på hur stor sidan är och vad den ska kunna. När jag vet vad du behöver får du ett fast pris innan jag börjar, så att det inte blir några överraskningar.</p></details>
      <details><summary>Hur lång tid tar det?</summary><p>Det beror på sidans storlek och hur snabbt texter och bilder finns på plats. Du får en tidsplan när vi har pratat.</p></details>
      <details><summary>Kan du göra om vår nuvarande sida?</summary><p>Ja. Jag går igenom er nuvarande sida, behåller det som fungerar och bygger om resten så att den känns modern och tydlig.</p></details>
      <details><summary>Måste jag kunna något om webb?</summary><p>Nej. Du berättar om företaget, och jag tar hand om resten. Du får se och tycka till om allt innan sidan går live.</p></details>
    </div>
  </div>
</section>
` + foot;

writeFileSync('index.html', home);
mkdirSync('arbeten', { recursive: true });
writeFileSync('arbeten/index.html', arbeten);
mkdirSync('kontakt', { recursive: true });
writeFileSync('kontakt/index.html', kontakt);
writeFileSync('404.html', head({ title: 'Sidan finns inte – Byggd av Max', desc: 'Sidan finns inte.', path: '' }) + `
<section class="band"><div class="kk-section page-title"><h1 class="kk-section__title">Sidan finns inte</h1><p class="kk-section__sub">Adressen kan vara fel</p><p class="kk-section__text"><a class="kk-btn" href="/">Till startsidan</a></p></div></section>
` + foot);
console.log('4 sidor byggda');
