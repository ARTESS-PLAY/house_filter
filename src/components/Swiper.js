import React, { useEffect, useRef } from 'react'

const SwiperPlugin = window.Swiper

export function Swiper({ options, children, className = '', ...rest }) {
  const elemRef = useRef(null)

  useEffect(() => {
    const swiper = new SwiperPlugin(elemRef.current, options)
    return () => swiper.destroy()
  }, [options])

  return (
    <div className={`swiper ${className}`} {...rest} ref={elemRef}>
      <div className="swiper-wrapper">{children}</div>
    </div>
  )
}

export function SwiperSlide({ children, className = '', ...rest }) {
  return (
    <div className={`swiper-slide ${className}`} {...rest}>
      {children}
    </div>
  )
}
