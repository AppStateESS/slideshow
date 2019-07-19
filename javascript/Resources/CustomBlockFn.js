export default function(block) {
    let className = block.getType()
    if (block.getData().get('align') != undefined) {
        className += " " + block.getData().get('align')
    }
    return className
}