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

function getHeaders(table) {
    return table[0];
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

function hasEqualCountHeaders(table1, table2) {
    return table1[0].length != table2[1].length;
}

function getHeaderCount(table) {
    return getHeaders(table).length;
}

function getDifferentRows(table1, table2) {
    const rows = [];

    let y = 1;
    while (y < table1.length && y < table2.length) {
        let columnDiffObject = {};
        const table1row = table1[y];
        const table2row = table2[y];

        let x = 0;
        while (x < table1row.length && x < table2row.length) {
            const table1column = table1row[x];
            const table2column = table2row[x];

            if (table1column !== table2column) {
                columnDiffObject[x] = [ table1column, table2column ];
            }

            x++;
        }

        while (x < table1row.length) {
            columnDiffObject[x] = [ table1row[x], null ];
            x++;
        }

        while (x < table2row.length) {
            columnDiffObject[x] = [ null, table2row[x] ];
            x++;
        }
        
        rows.push(columnDiffObject);
        y++;
    }

    while (y < table1.length) {
        let columnDiffObject = {};
        let x = 0;
        while (x < table1[y].length) {
            columnDiffObject[x] = [ table1[y][x] , null ]
            x++;
        }
        rows.push(columnDiffObject);
        //console.log("#1 table has one more column")
        y++;
    }

    while (y < table2.length) {
        let columnDiffObject = {};
        let x = 0;
        while (x < table2[y].length) {
            columnDiffObject[x] = [ table2[y][x] , null ]
            x++;
        }

        rows.push(columnDiffObject);
        y++;
    }

    return rows;
}

function getHeaderTemplate(headers) {
    let html = "";
    headers.forEach(header => {
        html += `<th class="col">${header}</th>`;
    });
    return html;
}

$(document).ready(function() {
    $('#exampleModal').on('show.bs.modal', async function(event) {
        const btn = $(event.relatedTarget);
        const tableName = btn.data('table-name');
        const modal = $(this);

        let [db1Table, db2Table] = await Promise.all([
            get(`/index.php?action=rows-api&db=youtube&table=${tableName}`),
            get(`/index.php?action=rows-api&db=youtube_test&table=${tableName}`),
        ]);
        
        const differentRows = getDifferentRows(db1Table, db2Table);

        let html = "<table class='table table-striped table-responsive'><tr>";
        html += getHeaderTemplate(getHeaders(db1Table));
        html += getHeaderTemplate(getHeaders(db2Table));
        html += "</tr>";

        const table1ColumnCount = getHeaderCount(db1Table);
        const table2ColumnCount = getHeaderCount(db2Table);

        let y = 1;
        while (y < db1Table.length && y < db2Table.length) {
            if (Object.keys(differentRows[y]).length === 0) {
                console.log(`#${row} has no difference ... skipping`)
                y++;
                continue;
            }

            html += "<tr>";
            let table1Columns = "";
            let table2Columns = "";

            let x = 0;
            while (x < table1ColumnCount && x < table2ColumnCount) {
                table1Columns += `<td class="col">${db1Table[y][x]}</td>`;
                table2Columns += `<td class="col">${db2Table[y][x]}</td>`;
                x++;
            }
    
            while (x < table1ColumnCount) {
                table1Columns += `<td class="col">${db1Table[y][x]}</td>`;
                x++;
            }
    
            while (x < table2ColumnCount) {
                table2Columns += `<td class="col">${db2Table[y][x]}</td>`;
                x++;
            }

            html += table1Columns;
            html += table2Columns;
            html += "</tr>";
            y++;
        }

        while (y < db1Table.length) {
            db1Table[y].forEach(column => {
                html += `<td class="col">${column}</td>`;
            });
            html += `<td colspan="${table2ColumnCount}"></td>`;
            y++;
        }

        while (y < db2Table.length) {
            html += `<td colspan="${table1ColumnCount}"></td>`;
            db2Table[y].forEach(column => {
                html += `<td class="col">${column}</td>`;
            });
            y++;
        }
        
        html += "</table>";

        modal.find('.modal-title').text(`${tableName} table`);
        modal.find('.modal-body').html(html);
    });
});
