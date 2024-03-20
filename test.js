const findChromeExtension= require('./index.js')

let pluginPath = findChromeExtension('Jest Pro', 'dffeocoiocigjnhiniacbcdmddmllpan')
console.log(pluginPath)

pluginPath = findChromeExtension('FigmaCN')
console.log(pluginPath)
