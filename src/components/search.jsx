import React from "react";

import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";

const Search = ({ data, myId }) => {
  const resultData = data.map((key) => {
    return { ...key };
  });

  const history = useHistory();

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
            onClick: (event, rowData) => {
              if (myId !== rowData.id) {
                history.push("/profile", {
                  id: rowData.id,
                });
              } else {
                alert("Can't message to myself.");
              }
            },
          },
        ]}
      />
    </div>
  );
};
export default Search;
