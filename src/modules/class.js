let updateClass = function(oldVnode,vnode) {
    var cur ,name, elm = vnode.elm, 
        oldClass = oldVnode.data.class, kclass = vnode.data.class
    if (!oldClass && !kclass) return
    if (oldClass === kclass) return 
    oldClass = oldClass || {}
    kclass = kclass || {}
    // 从旧节点中删除新节点不存在的类
    for (name in oldClass) {
        if (!kclass[name]) {
            elm.classList.remove(name)
        }
    }
     //如果新节点中对应旧节点的类设置为false，则删除该类，如果新设置为true，则添加该类
    for (name in kclass) {
        cur = kclass[name]
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name)
        }
    }
}
export default {
    create: updateClass,
    update: updateClass
}