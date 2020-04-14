Data = {
    showAll: function (elem) {
        $('table.table tr.data').show();
        Data.selectElement(elem);
    },

    showDiff: function (elem) {
        $('table.table tr.data').hide();
        $('table.table li.new').parent().parent().parent().show();
        Data.selectElement(elem);
    },

    selectElement: function (elem) {
        $('.panel .sp a').removeClass('active');
        $(elem).addClass('active');
    },

    getTableData: function (url) {
        $('div.modal-background iframe').attr('src', url);
        $('div.modal-background').addClass('visible');
    },

    hideTableData: function () {
        $('div.modal-background').removeClass('visible');
    }
}

function get(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => response.json());
}

function getHeaders(table1, table2) {
    const tableHeader = [table1[0], table2[0]];

    if (tableHeader[0].length != tableHeader[1].length) {
        alert("not enought table header!");
        return;
    }

    const headers = [];

    for (var i = 0; i < tableHeader[0].length; i++) {
        if (tableHeader[0][i] === tableHeader[1][i]) {
            headers.push(tableHeader[0][i]);
        } else {
            headers.push(tableHeader[0][i]);
            headers.push(tableHeader[1][i]);
        }
    }

    return headers;
}

function getRows(table1, table2) {
    table1.splice(0, 1);
    table2.splice(0, 1);

    const rows = [];

    for (var i = 0; i < table1.length; i++) {
        const row = {};

        if (tableHeader[0][i] === tableHeader[1][i]) {
            headers.push(tableHeader[0][i]);
        } else {
            headers.push(tableHeader[0][i]);
            headers.push(tableHeader[1][i]);
        }

        rows.push(row);
    }

    return rows;
}

function getDifferentRows(table1, table2) {
    table1.splice(0, 1);
    table2.splice(0, 1);

    if (table1.length !== table2.length) {
        alert(`Unmatch row count! Table1.length: ${table1.length}, Table2.length: ${table2.length}`);
    }

    const rows = [];

    for (var y = 0; y < table1.length; y++) {
        const diffObj = [];
        const row1 = table1[y];
        const row2 = table1[y];

        if (row1.length !== row2.length) {
            alert(`Unmatch column count at row index ${y}`);
            break;
        }

        for (var x = 0; x < row1.length; x++) {
            const column1 = row1[x];
            const column2 = row2[x];

            if (column1 !== column2) {
                console.log(`difference at row ${y} at column ${x}`);
                diffObj.push(column1);
                diffObj.push(column2);
            }
        }

        if (diffObj.length !== 0) {
            rows.push(diffObj);
        }
    }

    return rows;
}

$(document).ready(function() {
    const diffBtns = document.querySelectorAll("span.diff-table-rows");
    diffBtns.forEach(btn => {
        btn.addEventListener("click", async function() {
            let [db1Table, db2Table] = await Promise.all([
                get(`/index.php?action=rows-api&db=youtube&table=${btn.dataset.tableName}`),
                get(`/index.php?action=rows-api&db=youtube_test&table=${btn.dataset.tableName}`),
            ]);

            const tableHeader = [db1Table[0], db2Table[0]];

            const asd = document.querySelector("div#asdasdasd");
            asd.innerHTML = btn.dataset.tableName + "<br>";
            $('div.modal-background').addClass('visible');

            const headers = getHeaders(db1Table, db2Table);
            asd.innerHTML += JSON.stringify(headers) + "<br>";
            asd.innerHTML += `Table 1 rows count: ${db1Table.length - 1}<br>`;
            asd.innerHTML += `Table 2 rows count: ${db2Table.length - 1}<br>`;
            asd.innerHTML += "Different rows:<br>";
            const differentRows = getDifferentRows(db1Table, db2Table);
            asd.innerHTML += JSON.stringify(differentRows) + "<br>";
        })
    });
});
