import SearchShowcase from '@/components/SearchShowcase';

export default function Home() {
  return (
    <main className="page">
      <h1>Search millions of papers</h1>
      <p className="lead">
        Search words, filters with live counts and a sort order work together on real research papers.
        Results keep loading as you scroll.
      </p>
      <SearchShowcase />
      <p className="credit">Data: <a href="https://openalex.org" target="_blank" rel="noopener noreferrer">OpenAlex</a></p>
    </main>
  );
}
