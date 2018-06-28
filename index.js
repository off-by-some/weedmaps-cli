const _ = require('lodash');
const sA = require('superagent');
const lev = require('levenshtein');

const prettyPrint = require('./prettyPrint');

// Human readable name mapping to (assumed) WeedMaps API type enum
const FILTERS = {
  indica:       1,
  sativa:       2,
  hybrid:       3,
  concentrate:  4,
  drink:        6,
  clone:        7,
  gear:        10,
  topicals:    11,
  preroll:     12,
}

// Grab all listings in an area
function getListings(regionName) {
  const url =
    "https://weedmaps.com/api/web/v1/listings?" +
    "only_published=true&region=" +
    regionName +
    "&size=150&types[]=dispensary"

  return new Promise(function(resolve, reject) {
    sA.get(url).then(function(req) {
      resolve(req.body)
    })
  })
}

function getListingMenu(listing) {
  const url =
    "https://weedmaps.com/api/web/v1/listings/" +
    listing.slug +
    "/menu?type=dispensary"

  return new Promise(function(resolve, reject) {
    sA.get(url).then(function(req) {
      const res = {
        categories: req.body.categories || [],
        apiName: listing.slug,
        name: listing.name,
        weedMapsId: listing.wmid,
        address: listing.address,
      }
      resolve(res)
    })
  });
}

// Find all categories relevant to our type id
function filterCategoriesByTypeId(id, categories) {
  return _.filter(
    categories,
    function(x) { return x.menu_item_category_id === id }
  )
}

// Finds only the categories we care about, and removes the rest
function filterIrrelevant(id, menus) {
  return menus.map(function(obj) {
      return _.assign(
        {}, obj,
        {categories: filterCategoriesByTypeId(id, obj.categories)}
      )
  });
}

function gatherResults(opts, cb, menus) {

  // Map over every option given to us at runtime
  let results = opts.map(function(typeIdx) {
    // Map over our data with our filters and remove
    // data that does not match our type (pure)
    return filterIrrelevant(typeIdx, menus);
  });

  // Zip our requested list of features back into groups of alike items
  // [[menu1,2,3],[menu1,2,3]] -> [[m1, m1], [m2, m2] ...]
  results = _.zip.apply(null, results)

  // ...and merge each scalar of filtered features from our data
  results = results.map(function(x) {
    // Yeesh. _.merge doesn't merge deep enough
    return _.reduce(x, function (a, b) {
      a.categories = a.categories.concat(b.categories)
      return a
    });
  });

  // Remove any shops that yielded no results
  results = _.filter(results, function(x) { return x.categories.length !== 0})

  // prettyPrintShops(results)

  cb(results)
}

function menuHasString(s1, menu) {
  for (const category of menu.categories) {
    const listings = category.items
    for (i of listings) {

      const fullMatch = new lev(s1, i.name);
      const singleMatches = _.some(
        i.name.split(" ")
          .map(function(x) { return (new lev(s1, x)).distance < 3 })
      );

      // Compare the edit distance of the full string and
      // it's individual segments to the query string
      if (fullMatch.distance < 5 || singleMatches) return true;
    }
  }
  return false;
}

function searchForItemInMenus(query, menus) {
  return _.filter(menus, menuHasString.bind(null, query));
}

function processListings(opts, listings) {
  const proms = listings.map(function(listing) {
    return getListingMenu(listing)
  });

  const filters = opts.filters
  return new Promise(function(resolve, reject) {
    Promise.all(proms)
      .then(gatherResults.bind(null, filters, resolve))
      .catch(function(err) {console.log("err", err)});
  }).then(function(x) {
    if (opts.query) {
      return searchForItemInMenus(opts.query, x);
    }
    return x;
  }).then(prettyPrint.shops)
  .catch(function(e) { console.log(e) });
}

function getShopsWithClones(opts) {
  return new Promise(function(resolve, reject) {
    getListings(opts.regionName)
      .then(processListings.bind(null, opts))
  });
}

exports.FILTERS = FILTERS;
exports.getShopsWithClones = getShopsWithClones;