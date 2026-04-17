import React from 'react'
import { MapPin, Phone,Clock, Mail } from 'lucide-react';

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Nous visitez",
    subtitle: "enter the location",
    icon: (
      <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary
      transition-color" />
    ),
  },
   {
    title: "Contacts",
    subtitle: "(+237) 677867169",
    icon: (
      <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary
      transition-color" />
    ),
  },
   {
    title: "Heure de travail",
    subtitle: "24h/7",
    icon: (
      <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary
      transition-color" />
    ),
  },
   {
    title: "Email",
    subtitle: "koudjougislaine@kuakumarket.com",
    icon: (
      <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary
      transition-color" />
    ),
  },
];
const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item,index)=>(
        <div key={index} className="flex items-center gap-3 group hover:bg-gray-300 p-4 transition-colors hoverEffect">
            {item?.icon}
             <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">{item?.title}</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect">{item?.subtitle}</p>
            </div>
        </div>
       
      ))}
    </div>
  )
}



export default FooterTop
