export default {
    name: 'pageInfo',
    title: 'PageInfo',
    type: 'document',
    fields: [
      {
        name:"backgroundInformation",
        title:"BackgroundInformation",
        type: "string"
      },
      {
        name:"email",
        title:"Email",
        type: "string"
      },
      {
        name:"role",
        title:"Role",
        type: "string"
      },
      {
        name:"heroImage",
        title:"Image",
        type:"image",
        options:{
          hotspot: true,
        }
      },
      {
        name:"name",
        title:"Name",
        type: "string",
      },
      {
        name:"profilePic",
        title:"ProfilePic",
        type: "image",
        options: {
          hotspot: true
        }
      },
      {
        name:"socials",
        title:"Socials",
        type: "array",
        of: [{ type: "reference", to: {type: "social"}}]
      },
  
     ],
  }
  