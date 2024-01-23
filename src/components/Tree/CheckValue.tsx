import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'

export const CheckValueNode = ({
  project_id,
  subproject_id,
  place_id,
  place,
  check_id,
  checkValue,
  level = 10,
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpenBase =
    urlPath[0] === 'projects' &&
    urlPath[1] === project_id &&
    urlPath[2] === 'subprojects' &&
    urlPath[3] === subproject_id &&
    urlPath[4] === 'places' &&
    urlPath[5] === (place_id ?? place.place_id)
  const isOpen = place_id
    ? isOpenBase &&
      urlPath[6] === 'places' &&
      urlPath[7] === place.place_id &&
      urlPath[8] === 'checks' &&
      urlPath[9] === check_id &&
      urlPath[10] === 'values' &&
      urlPath[11] === checkValue.check_value_id
    : isOpenBase &&
      urlPath[6] === 'checks' &&
      urlPath[7] === check_id &&
      urlPath[8] === 'values' &&
      urlPath[9] === checkValue.check_value_id
  const isActive = isOpen && urlPath.length === level

  const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}/places/${
    place_id ?? place.place_id
  }${place_id ? `/places/${place.place_id}` : ''}/checks/${check_id}/values`

  const onClickButton = useCallback(() => {
    if (isOpen) return navigate(baseUrl)
    navigate(`${baseUrl}/${checkValue.check_value_id}`)
  }, [isOpen, navigate, baseUrl, checkValue.check_value_id])

  return (
    <Node
      node={checkValue}
      level={level}
      isOpen={isOpen}
      isInActiveNodeArray={isOpen}
      isActive={isActive}
      childrenCount={0}
      to={`${baseUrl}/${checkValue.check_value_id}`}
      onClickButton={onClickButton}
    />
  )
}
