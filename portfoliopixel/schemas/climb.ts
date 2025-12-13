export default {
    name: 'climb',
    title: 'Climb',
    type: 'document',
    fields: [
        {
            name: "title",
            title: "Route/Mountain Name",
            description: "Name of the route or mountain",
            type: "string",
            validation: (Rule: any) => Rule.required()
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
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
            name: "youtubeUrl",
            title: "YouTube Shorts URL",
            description: "Link to a YouTube Shorts video showcasing this climb (used for Boulder and Sport)",
            type: "url",
            validation: (Rule: any) => Rule.uri({scheme: ['http','https']})
        },
        {
            name: "location",
            title: "Location",
            description: "Where the climb is located (e.g., 'Yosemite, California')",
            type: "string",
        },
        {
            name: "difficulty",
            title: "Difficulty Grade",
            description: "Climbing grade (e.g., '5.10a', 'V4', 'WI3')",
            type: "string",
        },
        {
            name: "category",
            title: "Climbing Category",
            type: "string",
            options: {
                list: [
                    { title: "Boulder", value: "boulder" },
                    { title: "Sport Climbing", value: "sport" },
                    { title: "Traditional (Trad)", value: "trad" },
                    { title: "Alpine/Mountaineering", value: "alpine" },
                ]
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: "description",
            title: "Description",
            description: "Your experience, route description, or story",
            type: "text"
        },
        {
            name: "dateCompleted",
            title: "Date Completed",
            description: "When you completed this climb",
            type: "date"
        },
        {
            name: "elevation",
            title: "Elevation",
            description: "Peak elevation or route height (optional)",
            type: "string",
        },
        {
            name: "duration",
            title: "Duration",
            description: "How long the climb took (e.g., '4 hours', '2 days')",
            type: "string",
        },
        {
            name: "partners",
            title: "Climbing Partners",
            description: "Who you climbed with (optional)",
            type: "string",
        },
        {
            name: "featured",
            title: "Featured Climb",
            description: "Highlight this climb prominently",
            type: "boolean",
            initialValue: false
        },
        {
            name: "firstAscent",
            title: "First Ascent",
            description: "Check if this was a first ascent",
            type: "boolean",
            initialValue: false
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            subtitle: 'difficulty'
        }
    }
}