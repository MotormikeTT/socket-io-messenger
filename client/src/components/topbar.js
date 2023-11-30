import Accessibility from "@material-ui/icons/Accessibility";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";

const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify the parent
  return (
    <AppBar position="static">
      <Toolbar color="primary" title="Sample Toolbar">
        <Typography variant="h6" color="inherit">
          Chat it Up!
        </Typography>
        {!props.showIcon && (
          <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
            <IconButton onClick={onIconClicked}>
              <Accessibility
                style={{ color: "white", height: 70, width: 70 }}
              />
            </IconButton>
          </section>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
