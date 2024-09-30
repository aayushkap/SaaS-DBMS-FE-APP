import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import { EditorView, ViewUpdate } from "@codemirror/view";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { executeQuery } from "@/app/api/query";
import truncate from "@/app/helper/helpers";
import Tooltip from "../ToolTip/ToolTip";
import { openDialog } from "@/store/slices/dialogSlice";
import { Loader } from "../Loader1/Loader";
import styles from "./EditorComp.module.scss";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import {
  setActiveDatabase,
  setActiveTable,
  setShowQueries,
} from "@/store/slices/tableSlice";

interface LineSql {
  line: number;
  sql: string;
}

export default function EditorComp() {
  const initialContent = "\n".repeat(24);

  const [value, setValue] = useState<string>(initialContent);
  const [selectedText, setSelectedText] = useState<string>("");
  const [lineSqlList, setLineSqlList] = useState<LineSql[]>([]);

  const activeDatabase = useSelector(
    (state: RootState) => state.table.activeDatabase
  );
  const dispatch = useDispatch();

  const onChange = useCallback((val: string) => setValue(val), []);

  const handleSelection = useCallback((editorView: EditorView) => {
    const { state } = editorView;
    const selection = state.selection.main;
    const text = state.doc.sliceString(selection.from, selection.to);
    setSelectedText(text);

    const startLine = state.doc.lineAt(selection.from).number;
    const endLine = state.doc.lineAt(selection.to).number;
    const lines: LineSql[] = [];

    let combinedSql = "";
    for (let i = startLine; i <= endLine; i++) {
      const lineContent = state.doc.line(i).text.trim();
      combinedSql += (combinedSql ? " " : "") + lineContent;

      if (lineContent.endsWith(";")) {
        lines.push({ line: i, sql: combinedSql });
        combinedSql = ""; // reset for next SQL statement
      }
    }

    if (combinedSql) lines.push({ line: endLine, sql: combinedSql });
    setLineSqlList(lines);
  }, []);

  const customCompletions = useCallback(
    (context: CompletionContext): CompletionResult | null => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      const keywords = [
        { label: "SELECT", type: "keyword" },
        { label: "FROM", type: "keyword" },
        { label: "INSERT", type: "keyword" },
        { label: "WHERE", type: "keyword" },
        { label: "AND", type: "keyword" },
        { label: "OR", type: "keyword" },
        { label: "NOT", type: "keyword" },
        { label: "IN", type: "keyword" },
        { label: "LIKE", type: "keyword" },
        { label: "BETWEEN", type: "keyword" },
      ];

      const tableCompletions = activeDatabase?.tables
        ? Object.keys(activeDatabase.tables).map((tableKey) => ({
            label: tableKey,
            type: "table",
          }))
        : [];

      const columnCompletions = activeDatabase?.tables
        ? Object.keys(activeDatabase.tables).flatMap((tableKey) =>
            activeDatabase.tables[tableKey].column_info.map(
              (column: { Field: string }) => ({
                label: column.Field,
                type: "column",
              })
            )
          )
        : [];

      return {
        from: word.from,
        options: [...keywords, ...tableCompletions, ...columnCompletions],
        validFor: /^\w*$/,
      };
    },
    [activeDatabase]
  );

  const [message, setMessage] = useState<string>("");

  const executeQueryMutation = useMutation({
    mutationFn: executeQuery,
    onSuccess: (data) => {
      const content = <QueryResultComp isPending={false} results={data} />;
      setMessage(
        data?.SUCCESS
          ? "Successfully executed query"
          : `Query Failed: ${JSON.stringify(data)}`
      );
      dispatch(openDialog(<div>{content}</div>));
      console.log("Query Results: ", data);

      const updatedActiveDatabase = {
        ...activeDatabase,
        queries: data.QUERY_RESPONSE,
      };
      console.log("Updated Active Database: ", updatedActiveDatabase);
      dispatch(setActiveDatabase(updatedActiveDatabase));
    },
    onError: () => dispatch(openDialog(<QueryResultComp isPending={false} />)),
  });

  const executeSQL = () => {
    if (lineSqlList.length === 0 || !activeDatabase) return;

    const queryData = {
      database_type: activeDatabase.type,
      params: activeDatabase.params,
      query: lineSqlList,
    };

    dispatch(openDialog(<QueryResultComp isPending={true} />));
    executeQueryMutation.mutate(queryData);
  };

  return (
    <div>
      <button onClick={() => setValue("")}>Clear</button>
      <button onClick={executeSQL}>Execute SQL</button>
      {activeDatabase && (
        <h3>Active Database: {activeDatabase?.params?.database}</h3>
      )}
      {message && <h3>{message}</h3>}
      {executeQueryMutation.isPending && <h3>Executing Query...</h3>}
      <CodeMirror
        value={value}
        extensions={[sql(), autocompletion({ override: [customCompletions] })]}
        onChange={onChange}
        onUpdate={(viewUpdate: ViewUpdate) => {
          if (viewUpdate.selectionSet) handleSelection(viewUpdate.view);
        }}
      />
      <div>
        <h4>Selected Text:</h4>
        <pre>{selectedText}</pre>
        <h4>Combined SQL Statements:</h4>
        <pre>{JSON.stringify(lineSqlList, null, 2)}</pre>
      </div>
    </div>
  );
}

function QueryResultComp({
  isPending,
  results,
}: {
  isPending: boolean;
  results?: any;
}) {
  if (isPending) {
    return (
      <div className={styles.dialogBox}>
        <Loader />
      </div>
    );
  }

  if (!results?.QUERY_RESPONSE?.length) {
    if (results?.RESPONSE?.ERROR) {
      return (
        <div className={styles.dialogBox}>
          <div className={styles.text}>
            Error:
            <br /> {results.RESPONSE.ERROR}
          </div>
        </div>
      );
    } else {
      return <div className={styles.dialogBox}>Unable to fetch results.</div>;
    }
  }

  const dispatch = useDispatch();

  const activeDatabase = useSelector(
    (state: RootState) => state.table.activeDatabase
  );

  function handleShowRows(result: any) {
    console.log("Show Rows: ", result);

    dispatch(setShowQueries(true));
    dispatch(setActiveTable(result.sql));

    // To Active Database, add a queries key with a list of the results
  }

  return (
    <div className={styles.dialogBox}>
      <table className={styles.resultsTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.lineNumber}>Line #</th>
            <th className={styles.sqlStatement}>SQL Statement</th>
            <th className={styles.resultType}>Result Type</th>
            <th className={styles.result}>Result</th>
          </tr>
        </thead>
        <tbody>
          {results.QUERY_RESPONSE.map((result: any, index: number) => (
            <tr key={index} className={styles.resultRow}>
              <td className={styles.lineCell}>{result.line}</td>
              <td className={styles.sqlCell}>
                <Tooltip message={result.sql}>
                  {truncate(result.sql, 30)}
                </Tooltip>
              </td>
              <td className={styles.typeCell}>{result.result_type}</td>
              <td className={styles.resultCell}>
                {result.result_type === "ERROR" ? (
                  <Tooltip message={result.result.toString()}>
                    {truncate(result.result.toString(), 30)}
                  </Tooltip>
                ) : result.result_type === "ROWS" ? (
                  <BsFillArrowUpRightCircleFill
                    size={18}
                    className={styles.resultIcon}
                    onClick={() => handleShowRows(result)}
                  />
                ) : result.result_type === "ROW COUNT" ? (
                  result.result.toString()
                ) : (
                  result.result
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
