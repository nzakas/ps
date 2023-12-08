import { useMatches } from 'react-router-dom'

export const Breadcrumbs = () => {
  const matches = useMatches()

  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements
    .map((match) => match.handle.crumb(match))

  // console.log('Breadcrumbs', { matches, crumbs })

  // New Idea: active (last) crumb should _not_ be a link
  // Pass Objects with { text, link } to crumb
  // Add arrows between crumbs

  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <div key={index} className="crumb">
          {crumb}
        </div>
      ))}
    </nav>
  )
}
