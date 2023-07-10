import React, { useEffect, useRef } from 'react'
// import SlimSelect from 'slim-select'
// import 'slim-select/dist/slimselect.min.css'

import { echoDeadline } from '../utils'

const { SlimSelect } = window

export default function Select({
  placeholder,
  children,
  onChange,
  deadlineValue,
  data,
  ...rest
}) {
  const elemRef = useRef(null)

  useEffect(() => {
    let slimSelect

    if (data) {
      const dataArr = Object.values(data).map((el) => {
        return { text: echoDeadline(el), value: el.toString() }
      })
      slimSelect = new SlimSelect({
        select: elemRef.current,
        placeholder: placeholder,
        events: {
          beforeChange: onChange
        },
        settings: {
          showSearch: false,
          placeholderText: 'Выбрать срок'
        },
        data: dataArr
      })
    } else {
      slimSelect = new SlimSelect({
        select: elemRef.current,
        placeholder: placeholder,
        events: {
          beforeChange: onChange
        },
        settings: {
          showSearch: false
        }
      })
    }

    if (deadlineValue) {
      let deadlineValueNew = deadlineValue.map((el) => el.toString())
      if (deadlineValueNew.length <= 1) {
        deadlineValueNew = deadlineValueNew[0]
      }
      setTimeout(() => {
        slimSelect.setSelected(deadlineValueNew)
      }, 10)
    }

    return () => {
      slimSelect.destroy()
    }
  }, [deadlineValue])

  return (
    <select ref={elemRef} {...rest} onChange={() => null}>
      {children}
    </select>
  )
}
