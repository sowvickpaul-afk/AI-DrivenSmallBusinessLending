if (
  process.env.NODE_ENV === 'development' &&
  typeof performance !== 'undefined' &&
  typeof performance.measure === 'function'
) {
  const nativeMeasure = performance.measure.bind(performance)

  const guardedMeasure = ((
    measureName: string,
    startOrMeasureOptions?: string | PerformanceMeasureOptions,
    endMark?: string,
  ) => {
    try {
      return nativeMeasure(measureName, startOrMeasureOptions, endMark)
    } catch (error) {
      const isServerComponentMeasure = measureName.startsWith('\u200b')
      const isNegativeTimestamp =
        error instanceof TypeError && error.message.includes('negative time stamp')
      const options =
        typeof startOrMeasureOptions === 'object' && startOrMeasureOptions !== null
          ? startOrMeasureOptions
          : null

      if (!isServerComponentMeasure || !isNegativeTimestamp || !options) throw error

      // React's development RSC profiler can receive a slightly negative server
      // timestamp after HMR or clock-origin drift. Clamp only that profiler
      // entry and preserve all application Performance API behavior.
      const start = typeof options.start === 'number' ? Math.max(0, options.start) : options.start
      const end =
        typeof options.end === 'number'
          ? Math.max(0, typeof start === 'number' ? start : 0, options.end)
          : options.end

      return nativeMeasure(measureName, { ...options, start, end })
    }
  }) as Performance['measure']

  Object.defineProperty(performance, 'measure', {
    configurable: true,
    value: guardedMeasure,
  })
}
