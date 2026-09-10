export function Diagram({ slug }: { slug: string }) {
  const fold = slug === "fold-house";
  const foundry = slug === "foundry-hall";
  return (
    <figure className="diagram">
      <svg
        viewBox="0 0 800 440"
        role="img"
        aria-label={
          fold
            ? "Conceptual plan of two wings around a courtyard"
            : foundry
              ? "Conceptual plan of independent rooms within an existing hall"
              : "Conceptual section through sheltered porch and reading room"
        }
      >
        <defs>
          <pattern
            id={`hatch-${slug}`}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <path d="M0 8 8 0" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          {fold ? (
            <>
              <path
                d="M155 90h475v265H490V210H155Z"
                fill={`url(#hatch-${slug})`}
                fillOpacity=".2"
              />
              <path d="M175 110h435v80H175zM510 210h100v125H510z" />
              <path d="M365 110v80M470 110v80M510 280h100" />
              <path d="M185 225v130h285" />
              <circle cx="350" cy="285" r="36" strokeDasharray="4 5" />
              <path
                d="M175 210h295M490 225v110"
                stroke="#244EFF"
                strokeWidth="4"
              />
              <path d="M110 320h110m-10-8 10 8-10 8" stroke="#244EFF" />
            </>
          ) : foundry ? (
            <>
              <rect x="95" y="90" width="610" height="260" strokeWidth="5" />
              {[170, 280, 390, 500, 610].map((x) => (
                <path
                  key={x}
                  d={`M${x} 90v260`}
                  strokeDasharray="3 9"
                  strokeWidth="1"
                />
              ))}
              <path
                d="M155 135h110v95H155ZM330 225h110v80H330ZM505 135h125v95H505Z"
                fill={`url(#hatch-${slug})`}
              />
              <path
                d="M105 270h190l50-80h310m-14-8 14 8-14 8"
                stroke="#244EFF"
              />
            </>
          ) : (
            <>
              <path
                d="M95 345h610M125 170h570v15H125zM285 185v155M680 185v160"
                strokeWidth="4"
              />
              <path d="M350 185v160" stroke="#244EFF" />
              <path d="M170 280h95v12h-95ZM190 292v48M250 292v48M420 270h210M435 270v70M615 270v70M630 210v130M660 210v130M630 235h30M630 265h30M630 295h30" />
              <path d="M110 310h185m-12-8 12 8-12 8" stroke="#244EFF" />
              <path
                d="M400 190l65 65M510 190l65 65"
                strokeWidth="1"
                strokeDasharray="3 6"
              />
            </>
          )}
        </g>
        <g
          fill="currentColor"
          fontFamily="var(--font-mono),monospace"
          fontSize="13"
        >
          {fold ? (
            <>
              <text x="200" y="155">
                SHARED LIFE
              </text>
              <text x="520" y="260">
                RETREAT
              </text>
              <text x="300" y="345">
                COURTYARD
              </text>
            </>
          ) : foundry ? (
            <>
              <text x="145" y="65">
                EXISTING SHELL
              </text>
              <text x="160" y="185">
                INSERT
              </text>
              <text x="470" y="310">
                OPEN FLOOR
              </text>
            </>
          ) : (
            <>
              <text x="155" y="380">
                PUBLIC PORCH
              </text>
              <text x="445" y="380">
                READING ROOM
              </text>
            </>
          )}
        </g>
      </svg>
      <figcaption>
        <span className="mono">
          SPATIAL STUDY / {fold || foundry ? "PLAN" : "SECTION"}
        </span>
        <span>
          Conceptual schematic · not to scale · not a construction drawing
        </span>
      </figcaption>
    </figure>
  );
}
