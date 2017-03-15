import Vue from 'vue'

Vue.filter('formatSize', (size) => {
  if (size > 1024 * 1024) {
    if (size > 1024 * 1024 * 1024) {
      return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    } else {
      return (size / 1024 / 1024).toFixed(2) + ' MB'
    }
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return size.toString() + ' B'
  }
})
