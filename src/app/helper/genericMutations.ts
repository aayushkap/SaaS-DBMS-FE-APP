import { useMutation } from "@tanstack/react-query";
import { addConnection, setConnections } from "@/store/slices/connectionsSlice";
import { setActiveTable, setActiveDatabase } from "@/store/slices/tableSlice";
import { testConnection } from "@/app/api/query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";

export const useTestConnectionMutation = () => {
  const dispatch = useDispatch();
  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  const findConnectionIndex = (params: any) =>
    connections.findIndex(
      (connection) =>
        JSON.stringify(connection.params) === JSON.stringify(params)
    );

  return useMutation({
    mutationFn: testConnection,
    onSuccess: (data) => {
      if (!data?.SUCCESS) {
        console.log(
          "Query failed. If connection exists, change to Connection Unsuccessful."
        );

        const connectionIndex = findConnectionIndex(data.params);
        if (connectionIndex !== -1) {
          const updatedConnections = [...connections];
          updatedConnections[connectionIndex] = {
            ...connections[connectionIndex],
            CONNECTION_SUCCESS: false,
          };
          dispatch(setConnections(updatedConnections));
          console.log("Connection unsuccessful.");
        }

        throw new Error("Connection unsuccessful.");
      }

      console.log("data", data);
      const connectionIndex = findConnectionIndex(data.params);
      const updatedConnections = [...connections];

      if (connectionIndex !== -1) {
        updatedConnections[connectionIndex] = data;
        console.log("Connection updated successfully.");
        dispatch(setConnections(updatedConnections));
      } else {
        console.log("No matching connection found. Adding new connection.");
        dispatch(addConnection(data));
      }

      if (data.DATABASE_INFO) {
        dispatch(setActiveDatabase(data.DATABASE_INFO));
        dispatch(setActiveTable(Object.keys(data?.DATABASE_INFO?.tables)[0]));
      }

      return true;
    },
    onError: (e) => {
      console.error(`Error connecting to database: ${e.toString()}`);
      return false;
    },
  });
};
