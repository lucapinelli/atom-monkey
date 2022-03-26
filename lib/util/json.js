'use babel'

export const validateJson = (text) => {
  try {
    JSON.parse(text)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export const formatJson = (text) => {
  try {
    const json = JSON.parse(text)
    return { success: true, formatted: JSON.stringify(json, null, 2) }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
