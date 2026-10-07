# faydesign.ch

Portfolio von Fatih Cölkusu, Head of Design (UX/UI, Designsysteme), Zürich.
Live: https://www.faydesign.ch

Statische Website ohne Build-Schritt: HTML, CSS und JavaScript.

- `index.html`: Startseite mit scrollgesteuerter Tinte-Kamerafahrt (Desktop- und Hochformat-Schnitt), DE/EN, Hell/Dunkel
- `impressum.html`, `datenschutz.html`: Rechtliches, DE/EN
- `assets/`: CSS, JS, selbst gehostete Schriften, Videos und Projektbilder

Lokale Vorschau:

```bash
python3 -m http.server 8123 --bind 127.0.0.1
```

Bei jeder Änderung an CSS oder JS den `?v=`-Parameter in den HTML-Dateien erhöhen, damit Browser die neue Version laden.
