import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

export const config: any = {
    dataset: import.meta.env.VITE_APP_PUBLIC_SANITY_DATASET || "production",
    projectId: import.meta.env.VITE_APP_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-03-25",
    useCdn: "production"
};

//set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config); 

export const urlFor = (source: any) => {
    createImageUrlBuilder(config).image(source);
}