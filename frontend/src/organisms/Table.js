import React from "react";
import ReactTable from "react-table";

export function Table({data, columns}) {
    return (
        <div>
            <ReactTable
                previousText="Předchozí"
                nextText="Další"
                pageText="Stránka"
                ofText="z"
                rowsText="řádků"
                noDataText="Nenalezená žádná data"
                rows
                data={data}
                filterable
                columns={[{columns}]}
                defaultPageSize={10}
                className="-striped -highlight"
            />
        </div>
    )
}