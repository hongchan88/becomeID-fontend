import React from "react";

import MaterialTable from "material-table";
const Search = ({ data }) => {
  const resultData = data.map((key) => {
    return { ...key };
  });

  console.log(data[0]);
  return (
    <div style={{ maxWidth: "100%", marginTop: "2em" }}>
      <MaterialTable
        title=""
        columns={[
          { title: "Car Plates", field: "car_plates" },
          { title: "Email Address", field: "email" },
        ]}
        data={resultData}
        actions={[
          {
            icon: "message",
            tooltip: "Message User",
            onClick: (event, rowData) => alert("DM feature is in progress"),
          },
        ]}
      />
    </div>
  );
};
export default Search;
