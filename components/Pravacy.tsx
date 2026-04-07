import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-shop_light_green">
        Politique de gestion des avis
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Origine des avis</h2>
        <p>
          Des avis peuvent être déposés spontanément, par toute personne ayant utilisé un produit de Kuaku Market.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Absence de contrepartie</h2>
        <p>
          Aucune rémunération financière ni avantage autre que l’envoi éventuel du Produit à tester n’est accordé en échange du dépôt d’un avis. Kuaku Market ne privilégie ni ne supprime un avis en fonction de son caractère positif ou négatif.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Modération</h2>
        <p>
          Les avis sont modérés conformément à la politique de modération visant à :
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>supprimer les contenus injurieux, offensants, frauduleux ou contenant des données personnelles,</li>
          <li>vérifier la cohérence générale du commentaire.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Classement et affichage</h2>
        <p>
          Par défaut, les avis sont affichés du plus récent au plus ancien.
          L’utilisateur peut également trier les avis (par note, par ordre chronologique, etc.), lorsque l’interface du SITE le permet.
          La note moyenne affichée correspond à la moyenne arithmétique simple des avis publiés.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Droit de rectification et de retrait</h2>
        <p>
          L’auteur d’un avis peut, à tout moment :
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>modifier son avis,</li>
          <li>retirer son avis,</li>
          <li>demander la suppression de ses données.</li>
        </ul>
        
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Signalement d’un avis</h2>
        <p>
          Toute personne peut signaler un avis qu’elle estime :
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>diffamatoire,</li>
          <li>frauduleux,</li>
          <li>mensonger,</li>
          <li>ou ne respectant pas les conditions d’utilisation.</li>
        </ul>
        <p>
          Demande de signalement à adresser en cliquant sur « signaler » directement sur l’avis ciblé.
          La demande doit préciser le Produit concerné, le lien vers l’avis, la raison du signalement.
          Une analyse est effectuée sous 14 jours calendaires.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
