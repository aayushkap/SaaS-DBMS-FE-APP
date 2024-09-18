type DBConfig = {
  [key: string]: {
    params: {
      title: string;
      type: "input" | "checkbox";
      inputType?: "text" | "number" | "password";
      key: string;
      required?: boolean;
    }[];
  };
};

const dbConfig: DBConfig = {
  mysql: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Database",
        type: "input",
        inputType: "text",
        key: "database",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: " User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
        required: true,
      },
      { title: "Use SSL", type: "checkbox", key: "useSSL" },
    ],
  },
  postgres: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: " User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
        required: true,
      },
      {
        title: "Database",
        type: "input",
        inputType: "text",
        key: "database",
        required: true,
      },
      {
        title: "Require SSL",
        type: "checkbox",
        key: "requireSSL",
      },
    ],
  },
  mssql: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: "User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
      },
      {
        title: "Integrated Security",
        type: "checkbox",
        key: "integratedSecurity",
      },
    ],
  },
};

export default dbConfig;
