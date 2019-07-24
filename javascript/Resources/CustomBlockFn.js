export default function(block) {
    // Adds alignment property to the class name of a block
    let className = block.getType()
    if (block.getData().get('align') != undefined) {
        className += " " + block.getData().get('align')
    }
    return className
}