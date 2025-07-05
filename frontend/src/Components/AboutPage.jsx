import React from 'react';

const AboutPage = () => {
  return (
    <div className="container py-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#343a40' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <h1 className="mb-4 fw-bold" style={{ color: '#004085' }}>
            Despre Expert Auto S.R.L.
          </h1>

          <p className="lead mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            În contextul actual al dezvoltării rapide a tehnologiei informației și comunicării, digitalizarea proceselor operaționale a devenit o condiție esențială pentru eficientizarea și modernizarea activităților din diverse domenii, inclusiv în sectorul service-urilor auto.
          </p>

          <p className="mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Companiile care activează în această industrie resimt o nevoie de a adopta soluții informatice care să le permită automatizarea activităților, gestionarea eficientă a datelor, precum și o comunicare rapidă și coerentă cu clienții.
          </p>

          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h3 className="card-title fw-semibold mb-3" style={{ color: '#0069d9' }}>
                Cine suntem?
              </h3>
              <p className="card-text" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Expert Auto S.R.L. este o companie aflată în fază de dezvoltare, înregistrată în România, care își propune să dezvolte o platformă digitală dedicată programărilor online la service-uri auto.
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h3 className="card-title fw-semibold mb-3" style={{ color: '#0069d9' }}>
                Obiectivele noastre
              </h3>
              <p className="card-text" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Firma are ca obiectiv principal digitalizarea interacțiunii dintre clienți și service-urile auto, printr-o aplicație web modernă, accesibilă din browser, care va permite programarea rapidă la diverse tipuri de reparații și intervenții auto.
              </p>
              <p className="card-text" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Aplicația își propune să răspundă unei nevoi reale de pe piață – aceea de a eficientiza procesul de căutare și programare la service-uri auto, printr-o interfață intuitivă și un sistem automatizat de gestionare a disponibilităților.
              </p>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="card-title fw-semibold mb-3" style={{ color: '#0069d9' }}>
                Beneficiile platformei
              </h3>
              <ul className="list-group list-group-flush" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <li className="list-group-item border-0 ps-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Proces rapid și sigur de accesare a serviciilor auto pentru clienți.
                </li>
                <li className="list-group-item border-0 ps-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Platformă ușor de gestionat pentru service-uri auto, cu beneficii în atragerea de clienți.
                </li>
                <li className="list-group-item border-0 ps-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Optimizarea activităților interne ale service-urilor auto.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
