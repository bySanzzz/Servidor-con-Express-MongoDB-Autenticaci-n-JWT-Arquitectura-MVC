const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues.map(issue => ({
          campo: issue.path.join("."),
          mensaje: issue.message
        }))
      })
    }

    if (source === "query") {
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true
      })
    } else {
      req[source] = result.data
    }

    next()
  }
}

export { validate }