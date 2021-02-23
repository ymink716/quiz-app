import React from 'react'
import { withRouter } from 'react-router-dom';

function NotFoundPage(props) {
    return (
        <div style={{ textAlign: 'center' }}>
            Page Not Found
        </div>
    )
}

export default withRouter(NotFoundPage);
