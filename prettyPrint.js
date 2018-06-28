const prettyMap = {
  1:  "Indicas (Flower):",
  2:  "Sativas (Flower):",
  3:  "Hybrids (Flower):",
  4:  "Concentrates:",
  6:  "Drinks:",
  7:  "Clones:",
  10: "Gear:",
  11: "Topicals:",
  12: "Prerolls:"
}

module.exports.category = category;
function category(c) {
  console.log("\n")
  const prettyName = prettyMap[c.menu_item_category_id]
  console.log("===== " + prettyName + "\n");
  const selection = c.items
  // Level up!
  for (const item of selection) {
    const idx = selection.indexOf(item)
    console.log((idx + 1) + ".\t" + item.name)
  }
}

module.exports.shop = shop;
function shop(s) {
  console.log("\n\n")
  console.log("=========" + " Shop: " + s.name + " =========")
  console.log("\nAddress: " + s.address + " ====");

  // Print the shop's categories
  for (c of s.categories) {
    category(c);
  }
}

module.exports.shops = shops;
function shops(shops) {
  for (s of shops) {
    console.log("\n\n")
    console.log("=============================================================")
    shop(s);
    console.log("\n")
    console.log("=============================================================")
  }
}