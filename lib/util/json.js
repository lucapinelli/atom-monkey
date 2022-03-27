'use babel'

const getRowPosition = (rows, error) => {
  const match = (error || '').replace(/\n/g, '').match(/Unexpected .* in JSON at position (\d+)/)
  if (!match || !match[1]) {
    return null
  }
  let index = Number(match[1])
  let currentRow = 0
  while (rows[currentRow].length <= index) {
    index -= rows[currentRow].length + 1
    ++currentRow
  }
  return { row: currentRow + 1, index }
}

const getFocusBox = (rows, focus) => {
  const { row, index } = focus
  const from = Math.max(0, row - 3)
  const to = Math.min(rows.length, row + 2)
  let focusBox = rows.slice(from, to)
  const rowStart = Math.max(0, index - 40)
  const rowEnd = index + 40

  let maxLenght = 0
  focusBox = focusBox.map(row => {
    let line = row.substring(rowStart, rowEnd)
    if (rowStart > 0) {
      line = `…${line.substring(1)}`
    }
    if (row.length > rowEnd) {
      line = `${line.substring(0, rowEnd)}…`
    }
    maxLenght = Math.max(maxLenght, line.length)
    return line
  })
  const marker = '^'
    .padStart(index + 1 - rowStart, '-')
    .padEnd(maxLenght, '-')
  focusBox.splice(row - from, 0, marker)

  return focusBox.join('\n')
}

const parseError = (error, text) => {
  const rows = text.split('\n')
  const rowPosition = getRowPosition(rows, error.message)
  const focusBox = rowPosition
    ? getFocusBox(rows, rowPosition)
    : null
  return { error: error.message, rowPosition, focusBox }
}

export const validateJson = (text) => {
  try {
    JSON.parse(text)
    return { success: true }
  } catch (e) {
    return { success: false, ...parseError(e, text) }
  }
}

export const formatJson = (text) => {
  try {
    const json = JSON.parse(text)
    return { success: true, formatted: JSON.stringify(json, null, 2) }
  } catch (e) {
    return { success: false, ...parseError(e, text) }
  }
}
