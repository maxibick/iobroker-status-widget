
const ip = args.widgetParameter

console.log("Running as "+config.widgetFamily)

let w = await createWidget()
if (config.runsInWidget) {
  
  Script.setWidget(w)
} else {
  
  test()
  w.presentLarge()
}
Script.complete();


async function test() {
  
  //   let search = "search?pattern=system.adapter.*&prettyPrint"
  let plain = "getPlainValue/logparser.0.filters.Error.json"
  let req = await buildRequest(plain)
  console.log(await req.loadString())
}

async function createWidget() {
  
  let w = new ListWidget()
  let gradient = new LinearGradient()
  gradient.colors = [
    new Color("#004080"),
    new Color("#00264d")
  ]
  gradient.locations = [0, 0.5]
  w.backgroundGradient = gradient
  
  // icons
  let error_img = SFSymbol.named("xmark.octagon.fill").image

  // Titel Layout
  w.addText("Test")
  let title_stack = w.addStack()
  title_stack.borderWidth = 2
  
  // Titel Icon
  let icon = await loadAppIcon()
  let title_icon = title_stack.addImage(icon)
  let icon_size = new Size(15, 15)
  title_icon.imageSize = icon_size
  title_stack.addSpacer(5)
  
  // Titel text
  let title = title_stack.addText("ioBroker")
  title.textColor = Color.white()
  title.font = Font.mediumSystemFont(13)
  title.textOpacity = 0.7

  // Speicher
  w.addSpacer(10)
  let mem_stack = w.addStack()
  let stats = await loadDocs()
  console.log(stats)
  let gb_free_mem = Math.round((stats.val/1000)*100)/100
  mem_stack.addText("Freier Speicher: " + gb_free_mem.toString().replace(".", ",")+" GB")
  return w
}


async function loadAppIcon() {
  
  let url = "http://10.72.12.102:8081/img/no-image.png"
  let req = new Request(url)
  return req.loadImage()
}


async function loadDocs() {
  
  let url = "http://10.72.12.102:8087/get/system.host.srv-cont-iobroker.freemem"
  let req = new Request(url)
  return await req.loadJSON()
}

async function buildRequest(requestString) {
  
  let base = "http://10.72.12.102:8087/"
  let url = base + requestString
  console.log("Request: "+url)
  return new Request(url)
}
