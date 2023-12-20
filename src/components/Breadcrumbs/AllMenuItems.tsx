import type { MenuProps } from 'antd'
import { BsCaretDown, BsCaretRight } from 'react-icons/bs'

import { buildNavs as buildNavs } from '../../modules/navs'

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  {
    label: <BsCaretDown />,
    key: 'root',
    children: buildNavs({ table: 'root', params: {} }).map(
      ({ path, text }, index) => ({
        label: text,
        path,
        key: index,
        children: [],
      }),
    ),
  },
]
