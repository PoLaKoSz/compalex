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
        //alert("not enought table header!");
        //return;
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

    console.log(headers)

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
    const table1HeaderCount = getHeaderCount(table1);
    const table2HeaderCount = getHeaderCount(table2);

    let y = 1;
    while (y < table1.length && y < table2.length) {
        //console.log("y =", y)
        let columnDiffObject = {};

        if (table1HeaderCount !== table2HeaderCount) {
            //console.log(`Unmatch column count at row index ${y}`);
            //break;
        }

        const table1row = table1[y];
        const table2row = table2[y];

        let x = 0;
        while (x < table1row.length && x < table2row.length) {
            const table1column = table1row[x];
            const table2column = table2row[x];

            if (table1column !== table2column) {
                //console.log(`difference at row ${y} at column ${x}`);
                columnDiffObject[x] = [ table1column, table2column ];
            } else {
                //console.log(`#${y} Row Column #${x} equals (${table1column} = ${table2column})`)
            }

            x++;
        }

        while (x < table1row.length) {
            columnDiffObject[x] = [ table1row[x], null ];
            //console.log(`#1 table has one more column at #${x}`)
            //console.log("x =", x)
            x++;
        }

        while (x < table2row.length) {
            columnDiffObject[x] = [ null, table2row[x] ];
            //console.log(`#2 table has one more column at #${x}`)
            //console.log("x =", x)
            x++;
        }
        
        rows.push(columnDiffObject);
        //console.log(`row #${y}`, columnDiffObject)
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
        //console.log("#2 table has one more column")
        y++;
    }

    console.log(rows)

    return rows;
}

function getHeaderTemplate(headers) {
    let html = "";
    headers.forEach(header => {
        html += `<td class="responsive">${header}</td>`;
    });
    return html;
}

$(document).ready(function() {
    const diffBtns = document.querySelectorAll("span.diff-table-rows");
    diffBtns.forEach(btn => {
        btn.addEventListener("click", async function() {
            let [db1Table, db2Table] = await Promise.all([
                get(`/index.php?action=rows-api&db=youtube&table=${btn.dataset.tableName}`),
                get(`/index.php?action=rows-api&db=youtube_test&table=${btn.dataset.tableName}`),
            ]);

            const tableHeaders = [getHeaders(db1Table), getHeaders(db2Table)];

            const asd = document.querySelector("div#asdasdasd");
            asd.innerHTML = btn.dataset.tableName + "<br>";
            $('div.modal-background').addClass('visible');

            const headers = getHeaders(db1Table, db2Table);
            const differentRows = getDifferentRows(db1Table, db2Table);

            let html = "<table class='response'><tr>";
            html += getHeaderTemplate(getHeaders(db1Table));
            html += getHeaderTemplate(getHeaders(db2Table));
            html += "</tr>";

            const table1ColumnCount = getHeaderCount(db1Table);
            const table2ColumnCount = getHeaderCount(db2Table);

            let y = 0;
            while (x < table1ColumnCount && x < table2ColumnCount) {
                const table1column = table1row[x];
                const table2column = table2row[x];
                

    
                x++;
            }
            
            differentRows.forEach(row => {
                html += "<tr>";
                let table1Columns = "";
                let table2Columns = "";

                let x = 0;
                while (x < table1ColumnCount && x < table2ColumnCount) {
                    const table1column = table1row[x];
                    const table2column = table2row[x];
                    

        
                    x++;
                }
        
                while (x < table1row.length) {
                    columnDiffObject[x] = [ table1row[x], null ];
                    //console.log(`#1 table has one more column at #${x}`)
                    //console.log("x =", x)
                    x++;
                }
        
                while (x < table2row.length) {
                    columnDiffObject[x] = [ null, table2row[x] ];
                    //console.log(`#2 table has one more column at #${x}`)
                    //console.log("x =", x)
                    x++;
                }
                html += table1Columns;
                html += table2Columns;
                html += "</tr>";
            });
            
            html += "</table>";

            asd.innerHTML += html;
        })
    });
});
