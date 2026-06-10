
let cachedDurationSeconds = 0

export const setSessionDuration = (minutes: number) => {
  cachedDurationSeconds = minutes * 60
}

export const getConfigDuration = (): number => cachedDurationSeconds