const CAPS_REGX = /[A-Z]/g
let updateDataset = function(oldVnode, vnode) {
    var elm = vnode.elm, 
        oldDataset = oldVnode.data.dataset,
        dataset = vnode.data.dataset
    if (!oldDataset && !dataset) return
    if (oldDataset === dataset) return
    oldDataset = oldDataset || {}
    dataset = dataset || {}
    var d = elm.dataset
    
}