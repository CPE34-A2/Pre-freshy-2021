export default function Map({ planets }) {
  const planetsList = planets.map((planet) => {
    return <li key={planet._id}>{planet.owner}</li>
  })
  return (
    <>
      <ul>{planetsList}</ul>
      <p>hello</p>
    </>
  )
}