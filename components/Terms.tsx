import Container from '@/components/Container';
import React from 'react';

const Terms = () => {
  return (
    <Container className="py-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-shop_light_green">
        TERMS OF USE OF THE KUAKU MARKET WEBSITE
      </h1>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Editeur et responsable du Site</h3>
        <h4 className="text-xl font-medium mb-1">Kuaku market</h4>
        <p className="mb-2">
          Etablissement au capital de 10,000,000 FCFA<br />
          Siège social : BP3114 Yaoundé
        </p>
        <p className="mb-4 font-semibold">Crédits</p>
        <p className="mb-4">
          Conception, Webdesign & Développement
        </p>
      </section>

      <section className="mb-8">
        <ul className="list-decimal list-inside space-y-6 text-gray-700 leading-relaxed">
          <li>
            <p>
              <strong> Définitions</strong><br />
              Le présent article a pour objet de définir les termes suivants utilisés au sein des CGU :<br />
              <em>« Contenu »</em> : désigne l’ensemble des informations, documents, textes, visuels, données et éléments de toute nature communiqués par l’Éditeur sur le Site.<br />
              <em>« Données Personnelles »</em> : désigne toute information se rapportant à une personne physique identifiée ou identifiable, collectée et traitée dans le cadre de l’utilisation du Site.<br />
              <em>« Services »</em> : désigne l’accès au Site, à son Contenu et aux fonctionnalités associées, notamment la consultation des produits de la marque TOPICREM et des informations associées.<br />
              <em>« Site »</em> : désigne le site internet accessible à l’adresse https://fr.kuakumarket.com/<br />
              <em>« Utilisateur »</em> : désigne toute personne physique ou morale accédant au Site et utilisant ses Services.
            </p>
          </li>

          <li>
            <p>
              <strong> Accord préalable</strong><br />
              Le Site est développé et fourni par l’Éditeur.<br />
              L’accès et l’utilisation du Site par l’Utilisateur sont soumis aux présentes Conditions Générales d’Utilisation (ci-après les « CGU »), ainsi qu’aux lois et règlements en vigueur.<br />
              En accédant au Site, en le consultant ou en utilisant ses Services, l’Utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepte sans restriction ni réserve.
            </p>
          </li>

          <li>
            <p>
              <strong> Non-respect des Conditions Générales d’Utilisation</strong><br />
              Si l’éditeur prend connaissance d’une violation des présentes conditions générales d’utilisation par l’utilisateur, il pourra prendre immédiatement toute mesure corrective, y compris suspendre ou bloquer l’accès de l’utilisateur au site, à tout moment et sans préavis.<br />
              Si la violation cause un préjudice à l’éditeur, ce dernier pourra, à sa discrétion, réclamer à l’utilisateur des dommages et intérêts.
            </p>
          </li>

          <li>
            <p>
              <strong> Effets indésirables / effets secondaires / Incidents</strong><br />
              Les utilisateurs et clients sont invités à signaler toute réclamation relative aux produits Topicrem, notamment en cas de non-conformité ou de réaction indésirable liée à leur utilisation.<br />
              Ces signalements peuvent être effectués via le formulaire de contact disponible sur le site https://kuakumarket.com/<br />
              L’éditeur s’engage à traiter toute réclamation dans les meilleurs délais, conformément à la réglementation applicable aux produits cosmétiques.
            </p>
          </li>

          <li>
            <p>
              <strong> Divisibilité</strong><br />
              La non-validité ou l’inapplicabilité d’une ou de plusieurs dispositions des présentes conditions générales d’utilisation n’affecte pas la validité des autres dispositions, qui resteront pleinement en vigueur, sauf si la clause invalidée constituait un élément essentiel des présentes.<br /><br />
              <strong> Lois applicables</strong><br />
              Les présentes conditions générales d’utilisation et l’utilisation du site sont régies par le droit français, à l’exclusion de ses règles de conflit de lois.<br /><br />
              <strong> Règlement des litiges</strong><br />
              Tout différend relatif aux présentes conditions générales d’utilisation ou à l’utilisation du site qui ne pourrait être réglé à l’amiable sera soumis à la compétence exclusive du tribunal de commerce de Nanterre, nonobstant pluralité de défendeurs ou appel en garantie.
            </p>
          </li>
        </ul>
      </section>

     
    </Container>
  );
};

export default Terms;
