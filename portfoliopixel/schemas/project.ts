export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      {
        name:"title",
        title:"Title",
        description: "Title of the project",
        type: "string",
      },
      {
        name:"image",
        title:"Image",
        type:"image",
        options:{
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Alternative text for screen readers'
          }
        ]
      },
      {
        name:"summary",
        title:"Summary",
        type: "text"
      },
      {
        name:"description",
        title:"Detailed Description",
        description: "Detailed description of the project, your role, and technical challenges",
        type: "text"
      },
      {
        name:"category",
        title:"Project Category",
        type: "string",
        options: {
          list: [
            {title: "Personal Project", value: "personal"},
            {title: "Academic Project", value: "academic"},
            {title: "Professional Work", value: "professional"},
          ]
        }
      },
      {
        name:"technologies",
        title:"Technologies",
        type: "array",
        of: [{ type: "reference", to: {type: "skill"}}]
      },
      {
        name:"linkToBuild",
        title:"Live Demo URL",
        description: "Link to the live project (if available)",
        type: "url",
      },
      {
        name:"githubUrl",
        title:"GitHub Repository",
        description: "Link to GitHub repo (if available/allowed)",
        type: "url",
      },
      {
        name:"impact",
        title:"Impact/Metrics",
        description: "Quantifiable results (e.g., '40% performance improvement, 50K+ users')",
        type: "string",
      },
      {
        name:"role",
        title:"Your Role",
        description: "Your specific role in this project",
        type: "string",
      },
      {
        name:"teamSize",
        title:"Team Size",
        description: "Number of people who worked on this project",
        type: "number",
      },
      {
        name:"duration",
        title:"Project Duration",
        description: "How long the project took (e.g., '3 months', '1 year')",
        type: "string",
      },
      {
        name:"featured",
        title:"Featured Project",
        description: "Show this project prominently on homepage",
        type: "boolean",
        initialValue: false
      },
      {
        name:"ndaRestricted",
        title:"NDA Restricted",
        description: "Check if this project has NDA restrictions",
        type: "boolean",
        initialValue: false
      }
     ],
  }
  