import React from 'react';

export const showToast = (msg) => {
    console.log("msgsSS____",msg)
    return (
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                {msg}
            </div>
        </div>
    );
}