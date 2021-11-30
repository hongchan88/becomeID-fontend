import MaterialTable from "material-table";
import React from "react";
import { useHistory } from "react-router-dom";

const Search = ({ data, myId }) => {
  console.log(data);
  const resultData = data.map((key) => {
    return { ...key };
  });

  const history = useHistory();

  return (
    <div style={{ width: "100%", height: "100%", fontSize: "0.8rem" }}>
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
                history.push("/room", {
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
