// Bygger sidorna: node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const PHONE = '070-939 98 96';
const TEL = '+46709399896';
const MAIL = 'max.engellau@gmail.com';
const year = new Date().getFullYear();

const head = ({ title, desc, path }) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#fbfaf7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131211" media="(prefers-color-scheme: dark)">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23171615'/%3E%3Ctext x='32' y='44' font-family='Georgia,serif' font-style='italic' font-size='38' fill='%23fbfaf7' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<a class="skip" href="#innehall">Hoppa till innehållet</a>
<header class="site-head">
  <div class="wrap">
    <a class="mark" href="/">Byggd av <b>Max</b></a>
    <nav class="nav" aria-label="Huvudmeny">
      <a href="/arbeten/"${path === 'arbeten' ? ' aria-current="page"' : ''}>Arbeten</a>
      <a class="opt" href="/#sa-funkar-det">Så går det till</a>
      <a href="/kontakt/"${path === 'kontakt' ? ' aria-current="page"' : ''}>Kontakt</a>
      <a class="btn" href="tel:${TEL}">Ring ${PHONE}</a>
    </nav>
  </div>
</header>
<main id="innehall">
`;

const cta = `<section class="cta" aria-labelledby="cta-rubrik">
  <div class="wrap">
    <p class="label">Kontakt</p>
    <h2 id="cta-rubrik">Har du ett företag som förtjänar en <em>bättre</em> hemsida?</h2>
    <div class="cta__ways">
      <div class="way">
        <p class="label">Ring eller sms:a</p>
        <a class="big" href="tel:${TEL}">${PHONE}</a>
        <div class="small"><a href="sms:${TEL}">Skicka sms</a><button type="button" data-copy="${PHONE}">Kopiera</button></div>
      </div>
      <div class="way">
        <p class="label">Mejla</p>
        <a class="big" href="mailto:${MAIL}?subject=Ny%20hemsida">${MAIL}</a>
        <div class="small"><a href="mailto:${MAIL}?subject=Ny%20hemsida">Skriv ett mejl</a><button type="button" data-copy="${MAIL}">Kopiera</button></div>
      </div>
    </div>
  </div>
</section>
`;

const foot = `</main>
<footer class="site-foot">
  <div class="wrap">
    <span>© ${year} Byggd av Max</span>
    <nav aria-label="Sidfot"><a href="/arbeten/">Arbeten</a><a href="/kontakt/">Kontakt</a><a href="mailto:${MAIL}">${MAIL}</a></nav>
  </div>
