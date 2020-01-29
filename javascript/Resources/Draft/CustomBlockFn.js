export default function(block) {
    // Adds alignment property to the class name of a block
    let className = block.getType()
    if (block.getData().get('align') != undefined) {
        if (block.getType() !== 'unordered-list-item' && block.getType() !== 'ordered-list-item') {
            className += " " + block.getData().get('align')
        }
    }
    return className
}