import './App.css';
import Container from 'react-bootstrap/Container';
import Results from './components/Results';
import Filter from './components/Filter';

import {useState} from "react";

function App() {
  let testResults = [
    {
      "team_name": "test-team-1",
      "team_code": "TT1"
    }, 
    {
      "team_name": "test-team-2",
      "team_code": "TT2"
    },
    {
      "team_name": "test-team-3",
      "team_code": "TT3"
    }
  ];

  const [rankingHeader, setRankingHeader] = useState("Global");

  return (
    <div className="App">
      <Container className="mt-3">
        <h1>{rankingHeader} Rankings</h1>
        <Filter setRankingHeader={setRankingHeader} />
        <Results results={testResults} />
      </Container>
    </div>
  );
}

export default App;
