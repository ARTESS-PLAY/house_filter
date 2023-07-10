import React, { useEffect, useState } from 'react'

export default function Range({
  min = 0,
  max = 100,
  step = 1,
  gap = 10,
  value = [0, 100],
  onChange,
  format = (v) => v,
  unformat = (v) => v,
  showLegends = false,
  ...rest
}) {
  const [inputValue, setInputValue] = useState([...value])

  useEffect(() => {
    // console.log('value changed')
    setInputValue(value.map(format))
  }, [value])

  const onRangeChange = (i) => (e) => {
    if (i === 0) {
      const newValue = Math.max(e.target.valueAsNumber, min)
      onChange([Math.min(newValue, value[1] - gap), value[1]])
    } else {
      const newValue = Math.min(e.target.valueAsNumber, max)
      onChange([value[0], Math.max(newValue, value[0] + gap)])
    }
  }

  const onInputChange = (i) => (e) => {
    setInputValue(
      i === 0
        ? [e.target.value, inputValue[1]]
        : [inputValue[0], e.target.value]
    )

    let val = e.target.valueAsNumber
    if (isNaN(val)) return
    val = unformat(val)
    if (val < min || val > max) return

    if (i === 0) {
      if (max - gap < val) return
      onChange([val, value[1]])
    } else {
      if (min + gap > val) return
      onChange([value[0], val])
    }
  }

  function onInputBlur(e) {
    console.log('bluer')
    setInputValue(value.map(format))
  }

  return (
    <div className="range range_double">
      <div className="range__top">
        <span className="range__sep">—</span>
        {value.map((val, i) => (
          <div
            className="range__part"
            key={i}
            style={{
              '--range-input-width': `${
                String(inputValue[i]).replaceAll('.', '').length +
                (Number.isInteger(inputValue[i]) ? 0 : 0.5)
              }ch`
            }}
          >
            {showLegends && (
              <span className="range__legend">{i === 0 ? 'от' : 'до'}</span>
            )}
            <input
              className={`range__input range__input_${i === 0 ? 'one' : 'two'}`}
              type="number"
              min={format(min)}
              max={format(max)}
              // step={format(step)}
              value={inputValue[i]}
              onChange={onInputChange(i)}
              onBlur={onInputBlur}
            />
          </div>
        ))}
      </div>
      <div
        className="range__items"
        style={{
          '--gradient-stop-1': `${((value[0] - min) / (max - min)) * 100}%`,
          '--gradient-stop-2': `${((value[1] - min) / (max - min)) * 100}%`,
          background: `linear-gradient(to right, transparent var(--gradient-stop-1), #20BA72 var(--gradient-stop-1) ,
          #20BA72 var(--gradient-stop-2), transparent var(--gradient-stop-2))`
        }}
      >
        {value.map((val, i) => (
          <input
            key={i}
            className={`range__item range__item_${i === 0 ? 'one' : 'two'}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[i]}
            onChange={onRangeChange(i)}
          />
        ))}
      </div>
    </div>
  )
}
