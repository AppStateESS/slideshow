// Link Decorator
import React from 'react'
import { CompositeDecorator } from 'draft-js'
import Tippy from '@tippy.js/react'
import 'tippy.js/themes/google.css'

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
    let {url} = props.contentState.getEntity(props.entityKey).getData();
    const urlA = url.split("//")
    if (urlA[0] != "https:" && urlA[0] != "http:") {
        url = "http://" + url
    }
    return (
        <Tippy content={<a href={url} style={{color: 'white'}} target="_blank">{url}</a>} arrow={true} interactive={true}>
            <a className="linkDecorator" href={url} style={linkStyle} target="_blank">
                {props.children}
            </a>
        </Tippy>
    );
};

const linkStyle = {
    color: 'royalblue',
    textDecorationColor: 'royalblue',
    // There is a bug where this disappears when text is aligned to center/right
    textDecorationLine: 'underline !important' 
}

const icon = {
    fontSize: '50%',
    verticalAlign: 'middle'
}

const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link,
    },
]);

export default decorator;