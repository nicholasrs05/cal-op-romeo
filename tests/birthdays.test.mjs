import test from 'node:test'
import assert from 'node:assert/strict'
import {
  birthdaysOn, daysInMonth, displayName, isLeapYear, monthCells,
  moveDay, moveMonth, partitionBirthdays,
} from '../src/lib/birthdays.ts'

function person(id, day, month, year, panggoaran = null) {
  return {
    id, nama: `Nama ${id}`, panggoaran,
    tgllahir: String(day), blnlahir: String(month), thnlahir: String(year),
  }
}

test('February follows leap year rules and Monday-first alignment', () => {
  assert.equal(isLeapYear(2024), true)
  assert.equal(isLeapYear(2100), false)
  assert.equal(isLeapYear(2000), true)
  assert.equal(daysInMonth(2024, 2), 29)
  assert.equal(daysInMonth(2025, 2), 28)
  assert.equal(monthCells(2024, 2).filter((day) => day !== null).length, 29)
  assert.deepEqual(monthCells(2024, 1).slice(0, 3), [1, 2, 3])
  assert.deepEqual(monthCells(2024, 2).slice(0, 4), [null, null, null, 1])
})

test('month and day navigation crosses month and year boundaries', () => {
  assert.deepEqual(moveMonth({ year: 2024, month: 12, day: 31 }, 1), { year: 2025, month: 1, day: 31 })
  assert.deepEqual(moveMonth({ year: 2024, month: 1, day: 31 }, 1), { year: 2024, month: 2, day: 29 })
  assert.deepEqual(moveDay({ year: 2024, month: 2, day: 28 }, 1), { year: 2024, month: 2, day: 29 })
  assert.deepEqual(moveDay({ year: 2025, month: 1, day: 1 }, -1), { year: 2024, month: 12, day: 31 })
})

test('multiple people on one day are all shown and names fall back to nama', () => {
  const { birthdays } = partitionBirthdays([
    person('a', 18, 11, 1990, 'Panggoaran A'),
    person('b', 18, 11, 2000),
    person('c', 18, 11, 1985, '   '),
  ])
  const matches = birthdaysOn(birthdays, { year: 2026, month: 11, day: 18 })
  assert.equal(matches.length, 3)
  assert.deepEqual(matches.map(({ person }) => displayName(person)), ['Panggoaran A', 'Nama b', 'Nama c'])
  assert.equal(birthdaysOn(birthdays, { year: 2026, month: 11, day: 19 }).length, 0)
})

test('numeric date fields from the live API are placed on the calendar', () => {
  const dates = [[16, 7, 2005], [5, 6, 2000], [19, 10, 2001], [31, 5, 1970], [21, 11, 1962]]
  const people = dates.map(([day, month, year], index) => ({
    ...person(String(index + 1), day, month, year),
    id: index + 1, tgllahir: day, blnlahir: month, thnlahir: year,
  }))
  const { birthdays, invalid } = partitionBirthdays(people)
  assert.equal(birthdays.length, 5)
  assert.equal(invalid.length, 0)
  assert.equal(birthdaysOn(birthdays, { year: 2026, month: 5, day: 31 }).length, 1)
})

test('February 29 birthdays occur only in leap years', () => {
  const { birthdays } = partitionBirthdays([person('leap', 29, 2, 2000)])
  assert.equal(birthdaysOn(birthdays, { year: 2024, month: 2, day: 29 }).length, 1)
  assert.equal(birthdaysOn(birthdays, { year: 2025, month: 2, day: 28 }).length, 0)
  assert.equal(birthdaysOn(birthdays, { year: 2025, month: 3, day: 1 }).length, 0)
})

test('invalid dates stay visible in the correction list', () => {
  const { birthdays, invalid } = partitionBirthdays([
    person('valid', 31, 1, 1994),
    person('impossible', 31, 2, 1994),
    person('not-leap', 29, 2, 2001),
    person('text', '1x', 3, 2000),
    { ...person('fraction', 1, 3, 2000), tgllahir: 1.5 },
  ])
  assert.equal(birthdays.length, 1)
  assert.deepEqual(invalid.map(({ id }) => id), ['impossible', 'not-leap', 'text', 'fraction'])
})
