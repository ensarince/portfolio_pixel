import { sanityClient } from "../sanity";
import { Climb } from "../typings";

export const getClimb = async (id: string): Promise<Climb | null> => {
  const query = `*[_type == "climb" && _id == $id][0] {
    _id,
    _createdAt,
    title,
    image,
    youtubeUrl,
    location,
    difficulty,
    category,
    description,
    story,
    diaryEntries,
    dateCompleted,
    elevation,
    duration,
    partners,
    featured,
    firstAscent
  }`;

  const climb: Climb = await sanityClient.fetch(query, { id });
  return climb ?? null;
};
