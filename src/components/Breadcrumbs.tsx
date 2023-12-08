import { useMatches, useNavigate } from 'react-router-dom'

export const Breadcrumbs = () => {
  const matches = useMatches()
  const navigate = useNavigate()

  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements
    .map((match) => match.handle.crumb?.(match))

  // New Idea: active (last) crumb should _not_ be a link
  // Pass Objects with { text, link } to crumb
  // Add arrows between crumbs

  return (
    <nav className="breadcrumbs">
      {crumbs.map(({ text, url }, index) => {
        const className =
          location.pathname === url ? 'crumb is-active' : 'crumb link'

        return (
          <div className={className} key={index} onClick={() => navigate(url)}>
            {text}
          </div>
        )
      })}
    </nav>
  )
}
