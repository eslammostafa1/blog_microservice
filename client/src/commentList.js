import React from 'react';

const CommentList = ({ comments }) => {

    const renderComments = Object.values(comments).map(Comment => {
        //view the comment depend on the status of comment
        let content
        if ( Comment.status === 'approved') {
            content = Comment.content
        }
        if ( Comment.status === 'pending') {
            content = 'the comment is under review.'
        }
        if ( Comment.status === 'rejected') {
            content = 'the comment is under rejected.'
        }
        return <li key={Comment.id} >{content}</li>;
    });
    return (
        <ul>
            {renderComments}
        </ul>
    )
};

export default CommentList;
