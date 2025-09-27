import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [       
              defineField({
                name: 'image',
                title: 'Image',
                type: 'image',
                options: {
                  hotspot: true,
                },
              }),
              defineField({
                name: 'description',
                title: 'Description',
                type: 'text',
                description: 'Add a description for this image',
              }),
            ],
          },
        ],
    }
  ],
})
