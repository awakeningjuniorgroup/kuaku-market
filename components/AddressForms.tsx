// components/AddressForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Données Afrique Centrale
const PAYS_DATA: Record<
  string,
  { code: string; flag: string; format: string; villes: string[] }
> = {
  Cameroun: {
    code: "+237",
    flag: "🇨🇲",
    format: "6XX XXX XXX",
    villes: [
      "Yaoundé","Douala","Bafoussam","Garoua","Maroua","Bamenda",
      "Ngaoundéré","Bertoua","Ebolowa","Limbé","Kribi","Kumba",
      "Nkongsamba","Edéa","Sangmélima",
    ],
  },
  "Congo (RDC)": {
    code: "+243",
    flag: "🇨🇩",
    format: "8X XXX XXXX",
    villes: [
      "Kinshasa","Lubumbashi","Mbuji-Mayi","Kananga","Kisangani",
      "Bukavu","Goma","Bunia","Tshikapa","Kolwezi","Likasi",
      "Matadi","Uvira","Kalemie","Beni",
    ],
  },
  "Congo (Brazzaville)": {
    code: "+242",
    flag: "🇨🇬",
    format: "XX XXX XXXX",
    villes: [
      "Brazzaville","Pointe-Noire","Dolisie","Nkayi","Impfondo",
      "Ouesso","Madingou","Sibiti","Mossendjo","Kinkala",
      "Owando","Djambala","Gamboma","Ewo","Loandjili",
    ],
  },
  Gabon: {
    code: "+241",
    flag: "🇬🇦",
    format: "0X XX XX XX",
    villes: [
      "Libreville","Port-Gentil","Franceville","Oyem","Moanda",
      "Mouila","Lambaréné","Tchibanga","Koulamoutou","Makokou",
      "Bitam","Gamba","Lastoursville","Ndendé","Booué",
    ],
  },
  Tchad: {
    code: "+235",
    flag: "🇹🇩",
    format: "XX XX XX XX",
    villes: [
      "N'Djamena","Moundou","Sarh","Abéché","Kélo","Koumra",
      "Pala","Am Timan","Bongor","Doba","Mongo","Bol",
      "Faya-Largeau","Léré","Massakory",
    ],
  },
  "République centrafricaine": {
    code: "+236",
    flag: "🇨🇫",
    format: "XX XX XX XX",
    villes: [
      "Bangui","Bimbo","Mbaïki","Berberati","Kaga-Bandoro",
      "Bambari","Bouar","Bossangoa","Bria","Nola","Carnot",
      "Sibut","Ndélé","Alindao","Paoua",
    ],
  },
  "Guinée équatoriale": {
    code: "+240",
    flag: "🇬🇶",
    format: "XXX XXX XXX",
    villes: [
      "Malabo","Bata","Ebebiyin","Aconibe","Añisoc","Luba",
      "Evinayong","Mongomo","Cogo","Riaba","Moka","Rebola",
      "Bioko","Niefang","Acalayong",
    ],
  },
  "São Tomé-et-Príncipe": {
    code: "+239",
    flag: "🇸🇹",
    format: "XXX XXXX",
    villes: [
      "São Tomé","Santo António","Neves","Santana","Trindade",
      "São João dos Angolares","Guadalupe","Santa Cruz","Pantufo","Angolares",
    ],
  },
};

export interface AddressFormData {
  name: string;
  phone: string;
  phoneCode: string;
  pays: string;
  ville: string;
  quartier: string;
}

interface AddressFormProps {
  onSave: (address: AddressFormData) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const AddressForm = ({ onSave, onCancel, showCancelButton = true }: AddressFormProps) => {
  const [form, setForm] = useState<AddressFormData>({
    name: "",
    phone: "",
    phoneCode: "",
    pays: "",
    ville: "",
    quartier: "",
  });

  const paysInfo = form.pays ? PAYS_DATA[form.pays] : null;
  const villes = paysInfo?.villes ?? [];

  const handlePaysChange = (pays: string) => {
    const info = PAYS_DATA[pays];
    setForm((f) => ({
      ...f,
      pays,
      ville: "",
      phoneCode: info?.code ?? f.phoneCode,
    }));
  };

  const handlePhoneCodeChange = (code: string) => {
    const matchedPays = Object.keys(PAYS_DATA).find(
      (p) => PAYS_DATA[p].code === code
    );
    setForm((f) => ({
      ...f,
      phoneCode: code,
      pays: matchedPays ?? f.pays,
      ville: matchedPays && matchedPays !== f.pays ? "" : f.ville,
    }));
  };

  const handleSubmit = () => {
    const { name, phone, phoneCode, pays, ville } = form;
    if (!name || !phone || !phoneCode || !pays || !ville) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onSave(form);
    toast.success("Adresse ajoutée avec succès !");
  };

  const inputCls =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black";
  const labelCls = "block text-xs text-gray-500 mb-1";

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Nouvelle adresse de livraison
        </h3>
        {showCancelButton && onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nom complet */}
      <div>
        <label className={labelCls}>Nom complet *</label>
        <input
          className={inputCls}
          placeholder="Ex : Jean-Pierre Mbarga"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className={labelCls}>Téléphone *</label>
        <div className="flex gap-2">
          <select
            className="border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black w-36 shrink-0"
            value={form.phoneCode}
            onChange={(e) => handlePhoneCodeChange(e.target.value)}
          >
            <option value="">-- Indicatif --</option>
            {Object.entries(PAYS_DATA).map(([pays, info]) => (
              <option key={pays} value={info.code}>
                {info.flag} {info.code}
              </option>
            ))}
          </select>
          <input
            className={inputCls}
            type="tel"
            placeholder={paysInfo?.format ?? "Numéro"}
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Pays */}
      <div>
        <label className={labelCls}>Pays *</label>
        <select
          className={inputCls}
          value={form.pays}
          onChange={(e) => handlePaysChange(e.target.value)}
        >
          <option value="">-- Sélectionnez un pays --</option>
          {Object.entries(PAYS_DATA).map(([pays, info]) => (
            <option key={pays} value={pays}>
              {info.flag}  {pays}
            </option>
          ))}
        </select>
      </div>

      {/* Ville + Quartier */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Ville *</label>
          <select
            className={inputCls}
            value={form.ville}
            disabled={!form.pays}
            onChange={(e) =>
              setForm((f) => ({ ...f, ville: e.target.value }))
            }
          >
            <option value="">
              {form.pays ? "-- Choisir --" : "-- Pays d'abord --"}
            </option>
            {villes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Quartier</label>
          <input
            className={inputCls}
            placeholder="Ex : Bastos…"
            value={form.quartier}
            onChange={(e) =>
              setForm((f) => ({ ...f, quartier: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-2 pt-1">
        {showCancelButton && onCancel && (
          <Button variant="outline" className="flex-1 text-sm" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button className="flex-1 text-sm" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default AddressForm;