import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
interface Props {
    className?: string;
    iconClassName?: string;
    tooltipclassName?: string;
}

const SocialLink = [
  {
    title: "Youtube",
    href: "https://www.youtube.com/",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Tiktok",
    href: "https://www.tiktok.com/",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/",
    icon: <Instagram className="w-5 h-5" />,
  },
];

const SocialMedia = ({className, iconClassName, tooltipclassName}:Props) => {
  return (
    <Tooltip.Provider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {SocialLink.map((item) => (
          <Tooltip.Root key={item.title}>
            <Tooltip.Trigger asChild>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="  p-2 border rounded-full hover:text-white hover:border-shop_light_green hover:scale-200 hoverEffect">
                {item.icon}
              </a>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="top" align="center" className="rounded bg-black text-white px-2 py-1 text-4xl z-50">
                {item.title}
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
};

export default SocialMedia;
