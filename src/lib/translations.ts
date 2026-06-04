export type Lang = "it" | "de";

export const translations = {
  it: {
    nav: {
      home: "Home",
      catering: "Catering & Eventi",
      pasticceria: "Pasticceria",
      call: "Chiama",
    },
    hero: {
      kicker: "Bolzano",
      title: "Bistro Gambrinus",
      subtitle: "Il tuo momento di gusto",
      lead: "Caffetteria, pranzi veloci, aperitivi e pasticceria artigianale — nel cuore di Bolzano.",
      ctaMenu: "Menù del giorno",
      ctaQuote: "Richiedi preventivo",
    },
    intro: {
      kicker: "Benvenuti",
      body: "Un luogo dove il tempo rallenta, il caffè è una piccola cerimonia e ogni piatto racconta la freschezza degli ingredienti di stagione.",
      bodyItalic: "tempo rallenta",
    },
    specialties: {
      kicker: "Le nostre specialità",
      title: "Tre momenti,",
      titleItalic: "una sola passione.",
      lead: "Dal primo caffè della giornata all'aperitivo serale, Gambrinus accompagna i ritmi di Bolzano con cura artigianale.",
      items: [
        {
          title: "Aperitivi",
          text: "Spritz, vini selezionati e taglieri da condividere all'ora del tramonto.",
        },
        {
          title: "Pranzi Veloci",
          text: "Un menù che cambia ogni giorno, con ingredienti freschi di stagione.",
        },
        {
          title: "Caffetteria",
          text: "Espresso, cappuccini e pasticceria mignon per iniziare la giornata.",
        },
      ],
    },
    menu: {
      kicker: "Menù del Giorno",
      title: "Ogni giorno un menù diverso",
      titleItalic: "ed ingredienti freschi!",
      loading: "Caricamento…",
      empty: "Il menù di oggi sarà disponibile a breve.",
    },
    info: {
      where: "Dove siamo",
      phone: "Telefono",
      hours: "Orari",
      callNow: "Chiama ora",
      hoursLines: ["Lun – Ven · 07:30 – 20:00", "Sab · 07:30 – 13:15", "Dom · Chiuso"],
    },
    footer: {
      tagline:
        "Il tuo momento di gusto a Bolzano. Caffetteria, pranzi veloci, aperitivi e pasticceria artigianale dal cuore della città.",
      followFb: "Seguici su Facebook",
      contacts: "Contatti",
      hours: "Orari",
      reserved: "Area riservata",
    },
    catering: {
      kicker: "Catering & Eventi",
      title1: "Cene a richiesta,",
      title2: "eventi indimenticabili.",
      services: [
        {
          title: "Cene private a richiesta",
          text: "Menù degustazione su misura per serate intime, riservate o di rappresentanza.",
        },
        {
          title: "Compleanni & Feste",
          text: "Torte personalizzate, buffet e servizio dedicato per festeggiare in grande.",
        },
        {
          title: "Feste di laurea & Eventi",
          text: "Allestimenti curati, aperitivi e cene per celebrare i traguardi più importanti.",
        },
      ],
      form: {
        kicker: "Richiedi un preventivo",
        title: "Raccontaci il tuo evento",
        lead: "Risposta entro 24 ore lavorative.",
        name: "Nome e cognome *",
        email: "Email *",
        date: "Data evento *",
        guests: "Numero ospiti",
        requests: "Richieste particolari",
        submit: "Invia richiesta",
        submitting: "Invio in corso…",
        success: "Richiesta inviata! Ti contatteremo a breve.",
        errorRequired: "Compila i campi richiesti",
      },
    },
    pasticceria: {
      kicker: "Pasticceria & Bakery",
      title1: "Dolce,",
      title2: "artigianale.",
      lead: "Torte su ordinazione, pasticceria fresca ogni mattina, creazioni per ogni ricorrenza.",
      gallery: [
        { title: "Torte d'autore" },
        { title: "Pasticceria mignon" },
        { title: "Creazioni per cerimonie" },
      ],
      ctaTitle: "Una torta su misura?",
      ctaLead: "Chiamaci o vieni a trovarci per progettare insieme la tua creazione.",
    },
    mobileMenu: {
      address: "Viale Duca d'Aosta, Bolzano",
      hoursShort: "Lun–Ven 07:30–20:00 · Sab 07:30–13:15",
    },
    admin: {
      kicker: "Area amministratore",
      tabMenu: "Menù del giorno",
      tabRequests: "Richieste catering",
      menuTitle: "Menù del giorno",
      menuLead: "Aggiungi, modifica o rimuovi i piatti. Le modifiche sono immediate.",
      requestsTitle: "Richieste catering",
      requestsLead:
        "Messaggi ricevuti dal modulo Catering & Eventi. Vengono eliminati automaticamente dopo 3 mesi.",
      requestsEmpty: "Nessuna richiesta al momento.",
      logout: "Esci",
      addDish: "Aggiungi piatto",
      dishName: "Nome piatto",
      dishDesc: "Descrizione (opzionale)",
      saved: "Salvato",
      deleted: "Eliminato",
      nameRequired: "Il nome è obbligatorio",
      markRead: "Segna come letto",
      archive: "Archivia",
      unarchive: "Riapri",
      delete: "Elimina",
      status: { new: "Nuovo", read: "Letto", archived: "Archiviato" },
      eventDate: "Data evento",
      guests: "Ospiti",
      message: "Messaggio",
      receivedOn: "Ricevuta il",
      expiresIn: "Scade tra",
      days: "giorni",
    },
  },
  de: {
    nav: {
      home: "Home",
      catering: "Catering & Events",
      pasticceria: "Konditorei",
      call: "Anrufen",
    },
    hero: {
      kicker: "Bozen",
      title: "Bistro Gambrinus",
      subtitle: "Dein Genussmoment",
      lead: "Kaffeebar, schnelles Mittagessen, Aperitifs und handwerkliche Konditorei — im Herzen von Bozen.",
      ctaMenu: "Heutiges Menü",
      ctaQuote: "Angebot anfordern",
    },
    intro: {
      kicker: "Willkommen",
      body: "Ein Ort, an dem die Zeit langsamer vergeht, Kaffee ein kleines Ritual ist und jedes Gericht die Geschichte saisonaler Zutaten erzählt.",
      bodyItalic: "die Zeit langsamer vergeht",
    },
    specialties: {
      kicker: "Unsere Spezialitäten",
      title: "Drei Momente,",
      titleItalic: "eine einzige Leidenschaft.",
      lead: "Vom ersten Kaffee des Tages bis zum abendlichen Aperitif begleitet das Gambrinus den Rhythmus Bozens mit handwerklicher Sorgfalt.",
      items: [
        {
          title: "Aperitifs",
          text: "Spritz, ausgewählte Weine und Genussplatten zum Sonnenuntergang.",
        },
        {
          title: "Schnelles Mittagessen",
          text: "Ein täglich wechselndes Menü mit frischen, saisonalen Zutaten.",
        },
        {
          title: "Kaffeebar",
          text: "Espresso, Cappuccino und Mignon-Gebäck für den perfekten Start in den Tag.",
        },
      ],
    },
    menu: {
      kicker: "Heutiges Menü",
      title: "Jeden Tag ein anderes Menü",
      titleItalic: "mit frischen Zutaten!",
      loading: "Wird geladen…",
      empty: "Das heutige Menü ist in Kürze verfügbar.",
    },
    info: {
      where: "Wo wir sind",
      phone: "Telefon",
      hours: "Öffnungszeiten",
      callNow: "Jetzt anrufen",
      hoursLines: ["Mo – Fr · 7:30 – 20:00 Uhr", "Sa · 7:30 – 13:15 Uhr", "So · Geschlossen"],
    },
    footer: {
      tagline:
        "Dein Genussmoment in Bozen. Kaffeebar, schnelles Mittagessen, Aperitifs und handwerkliche Konditorei im Herzen der Stadt.",
      followFb: "Folge uns auf Facebook",
      contacts: "Kontakte",
      hours: "Öffnungszeiten",
      reserved: "Mitarbeiterbereich",
    },
    catering: {
      kicker: "Catering & Events",
      title1: "Abendessen auf Anfrage,",
      title2: "unvergessliche Events.",
      services: [
        {
          title: "Private Abendessen auf Anfrage",
          text: "Individuelle Degustationsmenüs für exklusive private oder geschäftliche Abende.",
        },
        {
          title: "Geburtstage & Feiern",
          text: "Maßgeschneiderte Torten, Buffets und erstklassiger Service, um stilvoll zu feiern.",
        },
        {
          title: "Sponsionen & Events",
          text: "Elegante Dekoration, Aperitifs und Abendessen, um die wichtigsten Meilensteine zu zelebrieren.",
        },
      ],
      form: {
        kicker: "Angebot anfordern",
        title: "Erzähle uns von deinem Event",
        lead: "Antwort innerhalb von 24 Werktstunden.",
        name: "Vollständiger Name *",
        email: "E-Mail *",
        date: "Event-Datum *",
        guests: "Anzahl der Gäste",
        requests: "Besondere Wünsche",
        submit: "Anfrage senden",
        submitting: "Wird gesendet…",
        success: "Anfrage gesendet! Wir werden dich in Kürze kontaktieren.",
        errorRequired: "Bitte fülle die Pflichtfelder aus",
      },
    },
    pasticceria: {
      kicker: "Konditorei & Backwaren",
      title1: "Süß,",
      title2: "handgemacht.",
      lead: "Torten auf Bestellung, frisches Gebäck jeden Morgen, Kreationen für jeden Anlass.",
      gallery: [
        { title: "Spezialtorten" },
        { title: "Mignon-Gebäck" },
        { title: "Kreationen für Feierlichkeiten" },
      ],
      ctaTitle: "Eine individuelle Torte?",
      ctaLead: "Rufe uns an oder besuche uns, um deine Kreation gemeinsam zu planen.",
    },
    mobileMenu: {
      address: "Herzog-Aosta-Straße, Bozen",
      hoursShort: "Mo–Fr 7:30–20:00 · Sa 7:30–13:15",
    },
    admin: {
      kicker: "Admin-Bereich",
      tabMenu: "Tagesmenü",
      tabRequests: "Catering-Posteingang",
      menuTitle: "Tagesmenü",
      menuLead: "Gerichte hinzufügen, bearbeiten oder entfernen. Änderungen sind sofort live.",
      requestsTitle: "Catering-Anfragen",
      requestsLead:
        "Über das Catering- & Eventformular empfangene Nachrichten. Werden automatisch nach 3 Monaten gelöscht.",
      requestsEmpty: "Noch keine Anfragen vorhanden.",
      logout: "Abmelden",
      addDish: "Gericht hinzufügen",
      dishName: "Name des Gerichts",
      dishDesc: "Beschreibung (optional)",
      saved: "Gespeichert",
      deleted: "Gelöscht",
      nameRequired: "Name ist erforderlich",
      markRead: "Als gelesen markieren",
      archive: "Archivieren",
      unarchive: "Wieder öffnen",
      delete: "Löschen",
      status: { new: "Neu", read: "Gelesen", archived: "Archiviert" },
      eventDate: "Event-Datum",
      guests: "Gäste",
      message: "Nachricht",
      receivedOn: "Empfangen am",
      expiresIn: "Läuft ab in",
      days: "Tagen",
    },
  },
} as const;

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? readonly DeepWiden<U>[]
  : T extends object
  ? { readonly [K in keyof T]: DeepWiden<T[K]> }
  : T;

export type Dict = DeepWiden<typeof translations.it>;
