import React from "react";
import "./boardSquare.css";

interface params {
    role: String;
}

export default function GameSquare({ role }: params): React.ReactElement {
    return (
        <div className={`game-square ${role === "Snake" ? "snake" : role === "Apple" ? "apple" : role === "Snake Head" ? "snake-head" : "grass"}`}></div>
    );
}