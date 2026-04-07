import React from 'react';

const Faqs = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-shop_light_green">
        Foire aux Questions (FAQs)
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Comment puis-je me procurer des échantillons ?
        </h2>
        <p>
          Nous vous invitons à vous rendre sur le site{' '}
          <a
            href="https://kuakumarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-shop_light_green underline"
          >
            kuakumarket.com
          </a>{' '}
          pour voir les échantillons correspondants à votre type de peau.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Combien de temps un produit peut-il être conservé avant d&apos;être ouvert ?
        </h2>
        <p>
          Vous pouvez vous référer à la date de péremption indiquée sur nos produits.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Combien de temps peut-on conserver un produit après ouverture ?
        </h2>
        <p>
          Nous mentionnons la PAO ou &quot;Période Après Ouverture&quot; indiquée par un pictogramme représentant un pot ouvert, qui désigne la durée d&apos;utilisation recommandée après ouverture de l&apos;emballage. Elle varie généralement de 6 mois (6M) à 24 mois (24M).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Pourquoi avoir changé le nom du produit MELA Lait Unifiant Ultra-Hydratant ?
        </h2>
        <p>
          Notre MELA Lait Unifiant Ultra-Hydratant, anciennement connu sous le nom de MELA Lait Éclaircissant Ultra-Hydratant, est conçu pour unifier, corriger et prévenir les taches pigmentaires. Notre produit lisse les taches pigmentaires, rend la peau éclatante sans modifier le teint. Nous avons modifié le nom du produit d&apos;Éclaircissant à Unifiant pour nous rapprocher de son véritable objectif.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Pourquoi modifier les packagings / formules de certains de vos produits ?
        </h2>
        <p>
          Votre préoccupation est la nôtre. Nous œuvrons pour votre bien-être en vous proposant des formules toujours plus innovantes et à la pointe de la technologie. Nous évoluons avec notre temps, tout comme nos packagings.
        </p>
      </section>
    </div>
  );
};

export default Faqs;
