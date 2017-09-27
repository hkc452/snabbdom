const CAPS_REGX = /[A-Z]/g
let updateDataset = function(oldVnode, vnode) {
    var elm = vnode.elm, 
        oldDataset = oldVnode.data.dataset,
        dataset = vnode.data.dataset,
        key
    if (!oldDataset && !dataset) return
    if (oldDataset === dataset) return
    oldDataset = oldDataset || {}
    dataset = dataset || {}
    var d = elm.dataset
    for (key in oldDataset) {
        if (!dataset[key]) {
            if (d) {
                if (key in d) {
                    delete d[key]            
                }
            }
            else {
                elm.removeAttribute('data-' + key.replace(CAPS_REGX, '-$&').toLowerCase())
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) {
            if (d) {
                d[key] = dataset[key]
            }
            else {
                elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key])
            }
        }
    }
}
export default {
    create: updateDataset,
    update: updateDataset
}