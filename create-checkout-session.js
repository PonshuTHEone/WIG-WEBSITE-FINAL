const stripeModule = require("stripe");
const Stripe = stripeModule.Stripe || stripeModule.default || stripeModule;

// Prices live here on the server so a customer can never change what they pay.
// Each product: cols = the lengths, rows = [colour group, [price for each length]] (CAD, 100% price).
const PRICES = {"Heather":{"cols":["14\" / 35cm (long layer)"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #SAND, #HVS, #MBLOND, #TAB, #TBLOND, #TMJ, #BRM, #DICE, #ASH BLOND, #RBA, #WTR, #BRH",[1953.43]]]},"Natalie":{"cols":["14\" / 35cm (short layer)"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TAB, #TMJ, #ASH BLOND",[1790.57]]]},"Melody":{"cols":["14\" / 35cm"],"rows":[["#NC, #2, #4, #6, #8, #ASH BLOND, #BRH, #BRM, #DICE, #HVS, #TBLOND, #WTR, #22, #60, #MBLOND, #RBA, #SAND, #TMJ",[1622.0]]]},"Elaris":{"cols":["2\"-4\" / 5-10cm"],"rows":[["#ASH BLOND, #TAB, #TMJ, #TMR",[1253.43]]]},"Valenne":{"cols":["6\"-8\" / 15-20cm"],"rows":[["#ASH BLOND, #TAB, #TMJ, #TMR",[1539.14]]]},"Amelie":{"cols":["14\" / 35cm"],"rows":[["#Natural Black, #1B, #4, #22",[1739.14]]]},"Evelyn":{"cols":["14\" / 35cm"],"rows":[["#4, #613",[1353.43]],["#1740, #60R",[1410.57]]]},"Vivian":{"cols":["14\" / 35cm","18\" / 45cm"],"rows":[["#4, #613",[1353.43,2353.43]],["#1740, #6244",[1410.57,null]]]},"HW-3":{"cols":["14\" / 35cm","16\" / 40cm"],"rows":[["#4",[1353.43,null]],["#613",[1353.43,1639.14]],["#60R",[1410.57,null]]]},"Margot":{"cols":["14\" / 35cm"],"rows":[["#4, #613, #22R",[2353.43]]]},"Custom colour lace front":{"cols":["12\" / 30cm BOB","14\" / 35cm BOB","16\" / 40cm BOB","16\" / 40cm LONG LAYER","18\" / 45cm LONG LAYER","20\" / 50cm LONG LAYER","22\" / 55cm LONG LAYER","24\" / 60cm LONG LAYER"],"rows":[["Transparent lace",[622.0,724.86,839.14,782.0,896.29,1050.57,1107.71,1210.57]],["HD lace",[679.14,810.57,924.86,867.71,993.43,1153.43,1210.57,1307.71]]]},"Julie":{"cols":["14\" / 35cm","16\" / 40cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[910.57,1153.43]]]},"Sidney":{"cols":["14\" / 35cm","16\" / 40cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[639.14,753.43]]]},"Kailani":{"cols":["14\" / 35cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[1082.0]]]},"Eloise":{"cols":["14\" / 35cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[1053.43]]]},"Teena":{"cols":["14\" / 35cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[1082.0]]]},"Orpha":{"cols":["14\" / 35cm"],"rows":[["#NC, #2, #4, #6, #8, #22, #60, #MBLOND, #TMJ, #TMR",[1367.71]]]},"Lucia":{"cols":["6\" / 15cm","8\" / 20cm","10\" / 25cm"],"rows":[["#2, #3, #4, #5, #6, #7, #20",[610.57,696.29,782.0]]]},"Solene":{"cols":["14\" / 35cm","16\" / 40cm"],"rows":[["Natural Black, #1B, #4, #6",[767.71,924.86]]]},"Camille":{"cols":["14\" / 35cm","16\" / 40cm"],"rows":[["Natural Black, #1B, #4, #6",[767.71,924.86]],["#22",[839.14,990.57]]]},"Lena":{"cols":["14\" / 35cm","18\" / 45cm"],"rows":[["#1B, #2, #3, #4, #6",[793.43,1124.86]]]},"Mira":{"cols":["14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm"],"rows":[["#1B, #2, #4, #6",[679.14,782.0,867.71,1139.14]]]},"Irene":{"cols":["14\" / 35cm","16\" / 40cm","18\" / 45cm"],"rows":[["#8K, #NC",[467.71,553.43,710.57]],["#10",[524.86,653.43,910.57]],["#T8/27, #10/24",[590.57,753.43,982.0]]]},"Verena":{"cols":["12\" / 30cm"],"rows":[["Natural Black",[524.86]],["#2, #4",[567.71]],["#22, #60",[596.29]]]},"Cecily":{"cols":["10\" / 25cm","12\" / 30cm","14\" / 35cm","16\" / 40cm"],"rows":[["Natural Black",[524.86,624.86,753.43,867.71]],["#4, #6",[562.0,653.43,790.57,933.43]],["#22, #60, #613",[582.0,682.0,853.43,993.43]]]},"Lyra":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm"],"rows":[["Natural Black, #1B",[879.14,964.86,1153.43]],["#2, #4, #4ASH, #8",[907.71,993.43,1210.57]],["#60, #613",[993.43,1079.14,1307.71]]]},"Arielle":{"cols":["14\" / 35cm","16\" / 40cm","20\" / 50cm"],"rows":[["Natural Black",[753.43,896.29,1153.43]],["#2, #4",[782.0,939.14,null]],["#613",[853.43,1024.86,null]],["#22",[null,1024.86,null]],["#60",[null,1050.57,null]],["#T4-8-60",[896.29,1096.29,null]]]},"Flora 6×6.5":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm","22\" / 55cm"],"rows":[["Natural Black",[1024.86,1067.71,1224.86,1282.0,1539.14,1667.71]],["#2",[1024.86,1067.71,1224.86,null,1539.14,null]],["#4, #6",[1024.86,1067.71,1224.86,1282.0,1539.14,null]],["#8",[1096.29,1224.86,1324.86,1410.57,1696.29,null]],["#613",[1096.29,1224.86,1324.86,1410.57,1696.29,1796.29]],["#T4-8-60 (European Hair)",[null,1453.43,1524.86,1639.14,1839.14,null]]]},"Flora 8×8":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","20\" / 50cm","18\" / 45cm"],"rows":[["Natural Black",[1239.14,1382.0,1524.86,1810.57,null]],["#2, #4",[1239.14,1382.0,1524.86,1810.57,1667.71]]]},"STWL8x8":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","20\" / 50cm"],"rows":[["Natural Black",[1239.14,1382.0,1524.86,1810.57]],["#2",[null,null,1524.86,1810.57]],["#4",[null,null,1524.86,null]],["#613",[null,null,1724.86,null]]]},"STWL7x8":{"cols":["14\" / 35cm","16\" / 40cm","12\" / 30cm"],"rows":[["#T4-8-60 (European Hair)",[1696.29,1824.86,null]],["#R25AL (European Hair)",[1696.29,1824.86,1610.57]]]},"Hilary":{"cols":["10\" / 25cm","12\" / 30cm","14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm"],"rows":[["#2",[710.57,767.71,839.14,896.29,953.43,1010.57]],["#4",[null,767.71,839.14,896.29,953.43,null]],["Natural Black",[767.71,824.86,null,953.43,1010.57,null]],["#613",[767.71,824.86,896.29,953.43,1010.57,1067.71]],["#18-22",[null,null,910.57,null,null,null]],["#T4-8-60",[867.71,924.86,982.0,1039.14,null,null]],["#R25AL (European Hair)",[null,924.86,982.0,1039.14,1096.29,null]],["#TGrey-614, #6-8R",[null,924.86,null,null,null,null]]]},"STL6x6.5":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm"],"rows":[["#2, #4",[1267.71,1324.86,1353.43,1539.14,1710.57]],["Natural Black",[1267.71,1324.86,null,1539.14,1710.57]],["#613",[1396.29,1539.14,1596.29,1710.57,1867.71]],["#6-8",[null,1567.71,1667.71,null,1896.29]],["#6-8-613",[null,null,null,null,1896.29]],["#T4-8-60",[1510.57,null,1739.14,1839.14,1967.71]],["#R25AL (European Hair)",[null,1639.14,null,1839.14,1967.71]],["#R24AL (European Hair)",[null,1724.86,1810.57,1924.86,2039.14]]]},"Ella":{"cols":["14\" / 35cm","16\" / 40cm","18\" / 45cm"],"rows":[["#1B",[739.14,853.43,null]],["#1A, #2A, #2, #3, #4, #6",[739.14,null,null]],["#7C, #8, #14, #18, #30, #33, #695T, #99J, #Cherry, #White, GREY",[796.29,null,null]],["#4-33, #14-22",[839.14,null,null]],["#613",[null,910.57,null]],["#18-22",[839.14,null,1067.71]]]},"ST5x3":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm","10\" / 25cm"],"rows":[["Natural Black",[967.71,1039.14,1153.43,1253.43,1353.43,null]],["#2",[839.14,910.57,996.29,1082.0,1153.43,739.14]],["#4",[null,910.57,996.29,1082.0,1153.43,null]],["#6",[839.14,910.57,996.29,1082.0,1153.43,null]],["#8",[967.71,1039.14,1153.43,null,null,null]],["#613",[967.71,1039.14,1153.43,1253.43,1353.43,null]],["#T4-8-60",[1124.86,1196.29,1367.71,1424.86,1639.14,null]],["#6-8R",[null,null,1282.0,null,null,null]],["#GREY",[1039.14,1110.57,null,null,null,null]],["#white",[null,null,1153.43,null,1353.43,null]],["#R24AL (European Hair)",[1124.86,null,1367.71,1424.86,1639.14,null]],["#R25AL (European Hair)",[1124.86,1196.29,1367.71,1424.86,1639.14,null]],["#R26AL (European Hair)",[1124.86,1196.29,1367.71,1424.86,null,null]],["#R28AL (European Hair)",[1124.86,1196.29,1367.71,null,null,null]],["#R29AL (European Hair)",[null,1196.29,1367.71,null,null,null]],["#R30AL (European Hair)",[null,1196.29,null,null,null,null]]]},"Alba":{"cols":["14\" / 35cm"],"rows":[["#1, #1B, #2, #3, #4, #6",[639.14]],["#2A, #7C, #8, #10, #22, #30, #33, #695T, #613, #99J",[682.0]],["#14-22, #18-22, #4-8-18, #White, #GREY",[710.57]],["#4-8-18ROOT",[767.71]]]},"STF":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","18\" / 45cm","20\" / 50cm"],"rows":[["Natural Black, #2, #4, #6",[1253.43,1324.86,1382.0,1567.71,1667.71]],["#8",[null,1410.57,1539.14,1767.71,1896.29]],["#613",[1324.86,1410.57,1539.14,1767.71,1896.29]],["#T4-8-60",[null,null,1696.29,null,null]],["#R25AL (European Hair)",[1467.71,1582.0,1696.29,1896.29,1982.0]]]},"Monot":{"cols":["12\" / 30cm","14\" / 35cm","16\" / 40cm","20\" / 50cm","18\" / 45cm"],"rows":[["#2",[1039.14,1124.86,1196.29,1453.43,null]],["#4",[null,null,1196.29,1453.43,1324.86]],["Natural Black",[1039.14,1124.86,null,null,null]],["#6",[1039.14,null,1196.29,null,null]],["#613",[1153.43,1253.43,1382.0,1696.29,1510.57]],["#8",[1153.43,1253.43,1382.0,null,null]],["#R25AL (European Hair)",[1382.0,1453.43,null,1796.29,1696.29]],["#T4-8-60",[1382.0,1453.43,1567.71,null,1696.29]]]},"Amy":{"cols":["6\" / 15cm","8\" / 20cm","10\" / 25cm","12\" / 30cm","14\" / 35cm","16\" / 40cm"],"rows":[["Natural Color",[453.43,467.71,482.0,510.57,567.71,582.0]]]},"LT":{"cols":["10\" / 25cm"],"rows":[["Natural Color",[290.57]]]},"Amara":{"cols":["10\" / 25cm","12\" / 30cm"],"rows":[["Natural Color - base 5\"x6\" (13x15cm)",[482.0,510.57]],["Natural Color - base 5.5\"x6.25\" (14x16cm)",[510.57,553.43]]]},"SPC":{"cols":["14\" / 35cm","16\" / 40cm","18\" / 45cm"],"rows":[["Dark Color",[699.14,733.43,782.0]],["Light Color",[733.43,782.0,839.14]]]},"Tressa":{"cols":["12\" / 30cm","14\" / 35cm","18\" / 45cm","20\" / 50cm","16\" / 40cm"],"rows":[["#1B",[367.71,390.57,470.57,539.14,null]],["#2",[367.71,null,470.57,539.14,424.86]],["#4",[367.71,null,470.57,539.14,null]],["#60",[402.0,424.86,539.14,722.0,447.71]],["#4P27",[402.0,424.86,504.86,584.86,436.29]]]}};

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Work out the cart from our own price table
  let items;
  try {
    items = JSON.parse(event.body || "{}").items;
  } catch (e) {
    return json(400, { error: "Bad request." });
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
    return json(400, { error: "Your cart is empty or too large." });
  }

  const line_items = [];
  for (const it of items) {
    const product = Object.prototype.hasOwnProperty.call(PRICES, it && it.name) ? PRICES[it.name] : null;
    const row = product && Number.isInteger(it.row) ? product.rows[it.row] : null;
    const price = row && Number.isInteger(it.col) ? row[1][it.col] : null;
    const qty = it && it.qty;
    if (
      typeof price !== "number" ||
      !Number.isInteger(qty) || qty < 1 || qty > 10 ||
      typeof it.color !== "string" || !row[0].split(/,\s*/).includes(it.color)
    ) {
      return json(400, { error: "One of the items in your cart is no longer available. Please re-add it." });
    }
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "cad",
        unit_amount: Math.round(price * 100),
        product_data: { name: (it.name + " - " + product.cols[it.col] + " - " + it.color).slice(0, 250) },
      },
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });

  // TODO: Set mode to "subscription" if selling recurring products.
  const mode = "payment";

  const sessionParams = {
    ui_mode: "form",
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false },
    submit_type: "auto",
    integration_identifier: "custom_embedded_web_0001",
    mode,
    line_items,
  };
  if (mode === "subscription") {
    sessionParams.payment_method_collection = "always";
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return json(200, { client_secret: session.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return json(500, { error: "Could not start checkout. Please try again." });
  }
};
