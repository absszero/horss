export default function (...numbers: number[]) {
  let result = 0

  if (numbers.length === 0) {
    throw new Error('No numbers specified')
  }

  for (let i = 0; i < numbers.length; i++) {
    if (typeof numbers[i] !== 'number') {
      return null
    }

    if (Number.isNaN(numbers[i])) {
      return null
    }

    result += numbers[i]
  }

  return result
}
