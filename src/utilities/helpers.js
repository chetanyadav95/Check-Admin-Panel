/**
 * Return years from 2010
 */

import { Type } from './constants'

 function getYears() {
  const years = []
  const endYear = new Date().getFullYear() - 1

  var year = endYear

  while (year >= 2010) {
    years.push(year)
    year--
  }

  return years
}

/**
 * Call getYears() and save values to years
 */

const years = getYears()

/**
 * Get Choice label: A, B, C, D
 * @param {Number} index 
 */

function choiceLabel(index) {
  switch (index) {
    case 0:
      return 'A.'
    case 1:
      return 'B.'
    case 2:
      return 'C.'
    case 3:
      return 'D.'
    default:
      throw new Error('Invalid Choice Index')
  }
}

/**
 * Get question type from year
 */

function questionType(year) {
  switch (year) {
    case Type.SERIES:
      return 'Type: Test Series'
    case Type.QUIZ:
      return 'Type: Quiz'
    default:
      return `Year: ${year}`
  }
}

export { years, choiceLabel, questionType }
