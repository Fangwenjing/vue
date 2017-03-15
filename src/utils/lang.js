export function extend (to, from) {
  var keys = Object.keys(from)
  var i = keys.length
  while (i--) {
    if (!to[keys[i]]) {
      to[keys[i]] = from[keys[i]]
    }
  }
  return to
}
