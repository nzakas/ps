import './index.css'

export const Component = () => (
  <div style={{ height: '100%' }}>
    <picture>
      <source
        srcSet="home_700.avif 700w, home_1000.avif 1000w, home_1400.avif 1400w, home_2000.avif 2000w, home_2500.avif 2500w"
        type="image/avif"
      />
      <img
        src="home_700.webp"
        srcSet="home_700.webp 700w, home_1000.webp 1000w, home_1400.webp 1400w, home_2000.webp 2000w, home_2500.webp 2500w"
        sizes="100vw"
        alt="Spinnen-Ragwurz"
        className="img"
      />
    </picture>
    <div className="scroll-container">
      <h6 className="page-title">Bedrohte Arten und Biotope fördern</h6>
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">Arten oder Biotope</h3>
          Seltene und gefährdete Arten oder Biotope werden überwacht und
          gefördert.
          <br />
          <br />
          Arten und Biotoptypen werden in eigenen Teilprojekten erfasst.
        </div>
        <div className="card">
          <h3 className="card-title">Ziele</h3>
          beschreiben, wie sich Populationen und Biotope entwickeln sollen.
        </div>
        <div className="card">
          <h3 className="card-title">Verantwortliche</h3>
          organisieren Massnahmen und Kontrollen, analysieren und berichten.
        </div>
        <div className="card">
          <h3 className="card-title">Räume</h3>
          beschreiben einzelne Populationen und Biotope.
        </div>
        <div className="card">
          <h3 className="card-title">Zweistufige Räume</h3>
          Populationen können in Teil&shy;populationen, Biotope in Teilflächen
          gegliedert werden.
        </div>
        <div className="card">
          <h3 className="card-title">Massnahmen</h3>
          verbessern den Zustand einer Art oder eines Biotops.
        </div>
        <div className="card">
          <h3 className="card-title">Kontrollen</h3>
          erfassen den aktuellen Zustand von Populationen und Biotopen sowie die
          Wirkung von Massnahmen.
        </div>
        <div className="card">
          <h3 className="card-title">Berichte</h3>
          Verantwortliche berichten über die Entwick&shy;lung der Populationen
          und Biotope, den Erfolg der Massnahmen und die Errei&shy;chung der
          Ziele.
        </div>
        <div className="card">
          <h3 className="card-title">Beobachtungen</h3>
          Von Dritten gemeldete Beobachtungen werden geprüft und den
          Popula&shy;tionen und Biotopen zugeordnet.
        </div>
        <div className="card">
          <h3 className="card-title">Mobilfähig</h3>
          Promoting Species passt sich jeder Bildschirmgrösse an. Arbeiten Sie
          effizient auf Ihrem Smartphone, Tablet oder Computer.
        </div>
        <div className="card">
          <h3 className="card-title">Bring your own device</h3>
          Promoting Species funktioniert auf jedem Betriebssystem mit modernem
          Browser: Windows, MacOS, Linux, Android, iOS...
        </div>
        <div className="card">
          <h3 className="card-title">Kein Internet? Egal!</h3>
          Promoting Species funktioniert auch offline. Sobald Sie wieder online
          sind, werden die Daten synchronisiert.
        </div>
        <div className="card">
          <h3 className="card-title">Flexible Konfiguration</h3>
          Sie können Ihr Projekt individuell Ihren Bedürfnissen anpassen.
          Vermissen Sie eine Funktion? Wir sind interessiert!
        </div>
        <div className="card">
          <h3 className="card-title">Einfaches Onboarding</h3>
          Erfassen Sie neue Mitarbeitende mit deren Email. Ergänzen Sie diese
          Person bei allen Teilprojekten, in denen sie mitarbeiten soll. Fertig!
        </div>
        <div className="card">
          <h3 className="card-title">Teamwork</h3>
          Da die Daten laufend synchronisiert werden, können mehrere
          Mitarbeitende effizient gleichzeitig arbeiten.
          <br />
          <br />
          Aus versehen offline die gleichen Daten geändert? Nach der nächsten
          Synchronisierung kann das bereinigt werden. Sie sehen, wer wann was
          geändert hat.
        </div>
        <div className="card">
          <h3 className="card-title">Ihre Daten gehören Ihnen</h3>
          100% Ihrer Daten werden auf Ihr Gerät synchronisiert. Sie können
          jederzeit exportiert werden. TODO:
        </div>
      </div>
    </div>
  </div>
)
