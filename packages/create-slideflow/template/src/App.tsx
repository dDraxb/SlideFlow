import { Deck } from "slideflow";
import "slideflow/styles.css";
import "slideflow/theme.css";
import "./theme.css";
import { deck } from "./deck";

export default function App() {
  return <Deck deck={deck} />;
}
