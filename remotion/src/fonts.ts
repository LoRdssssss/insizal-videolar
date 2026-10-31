import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

// Marka yazı tipleri (OFL). loadFont, yükleme bitene kadar karelerin çekilmesini bekletir.
loadFont({family: "Bricolage Grotesque", url: staticFile("fontlar/bricolage-grotesque-tr-wght-1.001.woff2"), weight: "200 800", format: "woff2"});
loadFont({family: "Instrument Sans", url: staticFile("fontlar/instrument-sans-tr-wght-1.000.woff2"), weight: "400 700", format: "woff2"});
