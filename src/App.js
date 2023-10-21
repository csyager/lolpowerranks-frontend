import './App.css';
import Container from 'react-bootstrap/Container';
import Results from './components/Results';
import Filter from './components/Filter';
import { Image } from 'react-bootstrap';
import { BACKEND_URL } from './Constants';

import {useState, useEffect} from "react";

function App() {
  const [rankingHeader, setRankingHeader] = useState("Global");

  const [results, setResults] = useState([]);

  const [queryTeams, setQueryTeams] = useState([]);
  const [queryTournament, setQueryTournament] = useState(null);
  const [queryStage, setQueryStage] = useState(null);

  // fetch initial results
  useEffect(() => {
    fetch(BACKEND_URL + "global_rankings")
      .then(response => response.json())
      .then(data => { console.log(data); return data; })
      .then(data => setResults(data));
  }, []);

  // query based on filters
  useEffect(() => {
    if (queryTeams.length > 0) {
      console.log("sending request for teams");
      fetch(BACKEND_URL + "team_rankings?team_ids=" + queryTeams.join(","))
        .then(response => response.json())
        .then(data => { console.log(data); return data; })
        .then(data => setResults(data));
    } else if (queryTournament != null) {
      console.log("sending request for tournaments");
      let url = BACKEND_URL + "tournament_rankings/" + queryTournament;
      if (queryStage != null && queryStage != "") {
        url += "?stage=" + queryStage;
      }
      fetch(url)
        .then(response => response.json())
        .then(data => { console.log(data); return data; })
        .then(data => setResults(data));
    } else {
      console.log("sending request for global_rankings");
      fetch(BACKEND_URL + "global_rankings")
        .then(response => response.json())
        .then(data => { console.log(data); return data; })
        .then(data => setResults(data));
    }
  }, [queryTeams, queryTournament, queryStage]);

  return (
    <div className="App">
      <Container className="mt-3">
        <Image src="/logo.png" fluid className="mb-3" />
        <h2>{rankingHeader} Rankings</h2>
        <Filter 
          setRankingHeader={setRankingHeader} 
          setQueryTeams={setQueryTeams} 
          setQueryTournament={setQueryTournament}
          setQueryStage={setQueryStage}
        />
        <Results results={results} />
      </Container>
    </div>
  );
}

export default App;
