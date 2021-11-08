import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import "./App.css";
import Project2Component from "./project2/project2component";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <Project2Component />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
