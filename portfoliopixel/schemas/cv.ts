export default {
  name: 'cv',
  title: 'CV & Resume',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'CV',
      hidden: true,
    },
    {
      name: 'experience',
      title: 'Professional Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'position',
              title: 'Position/Title',
              type: 'string',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'e.g., "Jan 2020 - Present" or "2020 - 2021"',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Key responsibilities and achievements',
            },
            {
              name: 'current',
              title: 'Currently Working Here',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'position',
              subtitle: 'company',
            },
          },
        },
      ],
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'school',
              title: 'School/University',
              type: 'string',
            },
            {
              name: 'degree',
              title: 'Degree',
              type: 'string',
              description: 'e.g., Bachelor, Master, Diploma',
            },
            {
              name: 'field',
              title: 'Field of Study',
              type: 'string',
              description: 'e.g., Computer Science, Business',
            },
            {
              name: 'year',
              title: 'Graduation Year',
              type: 'string',
              description: 'e.g., 2020 or 2019-2020',
            },
            {
              name: 'description',
              title: 'Additional Info',
              type: 'text',
              description: 'Optional achievements, GPA, etc.',
            },
          ],
          preview: {
            select: {
              title: 'degree',
              subtitle: 'school',
            },
          },
        },
      ],
    },
    {
      name: 'certifications',
      title: 'Certifications & Licenses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Certification Name',
              type: 'string',
            },
            {
              name: 'issuer',
              title: 'Issuer/Provider',
              type: 'string',
            },
            {
              name: 'date',
              title: 'Date Issued',
              type: 'string',
              description: 'e.g., Jan 2023 or 2023',
            },
            {
              name: 'url',
              title: 'Credential URL',
              type: 'url',
              description: 'Link to verify credential (optional)',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'issuer',
            },
          },
        },
      ],
    },
    {
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string',
            },
            {
              name: 'proficiency',
              title: 'Proficiency Level',
              type: 'string',
              options: {
                list: [
                  { title: 'Native', value: 'native' },
                  { title: 'Fluent', value: 'fluent' },
                  { title: 'Advanced', value: 'advanced' },
                  { title: 'Intermediate', value: 'intermediate' },
                  { title: 'Basic', value: 'basic' },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'language',
              subtitle: 'proficiency',
            },
          },
        },
      ],
    },
    {
      name: 'summary',
      title: 'Professional Summary',
      type: 'text',
      description: 'Brief overview of your professional background and key strengths',
    },
  ],
}
