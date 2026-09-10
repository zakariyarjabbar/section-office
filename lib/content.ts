export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  position?: string;
};
export type Project = {
  id: string;
  slug: string;
  number: string;
  name: string;
  category: string;
  year: number;
  context: string;
  area: string;
  materials: string[];
  statement: string;
  intro: string;
  brief: string;
  response: string;
  experience: string;
  detail: string;
  related: string[];
  images: ProjectImage[];
  flagship?: boolean;
};
function images(
  slug: string,
  captions: string[],
  portraitIndex: number,
  squareIndex = -1,
): ProjectImage[] {
  return captions.map((caption, i) => ({
    src: `/images/${slug}-${i + 1}.webp`,
    alt: caption,
    caption,
    width: i === portraitIndex ? 1024 : i === squareIndex ? 1254 : 1536,
    height: i === portraitIndex ? 1536 : i === squareIndex ? 1254 : 1024,
  }));
}
export const projects: Project[] = [
  {
    id: "fold-house",
    slug: "fold-house",
    number: "01",
    name: "Fold House",
    category: "Residential",
    year: 2026,
    context: "A meadow edge, temperate landscape",
    area: "145 m²",
    materials: ["Board-marked concrete", "Oak", "Zinc", "Stone"],
    flagship: true,
    statement: "A quiet world, held within a fold.",
    intro:
      "A compact home turns toward a protected courtyard. One folded roof brings the rooms together, while light gives each a different character.",
    brief:
      "The imagined brief asks a small home to do two things at once: open itself to a meadow and offer a place of real retreat. Rather than adding rooms along a corridor, the study gathers daily life around an outdoor room. The courtyard is the centre of the plan, not the space left over.",
    response:
      "Two low wings meet at a sheltered corner. Living and dining occupy the longer wing; a quieter room looks across the courtyard from the other. The zinc roof folds above both, rising where shared life needs height and lowering toward the protected edge. A continuous oak soffit draws the eye from inside to outside.",
    experience:
      "Arrival is deliberately oblique. A low concrete wall first frames the tree, then reveals the glazed rooms beyond. Inside, a built-in seat follows the window. The stone floor continues toward the courtyard so that even on a wet day the room feels connected to the weather.",
    detail:
      "Board marks keep the concrete tactile. Oak softens the underside of the roof; slender bronze-colored frames make the boundary between room and courtyard precise. A small shadow gap lets each material remain legible.",
    related: ["frame-apartment", "field-pavilion"],
    images: images(
      "fold-house",
      [
        "A folded zinc roof gathers two glazed wings around a protected courtyard.",
        "The oak window seat and stone floor extend the living room toward the courtyard.",
        "Seen from the meadow, the low roof keeps the home close to the landscape.",
        "A deep oak soffit makes a sheltered passage between room and garden.",
        "Board-marked concrete, oak and a slender bronze frame meet at the eaves.",
      ],
      3,
      4,
    ),
  },
  {
    id: "foundry-hall",
    slug: "foundry-hall",
    number: "02",
    name: "Foundry Hall",
    category: "Adaptive reuse",
    year: 2026,
    context: "A former industrial street, urban district",
    area: "720 m²",
    materials: ["Existing brick", "Steel", "Birch plywood", "Concrete"],
    flagship: true,
    statement: "A new chapter, with the old one still visible.",
    intro:
      "An industrial shell becomes a place for exhibitions and gathering. Independent timber rooms sit beneath the original roof, leaving the larger space intact.",
    brief:
      "The fictional brief imagines a disused hall becoming useful again without erasing its industrial scale. Exhibitions need intimacy, while community events need an open floor. The study asks how both can belong to one space without pretending the building is new.",
    response:
      "A sequence of free-standing plywood rooms creates smaller places within the hall. They stop below the factory windows, preserving the high daylight and the long view of the steel trusses. The inserts are conceived as an independent assembly so that the relationship between old shell and new use remains clear.",
    experience:
      "From the street, the brick gable gives little away. Inside, a generous route passes between the timber rooms and opens into a shared gathering space. Moving around an insert changes the apparent scale: a tall industrial hall becomes a quiet alcove, then expands again.",
    detail:
      "Patched concrete is treated as a record of use. Brick and steel retain their irregularities; pale plywood introduces a warmer, more exact surface. The gap between them is a deliberate part of the architecture.",
    related: ["passage-gallery", "common-ground"],
    images: images(
      "foundry-hall",
      [
        "Free-standing plywood rooms leave the steel roof and high factory windows visible.",
        "The brick gable and repeated windows keep the hall legible in its industrial street.",
        "An open route follows the original wall beside a sequence of smaller exhibition rooms.",
        "A level threshold and a narrow gap distinguish the timber insert from the brick shell.",
        "Worn brick, matte steel and patched concrete preserve a record of the building’s imagined use.",
      ],
      3,
      4,
    ),
  },
  {
    id: "common-ground",
    slug: "common-ground",
    number: "03",
    name: "Common Ground",
    category: "Cultural",
    year: 2026,
    context: "A leafy neighborhood street",
    area: "210 m²",
    materials: ["Buff brick", "Green steel", "Birch", "Concrete"],
    flagship: true,
    statement: "A room for the neighborhood. A place to pause.",
    intro:
      "A reading room begins before its front door. A broad roof, a bench and a generous threshold make a small public place in the everyday street.",
    brief:
      "This study starts with a simple question: can a modest reading room offer something to a person who never goes inside? The imagined neighborhood needs a shared interior, but also a sheltered place to wait, meet someone or read a few pages outdoors.",
    response:
      "A concrete roof extends beyond the glazed front, supported by thick buff-brick piers. This depth makes a useful threshold between pavement and room. Inside, one long birch table gives the space a shared centre, with books around its edges and the street always in view.",
    experience:
      "The bench lets a visitor arrive without committing to an activity. Through the green-framed glass, the table and shelves are immediately understandable. There is no ceremonial entrance: just a level transition from flagstone to the quieter rhythm of reading.",
    detail:
      "Warm birch meets sandy brick at a comfortable sitting height. Dark green frames outline the opening without competing with the books. Thick walls and a thin line of shadow give the porch its sense of shelter.",
    related: ["field-pavilion", "northlight-studio"],
    images: images(
      "common-ground",
      [
        "A broad roof and thick brick piers turn the street edge into a sheltered public threshold.",
        "One shared birch table anchors the room between bookshelves and green-framed glazing.",
        "The porch connects a public bench, flagstone pavement and the communal interior.",
        "The depth of a brick pier creates a quiet place to pause beside the entrance.",
        "Pale brick, green steel and birch joinery establish a warm, durable material rhythm.",
      ],
      3,
      4,
    ),
  },
  {
    id: "quarry-rooms",
    slug: "quarry-rooms",
    number: "04",
    name: "Quarry Rooms",
    category: "Hospitality",
    year: 2025,
    context: "A dry, rocky hillside",
    area: "280 m²",
    materials: ["Limestone", "Lime plaster", "Oak"],
    statement: "Rooms that follow the ground.",
    intro:
      "Small guest rooms gather around stone walls and a rough courtyard. Each follows the slope, finding privacy through depth rather than distance.",
    brief:
      "The imagined site is an uneven rocky slope. The brief proposes a few quiet guest rooms with a shared outdoor place, without turning the hillside into one large level platform. The ground should remain present in the experience of arriving.",
    response:
      "Three low volumes step with the terrain. Thick limestone walls define an intimate court, while deep openings temper the transition from bright exterior to pale interior. Oak shutters provide a simple, legible way to change privacy and light.",
    experience:
      "A visitor moves from rough stone to a cut threshold, then into lime-plastered stillness. Views are deliberately framed. The rooms share the court but retain their own orientation; modest changes in level let each find a small piece of the landscape.",
    detail:
      "Rough limestone is held against smooth lime plaster. The oak shutter is both a moving wall and a warm surface to touch. A precisely cut sill makes the change in texture clear.",
    related: ["fold-house", "passage-gallery"],
    images: images(
      "quarry-rooms",
      [
        "Three limestone rooms step with a rocky slope around a shared court.",
        "A deep oak-shuttered opening connects the lime-plaster room to the stone court.",
        "Rough limestone, a smooth plaster reveal and an oak shutter meet at a cut-stone threshold.",
      ],
      2,
    ),
  },
  {
    id: "frame-apartment",
    slug: "frame-apartment",
    number: "05",
    name: "Frame Apartment",
    category: "Interiors",
    year: 2025,
    context: "A compact apartment in an urban block",
    area: "68 m²",
    materials: ["Oak", "Ribbed glass", "Terrazzo"],
    statement: "More room for the same space.",
    intro:
      "One continuous joinery frame reorganizes a compact apartment, giving storage, movement and shared light a common language.",
    brief:
      "The fictional apartment has two generous existing windows but a fragmented interior. The brief asks for a place to cook, work and retreat without losing the feeling of a single, light-filled home. Increasing floor area is not part of the study.",
    response:
      "An oak joinery frame replaces the logic of isolated cupboards and doors. It holds practical storage while marking a sequence of spaces. Ribbed-glass panels borrow light across the plan and offer visual privacy without requiring every activity to be enclosed by an opaque wall.",
    experience:
      "The entry opens along the joinery toward a window. A turn reveals the shared room; a sliding panel makes a quieter place beyond it. Terrazzo runs continuously under the frame, allowing the eye to read the apartment as one whole.",
    detail:
      "Oak edges frame the textured glass with a simple, repeatable profile. The contrast between warm grain and cool terrazzo gives the small interior definition without multiplying materials.",
    related: ["fold-house", "northlight-studio"],
    images: images(
      "frame-apartment",
      [
        "A continuous oak frame gives the apartment a clear sequence of shared spaces.",
        "Ribbed-glass panels carry window light deeper into the compact interior.",
        "Oak joinery, textured glass and terrazzo meet in a restrained material palette.",
      ],
      2,
    ),
  },
  {
    id: "field-pavilion",
    slug: "field-pavilion",
    number: "06",
    name: "Field Pavilion",
    category: "Research",
    year: 2026,
    context: "An open meadow and distant tree line",
    area: "36 m²",
    materials: ["Timber", "Galvanized steel"],
    statement: "Just enough architecture.",
    intro:
      "A lightweight timber shelter studies the distance between a frame and a room. Its roof makes shade; its open sides leave the landscape continuous.",
    brief:
      "This spatial research asks what is necessary to make a place to pause outdoors. The fictional brief contains no enclosed program. It asks instead for a small, legible shelter where the structure, the shade and the ground are enough.",
    response:
      "Repeated timber posts carry a slatted roof above a modest deck. The regular frame gives scale to the open field. Visible metal connections make the assembly understandable; the gaps in the roof allow the sun to describe its movement through the day.",
    experience:
      "There is no single front. Approaching from the meadow, the frame first appears as a rhythm of lines. Beneath it, the overhead shade and change underfoot make a room without closing the view. Leaving returns the visitor gradually to the grass.",
    detail:
      "Simple timber members meet at small galvanized plates. The study keeps the connections visible and avoids making the shelter look weightless: every span has a support and every element has a role.",
    related: ["common-ground", "fold-house"],
    images: images(
      "field-pavilion",
      [
        "An open timber frame and slatted roof make a small place to pause in the meadow.",
        "The repeated posts frame a continuous view through the shelter to the field.",
        "Visible steel plates connect the timber roof members with a clear structural logic.",
      ],
      2,
    ),
  },
  {
    id: "northlight-studio",
    slug: "northlight-studio",
    number: "07",
    name: "Northlight Studio",
    category: "Workplace",
    year: 2026,
    context: "A small workshop plot in an urban district",
    area: "185 m²",
    materials: ["Birch", "Concrete", "Whitewashed masonry"],
    statement: "A working day, measured in light.",
    intro:
      "Repeated north-facing rooflights bring a quiet, even light to a shared creative workplace. The plan gives equal attention to concentration and conversation.",
    brief:
      "The imagined brief is a small studio for drawing, making and discussion. Deep work surfaces need daylight beyond the perimeter. Rather than filling a generic shell with desks, the study begins with the roof and the way light reaches a table.",
    response:
      "Three sawtooth bays admit diffuse light from above. Birch tables occupy the central space, with materials and storage held along the walls. A clear route between the tables allows pin-ups and shared work without turning the entire room into circulation.",
    experience:
      "The entrance leads beneath the low part of the roof before the room opens toward the clerestories. From a seat at a table, the changing sky is present without a direct view of the street. The room remains deliberately simple enough to be rearranged.",
    detail:
      "Pale birch work surfaces bring warmth to raw concrete and whitewashed walls. Roof openings repeat at a useful scale; exposed edges and modest fixtures keep attention on the work.",
    related: ["common-ground", "frame-apartment"],
    images: images(
      "northlight-studio",
      [
        "Three sawtooth roof bays distribute diffuse daylight over shared birch worktables.",
        "The modest workshop exterior gives a clear profile to the three north-facing roof bays.",
        "A birch work surface and whitewashed wall meet the quiet mineral floor.",
      ],
      2,
    ),
  },
  {
    id: "passage-gallery",
    slug: "passage-gallery",
    number: "08",
    name: "Passage Gallery",
    category: "Commercial",
    year: 2025,
    context: "A narrow infill space along an urban street",
    area: "95 m²",
    materials: ["Oxidized steel", "Plaster", "Concrete"],
    statement: "A long room. A changing view.",
    intro:
      "A narrow gallery is organized by thresholds and a continuous display wall. Light from above gives depth to an otherwise constrained site.",
    brief:
      "The fictional brief asks a slender urban interior to support a small exhibition program. Its width is limited and its rear receives little street light. The study treats the long proportion as a useful sequence rather than something to conceal.",
    response:
      "A continuous white display wall runs from the entry toward the back. A linear skylight follows the route, while carefully deepened thresholds break the view into a series of encounters. The gallery can hold a single work in isolation or a longer visual conversation.",
    experience:
      "A dark steel reveal marks the change from street to gallery. Inside, the floor draws the visitor toward daylight, then a slight shift in the wall slows the pace. Looking back, the entry becomes a frame within a frame.",
    detail:
      "Oxidized steel gives the entrance weight and tactility. White plaster receives the light; the concrete floor provides a quiet continuous ground. Their junctions stay simple so that the work can take precedence.",
    related: ["foundry-hall", "quarry-rooms"],
    images: images(
      "passage-gallery",
      [
        "A continuous white wall and linear skylight give depth to the narrow gallery.",
        "Successive thresholds slow the route from the street toward the light at the rear.",
        "A deep oxidized-steel reveal frames the transition from street to white gallery.",
      ],
      2,
    ),
  },
];
export const categories = [...new Set(projects.map((p) => p.category))];
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const projectHref = (p: Pick<Project, "slug">) => `/work/${p.slug}/`;
export type Article = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  theme: string;
  minutes: number;
  project: string;
  imageIndex: number;
  sections: { heading: string; paragraphs: string[] }[];
};
export const articles: Article[] = [
  {
    slug: "the-space-before-the-door",
    number: "01",
    title: "The space before the door",
    subtitle:
      "On thresholds, small acts of welcome, and the generosity of an edge.",
    theme: "Thresholds",
    minutes: 5,
    project: "common-ground",
    imageIndex: 2,
    sections: [
      {
        heading: "Arrival begins outside",
        paragraphs: [
          "A doorway is a line on a plan. Arrival is a longer event. We slow down, look for a handle, wait for someone, adjust to the light. The few metres before an entrance have to accommodate all of this, even when a drawing gives them very little attention.",
          "In Common Ground, our reading-room study, the roof reaches beyond the glass. The resulting porch is not simply weather protection. It offers a choice: to enter, to sit, or to stay close to the life of the room without joining it. The bench makes that choice visible.",
        ],
      },
      {
        heading: "Depth makes room for choice",
        paragraphs: [
          "A deep reveal can hold more than a door. It can contain a seat, shelter a person waiting, or give the eye time to adjust between a bright street and a quieter interior. These are modest possibilities, but they change how a building addresses its surroundings.",
          "The threshold should also be understandable. A beautiful entry that hides its handle or puts a step where someone expects a level floor has missed a basic responsibility. Shelter and clarity need to work together. In the concept, the paving leads directly into the room and the glazed opening shows where to go.",
        ],
      },
      {
        heading: "A material change, not an obstacle",
        paragraphs: [
          "A transition can be felt without being made difficult. Smooth timber against rough brick signals a place to touch and sit. The shadow beneath a roof suggests protection. A change in acoustics can make an interior feel distinct while the floor remains continuous.",
          "For us, this is where architecture becomes most interesting: at the scale of a shoulder, a hand, a pause. A generous threshold does not ask a building to announce itself more loudly. It asks the building to leave enough room for someone else.",
        ],
      },
    ],
  },
  {
    slug: "drawing-with-daylight",
    number: "02",
    title: "Drawing with daylight",
    subtitle: "The shape of a room is also the shape of the light it receives.",
    theme: "Daylight",
    minutes: 4,
    project: "northlight-studio",
    imageIndex: 0,
    sections: [
      {
        heading: "Start with the opening",
        paragraphs: [
          "It is easy to think of daylight as something added to a room through a window. In practice, the opening, the depth of the room and the surfaces around it form one relationship. Move a window higher and the ceiling becomes part of the conversation. Deepen its reveal and a bright edge becomes a softer transition.",
          "Northlight Studio begins with this relationship. Three repeated roof bays admit light from above, allowing the worktables to occupy the middle of the plan. The study does not treat the roof as a sculptural flourish; its geometry follows the intention to bring diffuse light further into a working room.",
        ],
      },
      {
        heading: "Different tasks, different light",
        paragraphs: [
          "A table used for drawing asks something different of its surroundings than a place to rest. Evenness can help a working surface, while a concentrated patch of sun can make a window seat inviting. A house does not need to be uniformly bright to feel open.",
          "At Fold House, the deep eaves leave the courtyard-facing glass in shade for part of the day. Inside, the oak soffit and pale floor receive reflected light. The sheltered edge gives the brighter garden a useful counterpoint. These are spatial intentions in a concept study, not measured daylight predictions.",
        ],
      },
      {
        heading: "Materials participate",
        paragraphs: [
          "A white wall, unfinished timber and rough concrete each return light differently. Their color and texture influence the room as much as the size of the glazing. Choosing materials from isolated samples misses the moving relationship between surface and sky.",
          "A useful design conversation asks where someone will sit, what they will look at and when they will use the room. Only then can the opening find its place. Daylight is not an effect applied at the end; it is one of the things the plan is made from.",
        ],
      },
    ],
  },
  {
    slug: "keeping-the-useful-past",
    number: "03",
    title: "Keeping the useful past",
    subtitle:
      "Adaptive reuse as a conversation between what remains and what comes next.",
    theme: "Adaptive reuse",
    minutes: 5,
    project: "foundry-hall",
    imageIndex: 0,
    sections: [
      {
        heading: "Read before rewriting",
        paragraphs: [
          "An existing building contains decisions that may no longer be obvious. A patch in a floor, a blocked opening or a change in brickwork can explain how a place was used. To begin with a clean visual concept is to risk overlooking these clues.",
          "Foundry Hall is an imagined exercise in reading an industrial shell. Its long span, high windows and repeated trusses are the useful starting points. The question is not how to make the hall look contemporary, but which new uses can coexist with the spatial qualities already proposed in its fictional brief.",
        ],
      },
      {
        heading: "Smaller rooms, larger space",
        paragraphs: [
          "The new plywood rooms stop short of the roof. Their limited height allows the old hall to remain visible above them, while giving an exhibition a more intimate setting at eye level. The route can expand for a gathering and contract around a quiet display.",
          "A small gap between the timber and the brick distinguishes the two assemblies. This is partly a visual decision, but it also expresses an intention about reversibility. The insert should be understood as something that could change while the larger shell remains. Detailed structural, fire and access decisions would need real project information.",
        ],
      },
      {
        heading: "Continuity without imitation",
        paragraphs: [
          "New work does not have to imitate old material to belong beside it. Pale plywood and weathered brick have different textures, scales and histories. Their relationship becomes convincing when each is given a clear role and their junction is carefully considered.",
          "The study leaves marks visible without treating wear as decoration. Keeping the useful past means asking what deserves to continue, what must be repaired and what can change. It is a practical design discipline as much as an aesthetic position. The best new chapter makes the earlier one easier to read.",
        ],
      },
    ],
  },
];
