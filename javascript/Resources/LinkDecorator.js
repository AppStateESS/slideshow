// Link Decorator
import React from 'react'
import { CompositeDecorator } from 'draft-js'

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}
const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url} style={linkStyle} target="_blank">
            {props.children}
        </a>
    );
};

const linkStyle = {
    color: 'royalblue',
    textDecorationColor: 'royalblue',
    // There is a bug where this disappears when text is aligned to center/right
    textDecorationLine: 'underline' 
}

const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link,
    },
]);

export default decorator;