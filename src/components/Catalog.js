import React, { useEffect, useState, useMemo } from 'react'
import Select from './Select'
import Range from './Range'
import Flat from './Flat'
import { declOfNum } from '../utils'

export default function Catalog({
  houseTopFloorMap,
  availableItems,
  perPage = 6,
  mapHouseDeadline
}) {
  const [areaEnds, setAreaEnds] = useState([0, 100])
  const [areaRange, setAreaRange] = useState([0, 100])
  const [priceEnds, setPriceEnds] = useState([0, 100])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [floorEnds, setFloorEnds] = useState([0, 100])
  const [floorRange, setFloorRange] = useState([0, 100])

  // const [selectedHouses, setSelectedHouses] = useState([])
  // const [selectedRooms, setSelectedRooms] = useState([])
  const [deferredItems, setDeferredItems] = useState([])

  const [sort, setSort] = useState('asc')
  const [page, setPage] = useState(1)
  // const [firstUpdate, setFirstUpdate] = useState(true)
  const [layout, setLayout] = useState('grid')
  const [filtersChanged, setFiltersChanged] = useState(false)
  const [filtersTouched, setFiltersTouched] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  //фильтр выбора даты
  const [filterDeadline, setFilterDeadline] = useState([
    mapHouseDeadline[Object.keys(mapHouseDeadline)[0]]
  ])

  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem('wishList') || '[]')
  )

  const availableHouses = useMemo(
    () => [...new Set(availableItems.map((it) => it.house))].sort(),
    [availableItems]
  )

  const [selectedHouses, setSelectedHouses] = useState([availableHouses[0]])

  const availableRooms = useMemo(() => {
    const housedItems = availableItems.filter(
      (item) =>
        selectedHouses.length === 0 || selectedHouses.includes(item.house)
    )
    const start = housedItems.some((item) => item.is_studio === 1) ? [-1] : []
    return start.concat(
      [...new Set(housedItems.map((item) => item.rooms))].sort()
    )
  }, [availableItems, selectedHouses])

  const [selectedRooms, setSelectedRooms] = useState([availableRooms[0]])

  useEffect(() => {
    const reducedItems = availableItems
      .filter(
        (item) =>
          selectedHouses.length === 0 || selectedHouses.includes(item.house)
      )
      .filter((item) => {
        const onlyRooms = selectedRooms.filter((s) => s !== -1)
        const hasStudio = selectedRooms.includes(-1)
        return (
          selectedRooms.length === 0 ||
          (hasStudio && item.is_studio === 1) ||
          (onlyRooms.includes(item.rooms) && item.is_studio === 0)
        )
        // return selectedRooms.length === 0 || selectedRooms.includes(item.rooms)
      })

    const ar = reducedItems.map((it) => it.area)
    const newArea = [Math.floor(Math.min(...ar)), Math.ceil(Math.max(...ar))]
    setAreaEnds(newArea)
    setAreaRange(newArea)

    const pr = reducedItems.map((it) => it.price)
    const newPr = [Math.min(...pr), Math.max(...pr)]
    setPriceEnds(newPr)
    setPriceRange(newPr)

    const fl = reducedItems.map((it) => it.floor)
    const newFl = [Math.min(...fl), Math.max(...fl)]
    setFloorEnds(newFl)
    setFloorRange(newFl)
  }, [availableItems, selectedHouses, selectedRooms])

  const computedItems = useMemo(() => {
    return (
      availableItems
        .filter(
          (item) =>
            selectedHouses.length === 0 || selectedHouses.includes(item.house)
        )
        //дедлайн
        // .filter((item) => {
        //   return item.deadline == filterDeadline
        // })
        .filter((item) => {
          const onlyRooms = selectedRooms.filter((s) => s !== -1)
          const hasStudio = selectedRooms.includes(-1)
          return (
            selectedRooms.length === 0 ||
            (hasStudio && item.is_studio === 1) ||
            (onlyRooms.includes(item.rooms) && item.is_studio === 0)
          )
        })
        .filter(
          (item) => item.area >= areaRange[0] && item.area <= areaRange[1]
        )
        .filter(
          (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
        )
        .filter(
          (item) => item.floor >= floorRange[0] && item.floor <= floorRange[1]
        )
    )
  }, [
    availableItems,
    selectedHouses,
    selectedRooms,
    areaRange,
    priceRange,
    floorRange
  ])

  useEffect(() => {
    function onHandler(e) {
      setSelectedRooms([e.detail])
      // setFiltersChanged(false)
      // setDeferredItems([...computedItems])
    }
    window.addEventListener('select-catalog-room', onHandler)
    return () => window.removeEventListener('select-catalog-room', onHandler)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredItems, sort])

  useEffect(() => {
    if (!filtersChanged) {
      setDeferredItems([...computedItems])
    }
  }, [filtersChanged, computedItems])

  const displayedItems = useMemo(() => {
    return deferredItems
      .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price))
      .slice(0, perPage * page)
  }, [deferredItems, sort, page, perPage])

  useEffect(() => {
    localStorage.setItem('wishList', JSON.stringify(wishList))
    window.dispatchEvent(
      new CustomEvent('wish-list-changed', { detail: wishList.length })
    )
  }, [wishList])

  function clearFilters() {
    setSelectedHouses([availableHouses[0]])
    setSelectedRooms([availableRooms[0]])
    setAreaRange(areaEnds)
    setPriceRange(priceEnds)
    setFloorRange(floorEnds)
    setFiltersChanged(false)
    setFiltersTouched(false)
    setFiltersOpen(false)
    setFilterDeadline([mapHouseDeadline[availableHouses[0]]])
  }

  function showResults() {
    setFiltersChanged(false)
    setFiltersOpen(false)
  }

  function onHouseChange(e) {
    const set = new Set(selectedHouses)
    if (set.has(e.target.value)) {
      set.delete(e.target.value)
    } else {
      set.add(e.target.value)
    }
    setSelectedHouses([...set])

    const tmp = Array.from(set)

    setFilterDeadline(
      tmp.map((el) => {
        return mapHouseDeadline[el]
      })
    )
  }
  function onHouseChangeOLD(e) {
    const set = new Set(selectedHouses)
    if (set.has(e.target.value)) {
      set.delete(e.target.value)
    } else {
      set.add(e.target.value)
    }
    setSelectedHouses([...set])
  }

  function onRoomChange(e) {
    const set = new Set(selectedRooms)
    if (set.has(+e.target.value)) {
      set.delete(+e.target.value)
    } else {
      set.add(+e.target.value)
    }
    setSelectedRooms([...set])
  }

  function onToggleWish(id) {
    const set = new Set(wishList)
    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }
    setWishList([...set])
  }

  function onFiltersChange() {
    setFiltersChanged(true)
    setFiltersTouched(true)
  }

  function selectDeadLine(value) {
    setFiltersChanged(true)
    const newDeadLineArr = value.map((el) => {
      let deadline = parseInt(el.value)
      return deadline
    })

    setFilterDeadline(newDeadLineArr)

    const newHouseArr = newDeadLineArr.map((el) => {
      return Object.keys(mapHouseDeadline).find(
        (key) => mapHouseDeadline[key] === el
      )
    })

    setSelectedHouses(newHouseArr)
  }

  return (
    <>
      <button
        className="button button_outline button_full button_sort catalog__filter-toggle"
        onClick={() => setFiltersOpen(true)}
        type="button"
      >
        Открыть фильтр
      </button>
      <div
        className={`filters ${filtersOpen ? 'filters_open' : ''}`}
        onChange={onFiltersChange}
      >
        <button
          className="close filters__close"
          type="button"
          onClick={() => setFiltersOpen(false)}
        ></button>
        <h2 className="filters__title">Фильтр</h2>
        <div className="filters__group">
          <div className="filters__subtitle">Выберите дом</div>
          <div className="filters__checks">
            {availableHouses.map((ho) => (
              <label className="check" key={ho}>
                <input
                  className="check__input"
                  type="checkbox"
                  name="house"
                  value={ho}
                  checked={selectedHouses.includes(ho)}
                  onChange={onHouseChange}
                />
                <span className="check__box">{ho}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="filters__group">
          <div className="filters__subtitle">Количество комнат</div>
          <div className="filters__checks">
            {availableRooms.map((rm) => (
              <label className="check" key={rm}>
                <input
                  className="check__input"
                  type="checkbox"
                  name="rooms"
                  value={rm}
                  checked={selectedRooms.includes(rm)}
                  onChange={onRoomChange}
                />
                <span className="check__box">
                  {rm === -1 ? 'Студия' : `${rm}-к`}
                </span>
              </label>
            ))}
            {/*{selectedRooms}*/}
          </div>
        </div>
        <div className="filters__group">
          <div className="filters__subtitle">Площадь, м2</div>
          <Range
            min={areaEnds[0]}
            max={areaEnds[1]}
            value={areaRange}
            step={1}
            gap={2}
            showLegends
            onChange={(val) => setAreaRange(val)}
          />
        </div>
        <div className="filters__group">
          <div className="filters__subtitle">Стоимость, млн ₽</div>
          <Range
            min={priceEnds[0]}
            max={priceEnds[1]}
            value={priceRange}
            step={1}
            gap={10000}
            format={(v) => Math.round((v / 1000000) * 10) / 10}
            unformat={(v) => String(v).replace(',', '.') * 1000000}
            showLegends
            onChange={(val) => setPriceRange(val)}
          />
        </div>
        <div className="filters__group">
          <div className="filters__subtitle">Срок сдачи</div>
          <div className="select filters__select">
            <Select
              placeholder={'test'}
              className="select__item"
              onChange={(e) => selectDeadLine(e)}
              deadlineValue={filterDeadline}
              data={mapHouseDeadline}
              multiple
            ></Select>
          </div>
        </div>
        <div className="filters__group">
          <div className="filters__subtitle">Этаж</div>
          <Range
            min={floorEnds[0]}
            max={floorEnds[1]}
            value={floorRange}
            step={1}
            gap={1}
            onChange={(val) => setFloorRange(val)}
          />
        </div>
        <div className="filters__group filters__group_mobile">
          <div className="filters__subtitle">Сортировка</div>
          <div className="select filters__select">
            <Select
              className="select__item"
              value={sort}
              onChange={(e) => setSort(e[0].value)}
            >
              <option value="asc">Cначала дешевле</option>
              <option value="desc">Cначала дороже</option>
            </Select>
          </div>
        </div>
        <div className="filters__group filters__group_count">
          {filtersChanged && (
            <button
              className="filters__count"
              type="button"
              onClick={showResults}
            >
              Смотреть {computedItems.length}{' '}
              {declOfNum(computedItems.length, [
                'вариант',
                'варианта',
                'вариантов'
              ])}
            </button>
          )}
        </div>
        <div className="filters__group filters__group_reset">
          {filtersTouched && (
            <button
              className="filters__reset"
              type="button"
              onClick={clearFilters}
            >
              Очистить фильтр
            </button>
          )}
        </div>
      </div>
      <div className="catalog__filters-overlay"></div>
      <div className="catalog__sorts">
        <div className="catalog__sort">
          <div className="catalog__sort-title">Сортировка:</div>
          <div className="catalog__sort-select">
            <Select
              className="catalog__sort-item"
              value={sort}
              onChange={(e) => setSort(e[0].value)}
            >
              <option value="asc">Cначала дешевле</option>
              <option value="desc">Cначала дороже</option>
            </Select>
          </div>
        </div>
        <div className="catalog__views">
          <button
            className={`catalog__view catalog__view_grid ${
              layout === 'grid' && 'catalog__view_active'
            }`}
            onClick={() => setLayout('grid')}
            type="button"
          ></button>
          <button
            className={`catalog__view catalog__view_row ${
              layout === 'row' && 'catalog__view_active'
            }`}
            onClick={() => setLayout('row')}
            type="button"
          ></button>
        </div>
      </div>
      <div className={`catalog__grid catalog__grid_${layout}`}>
        {displayedItems.map((item, i) => (
          <Flat
            {...item}
            topFloor={houseTopFloorMap[item.house]}
            key={item.id}
            wished={wishList.includes(item.id)}
            onToggleWish={() => onToggleWish(item.id)}
          />
        ))}
      </div>
      <button
        className="button button_outline button_full"
        style={{
          display: displayedItems.length === deferredItems.length ? 'none' : ''
        }}
        onClick={() => setPage((p) => p + 1)}
      >
        Загрузить ещё
      </button>
    </>
  )
}
