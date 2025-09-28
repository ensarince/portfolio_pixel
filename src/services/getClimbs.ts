import { sanityClient } from "../sanity";
import { Climb } from "../typings";

export const getClimbs = async (): Promise<Climb[]> => {
  const query = `*[_type == "climb"] | order(dateCompleted desc, _createdAt desc) {
    _id,
    title,
    image,
    location,
    difficulty,
    category,
    description,
    dateCompleted,
    elevation,
    duration,
    partners,
    featured,
    firstAscent
  }`;

  const climbs: Climb[] = await sanityClient.fetch(query);
  return climbs;
};