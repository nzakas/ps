import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'
import {
  PlaceReports as PlaceReport,
  Places as Place,
} from '../../../generated/client'
import { PlaceReportValuesNode } from './PlaceReportValues'

export const PlaceReportNode = ({
  project_id,
  subproject_id,
  place_id,
  place,
  placeReport,
  level = 8,
}: {
  project_id: string
  subproject_id: string
  placeReport: PlaceReport
  place: Place
  level: number
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
      urlPath[8] === 'reports' &&
      urlPath[9] === placeReport.place_report_id
    : isOpenBase &&
      urlPath[6] === 'reports' &&
      urlPath[7] === placeReport.place_report_id
  const isActive = isOpen && urlPath.length === level

  const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}/places/${
    place_id ?? place.place_id
  }${place_id ? `/places/${place.place_id}` : ''}/reports`

  const onClickButton = useCallback(() => {
    if (isOpen) return navigate(baseUrl)
    navigate(`${baseUrl}/${placeReport.place_report_id}`)
  }, [baseUrl, isOpen, navigate, placeReport.place_report_id])

  return (
    <>
      <Node
        node={placeReport}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={10}
        to={`${baseUrl}/${placeReport.place_report_id}`}
        onClickButton={onClickButton}
      />
      {isOpen && (
        <PlaceReportValuesNode
          project_id={project_id}
          subproject_id={subproject_id}
          place_id={place_id}
          place={place}
          place_report_id={placeReport.place_report_id}
          level={level + 1}
        />
      )}
    </>
  )
}
