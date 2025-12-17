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
```
```
📋 Sistemske in programske zahteve
Za uspešno namestitev in zagon morajo biti izpolnjeni naslednji pogoji:

⚙️ Osnovna okolja
* **Node.js (LTS)**: v18.x ali novejša (priporočeno v22.12.0)
* **npm**: v10.x ali novejša
* **Angular CLI**: v19.0.3

📦 Ključni paketi (Dependencies)
Znotraj projekta so uporabljeni naslednji specifični paketi, ki so nujni za delovanje:

| Paket | Različica | Namen |
| :--- | :--- | :--- |
| **@angular/core** | ^19.0.0 | Osrednje ogrodje aplikacije (uporaba Signalov). |
| **primeng** | ^19.0.0 | Knjižnica UI komponent (Table, Dialog, Button, InputText). |
| **primeicons** | ^7.0.0 | Set ikon uporabljenih v uporabniškem vmesniku. |
| **json-server** | ^0.17.4 | Simulacija REST API zalednega sistema. |
| **rxjs** | ^7.8.1 | Reaktivno programiranje in upravljanje z asinhronimi podatki. |
```



## 🛠️ Funkcionalnosti za testiranje
Ko sta oba strežnika aktivna, lahko preizkusite naslednje:

Pregled podatkov: Tabela se samodejno napolni s podatki iz datoteke db.json.

Urejanje predmetov (Courses):

Izberite študenta in kliknite na ikono/gumb za urejanje.

V vnosno polje za predmete vpišite ime novega predmeta in pritisnite Enter.

Kliknite gumb "Save Changes".

Preverjanje: Po kliku na gumb se izvede HTTP PUT klic, ki trajno posodobi podatke v db.json.
```
 Struktura projekta
student-system-task/
├── src/
│   ├── app/
│   │   ├── students/              # Logika za upravljanje s študenti
│   │   │   ├── student-overview/  # Komponenta za pregled in tabelo
│   │   │   └── student.service.ts # API klici (GET, PUT)
│   │   ├── app.config.ts          # Konfiguracija aplikacije in PrimeNG
│   │   └── app.routes.ts          # Usmerjanje (Routing)
│   ├── assets/                    # Statične datoteke in slike
│   └── styles.scss                # Globalni stili in PrimeNG tema
├── db.json                        # Lokalna baza podatkov (JSON server)
├── package.json                   # Seznam odvisnosti in skript
└── angular.json                   # Konfiguracija Angular ogrodja
```


## 💻  Tehnološki sklad
Frontend: Angular 21 (z uporabo Signalov za upravljanje stanja).

UI Komponente: PrimeNG (za tabelo in modalna okna).

Backend simulacija: json-server (teče na portu 3001).

Oblikovanje: SCSS.

### Avtor: Gal Krajnik



