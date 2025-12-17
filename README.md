# Študentski informacijski sistem (Student System Task)

Ta projekt je razvit kot rešitev za upravljanje podatkov o študentih in njihovih predmetih. Aplikacija omogoča pregled seznama študentov ter urejanje njihovih obveznosti prek interaktivnega uporabniškega vmesnika.

## 🚀 Navodila za namestitev in zagon

Za pravilno delovanje aplikacije morata biti hkrati zagnana dva strežnika: zaledni sistem (simulacija baze) in sprednji del (Angular aplikacija).

### 1. Namestitev odvisnosti
Pred prvim zagonom v korenu projekta namestite vse potrebne pakete:
```bash
npm install
2. Zagon zalednega strežnika (JSON Server)

Zaledni sistem uporablja json-server za simulacijo API-ja in shranjevanje podatkov v db.json. Strežnik je nastavljen na vrata 3001. V prvem terminalu zaženite:

Bash
npm run server
3. Zagon Angular aplikacije

V drugem (ločenem) terminalu zaženite razvojni strežnik za sprednji del:

Bash
ng serve
Aplikacija bo dostopna na naslovu: http://localhost:4200/.

🛠️ Funkcionalnosti za testiranje
Ko sta oba strežnika aktivna, lahko preizkusite naslednje:

Pregled podatkov: Tabela se samodejno napolni s podatki iz datoteke db.json.

Urejanje predmetov (Courses):

Izberite študenta in kliknite na ikono/gumb za urejanje.

V vnosno polje za predmete vpišite ime novega predmeta in pritisnite Enter.

Kliknite gumb "Save Changes".

Preverjanje: Po kliku na gumb se izvede HTTP PUT klic, ki trajno posodobi podatke v db.json.
```




## 💻  Tehnološki sklad
Frontend: Angular 21 (z uporabo Signalov za upravljanje stanja).

UI Komponente: PrimeNG (za tabelo in modalna okna).

Backend simulacija: json-server (teče na portu 3001).

Oblikovanje: SCSS.

### Avtor: Gal Krajnik



