import {defineField, defineType} from 'sanity'

export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name:"title",
      title:"Title",
      type: "string",
    }
   ],
}