</footer>
<script>
  var h = document.querySelector('.site-head');
  var onScroll = function () { h.classList.toggle('is-scrolled', window.scrollY > 8); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
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

const home = head({ title: 'Byggd av Max – hemsidor för företag', desc: `Jag bygger rena, snabba och personliga hemsidor för företag. Ring ${PHONE} eller mejla ${MAIL}.`, path: 'home' }) + `
<section class="hero">
  <div class="wrap">
    <p class="label rise">Hemsidor för företag</p>
    <h1 class="display rise rise-2">En hemsida som känns som <em>ditt</em> företag.</h1>
    <div class="hero__foot rise rise-3">
      <p class="lead">Du har nog hittat hit via en sida jag har byggt. Jag gör lugna, snygga och snabba hemsidor för restauranger, gårdar, butiker och andra företag som vill synas på riktigt.</p>
      <div class="actions">
        <a class="btn btn--solid" href="/kontakt/">Kontakta mig <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn" href="/arbeten/">Se arbeten</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ingar">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="ingar">Det här ingår</h2>
      <p>Allt som behövs för att sidan ska se bra ut, vara lätt att hitta och fungera på alla skärmar. Du behöver inte kunna något om webb.</p>
    </div>
    <div class="offer">
      <div><h3>Design</h3><p>En egen form som passar just ditt företag, inte en mall som tusen andra använder.</p></div>
      <div><h3>Text och bild</h3><p>Hjälp att formulera vad ni gör och att välja bilder som säger något.</p></div>
      <div><h3>Mobilen först</h3><p>De flesta besökare kommer från telefonen. Sidan byggs för dem från början.</p></div>
      <div><h3>Snabb och hittbar</h3><p>Lätt kod som laddar direkt, med grunderna för Google på plats.</p></div>
    </div>
  </div>
</section>

<section class="section section--tint" id="sa-funkar-det" aria-labelledby="steg">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="steg">Så går det till</h2>
      <p>Tre steg från första samtal till färdig sida. Du ser resultatet på riktigt innan något bestäms.</p>
    </div>
    <ol class="steps">
      <li><div><span class="n">01</span><h3>Vi pratar</h3></div><p>Du berättar om företaget, vilka ni vill nå och vad sidan ska göra. Har du en sida i dag går vi igenom vad som fungerar och vad som inte gör det.</p></li>
      <li><div><span class="n">02</span><h3>Jag bygger ett förslag</h3></div><p>Du får en riktig sida att klicka runt i, med dina texter och bilder. Vi justerar tills den känns rätt.</p></li>
      <li><div><span class="n">03</span><h3>Sidan går live</h3></div><p>Jag lägger upp sidan, kopplar din adress och ser till att allt fungerar. Efteråt finns jag kvar om något behöver ändras.</p></li>
    </ol>
  </div>
</section>

${cta}` + foot;

const arbeten = head({ title: 'Arbeten – Byggd av Max', desc: 'Exempel på hemsidor som jag har byggt åt företag.', path: 'arbeten' }) + `
<section class="page-head">
  <div class="wrap">
    <p class="label rise">Arbeten</p>
    <h1 class="rise rise-2">Sidor jag har byggt</h1>
    <p class="lead rise rise-3">Här samlar jag hemsidor jag har gjort åt företag, med vad uppdraget var och hur resultatet blev.</p>
  </div>
</section>

<section class="section" aria-labelledby="snart" style="padding-top:0;border-top:0">
  <div class="wrap">
    <div class="empty">
      <div>
        <h2 id="snart">De första exemplen kommer snart.</h2>
        <p>Flera sidor är på gång just nu. Vill du se vad jag har gjort redan i dag? Hör av dig, så visar jag gärna exempel som passar ditt företag.</p>
        <a class="link" href="/kontakt/">Be om exempel <span class="arrow" aria-hidden="true">→</span></a>
      </div>
      <div class="empty__frame" aria-hidden="true"><span>Under arbete</span></div>
    </div>

    <!-- MALL för ett arbete. Kopiera, fyll i och ta bort .empty ovan när första arbetet läggs in.
    <article class="work">
      <img class="work__shot" src="/img/arbeten/NAMN-desktop.webp" alt="Startsidan för NAMN" width="1440" height="900" loading="lazy">
      <div class="work__meta">
        <div><p class="label">Bransch · Ort · År</p><h2>Företagsnamn</h2></div>
        <p>Vad uppdraget var och vad som blev bättre, i två meningar. <a class="link" href="https://..." target="_blank" rel="noopener">Besök sidan <span class="arrow" aria-hidden="true">→</span></a></p>
      </div>
    </article>
    -->
  </div>
</section>

${cta}` + foot;

const kontakt = head({ title: 'Kontakt – Byggd av Max', desc: `Ring ${PHONE} eller mejla ${MAIL} om du vill ha en ny hemsida.`, path: 'kontakt' }) + `
<section class="page-head">
  <div class="wrap">
    <p class="label rise">Kontakt</p>
    <h1 class="rise rise-2">Hör av dig</h1>
    <p class="lead rise rise-3">Ring, sms:a eller mejla. Berätta kort om ditt företag, så återkommer jag så snart jag kan.</p>
  </div>
</section>

${cta.replace('<p class="label">Kontakt</p>
    ', '').replace('<h2 id="cta-rubrik">Har du ett företag som förtjänar en <em>bättre</em> hemsida?</h2>', '<h2 id="cta-rubrik">Enklast är att <em>ringa</em> eller mejla.</h2>')}
<section class="section" aria-labelledby="med" style="border-top:0">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="med">Bra att skicka med</h2>
      <p>Inget av det här krävs, men det gör det lättare att ge dig ett bra svar direkt.</p>
    </div>
    <ul class="bring">
      <li>Vad företaget heter och vad ni gör</li>
      <li>Adressen till er nuvarande hemsida, om ni har en</li>
      <li>Vad sidan ska hjälpa till med, till exempel bokningar, fler kunder eller att se mer seriös ut</li>
      <li>Sidor du gillar, även från helt andra branscher</li>
    </ul>
  </div>
</section>

<section class="section section--tint" aria-labelledby="fragor">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="fragor">Vanliga frågor</h2>
      <p>Hittar du inte svaret här? Fråga hellre en gång för mycket.</p>
    </div>
    <div class="faq">
      <details><summary>Vad kostar en hemsida?</summary><p>Det beror på hur stor sidan är och vad den ska kunna. När jag vet vad du behöver får du ett fast pris innan jag börjar, så att det inte blir några överraskningar.</p></details>
      <details><summary>Hur lång tid tar det?</summary><p>Det beror på sidans storlek och hur snabbt texter och bilder finns på plats. Du får en tidsplan när vi har pratat.</p></details>
      <details><summary>Vi har redan en hemsida. Kan du göra om den?</summary><p>Ja. Jag går igenom er nuvarande sida, behåller det som fungerar och bygger om resten så att den känns modern och tydlig.</p></details>
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
<section class="page-head"><div class="wrap"><p class="label">404</p><h1>Sidan finns inte</h1><p class="lead">Adressen kan vara fel, eller så har sidan flyttat. <a class="link" href="/">Till startsidan <span class="arrow" aria-hidden="true">→</span></a></p></div></section>
` + foot);
console.log('4 sidor byggda');
