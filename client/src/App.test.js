import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
// integration test for scenario signin
test("enhanced scenario component", async () => {
  render(<App />);
  const inputName = screen.getByPlaceholderText("Enter unique name");
  expect(inputName.value).toBe("");
  fireEvent.change(inputName, { target: { value: "Some Geek" } });
  expect(inputName.value).toBe("Some Geek");
  const inputRoom = screen.getByPlaceholderText("Enter room name");
  fireEvent.change(inputRoom, { target: { value: "info3139" } });
  expect(inputRoom.value).toBe("info3139");
  fireEvent.click(screen.getByTestId("submit"));
  await waitFor(() => {
    expect(screen.getByText("welcome Some Geek")).toBeInTheDocument();
  });
  // this just shows what the test sees, comment it out if there are no problems
  screen.debug();
});
