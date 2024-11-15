// Home.jsx
import InitialSearch from "@/components/initialSearch/initialSearch";
import CollectedItems from "@/components/collectedItems/collectedItems";
import About from "@/components/about/about";

function Home() {
  return (
    <div>
      <InitialSearch />
      <CollectedItems />
      <About />
    </div>
  );
}

export default Home;
