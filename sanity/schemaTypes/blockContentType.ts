import { ImageIcon, VideoIcon } from "lucide-react";
import { defineArrayMember, defineType } from "sanity";

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'h4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineArrayMember({
      type: 'file',
      icon: VideoIcon,
      title: 'Video',
      options: {
        accept: 'video/*',
      },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          options: {
            isHighlighted: true,
          },
        },
        {
          name: 'videoSize',
          type: 'string',
          title: 'Video Size',
          description: 'Choisissez la taille de la vidéo',
          options: {
            list: [
              { title: 'Petite', value: 'small' },
              { title: 'Moyenne', value: 'medium' },
              { title: 'Grande', value: 'large' },
            ],
            layout: 'radio', // ou 'dropdown'
          },
          initialValue: 'medium',
        },
      ],
    }),
  ],
});
