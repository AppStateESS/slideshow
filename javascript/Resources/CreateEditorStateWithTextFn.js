/**
 * Create an editor state with some text and a header-one block
 */

import { ContentState, EditorState, RichUtils } from 'draft-js';

import decorator from './LinkDecorator';
  
export default (text) =>  {
    let eState = EditorState.createWithContent(ContentState.createFromText(text), decorator)
    return RichUtils.toggleBlockType(eState, 'header-one')
};