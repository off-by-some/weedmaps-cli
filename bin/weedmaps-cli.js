#!/usr/bin/env node
var weedmaps = require('..');

function getOptions() {
  let filterFlags = process.argv.filter(function(x) { return x.indexOf("--") !== -1});
  let location = process.argv.filter(function(x) { return x.indexOf("--") === -1})
  location = location[location.length - 1];

  let query = process.argv.filter(
    function(x) { return x.indexOf("query=") >= 0 }
  )[0];

  if (query !== undefined) {
    delete filterFlags[filterFlags.indexOf(query)]
    const segs = query.split("=");
    query = segs[segs.length - 1];
  }

  filterFlags = filterFlags.map(function(x) {
    const segs = x.split("--")
    return segs[segs.length - 1]
  });

  console.log("Searching " + location + "...")
  if (query) console.log("Searching for " + query);

  return {
    query,
    filters: filterFlags.filter(x => x),
    regionName: location,
  }
}


const opts = getOptions()

if (opts.filters.length === 0) {
  opts.filters = Object.keys(weedmaps.FILTERS)
}

const filterTypes = opts.filters.map(function(x) {
  const name = weedmaps.FILTERS[x];

  if (name == null) {
    console.log("Fatal: Unrecognized filter " + x)
    process.exit(1);
  }

  return name
});

opts.filters = filterTypes;

weedmaps.getShopsWithClones(opts).catch(function(r) {console.log(r)})

