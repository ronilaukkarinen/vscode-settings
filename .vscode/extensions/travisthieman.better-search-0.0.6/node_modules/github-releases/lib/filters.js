var minimatch = require('minimatch')

module.exports =
class Filters {
  // Protected: Filter the array with {filter} if {filter} is a function,
  //            otherwise filter the array with elements that match the
  //            {filter}.
  filter(array, filter) {
    if (!(filter instanceof Function)) { filter = this.fieldMatchFilter.bind(this, filter) }
    return array.filter(filter)
  }

  // Private: Returns whether the string {str} matches the filter {filter}.
  matches(value, filter) {
    switch (filter.constructor) {
      case RegExp:
        return filter.test(value)
      case String:
        for (var filterPart of Array.from(filter.split(','))) {
          if (minimatch(value, filterPart)) { return true }
        }
        return false
      default:
        return value === filter
    }
  }

  // Private: Helper filter to test if {value} matches the {filter}
  fieldMatchFilter(filter, value) {
    for (var k in filter) {
      var v = filter[k]
      if ((value[k] == null) || !this.matches(value[k], v)) { return false }
    }
    return true
  }
}
