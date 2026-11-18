# Search millions of papers

An advanced-search UI over **295 million research papers**, built to show how a search screen behaves under a very large dataset:
several search approaches at once, filters with live counts, and results that keep loading as you scroll.

The data comes from the free [OpenAlex](https://openalex.org) API. The browser never calls OpenAlex directly: it calls two small
routes of this app, which hold the API key on the server.

```
Browser (UI)  ──►  /api/works , /api/facets  ──►  OpenAlex
                   (key added here, inputs checked,
                    answers cached for 60 s)
```

## What it shows

| Idea | How it is done here |
|---|---|
| **Several search approaches together** | Words searched *in the title* or *everywhere* (title, abstract, full text), plus filters and a sort order, all combined |
| **Filters with live counts** | Type, open access and author country show how many results each choice would give, and update when the other filters change |
| **Scroll pagination** | Cursor paging: the next page is requested before you reach the end, using the cursor the last page returned |
| **Only draw what is visible** | A virtual list with fixed-height rows draws the rows on screen (plus a few) out of everything loaded |
| **No stale answers** | Each search is numbered and the previous request is aborted, so a slow old answer can never overwrite a newer one |
| **Request budget** | Typing and clicking are debounced (350 ms); the server caches repeated searches for 60 s |
| **Honest states** | Skeleton rows, "no results" with a clear button, error with retry, and a clear message if the daily limit is used up |
| **Secrets stay server-side** | The key lives in `.env.local`; the routes accept only a fixed list of inputs, so nobody can use your key for other queries |

## Run it

You need Node.js 20.19 or newer (22.13+ or 24+ also work).

```bash
git clone https://github.com/Morrowga/search-list-experiment-with-high-data.git
cd search-list-experiment-with-high-data
yarn install
cp .env.example .env.local     # then put your key in OPENALEX_API_KEY
yarn dev
```

Open http://localhost:3000.

### The API key

OpenAlex gives a free key at https://openalex.org/settings/api. Without a key the first page of results still works, but
**cursor paging past the first page is refused**, so scrolling would stop after 25 results. With the free key the budget is about
$1 a day (roughly 10,000 requests; a normal request costs $0.0001). The limits are set by OpenAlex and can change, so check
their terms.

Never put the key in a variable that starts with `NEXT_PUBLIC_`, and never commit `.env.local` (it is git-ignored).

## API

Both routes accept the same filters. Anything else is ignored.

| Parameter | Values |
|---|---|
| `q` | search words (letters, numbers, spaces, `'` and `-`; up to 80 characters) |
| `mode` | `title` (default) or `all` |
| `sort` | `relevance` (needs words in `all` mode), `cited`, `new` |
| `types` | comma list: `article`, `review`, `book-chapter`, `preprint`, `dataset`, `book`, `dissertation`, `letter`, `editorial`, `report` |
| `oa` | `true` or `false` |
| `minCites` | whole number |
| `country` | 2-letter code, for example `TH` |
| `yearFrom`, `yearTo` | 4-digit years |

**`GET /api/works`** adds `cursor` (`*` for the first page, then the `nextCursor` you received) and `perPage` (1 to 50, default 25).
It returns `total`, `nextCursor`, `results[]`, `cached` and `ms`.

```bash
curl "http://localhost:3000/api/works?types=article&oa=true&yearFrom=2020&country=TH&q=learning&perPage=3"
```

**`GET /api/facets?field=...`** with `field` one of `type`, `open_access.is_oa`, `authorships.countries`, `publication_year`.
It returns the top groups with their counts for the *other* filters (a facet does not filter by itself).

Errors are JSON like `{ "error": "..." }` with a 400 for bad input, 503 when the key is missing or the daily limit is used up,
and 504 when OpenAlex is too slow.

## Project layout

```
app/page.tsx                 the page
app/api/works/route.ts       list of papers (cursor paging)
app/api/facets/route.ts      counts for one filter group
lib/openalex.ts              server-only: input checks, filter building, key, cache
components/SearchShowcase.tsx  the whole UI: filters, virtual list, infinite scroll
app/globals.css              layout and styles (two panes of equal height)
```

## Good to know

- The 60-second cache is in memory per server instance. On a serverless host each instance has its own, so it helps but is not shared.
- "Newest" only shows papers up to today (OpenAlex contains some papers dated in the future).
- The heights of the two panes are set with `--pane-h` in `app/globals.css`.
- Built with Next.js 16 (App Router), React 19 and TypeScript. This project is not affiliated with OpenAlex.

## Deploying

Any host that runs Next.js server code works (for example Vercel). Add `OPENALEX_API_KEY` in the host's environment settings.
Static hosting (for example GitHub Pages) cannot run the routes, so the key could not be kept secret there.

## License

[MIT](LICENSE). The OpenAlex data has its own terms: see https://openalex.org.
