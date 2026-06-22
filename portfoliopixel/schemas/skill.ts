export default {
    name: 'skill',
    title: 'Skill',
    type: 'document',
    fields: [
      {
        name:"title",
        title:"Title",
        description: "Title of skill",
        type: "string",
      },
      {
        name:"domain",
        title:"Domain",
        description: "Category this skill belongs to",
        type: "string",
        options: {
          list: [
            { title: 'Frontend', value: 'Frontend' },
            { title: 'Backend', value: 'Backend' },
            { title: 'Database', value: 'Database' },
            { title: 'DevOps', value: 'DevOps' },
            { title: 'Tools', value: 'Tools' },
            { title: 'Languages', value: 'Languages' },
            { title: 'Mobile', value: 'Mobile' },
            { title: 'Other', value: 'Other' },
          ]
        }
      },
      {
        name:"image",
        title:"Image",
        type: "image",
        options: {
          hotspot: true
        }
      },
     ],
  }
  