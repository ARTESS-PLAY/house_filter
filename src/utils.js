export function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ]
}

export function formatPrice(value) {
  return Intl.NumberFormat('ru-RU', { currency: 'RUB' }).format(value)
}

export function echoDeadline(deadline) {
  const str = deadline.toString()
  const ans = `${str.slice(-1)} квартал ${str.slice(0, 4)} г`
  return ans
}
