import ListGroup from 'react-bootstrap/ListGroup';

function Results(props) {
    let resultsList = props.results;
    const elementsList = resultsList.map((entry) => {
        return <ListGroup.Item key={entry.team_code} as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">{entry.team_name}</div>
            <div>{entry.team_code}</div>
        </ListGroup.Item>
    });
    return <ListGroup as="ol" numbered>{elementsList}</ListGroup>
}

export default Results;