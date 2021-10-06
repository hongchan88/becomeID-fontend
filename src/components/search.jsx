import React from "react";

import MaterialTable from "material-table";

const Search = ({ data }) => {
  const resultData = data.map((key) => {
    return { ...key };
  });

  return (
    <div style={{ width: "95%", height: "95%", fontSize: "0.8rem" }}>
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
