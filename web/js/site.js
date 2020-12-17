"use strict";

function getQuery() {
    return {
        id: Math.round(Math.random() * Number.MAX_SAFE_INTEGER),
        sum: 10 + Math.round(Math.random() * 490),
        commission: Math.round(5 + Math.random() * 15) / 10,
        order_number: 1 + Math.round(Math.random() * 20),
    };
}

function getQueries() {
    const queries = [];
    const queryCount = 1 + Math.round(Math.random() * 10);

    for (let iQuery = 1; iQuery <= queryCount; iQuery++) {
        queries.push(getQuery());
    }

    return queries;
}

function showQueries(queries) {
    const content = document.getElementsByClassName('body-content')[0];
    content.innerHTML = '';

    for (const query of queries) {
        const wrapper = document.createElement('p');
        const text = document.createTextNode('id: ' + query.id + ' sum:' + query.sum + ' commission:' + query.commission + ' order_number:' + query.order_number);
        wrapper.append(text);
        content.append(wrapper);
    }
}

function getSignValue(queries) {
    const text = JSON.stringify(queries);
    let signValue = 0;

    for (let i = 0; i < text.length; i++) {
        signValue += text.codePointAt(i);
        console.log(i, text.codePointAt(i));
    }

    return signValue;
}

function sendQueries(queries, signValue) {
    fetch('site/receiver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({queries, signValue}),
    });
}

setInterval(_ => {
    const queries = getQueries();
    showQueries(queries);
    const signValue = getSignValue(queries);
    sendQueries(queries, signValue);
}, 10000);
