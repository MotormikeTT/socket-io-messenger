import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import "./App.css";
import MainComponent from "./components/maincomponent";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <MainComponent />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
