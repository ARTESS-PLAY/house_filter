import React, { useEffect, useMemo, useState } from 'react'
import Flat from './Flat'

export default function Wish({ houseTopFloorMap, availableItems }) {
  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem('wishList') || '[]')
  )
  const wishedItems = useMemo(
    () => availableItems.filter((item) => wishList.includes(item.id)),
    [wishList]
  )

  useEffect(() => {
    localStorage.setItem('wishList', JSON.stringify(wishList))
    window.dispatchEvent(
      new CustomEvent('wish-list-changed', { detail: wishList.length })
    )
  }, [wishList])

  return (
    <>
      {wishedItems.length ? (
        <div className="catalog__grid">
          {wishedItems.map((item, i) => (
            <Flat
              {...item}
              topFloor={houseTopFloorMap[item.house]}
              key={item.id}
              wished={wishList.includes(item.id)}
              onToggleWish={() =>
                setWishList(wishList.filter((id) => id !== item.id))
              }
            />
          ))}
        </div>
      ) : (
        <div className="catalog__empty">Список пуст</div>
      )}
    </>
  )
}
