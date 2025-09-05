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
              {
                name:"categories",
                title:"Categories",
                type: "array",
                of: [{ type: "reference", to: {type: "category"}}]
              },
            ],
          },
        ],
    }
  ],
})
